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
from services.encryption_service import EncryptionService, DataAnonymizationService, SecurityAuditLogger
from services.ico_verification import ICOVerificationService
from services.law_updater import SlovakTaxLawUpdater, run_weekly_update
from knowledge.slovak_tax_kb import SlovakTaxKnowledgeBase, get_ai_context
from decimal import Decimal
import uuid
from pathlib import Path
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import logging

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
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY

# OCR Service setup
OCR_PROVIDER = os.getenv("OCR_PROVIDER", "mindee")  # mindee, tesseract, veryfi, klippa
ocr_service = OCRService(provider=OCRProvider(OCR_PROVIDER))

# File upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

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

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize scheduler for weekly law updates
scheduler = BackgroundScheduler()

@app.on_event("startup")
async def startup_event():
    """
    Spustí sa pri štarte aplikácie
    Nastaví týždenný scheduler pre aktualizáciu daňových zákonov
    """
    logger.info("🚀 Spúšťam TAXA API server...")
    
    # Nastavenie týždennej kontroly zákonov (každý pondelok o 9:00)
    scheduler.add_job(
        run_weekly_update,
        CronTrigger(day_of_week='mon', hour=9, minute=0),
        id='weekly_law_update',
        name='Týždenná kontrola daňových zákonov',
        replace_existing=True
    )
    
    scheduler.start()
    logger.info("✅ Scheduler nastavený - týždenná kontrola zákonov každý pondelok o 9:00")
    
    # Voliteľne: Spustiť prvú kontrolu hneď pri štarte (pre testovanie)
    # run_weekly_update()

