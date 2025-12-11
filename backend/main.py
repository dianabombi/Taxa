import os
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr, field_validator
import openai
from services.ocr_service import OCRService, OCRProvider, classify_document
from services.tax_calculator import SlovakTaxCalculator
from decimal import Decimal

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./taxa.db")
# For SQLite, need to add connect_args for Railway
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# OpenAI setup
openai.api_key = os.getenv("OPENAI_API_KEY")

# OCR Service setup
OCR_PROVIDER = os.getenv("OCR_PROVIDER", "mindee")  # mindee, tesseract, veryfi, klippa
ocr_service = OCRService(provider=OCRProvider(OCR_PROVIDER))

# Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    # Business identification
    ico = Column(String, unique=True, nullable=True, index=True)  # IČO
    dic = Column(String, nullable=True)  # DIČ
    ic_dph = Column(String, nullable=True)  # IČ DPH
    business_name = Column(String, nullable=True)  # Obchodné meno
    business_address = Column(String, nullable=True)  # Sídlo
    legal_form = Column(String, nullable=True)  # Právna forma
    # Onboarding fields
    phone = Column(String, nullable=True)
    business_type = Column(String, nullable=True)  # 'flat_rate' or 'actual_expenses'
    expense_type = Column(String, nullable=True)  # 'pausalne_vydavky' or 'skutocne_vydavky'
    vat_status = Column(String, nullable=True)  # 'non_payer' or 'payer'
    onboarding_completed = Column(Integer, default=0)  # 0, 1, 2, 3 (step completed)
    documents = relationship("Document", back_populates="owner")
    messages = relationship("ChatMessage", back_populates="user")

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    document_type = Column(String)  # invoice, receipt, tax_form, etc.
    extracted_data = Column(JSON)  # OCR extracted data
    confidence = Column(Integer)  # OCR confidence score
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="documents")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="messages")

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    ico: Optional[str] = None
    business_name: Optional[str] = None
    business_address: Optional[str] = None
    legal_form: Optional[str] = None
    dic: Optional[str] = None
    ic_dph: Optional[str] = None
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        if len(v.encode('utf-8')) > 72:
            raise ValueError('Password is too long (max 72 bytes)')
        return v

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    ico: Optional[str] = None
    dic: Optional[str] = None
    ic_dph: Optional[str] = None
    business_name: Optional[str] = None
    business_address: Optional[str] = None
    legal_form: Optional[str] = None
    phone: Optional[str] = None
    business_type: Optional[str] = None
    expense_type: Optional[str] = None
    vat_status: Optional[str] = None
    onboarding_completed: int = 0
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

class DocumentResponse(BaseModel):
    id: int
    filename: str
    document_type: Optional[str]
    extracted_data: Optional[dict]
    confidence: Optional[int]
    uploaded_at: datetime

class OnboardingUpdate(BaseModel):
    phone: Optional[str] = None
    business_type: Optional[str] = None
    expense_type: Optional[str] = None
    vat_status: Optional[str] = None
    onboarding_completed: Optional[int] = None

class ICOVerificationRequest(BaseModel):
    ico: str

class ICOVerificationResponse(BaseModel):
    valid: bool
    ico: str
    business_name: Optional[str] = None
    business_address: Optional[str] = None
    legal_form: Optional[str] = None
    dic: Optional[str] = None
    ic_dph: Optional[str] = None
    error: Optional[str] = None

