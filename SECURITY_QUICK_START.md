# TAXA Security Quick Start Guide
## Immediate Actions to Secure Your Application

---

## 🚨 STEP 1: Generate Secure Keys (5 minutes)

### Generate SECRET_KEY and ENCRYPTION_KEY

```bash
# Run these commands to generate secure keys
python3 -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(64))"
python3 -c "import secrets; print('ENCRYPTION_KEY=' + secrets.token_urlsafe(64))"
```

### Create .env file

```bash
cd /Users/diana/Downloads/TAXA/backend
cp .env.example .env
# Edit .env and paste your generated keys
nano .env
```

**CRITICAL:** Never commit .env to git!

```bash
# Add to .gitignore if not already there
echo ".env" >> .gitignore
echo "*.db" >> .gitignore
echo "uploads/" >> .gitignore
```

---

## 🚨 STEP 2: Install Security Packages (10 minutes)

```bash
cd /Users/diana/Downloads/TAXA/backend
pip3 install -r requirements.txt
```

If you encounter issues with specific packages:

```bash
# Install individually
pip3 install slowapi python-magic pyotp qrcode sentry-sdk prometheus-client sqlalchemy-utils
```

---

## 🚨 STEP 3: Migrate to PostgreSQL (30 minutes)

### Install PostgreSQL

```bash
# macOS
brew install postgresql@14
brew services start postgresql@14

# Create database
createdb taxa_db

# Create user
psql postgres
CREATE USER taxa_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE taxa_db TO taxa_user;
\q
```

### Update .env

```bash
DATABASE_URL=postgresql://taxa_user:your_secure_password@localhost:5432/taxa_db
```

### Migrate data (if you have existing SQLite data)

```bash
# Export from SQLite
sqlite3 taxa.db .dump > backup.sql

# Import to PostgreSQL (requires manual conversion)
# Or start fresh with new database
```

---

## 🚨 STEP 4: Enable Security Features (15 minutes)

### Update main.py to use security middleware

Add to the top of `/Users/diana/Downloads/TAXA/backend/main.py`:

```python
from middleware.security_middleware import setup_security_middleware
from services.security_service import (
    SecurityAuditService, 
    RateLimiter, 
    FileSecurityValidator,
    PasswordSecurityValidator,
    AuditLog,
    SecurityEvent,
    RateLimitTracker
)
import os

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Security configuration
SECURITY_CONFIG = {
    "enable_rate_limiting": os.getenv("ENABLE_RATE_LIMITING", "true").lower() == "true",
    "enable_audit_logging": os.getenv("ENABLE_AUDIT_LOGGING", "true").lower() == "true",
    "rate_limit": int(os.getenv("RATE_LIMIT_API", "100")),
    "rate_limit_window": 60,
    "admin_ip_whitelist": os.getenv("ADMIN_IP_WHITELIST", "").split(",") if os.getenv("ADMIN_IP_WHITELIST") else []
}
```

After creating the FastAPI app, add:

```python
# Setup security middleware
setup_security_middleware(app, SECURITY_CONFIG)
```

### Create database tables for security

```python
# Add to main.py after Base.metadata.create_all(bind=engine)
from services.security_service import AuditLog, SecurityEvent, RateLimitTracker

# Create security tables
AuditLog.__table__.create(bind=engine, checkfirst=True)
SecurityEvent.__table__.create(bind=engine, checkfirst=True)
RateLimitTracker.__table__.create(bind=engine, checkfirst=True)
```

---

## 🚨 STEP 5: Secure File Uploads (10 minutes)

### Update file upload endpoint

Replace the upload logic in main.py:

```python
from services.security_service import FileSecurityValidator, get_client_ip

@app.post("/api/documents/upload")
async def upload_document(
    request: Request,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Read file content
    content = await file.read()
    
    # Validate file security
    validation = FileSecurityValidator.validate_file(
        file.filename, 
        content, 
        file.content_type
    )
    
    if not validation['valid']:
        # Log security event
        SecurityAuditService.log_security_event(
            db=db,
            event_type="malicious_file_upload",
            severity="high",
            description=f"Blocked file upload: {validation['error']}",
            user_id=current_user.id,
            ip_address=get_client_ip(request)
        )
        raise HTTPException(status_code=400, detail=validation['error'])
    
    # Generate safe filename
    safe_filename = FileSecurityValidator.generate_safe_filename(file.filename)
    file_path = UPLOAD_DIR / safe_filename
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Log audit event
    SecurityAuditService.log_event(
        db=db,
        action="file_upload",
        user_id=current_user.id,
        resource_type="document",
        ip_address=get_client_ip(request),
        success=True,
        details={"filename": file.filename, "size": len(content)}
    )
    
    # Continue with OCR processing...
```

---

## 🚨 STEP 6: Enhance Password Security (10 minutes)

### Update registration endpoint

```python
from services.security_service import PasswordSecurityValidator

@app.post("/api/auth/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # Validate password strength
    password_validation = PasswordSecurityValidator.validate_password(user.password)
    
    if not password_validation['valid']:
        raise HTTPException(
            status_code=400,
            detail={"errors": password_validation['errors']}
        )
    
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = PasswordSecurityValidator.hash_password(user.password)
    
    # Create user
    db_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    
    return {"message": "User created successfully"}
```

### Update login endpoint with audit logging

```python
@app.post("/api/auth/login")
async def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Check rate limit
    client_ip = get_client_ip(request)
    if not RateLimiter.check_rate_limit(db, client_ip, 'login'):
        SecurityAuditService.log_security_event(
            db=db,
            event_type="rate_limit_exceeded",
            severity="medium",
            description="Login rate limit exceeded",
            ip_address=client_ip
        )
        raise HTTPException(
            status_code=429,
            detail="Too many login attempts. Please try again later."
        )
    
    # Authenticate user
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not PasswordSecurityValidator.verify_password(
        form_data.password, 
        user.hashed_password
    ):
        # Log failed login
        SecurityAuditService.log_event(
            db=db,
            action="login_attempt",
            user_id=user.id if user else None,
            ip_address=client_ip,
            user_agent=request.headers.get("user-agent"),
            success=False,
            risk_score=30
        )
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Check for suspicious activity
    risk_check = SecurityAuditService.check_suspicious_activity(db, user.id, client_ip)
    
    if risk_check['requires_verification']:
        SecurityAuditService.log_security_event(
            db=db,
            event_type="suspicious_login",
            severity="high",
            description=f"Suspicious login detected: {', '.join(risk_check['alerts'])}",
            user_id=user.id,
            ip_address=client_ip
        )
        # TODO: Implement 2FA verification here
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    # Log successful login
    SecurityAuditService.log_event(
        db=db,
        action="login_success",
        user_id=user.id,
        ip_address=client_ip,
        user_agent=request.headers.get("user-agent"),
        success=True
    )
    
    return {"access_token": access_token, "token_type": "bearer"}
```

---

## 🚨 STEP 7: Enable HTTPS (Production Only)

### Get SSL Certificate

```bash
# Install certbot
brew install certbot

# Get certificate (for production domain)
sudo certbot certonly --standalone -d yourdomain.com
```

### Configure Uvicorn with SSL

```bash
uvicorn main:app \
  --host 0.0.0.0 \
  --port 443 \
  --ssl-keyfile=/etc/letsencrypt/live/yourdomain.com/privkey.pem \
  --ssl-certfile=/etc/letsencrypt/live/yourdomain.com/fullchain.pem
```

Or use Nginx as reverse proxy (recommended):

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    ssl_protocols TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🚨 STEP 8: Set Up Monitoring (20 minutes)

### Install Sentry for Error Tracking