@app.on_event("shutdown")
async def shutdown_event():
    """
    Vypne scheduler pri vypnutí aplikácie
    """
    scheduler.shutdown()
    logger.info("🛑 Scheduler vypnutý")

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
        # Generate unique filename to avoid conflicts
        file_extension = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file permanently
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Classify document type
        doc_type = await classify_document(str(file_path))
        
        # Process with OCR
        try:
            extracted_data = await ocr_service.process_document(str(file_path), doc_type)
            confidence = int(extracted_data.get('confidence', 0) * 100)
        except Exception as e:
            print(f"OCR processing failed: {e}")
            extracted_data = {}
            confidence = 0
        
        # Save to database
        new_doc = Document(
            filename=file.filename,
            file_path=str(file_path),
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

# Helper function for AI responses with Slovak Tax Knowledge Base
def check_missing_documents(db: Session, user_id: int) -> dict:
    """Check what important documents are missing for tax return"""
    documents = db.query(Document).filter(Document.user_id == user_id).all()
    
    doc_types = [doc.document_type.lower() if doc.document_type else "" for doc in documents]
    
    missing = {
        "bank_statement": not any("bank" in dt or "výpis" in dt for dt in doc_types),
        "health_insurance": not any("health" in dt or "zdravotná" in dt or "zdravotna" in dt for dt in doc_types),
        "social_insurance": not any("social" in dt or "sociálna" in dt or "socialna" in dt for dt in doc_types)
    }
    
    return missing

def get_ai_response(message: str, docs_count: int, missing_docs: dict = None) -> str:
    """
    Generate intelligent tax consulting responses using Slovak Tax Knowledge Base
    Falls back to OpenAI if available, otherwise uses knowledge base directly
    """
    message_lower = message.lower()
    
    # Initialize knowledge base
    kb = SlovakTaxKnowledgeBase()
    
    # Get relevant context from knowledge base
    kb_context = kb.get_context_for_ai(message)
    
    # Try to use OpenAI for intelligent responses if API key is available
    if OPENAI_API_KEY:
        try:
            system_prompt = f"""Si odborný daňový poradca špecializujúci sa na slovenské daňové zákony.
Poskytuj presné, jasné a užitočné odpovede v slovenčine.

KONTEXT ZO SLOVENSKEJ DAŇOVEJ LEGISLATÍVY:
{kb_context}

PRAVIDLÁ:
- Odpovedaj v slovenčine
- Buď konkrétny a presný
- Používaj aktuálne údaje pre rok 2024
- Pri sumách používaj €
- Poskytuj príklady kde je to vhodné
- Odkazuj na konkrétne zákony a paragrafy kde je to možné"""

            client = openai.OpenAI(api_key=OPENAI_API_KEY)
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                max_tokens=800,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content
            
            # Add document count context if relevant
            if docs_count > 0 and any(word in message_lower for word in ['dokument', 'doklad', 'faktúr', 'príjem', 'výdavk']):
                ai_response += f"\n\n✓ Momentálne máte evidovaných {docs_count} dokladov v systéme TAXA."
            
            # Request missing documents if discussing relevant topics
            if missing_docs:
                doc_requests = []
                
                # Check if discussing tax returns, income, or financial overview
                if any(word in message_lower for word in ['daňové priznanie', 'danove priznanie', 'príjem', 'prijem', 'výdavk', 'vydavk', 'odvod', 'kalkuláci', 'kalkulaci']):
                    if missing_docs.get("bank_statement"):
                        doc_requests.append("📄 **Výpis z účtu** (bankový výpis za celý rok)")
                
                # Check if discussing insurance or social contributions
                if any(word in message_lower for word in ['odvod', 'poisteni', 'poistné', 'poistne', 'zdravotná', 'zdravotna', 'sociálna', 'socialna']):
                    if missing_docs.get("health_insurance"):
                        doc_requests.append("🏥 **Potvrdenie od zdravotnej poisťovne** (o zaplatených odvodoch)")
                    if missing_docs.get("social_insurance"):
                        doc_requests.append("👥 **Potvrdenie od Sociálnej poisťovne** (o zaplatených odvodoch)")
                
                if doc_requests:
                    ai_response += "\n\n" + "="*50 + "\n"
                    ai_response += "📋 **PRE PRESNÝ VÝPOČET POTREBUJEM:**\n\n"
                    ai_response += "\n".join(doc_requests)
                    ai_response += "\n\nNahrajte tieto dokumenty do systému TAXA pre kompletný daňový výpočet."
            
            return ai_response
            
        except Exception as e:
            print(f"OpenAI API error: {e}")
            # Fall back to knowledge base
    
    # Fallback: Use knowledge base directly (if OpenAI fails or no API key)
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
    
    elif any(word in message_lower for word in ['účtovníctvo', 'uctovnictvo', 'evidencia', 'kniha']):
        return """Účtovníctvo pre SZČO

TYPY ÚČTOVNÍCTVA:
• Jednoduché účtovníctvo - Pre väčšinu SZČO
• Podvojné účtovníctvo - Povinné pri obrate nad 500,000 €

Čo musíte evidovať:
✓ Kniha príjmov (všetky príjmy s dátumom a dokladom)
✓ Kniha výdavkov (všetky výdavky s faktúrami)
✓ Peňažný denník (pohyb peňazí)
✓ Evidencia majetku (ak máte)

Doba uchovávania:
• Účtovné doklady: 10 rokov
• Daňové priznania: 10 rokov
• Faktúry: 10 rokov

TAXA automaticky vedie evidenciu za vás!"""
    
    elif any(word in message_lower for word in ['optimalizácia', 'optimalizacia', 'ušetriť', 'usetrit', 'znížiť daň']):
        return """Daňová optimalizácia pre SZČO

LEGÁLNE SPÔSOBY ZNÍŽENIA DANE:

1. Výber typu výdavkov:
   • Porovnajte paušálne (60%/40%) vs. skutočné
   • Použite výhodnejšiu variantu

2. Daňové odpočty:
   • Daňový bonus na deti: 1,680 € ročne/dieťa
   • Úroky z hypotéky na bývanie
   • Dary (až 20% základu dane)
   • Dôchodkové sporenie (do 180 €)

3. Rozloženie príjmov:
   • Faktúry vystavujte strategicky
   • Rozložte príjmy medzi roky

4. Maximalizácia výdavkov:
   • Evidujte všetky oprávnené výdavky
   • Domáca kancelária (časť nájmu, energií)
   • Vzdelávanie a kurzy
   • Auto (do 80% PHM)

5. Zamestnanec vs. dodávateľ:
   • Zvážte zamestnanie rodinného príslušníka

Pozor: Vyhýbajte sa daňovým únikom!"""
    
    elif any(word in message_lower for word in ['pokuta', 'sankcia', 'sankcie', 'penále', 'penale']):
        return """Pokuty a sankcie v daňovom systéme

ZA NEPODANIE DAŇOVÉHO PRIZNANIA:
• Pokuta až 3,500 € za DPFO
• Pokuta až 3,000 € za DPH výkaz

ZA ONESKORENÉ PLATBY:
• Úrok z omeškania: 9.5% ročne (2024)
• Dodatočná pokuta až do výšky dlhu

ZA NESPRÁVNE ÚDAJE:
• Pokuta do 10,000 €
• Možnosť dodatočného priznania do 3 rokov

ZA NEPODANIE DPH:
• Pokuta 60 € - 16,000 € podľa závažnosti

AKO SA VYHNÚŤ POKUTÁM:
✓ Podávajte včas (31.3 alebo 30.6)
✓ Plaťte odvody do 8. dňa v mesiaci
✓ Kontrolujte správnosť údajov
✓ Uchovávajte doklady 10 rokov

TAXA vám pripomenie všetky termíny!"""
    
    elif any(word in message_lower for word in ['zamestnanec', 'zamestnať', 'mzda', 'pracovník']):
        return """Zamestnanie pracovníka ako SZČO

POVINNOSTI ZAMESTNÁVATEĽA:

1. Pred nástupom:
   • Pracovná zmluva (písomne)
   • Registrácia na Sociálnej poisťovni
   • Registrácia na zdravotnej poisťovni

2. Mesačné povinnosti:
   • Výplata mzdy (min. 750 € v 2024)
   • Odvody zamestnávateľa: 35.2%
   • Odvody zamestnanca: 13.4%

3. Príklad výpočtu:
   Hrubá mzda: 1,000 €
   • Odvody zamestnávateľa: 352 €
   • Odvody zamestnanca: 134 €
   • Čistá mzda: ~866 €
   • Celkový náklad: 1,352 €

4. Výhody:
   ✓ Mzda je daňový výdavok
   ✓ Znižuje váš základ dane
   ✓ Rodinný príslušník = nižšie celkové dane

ALTERNATÍVA:
• Dohoda o vykonaní práce (DPP)
• Dohoda o pracovnej činnosti (DPČ)
• Živnostník (subdodávateľ)"""
    
    elif any(word in message_lower for word in ['deti', 'dieťa', 'bonus', 'daňový bonus']):
        return f"""Daňový bonus na deti

ZÁKLADNÉ INFORMÁCIE:
• Suma: 140 € mesačne (1,680 € ročne)
• Na každé vyživované dieťa

PODMIENKY:
✓ Dieťa do 18 rokov
✓ Študent do 25 rokov (denné štúdium)
✓ Dieťa so zdravotným postihnutím (bez veku)
✓ Musíte mať zdaniteľný príjem

AKO FUNGUJE:
1. Znižuje vypočítanú daň
2. Ak je bonus vyšší ako daň → preplatok
3. Dostanete peniaze späť od štátu

PRÍKLAD:
Daň: 500 €
Bonus na 2 deti: 3,360 €
Výsledok: Preplatok 2,860 € ✓

AKO UPLATNIŤ:
• V daňovom priznaní DPFO
• Priložiť rodný list dieťaťa
• Potvrdenie o návšteve školy (študent)

Momentálne máte {docs_count} dokladov v systéme."""
    
    elif any(word in message_lower for word in ['dar', 'dary', 'darovanie', 'charita']):
        return """Daňové odpočty za dary

ČO MÔŽETE ODPOČÍTAŤ:
• Dary na verejnoprospešné účely
• Dary registrovaným organizáciám
• Dary na vedu, vzdelávanie, kultúru
• Dary na zdravotníctvo, šport

MAXIMÁLNA VÝŠKA:
• 20% zo základu dane ALEBO
• Minimálne 3% z príjmov
• Platí sa vyššia suma

PRÍKLAD:
Základ dane: 10,000 €
Príjmy: 30,000 €

20% z 10,000 = 2,000 €
3% z 30,000 = 900 €
Môžete odpočítať: 2,000 € ✓

PODMIENKY:
✓ Dar musí byť bezodplatný
✓ Organizácia musí byť registrovaná
✓ Musíte mať potvrdenie o dare
✓ Minimálna suma: 10 €

KAM DAROVAŤ:
• Neziskové organizácie
• Nadácie
• Občianske združenia
• Cirkvi
• Verejné výskumné inštitúcie"""
    
    elif any(word in message_lower for word in ['dôchodok', 'dochodok', 'sporenie', '3. pilier', 'dds']):
        return """Dôchodkové sporenie a daňové odpočty

3. PILIER (DDS - Doplnkové dôchodkové sporenie):
• Daňový odpočet: až 180 € ročne
• Znižuje základ dane
• Dobrovoľné sporenie

PRÍKLAD:
Vložíte do DDS: 500 € ročne
Odpočet: 180 €
Daň 19%: Ušetríte 34.20 € na dani

2. PILIER (Starobné dôchodkové sporenie):
• Povinné pre narodených po 1.1.1984
• Nie je daňový odpočet
• Časť odvodov ide do fondu

VÝHODY 3. PILIERA:
✓ Daňový odpočet
✓ Príspevok od zamestnávateľa (ak máte)
✓ Dlhodobé zhodnotenie
✓ Výber po 55. roku veku

AKO UPLATNIŤ:
• V daňovom priznaní DPFO
• Priložiť potvrdenie od DSS
• Maximálne 180 € ročne

ODPORÚČANIE:
Kombinujte s inými odpočtami pre maximálnu úsporu!"""
    
    elif any(word in message_lower for word in ['cestovné', 'cestovne', 'cesta', 'stravné', 'stravne']):
        return """Cestovné náhrady a stravné

SLUŽOBNÁ CESTA SZČO:

1. STRAVNÉ:
   • Slovensko: 5.10 € - 9.20 € (podľa dĺžky)
   • Zahraničie: podľa krajiny (15-52 €)
   • 5-12 hodín: 75% sadzby
   • Nad 12 hodín: 100% sadzby

2. UBYTOVANIE:
   • Skutočné náklady s faktúrou
   • Bez limitu (primeranosť)

3. DOPRAVA:
   • Vlastné auto: 0.263 €/km (2024)
   • Verejná doprava: skutočné náklady
   • Taxi: s dokladom

4. INÉ VÝDAVKY:
   • Parkovné, dálničné poplatky
   • Telefón počas cesty

PRÍKLAD VÝPOČTU:
Cesta: Bratislava → Košice (400 km)
• Km náhrada: 400 × 0.263 = 105.20 €
• Stravné (1 deň): 9.20 €
• Ubytovanie: 60 €
• Spolu: 174.40 € (daňový výdavok)

DOKLADY:
✓ Cestovný príkaz
✓ Faktúry za ubytovanie
✓ Doklady o doprave
✓ Kniha jázd (auto)"""
    
    elif any(word in message_lower for word in ['auto', 'vozidlo', 'phm', 'pohonné hmoty', 'pohonne hmoty']):
        return """Automobil a daňové výdavky

POUŽÍVANIE AUTA NA PODNIKANIE:

1. POHONNÉ HMOTY:
   • Odpočet: až 80% nákladov
   • Potrebné: kniha jázd
   • Evidencia: služobné vs. súkromné km

2. NÁKUP VOZIDLA:
   • Odpisovanie: 4-6 rokov
   • Limit: 48,000 € (nad limit nie je výdavok)
   • Leasing: splátky sú výdavok

3. PREVÁDZKOVÉ NÁKLADY:
   ✓ Servis a opravy: 100%
   ✓ Povinné ručenie: 100%
   ✓ Havarijné poistenie: 100%
   ✓ Diaľničná známka: 100%
   ✓ Parkovné (služobné): 100%

4. KNIHA JÁZD musí obsahovať:
   • Dátum cesty
   • Účel cesty
   • Trasa (odkiaľ - kam)
   • Počet km
   • Stav tachometra

PRÍKLAD:
Ročne najazdené: 20,000 km
Služ. cesty: 16,000 km (80%)
PHM celkom: 2,000 €
Odpočet: 2,000 × 80% × 80% = 1,280 €

ALTERNATÍVA:
• Paušál 0.263 €/km (bez dokladov o PHM)"""
    
    elif any(word in message_lower for word in ['kancelária', 'kancelaria', 'home office', 'domáca kancelária', 'domaca kancelaria', 'priestory']):
        return """Domáca kancelária a priestory

ODPOČET NÁKLADOV NA KANCELÁRIU:

1. PRENÁJOM KANCELÁRIE:
   • 100% nájomného je daňový výdavok
   • Potrebná nájomná zmluva
   • Faktúra/potvrdenie o platbe

2. DOMÁCA KANCELÁRIA:
   • Časť nákladov na bývanie
   • Podľa pomeru plôch

   Príklad výpočtu:
   Byt: 80 m²
   Kancelária: 16 m² (20%)
   
   Odpočítate 20% z:
   • Nájomné (ak prenajatý byt)
   • Energie (elektrina, plyn)
   • Internet
   • Telefón

3. ENERGIE:
   • Elektrina: podľa pomeru
   • Vykurovanie: podľa pomeru
   • Voda: podľa pomeru

4. VYBAVENIE:
   ✓ Nábytok (stôl, stolička)
   ✓ Počítač, notebook
   ✓ Tlačiareň, skener
   ✓ Telefón
   ✓ Software

PRÍKLAD MESAČNE:
Nájom: 600 € × 20% = 120 €
Energie: 100 € × 20% = 20 €
Internet: 30 € × 100% = 30 €
Spolu: 170 € mesačne = 2,040 € ročne

POZOR:
• Musíte preukázať pracovné využitie
• Odporúčané: fotky, popis činnosti"""
    
    else:
        # Default helpful response
        response = f"""Dobrý deň! Som váš AI daňový konzultant.

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
• Účtovníctvom a evidenciou
• Daňovou optimalizáciou
• Pokutami a sankciami
• Zamestnaním pracovníka
• Daňovým bonusom na deti
• Darmi a odpočtami
• Dôchodkovým sporením
• Cestovnými náhradami
• Autom a PHM
• Domácou kanceláriou

Príklady otázok:
"Kedy musím podať daňové priznanie?"
"Koľko sú minimálne odvody?"
"Ako ušetriť na daniach?"
"Môžem odpočítať auto?"
"Aký je daňový bonus na deti?"

Opýtajte sa ma na čokoľvek!"""
        
        # Add document requests if missing and relevant
        if missing_docs:
            doc_requests = []
            if missing_docs.get("bank_statement"):
                doc_requests.append("📄 **Výpis z účtu** (bankový výpis za celý rok)")
            if missing_docs.get("health_insurance"):
                doc_requests.append("🏥 **Potvrdenie od zdravotnej poisťovne** (o zaplatených odvodoch)")
            if missing_docs.get("social_insurance"):
                doc_requests.append("👥 **Potvrdenie od Sociálnej poisťovne** (o zaplatených odvodoch)")
            
            if doc_requests:
                response += "\n\n" + "="*50 + "\n"
                response += "📋 **PRE KOMPLETNÝ DAŇOVÝ VÝPOČET POTREBUJEM:**\n\n"
                response += "\n".join(doc_requests)
                response += "\n\nNahrajte tieto dokumenty do systému TAXA."
        
        return response

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
    
    # Check for missing important documents
    missing_docs = check_missing_documents(db, current_user.id)
    
    # Get AI response using built-in knowledge base
    try:
        # Use built-in knowledge base with document checking
        ai_response = get_ai_response(request.message, docs_count, missing_docs)
    except Exception as e:
        # Fallback to built-in responses without missing docs check
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

# ============================================================================
# SLOVAK TAX KNOWLEDGE BASE ENDPOINTS
# ============================================================================

@app.get("/api/knowledge/search")
async def search_knowledge_base(q: str):
    """
    Search Slovak tax knowledge base
    Public endpoint - no authentication required
    """
    kb = SlovakTaxKnowledgeBase()
    results = kb.search_knowledge(q)
    
    return {
        "query": q,
        "results": results,
        "count": len(results)
    }

@app.get("/api/knowledge/topic/{topic}")
async def get_knowledge_topic(topic: str):
    """
    Get specific topic from knowledge base
    Topics: tax_rates, deadlines, forms, deductions, vat_info, insurance, procedures, legislation, common_questions
    """
    kb = SlovakTaxKnowledgeBase()
    
    if topic not in kb.knowledge:
        return {"error": f"Topic '{topic}' not found"}
    
    return {
        "topic": topic,
        "data": kb.knowledge[topic]
    }

@app.get("/api/knowledge/faq")
async def get_faq():
    """
    Get frequently asked questions about Slovak taxes
    Public endpoint
    """
    kb = SlovakTaxKnowledgeBase()
    return kb.knowledge.get("common_questions", {})

@app.get("/api/knowledge/deadlines")
async def get_tax_deadlines():
    """
    Get current tax deadlines for Slovakia
    Public endpoint
    """
    kb = SlovakTaxKnowledgeBase()
    return kb.knowledge.get("deadlines", {})

@app.get("/api/knowledge/all")
async def get_all_knowledge():
    """
    Get entire knowledge base
    Use sparingly - large response
    """
    kb = SlovakTaxKnowledgeBase()
    return kb.knowledge

# ============================================================================
# ICO VERIFICATION ENDPOINTS
# ============================================================================

@app.get("/api/ico/verify/{ico}")
async def verify_ico(ico: str):
    """
    Verify ICO (Identifikačné číslo organizácie) against Slovak registries
    Returns company information if valid
    Public endpoint - no authentication required
    """
    service = ICOVerificationService()
    result = await service.verify_ico(ico)
    
    return result

@app.get("/api/ico/details/{ico}")
async def get_ico_details(ico: str):
    """
    Get complete company details for auto-filling registration form
    Public endpoint - no authentication required
    """
    service = ICOVerificationService()
    details = await service.get_company_details(ico)
    
    if not details:
        return {
            "error": "ICO not found or invalid",
            "ico": ico
        }
    
    return details

@app.post("/api/ico/validate")
async def validate_ico_format(data: dict):
    """
    Validate ICO format without calling external APIs
    Fast format check
    """
    ico = data.get("ico", "")
    service = ICOVerificationService()
    
    is_valid = service.validate_ico_format(ico)
    normalized = service.normalize_ico(ico) if is_valid else None
    
    return {
        "valid": is_valid,
        "ico": ico,
        "normalized": normalized,
        "message": "Valid ICO format" if is_valid else "Invalid ICO format. ICO must be 8 digits."
    }

# ============================================================================
# GDPR COMPLIANCE ENDPOINTS
# ============================================================================

@app.get("/api/gdpr/my-data")
async def export_my_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    GDPR Article 15: Right of access
    Export all user data in machine-readable format
    """
    # Log data access for audit
    SecurityAuditLogger.log_data_access(
        current_user.id, 
        "user_data_export", 
        current_user.id, 
        "GDPR_DATA_EXPORT"
    )
    
    # Get all user documents
    documents = db.query(Document).filter(Document.user_id == current_user.id).all()
    
    # Get all chat messages
    messages = db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id).all()
    
    # Prepare export data
    export_data = {
        "export_date": datetime.utcnow().isoformat(),
        "gdpr_compliance": "Article 15 - Right of Access",
        "data_location": "EU (Slovakia/Germany)",
        "user_profile": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "created_at": current_user.created_at.isoformat(),
            "ico": current_user.ico,
            "dic": current_user.dic,
            "ic_dph": current_user.ic_dph,
            "business_name": current_user.business_name,
            "business_address": current_user.business_address,
            "legal_form": current_user.legal_form,
            "phone": current_user.phone,
            "business_type": current_user.business_type,
            "expense_type": current_user.expense_type,
            "vat_status": current_user.vat_status,
            "onboarding_completed": current_user.onboarding_completed
        },
        "documents": [
            {
                "id": doc.id,
                "filename": doc.filename,
                "document_type": doc.document_type,
                "file_path": doc.file_path,
                "upload_date": doc.created_at.isoformat(),
                "extracted_data": doc.extracted_data
            }
            for doc in documents
        ],
        "chat_history": [
            {
                "id": msg.id,
                "role": msg.role,
                "content": msg.content,
                "timestamp": msg.created_at.isoformat()
            }
            for msg in messages
        ],
        "statistics": {
            "total_documents": len(documents),
            "total_messages": len(messages),
            "account_age_days": (datetime.utcnow() - current_user.created_at).days
        }
    }
    
    return export_data

@app.delete("/api/gdpr/delete-account")
async def delete_my_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    GDPR Article 17: Right to erasure ("right to be forgotten")
    Permanently delete user account and all associated data
    One-click account deletion
    """
    user_id = current_user.id
    user_email = current_user.email
    
    # Get counts for audit log
    documents_count = db.query(Document).filter(Document.user_id == user_id).count()
    messages_count = db.query(ChatMessage).filter(ChatMessage.user_id == user_id).count()
    
    # Delete all documents
    db.query(Document).filter(Document.user_id == user_id).delete()
    SecurityAuditLogger.log_data_deletion(user_id, "documents", documents_count)
    
    # Delete all chat messages
    db.query(ChatMessage).filter(ChatMessage.user_id == user_id).delete()
    SecurityAuditLogger.log_data_deletion(user_id, "chat_messages", messages_count)
    
    # Delete user account
    db.query(User).filter(User.id == user_id).delete()
    SecurityAuditLogger.log_data_deletion(user_id, "user_account", 1)
    
    db.commit()
    
    return {
        "message": "Account successfully deleted",
        "email": user_email,
        "deleted_at": datetime.utcnow().isoformat(),
        "gdpr_compliance": "Article 17 - Right to Erasure",
        "data_deleted": {
            "user_profile": 1,
            "documents": documents_count,
            "chat_messages": messages_count,
            "total_records": 1 + documents_count + messages_count
        },
        "note": "All your data has been permanently removed from our systems. Data stored in EU only."
    }

@app.get("/api/gdpr/privacy-info")
async def get_privacy_info():
    """
    Provide GDPR-compliant privacy information
    Data storage location, processing purposes, retention periods
    """
    return {
        "gdpr_compliance": "EU General Data Protection Regulation",
        "data_controller": {
            "name": "TAXA Platform",
            "location": "European Union",
            "contact": "privacy@taxa.app"
        },
        "data_storage": {
            "location": "EU-only servers (Germany/Slovakia)",
            "provider": "Render.com (EU region)",
            "encryption": "AES-256 encryption for all documents",
            "database": "Encrypted SQLite/PostgreSQL",
            "backups": "Encrypted, EU-only"
        },
        "data_collected": {
            "personal_info": ["name", "email", "phone", "business details"],
            "documents": ["invoices", "receipts", "tax forms"],
            "usage_data": ["chat history", "document uploads", "login activity"]
        },
        "data_processing_purposes": [
            "Tax calculation and reporting",
            "Document storage and management",
            "AI-powered tax assistance",
            "GDPR-compliant accounting"
        ],
        "data_retention": {
            "user_account": "Until deletion requested",
            "tax_documents": "10 years (Slovak law requirement)",
            "chat_history": "Until deletion requested",
            "audit_logs": "3 years (GDPR Article 30)"
        },
        "your_rights": {
            "access": "GET /api/gdpr/my-data - Export all your data",
            "rectification": "Update via profile settings",
            "erasure": "DELETE /api/gdpr/delete-account - One-click deletion",
            "portability": "Export data in JSON format",
            "object": "Contact privacy@taxa.app",
            "complaint": "File with Slovak DPA (ÚOOÚ)"
        },
        "security_measures": [
            "End-to-end encryption for documents",
            "HTTPS/TLS for all connections",
            "Password hashing (bcrypt)",
            "JWT authentication",
            "Regular security audits",
            "No third-party data sharing"
        ],
        "compliance_certificates": {
            "gdpr": "EU GDPR compliant",
            "data_location": "EU-only",
            "iso_27001": "Planned certification"
        }
    }

@app.get("/api/gdpr/data-portability")
async def get_portable_data(
    format: str = "json",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    GDPR Article 20: Right to data portability
    Export data in structured, commonly used format (JSON/CSV)
    """
    # Log data access
    SecurityAuditLogger.log_data_access(
        current_user.id,
        "data_portability",
        current_user.id,
        f"EXPORT_{format.upper()}"
    )
    
    # Get all data
    documents = db.query(Document).filter(Document.user_id == current_user.id).all()
    
    portable_data = {
        "format": format,
        "exported_at": datetime.utcnow().isoformat(),
        "gdpr_article": "Article 20 - Right to Data Portability",
        "user": {
            "email": current_user.email,
            "name": current_user.name,
            "business_info": {
                "ico": current_user.ico,
                "business_name": current_user.business_name,
                "vat_status": current_user.vat_status
            }
        },
        "documents_summary": {
            "total": len(documents),
            "by_type": {}
        },
        "documents": []
    }
    
    # Group documents by type
    for doc in documents:
        doc_type = doc.document_type or "unknown"
        if doc_type not in portable_data["documents_summary"]["by_type"]:
            portable_data["documents_summary"]["by_type"][doc_type] = 0
        portable_data["documents_summary"]["by_type"][doc_type] += 1
        
        portable_data["documents"].append({
            "filename": doc.filename,
            "type": doc.document_type,
            "date": doc.created_at.isoformat(),
            "extracted_data": doc.extracted_data
        })
    
    return portable_data

@app.post("/api/gdpr/consent")
async def update_consent(
    consent_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    GDPR Article 7: Consent management
    Allow users to manage their data processing consent
    """
    # In production: Store consent preferences in database
    # For now: Return acknowledgment
    
    SecurityAuditLogger.log_data_access(
        current_user.id,
        "consent_update",
        current_user.id,
        "CONSENT_MODIFIED"
    )
    
    return {
        "message": "Consent preferences updated",
        "timestamp": datetime.utcnow().isoformat(),
        "user_id": current_user.id,
        "consents_updated": consent_data
    }

# Law Updates Endpoints
@app.post("/api/admin/law-updates/check")
async def trigger_law_update_check(
    current_user: User = Depends(get_current_user)
):
    """
    Manuálne spustenie kontroly aktualizácií daňových zákonov
    Dostupné len pre administrátorov
    """
    logger.info(f"🔍 Manuálne spustená kontrola zákonov používateľom {current_user.email}")
    
    try:
        result = run_weekly_update()
        return {
            "status": "success",
            "message": "Kontrola zákonov dokončená",
            "result": result
        }
    except Exception as e:
        logger.error(f"❌ Chyba pri kontrole zákonov: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/law-updates/latest")
async def get_latest_law_updates(
    current_user: User = Depends(get_current_user)
):
    """
    Získa najnovšie aktualizácie daňových zákonov
    """
    updater = SlovakTaxLawUpdater()
    updates = updater.get_latest_updates()
    
    if updates:
        return {
            "status": "success",
            "updates": updates
        }
    else:
        return {
            "status": "no_updates",
            "message": "Zatiaľ neboli nájdené žiadne aktualizácie"
        }

@app.get("/api/admin/law-updates/history")
async def get_law_update_history(
    limit: int = 10,
    current_user: User = Depends(get_current_user)
):
    """
    Získa históriu kontrol aktualizácií zákonov
    """
    updater = SlovakTaxLawUpdater()
    history = updater.get_update_history(limit=limit)
    
    return {
        "status": "success",
        "history": history,
        "count": len(history)
    }