# FastAPI app
app = FastAPI(title="TAXA API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# IČO Verification Function
async def verify_ico(ico: str) -> dict:
    """Verify IČO using Slovak Register API"""
    import requests
    
    # Clean IČO - remove spaces and non-digits
    ico_clean = ''.join(filter(str.isdigit, ico))
    
    if not ico_clean or len(ico_clean) < 8:
        return {
            "valid": False,
            "ico": ico,
            "error": "IČO musí obsahovať minimálne 8 číslic"
        }
    
    try:
        # Try Register organizácií Štatistického úradu SR
        url = f"https://www.registeruz.sk/cruz-public/api/uctovnej-jednotky?ico={ico_clean}"
        
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            # Check if we got valid data
            if data and len(data) > 0:
                business = data[0]
                
                # Extract address parts
                address_parts = []
                if business.get('ulica'):
                    address_parts.append(business['ulica'])
                if business.get('mesto'):
                    address_parts.append(business['mesto'])
                if business.get('psc'):
                    address_parts.append(business['psc'])
                
                address = ', '.join(filter(None, address_parts)) if address_parts else None
                
                return {
                    "valid": True,
                    "ico": ico_clean,
                    "business_name": business.get('nazovUJ') or business.get('obchodneMeno'),
                    "business_address": address,
                    "legal_form": business.get('pravnaForma'),
                    "dic": business.get('dic'),
                    "ic_dph": business.get('icDph'),
                }
        
        # If main API fails, try alternative verification
        # Just check if IČO format is valid (8 digits)
        if len(ico_clean) == 8:
            return {
                "valid": True,
                "ico": ico_clean,
                "business_name": None,
                "business_address": None,
                "legal_form": None,
                "dic": None,
                "ic_dph": None,
            }
        
        return {
            "valid": False,
            "ico": ico,
            "error": "IČO sa nepodarilo overiť v registri"
        }
        
    except requests.Timeout:
        # If timeout, still allow registration with valid format
        if len(ico_clean) == 8:
            return {
                "valid": True,
                "ico": ico_clean,
                "business_name": None,
                "business_address": None,
                "legal_form": None,
                "dic": None,
                "ic_dph": None,
            }
        return {
            "valid": False,
            "ico": ico,
            "error": "Časový limit pre overenie IČO vypršal"
        }
    except Exception as e:
        # On error, accept valid 8-digit format
        if len(ico_clean) == 8:
            return {
                "valid": True,
                "ico": ico_clean,
                "business_name": None,
                "business_address": None,
                "legal_form": None,
                "dic": None,
                "ic_dph": None,
            }
        return {
            "valid": False,
            "ico": ico,
            "error": f"Chyba pri overení IČO"
        }

# Auth helpers
def verify_password(plain_password, hashed_password):
    # Bcrypt has a 72-byte limit, truncate if necessary
    if len(plain_password.encode('utf-8')) > 72:
        plain_password = plain_password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    # Bcrypt has a 72-byte limit, truncate if necessary
    if len(password.encode('utf-8')) > 72:
        password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to TAXA API"}

@app.get("/health")
def health_check():
    return {"status": "ok", "database": "connected", "ocr_provider": OCR_PROVIDER}

# Auth endpoints
@app.post("/api/auth/register", response_model=Token)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password,
        ico=user_data.ico,
        business_name=user_data.business_name,
        business_address=user_data.business_address,
        legal_form=user_data.legal_form,
        dic=user_data.dic,
        ic_dph=user_data.ic_dph
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.email})
    user_response = UserResponse(
        id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        ico=new_user.ico,
        dic=new_user.dic,
        ic_dph=new_user.ic_dph,
        business_name=new_user.business_name,
        business_address=new_user.business_address,
        legal_form=new_user.legal_form,
        phone=new_user.phone,
        business_type=new_user.business_type,
        expense_type=new_user.expense_type,
        vat_status=new_user.vat_status,
        onboarding_completed=new_user.onboarding_completed,
        created_at=new_user.created_at
    )
    
    return {"access_token": access_token, "token_type": "bearer", "user": user_response}

@app.post("/api/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    user_response = UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        ico=user.ico,
        dic=user.dic,
        ic_dph=user.ic_dph,
        business_name=user.business_name,
        business_address=user.business_address,
        legal_form=user.legal_form,
        phone=user.phone,
        business_type=user.business_type,
        expense_type=user.expense_type,
        vat_status=user.vat_status,
        onboarding_completed=user.onboarding_completed,
        created_at=user.created_at
    )
    
    return {"access_token": access_token, "token_type": "bearer", "user": user_response}

# IČO Verification endpoint
@app.post("/api/auth/verify-ico", response_model=ICOVerificationResponse)
async def verify_ico_endpoint(request: ICOVerificationRequest):
    """Verify IČO and return business information"""
    result = await verify_ico(request.ico)
    return ICOVerificationResponse(**result)