```python
# Add to main.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    integrations=[FastApiIntegration()],
    traces_sample_rate=1.0,
    environment=os.getenv("ENVIRONMENT", "development")
)
```

### Set up basic monitoring endpoint

```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/admin/security/stats")
async def security_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is admin (implement admin check)
    
    # Get security statistics
    total_audits = db.query(AuditLog).count()
    failed_logins = db.query(AuditLog).filter(
        AuditLog.action == "login_attempt",
        AuditLog.success == False,
        AuditLog.timestamp >= datetime.utcnow() - timedelta(days=7)
    ).count()
    
    security_events = db.query(SecurityEvent).filter(
        SecurityEvent.resolved == False
    ).count()
    
    return {
        "total_audit_logs": total_audits,
        "failed_logins_7d": failed_logins,
        "unresolved_security_events": security_events
    }
```

---

## 🚨 STEP 9: Regular Maintenance Tasks

### Daily Tasks

```bash
# Check for failed login attempts
psql taxa_db -c "SELECT COUNT(*) FROM audit_logs WHERE action='login_attempt' AND success=false AND timestamp > NOW() - INTERVAL '24 hours';"

# Check for unresolved security events
psql taxa_db -c "SELECT * FROM security_events WHERE resolved=false ORDER BY timestamp DESC LIMIT 10;"
```

### Weekly Tasks

```bash
# Clean up old rate limit trackers
psql taxa_db -c "DELETE FROM rate_limit_tracker WHERE last_request < NOW() - INTERVAL '7 days';"

# Review audit logs
psql taxa_db -c "SELECT action, COUNT(*) FROM audit_logs WHERE timestamp > NOW() - INTERVAL '7 days' GROUP BY action ORDER BY COUNT(*) DESC;"

# Backup database
pg_dump taxa_db > backup_$(date +%Y%m%d).sql
```

### Monthly Tasks

- Review and rotate encryption keys
- Update dependencies: `pip install --upgrade -r requirements.txt`
- Review security event logs
- Test backup restoration
- Update SSL certificates (if needed)

---

## 🚨 STEP 10: Testing Security

### Test Rate Limiting

```bash
# Test login rate limit (should block after 5 attempts)
for i in {1..10}; do
  curl -X POST http://localhost:8080/api/auth/login \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=test@test.com&password=wrong"
  echo ""
done
```

### Test File Upload Validation

```bash
# Try uploading invalid file type
curl -X POST http://localhost:8080/api/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@malicious.exe"
```

### Test Security Headers

```bash
curl -I http://localhost:8080/
# Should see X-Content-Type-Options, X-Frame-Options, etc.
```

---

## ✅ Security Checklist

After completing all steps, verify:

- [ ] SECRET_KEY is cryptographically secure (not default)
- [ ] Database is PostgreSQL with SSL enabled
- [ ] HTTPS is enabled (production)
- [ ] Rate limiting is active
- [ ] Security headers are present
- [ ] File uploads are validated
- [ ] Passwords meet complexity requirements
- [ ] Audit logging is working
- [ ] Monitoring is set up (Sentry)
- [ ] Backups are automated
- [ ] .env file is in .gitignore
- [ ] No sensitive data in git repository

---

## 🆘 Emergency Procedures

### If you detect a security breach:

1. **Immediately** - Disable affected accounts
2. **Within 1 hour** - Identify scope of breach
3. **Within 24 hours** - Notify affected users
4. **Within 72 hours** - Report to supervisory authority (GDPR)
5. **Document everything** - For legal compliance

### Emergency contacts:

- Security team: [Your email]
- Legal/GDPR officer: [Contact]
- Hosting provider: [Support contact]

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GDPR Compliance Checklist](https://gdpr.eu/checklist/)
- [FastAPI Security Best Practices](https://fastapi.tiangolo.com/tutorial/security/)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)

---

**Remember: Security is an ongoing process, not a one-time task!**

Review and update security measures quarterly.