# Onboarding endpoint
@app.patch("/api/auth/onboarding", response_model=UserResponse)
def update_onboarding(
    onboarding_data: OnboardingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Update user fields
    if onboarding_data.phone is not None:
        current_user.phone = onboarding_data.phone
    if onboarding_data.business_type is not None:
        current_user.business_type = onboarding_data.business_type
    if onboarding_data.expense_type is not None:
        current_user.expense_type = onboarding_data.expense_type
    if onboarding_data.vat_status is not None:
        current_user.vat_status = onboarding_data.vat_status
    if onboarding_data.onboarding_completed is not None:
        current_user.onboarding_completed = onboarding_data.onboarding_completed
    
    db.commit()
    db.refresh(current_user)
    
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        ico=current_user.ico,
        dic=current_user.dic,
        ic_dph=current_user.ic_dph,
        business_name=current_user.business_name,
        business_address=current_user.business_address,
        legal_form=current_user.legal_form,
        phone=current_user.phone,
        business_type=current_user.business_type,
        expense_type=current_user.expense_type,
        vat_status=current_user.vat_status,
        onboarding_completed=current_user.onboarding_completed,
        created_at=current_user.created_at
    )

# Documents endpoints
@app.get("/api/documents", response_model=List[DocumentResponse])
def get_documents(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    documents = db.query(Document).filter(Document.user_id == current_user.id).all()
    return documents

@app.post("/api/documents/upload")
async def upload_document(
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    uploaded_files = []
    
    for file in files:
        # Save file temporarily
        file_path = f"/tmp/{file.filename}"
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Classify document type
        doc_type = await classify_document(file_path)
        
        # Process with OCR
        try:
            extracted_data = await ocr_service.process_document(file_path, doc_type)
            confidence = int(extracted_data.get('confidence', 0) * 100)
        except Exception as e:
            print(f"OCR processing failed: {e}")
            extracted_data = {}
            confidence = 0
        
        # Save to database
        new_doc = Document(
            filename=file.filename,
            file_path=file_path,
            document_type=doc_type,
            extracted_data=extracted_data,
            confidence=confidence,
            user_id=current_user.id
        )
        db.add(new_doc)
        
        uploaded_files.append({
            "filename": file.filename,
            "type": doc_type,
            "confidence": confidence,
            "data": extracted_data
        })
    
    db.commit()
    return {"message": "Files uploaded and processed", "files": uploaded_files}

@app.get("/api/documents/{document_id}")
def get_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return document

# Helper function for AI responses
def get_ai_response(message: str, docs_count: int) -> str:
    """Generate helpful tax consulting responses"""
    message_lower = message.lower()
    
    # Tax-related keywords and responses
    if any(word in message_lower for word in ['dph', 'vat', 'daň z pridanej hodnoty']):
        return """DPH (Daň z pridanej hodnoty)

Základné informácie o DPH:
• Platiteľom DPH sa stávate pri obratu nad 49 790 € ročne
• Základná sadzba DPH: 20%
• Znížená sadzba: 10% (potraviny, lieky, knihy)
• Mesačné hlásenia: Do 25. dňa nasledujúceho mesiaca

Ak ste neplatca DPH:
✓ Nemusíte podávať mesačné hlásenia
✓ Jednoduchšie účtovníctvo
✓ Ceny bez DPH

Potrebujete viac informácií? Opýtajte sa konkrétnejšie!"""
    
    elif any(word in message_lower for word in ['daňové priznanie', 'daňove priznanie', 'priznanie']):
        return f"""Daňové priznanie pre SZČO

Termíny a informácie:
• Podanie: Do 31. marca nasledujúceho roka
• Predĺžený termín: Do 30. júna (s daňovým poradcom)
• Základ dane: Príjmy - výdavky

TAXA vám pomôže:
✓ Automaticky zhromaždí všetky príjmy a výdavky
✓ Vypočíta základ dane
✓ Vygeneruje daňové priznanie jedným klikom

Momentálne máte evidovaných {docs_count} dokladov."""
    
    elif any(word in message_lower for word in ['paušál', 'pausal', 'paušálne', 'pausalne']):
        return """Paušálne výdavky pre SZČO

Percentá podľa typu činnosti:
• 60% - Remeselné a výrobné činnosti
• 40% - Ostatné živnosti (služby, obchod)

Výhody:
✓ Jednoduché účtovníctvo
✓ Menej dokladov na evidenciu
✓ Rýchlejšie spracovanie

Nevýhody:
✗ Nemôžete uplatniť skutočné vyššie výdavky
✗ Menej možností optimalizácie

Paušálne výdavky = Príjmy × 60% (alebo 40%)"""
    
    elif any(word in message_lower for word in ['skutočné výdavky', 'skutocne vydavky', 'výdavky']):
        return """Skutočné výdavky

Musíte evidovať všetky výdavky s dokladmi:
• Materiál a tovar
• Prenájom priestorov
• Pohonné hmoty (do 80%)
• Telekomunikácie
• Software a služby
• Odvody (sociálne, zdravotné)

Čo môžete odpočítať:
✓ Všetky výdavky súvisiace s podnikaním
✓ Cestovné náhrady
✓ Reprezentáciu (do limitu)
✓ PHM (do 80% hodnoty)

TAXA automaticky kategorizuje vaše výdavky!"""
    
    elif any(word in message_lower for word in ['odvody', 'sociálne', 'zdravotné']):
        return """Odvody SZČO na Slovensku

SOCIÁLNA POISŤOVŇA:
• Minimálny základ: 540 € mesačne
• Sadzba: 31,3% (chorob. 5,15%, starobné 19,25%, invalidné 6%, nezamestnanosť 0,5%, garančný 0,2%, úrazové 0,2%)

ZDRAVOTNÁ POISŤOVŇA:
• Minimálny základ: 540 € mesačne  
• Sadzba: 14%

Mesačné minimálne odvody spolu:
Cca 245 € (sociálna + zdravotná)

Dôležité:
• Platí sa mesačne, vopred
• Termín: Do 8. dňa nasledujúceho mesiaca
• Pri vyššom príjme sa prepočítava ročne"""
    
    elif any(word in message_lower for word in ['termín', 'termin', 'kedy', 'deadline']):
        return """Dôležité termíny pre SZČO v roku 2024/2025

MESAČNE:
• 8. deň - Odvody (sociálna + zdravotná poisťovňa)
• 25. deň - DPH hlásenie (pre platiteľov DPH)

ROČNE:
• 31. marec - Daňové priznanie fyzických osôb
• 30. jún - Daňové priznanie (s daňovým poradcom)
• 31. marec - Zúčtovanie preddavkov na odvody

ŠTVRŤROČNE (pre niektorých):
• Preddavky na daň z príjmov

TAXA vám pripomenie všetky termíny!"""
    
    elif any(word in message_lower for word in ['faktúra', 'faktura', 'vystaviť']):
        return """Vystavenie faktúry - náležitosti

Povinné údaje na faktúre:
1. Označenie "FAKTÚRA" a číslo faktúry
2. Dátum vystavenia a dátum dodania
3. Obchodné meno a sídlo dodávateľa
4. IČO dodávateľa (IČ DPH pre platiteľov DPH)
5. Obchodné meno a sídlo odberateľa
6. Predmet plnenia (popis služby/tovaru)
7. Jednotková cena a množstvo
8. Celková suma bez DPH
9. Sadzba a suma DPH (pre platiteľov)
10. Celková suma s DPH
11. Dátum splatnosti

TAXA vám pomôže spracovať prijaté faktúry automaticky!"""
    
    elif any(word in message_lower for word in ['začať', 'zacat', 'živnosť', 'zivnost', 'založiť']):
        return """Ako začať podnikať na Slovensku

KROKY K ŽIVNOSTI:
1. Živnostenský úrad - Ohlásenie živnosti (bezplatne online)
2. Daňový úrad - Registrácia pre daň z príjmov (automaticky)
3. Sociálna poisťovňa - Registrácia SZČO (do 8 dní)
4. Zdravotná poisťovňa - Registrácia (do 8 dní)

Čo budete potrebovať:
• Občiansky preukaz
• Výpis z registra trestov (nie starší ako 3 mesiace)

Po založení:
✓ Zriadenie bankového účtu
✓ Nastavenie účtovného systému (TAXA!)
✓ Začať evidovať príjmy a výdavky

TAXA vám s tým všetkým pomôže!"""
    
    else:
        # Default helpful response
        return f"""Dobrý deň! Som váš AI daňový konzultant.

Momentálny stav:
• Evidované doklady: {docs_count}

Môžem vám poradiť s:
• DPH a registráciou platiteľa
• Daňovým priznaním
• Paušálnymi vs. skutočnými výdavkami
• Odvodmi (sociálnymi a zdravotnými)
• Termínmi a lehotami
• Vystavovaním faktúr
• Začatím podnikania

Príklady otázok:
"Kedy musím podať daňové priznanie?"
"Koľko sú minimálne odvody?"
"Aký je rozdiel medzi paušálnymi a skutočnými výdavkami?"

Opýtajte sa ma na čokoľvek!"""

# Chat endpoint
@app.post("/api/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Save user message
    user_message = ChatMessage(
        user_id=current_user.id,
        role="user",
        content=request.message
    )
    db.add(user_message)
    
    # Get user's documents count for context
    docs_count = db.query(Document).filter(
        Document.user_id == current_user.id
    ).count()
    
    # Get AI response using built-in knowledge base
    try:
        # If OpenAI is configured, use it
        if openai.api_key and openai.api_key != "":
            recent_docs = db.query(Document).filter(
                Document.user_id == current_user.id
            ).order_by(Document.uploaded_at.desc()).limit(5).all()
            
            context = f"Používateľ má {docs_count} evidovaných dokladov.\n"
            for doc in recent_docs:
                if doc.extracted_data:
                    context += f"- {doc.filename} ({doc.document_type}): {doc.extracted_data.get('total_amount', 'N/A')} EUR\n"
            
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": f"Ste odborný daňový konzultant pre Slovensko. Odpovedajte na otázky o slovenskom daňovom systéme presne a profesionálne.\n\n{context}"},
                    {"role": "user", "content": request.message}
                ]
            )
            ai_response = response.choices[0].message.content
        else:
            # Use built-in knowledge base
            ai_response = get_ai_response(request.message, docs_count)
    except Exception as e:
        # Fallback to built-in responses
        ai_response = get_ai_response(request.message, docs_count)
    
    # Save AI response
    assistant_message = ChatMessage(
        user_id=current_user.id,
        role="assistant",
        content=ai_response
    )
    db.add(assistant_message)
    db.commit()
    
    return {"response": ai_response}

# Tax Return Models
class TaxReturnRequest(BaseModel):
    year: int
    use_flat_rate: bool = True
    profession_type: str = "standard"  # "standard" or "craft"
    children_count: int = 0
    additional_non_taxable: Optional[float] = None
    paid_advances: Optional[float] = None
    
class TaxReturnResponse(BaseModel):
    calculation: dict
    documents_used: List[dict]
    form_data: dict

# Tax Return Endpoints
@app.post("/api/tax-return/calculate", response_model=TaxReturnResponse)
async def calculate_tax_return(
    request: TaxReturnRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Calculate complete tax return for the specified year
    Aggregates all documents and performs Slovak tax calculations
    """
    calculator = SlovakTaxCalculator(year=request.year)
    
    # Get all documents for the year
    documents = db.query(Document).filter(
        Document.user_id == current_user.id,
        Document.created_at >= datetime(request.year, 1, 1),
        Document.created_at < datetime(request.year + 1, 1, 1)
    ).all()
    
    # Aggregate income and expenses from documents
    total_income = Decimal("0")
    total_expenses = Decimal("0")
    
    documents_data = []
    for doc in documents:
        doc_data = {
            "id": doc.id,
            "filename": doc.filename,
            "upload_date": doc.created_at.isoformat(),
            "document_type": doc.document_type,
        }
        
        # Parse extracted data if available
        if doc.extracted_data:
            try:
                data = doc.extracted_data if isinstance(doc.extracted_data, dict) else {}
                
                # Extract amounts from OCR data
                if doc.document_type == "invoice":
                    amount = Decimal(str(data.get("total_amount", 0) or 0))
                    total_income += amount
                    doc_data["amount"] = float(amount)
                    doc_data["category"] = "income"
                    
                elif doc.document_type == "receipt":
                    amount = Decimal(str(data.get("total_amount", 0) or 0))
                    total_expenses += amount
                    doc_data["amount"] = float(amount)
                    doc_data["category"] = "expense"
                    
            except (ValueError, TypeError):
                pass
        
        documents_data.append(doc_data)
    
    # Perform tax calculation
    calculation = calculator.calculate_complete_tax_return(
        income=total_income,
        expenses=None if request.use_flat_rate else total_expenses,
        use_flat_rate=request.use_flat_rate,
        profession_type=request.profession_type,
        children_count=request.children_count,
        additional_non_taxable=Decimal(str(request.additional_non_taxable)) if request.additional_non_taxable else None,
        paid_advances=Decimal(str(request.paid_advances)) if request.paid_advances else None
    )
    
    # Convert Decimal to float for JSON serialization
    def decimal_to_float(obj):
        if isinstance(obj, dict):
            return {k: decimal_to_float(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [decimal_to_float(item) for item in obj]
        elif isinstance(obj, Decimal):
            return float(obj)
        return obj
    
    calculation = decimal_to_float(calculation)
    
    # Prepare form data for DPFO Type B
    form_data = {
        "taxpayer": {
            "name": current_user.name,
            "email": current_user.email,
            "ico": current_user.ico,
            "dic": current_user.dic,
            "ic_dph": current_user.ic_dph,
            "business_name": current_user.business_name,
            "address": current_user.business_address
        },
        "year": request.year,
        "income_section": {
            "line_6": calculation["income"]["gross_income"],  # Príjmy
            "line_12": calculation["income"]["expenses"],  # Výdavky
            "line_13": calculation["income"]["tax_base"],  # Základ dane
        },
        "deductions_section": {
            "line_42": calculation["insurance"]["total_yearly"],  # Poistné
            "line_44": 5174.70,  # Nezdaniteľná časť základu dane
        },
        "tax_section": {
            "line_47": calculation["tax"]["taxable_income"],  # Základ dane po odpočítaní
            "line_51": calculation["tax"]["tax_before_bonus"],  # Daň
            "line_62": calculation["tax"]["tax_bonus"],  # Daňový bonus
            "line_65": calculation["tax"]["final_tax"],  # Daň na zaplatenie
        },
        "payment_section": {
            "line_70": calculation["payment"]["paid_advances"],  # Preddavky
            "line_72": calculation["payment"]["to_pay"],  # Nedoplatok
            "line_73": calculation["payment"]["to_refund"],  # Preplatok
        }
    }
    
    return {
        "calculation": calculation,
        "documents_used": documents_data,
        "form_data": form_data
    }

@app.get("/api/tax-return/documents/{year}")
async def get_tax_documents(
    year: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all documents for a specific tax year
    """
    documents = db.query(Document).filter(
        Document.user_id == current_user.id,
        Document.created_at >= datetime(year, 1, 1),
        Document.created_at < datetime(year + 1, 1, 1)
    ).all()
    
    return {
        "year": year,
        "total_documents": len(documents),
        "documents": [
            {
                "id": doc.id,
                "filename": doc.filename,
                "type": doc.document_type,
                "upload_date": doc.created_at.isoformat(),
                "extracted_data": doc.extracted_data
            }
            for doc in documents
        ]
    }

@app.post("/api/tax-return/generate-pdf/{year}")
async def generate_tax_return_pdf(
    year: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate PDF of DPFO Type B form
    This will be implemented with reportlab or similar PDF generation library
    """
    # TODO: Implement PDF generation with official DPFO Type B template
    # For now, return instructions
    return {
        "message": "PDF generation coming soon",
        "instructions": "You can download the form template from financnasprava.sk and fill it manually with the calculated values",
        "form_url": "https://www.financnasprava.sk/sk/elektronicke-sluzby/verejne-sluzby/elektronicke-formular"
    }

@app.post("/api/tax-return/export-xml/{year}")
async def export_tax_return_xml(
    year: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Export tax return in XML format for electronic submission
    Format compatible with Slovak Financial Administration
    """
    # TODO: Implement XML generation according to Slovak FA specifications
    return {
        "message": "XML export coming soon",
        "instructions": "XML format will be compatible with www.slovensko.sk portal for electronic submission"
    }
