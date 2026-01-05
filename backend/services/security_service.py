"""
Enhanced Security Service for TAXA
Implements rate limiting, audit logging, and security monitoring
"""

import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSON, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
import logging
from fastapi import Request, HTTPException, status
import json

Base = declarative_base()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AuditLog(Base):
    """Comprehensive audit logging for all security-relevant events"""
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    action = Column(String, nullable=False, index=True)
    resource_type = Column(String, nullable=True)
    resource_id = Column(Integer, nullable=True)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    success = Column(Boolean, default=True)
    details = Column(JSON, nullable=True)
    risk_score = Column(Integer, default=0)


class SecurityEvent(Base):
    """Track security events and suspicious activities"""
    __tablename__ = "security_events"
    
    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String, nullable=False, index=True)
    severity = Column(String, nullable=False)  # low, medium, high, critical
    user_id = Column(Integer, nullable=True)
    ip_address = Column(String, nullable=True)
    description = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    resolved = Column(Boolean, default=False)
    resolution_notes = Column(Text, nullable=True)


class RateLimitTracker(Base):
    """Track API rate limits per user/IP"""
    __tablename__ = "rate_limit_tracker"
    
    id = Column(Integer, primary_key=True, index=True)
    identifier = Column(String, nullable=False, index=True)  # user_id or IP
    endpoint = Column(String, nullable=False)
    request_count = Column(Integer, default=1)
    window_start = Column(DateTime, default=datetime.utcnow)
    last_request = Column(DateTime, default=datetime.utcnow)


class SecurityAuditService:
    """Service for security audit logging and monitoring"""
    
    @staticmethod
    def log_event(
        db: Session,
        action: str,
        user_id: Optional[int] = None,
        resource_type: Optional[str] = None,
        resource_id: Optional[int] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        success: bool = True,
        details: Optional[Dict[str, Any]] = None,
        risk_score: int = 0
    ):
        """Log a security-relevant event"""
        try:
            audit_log = AuditLog(
                user_id=user_id,
                action=action,
                resource_type=resource_type,
                resource_id=resource_id,
                ip_address=ip_address,
                user_agent=user_agent,
                success=success,
                details=details,
                risk_score=risk_score
            )
            db.add(audit_log)
            db.commit()
            
            # Log to application logs as well
            log_msg = f"AUDIT: {action} | User: {user_id} | Success: {success} | IP: {ip_address}"
            if risk_score > 50:
                logger.warning(log_msg)
            else:
                logger.info(log_msg)
                
        except Exception as e:
            logger.error(f"Failed to log audit event: {str(e)}")
    
    @staticmethod
    def log_security_event(
        db: Session,
        event_type: str,
        severity: str,
        description: str,
        user_id: Optional[int] = None,
        ip_address: Optional[str] = None
    ):
        """Log a security event (suspicious activity, attack attempt, etc.)"""
        try:
            security_event = SecurityEvent(
                event_type=event_type,
                severity=severity,
                user_id=user_id,
                ip_address=ip_address,
                description=description
            )
            db.add(security_event)
            db.commit()
            
            # Alert on high/critical severity
            if severity in ['high', 'critical']:
                logger.critical(f"SECURITY ALERT: {event_type} - {description} | User: {user_id} | IP: {ip_address}")
            else:
                logger.warning(f"Security Event: {event_type} - {description}")
                
        except Exception as e:
            logger.error(f"Failed to log security event: {str(e)}")
    
    @staticmethod
    def check_suspicious_activity(db: Session, user_id: int, ip_address: str) -> Dict[str, Any]:
        """Check for suspicious activity patterns"""
        risk_score = 0
        alerts = []
        
        # Check failed login attempts in last hour
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)
        failed_logins = db.query(AuditLog).filter(
            AuditLog.user_id == user_id,
            AuditLog.action == 'login_attempt',
            AuditLog.success == False,
            AuditLog.timestamp >= one_hour_ago
        ).count()
        
        if failed_logins >= 3:
            risk_score += 30
            alerts.append(f"Multiple failed login attempts: {failed_logins}")
        
        # Check for access from new IP
        recent_ips = db.query(AuditLog.ip_address).filter(
            AuditLog.user_id == user_id,
            AuditLog.timestamp >= datetime.utcnow() - timedelta(days=30)
        ).distinct().all()
        
        known_ips = [ip[0] for ip in recent_ips if ip[0]]
        if ip_address not in known_ips and len(known_ips) > 0:
            risk_score += 20
            alerts.append("Access from new IP address")
        
        # Check for unusual activity volume
        last_hour_actions = db.query(AuditLog).filter(
            AuditLog.user_id == user_id,
            AuditLog.timestamp >= one_hour_ago
        ).count()
        
        if last_hour_actions > 100:
            risk_score += 25
            alerts.append(f"High activity volume: {last_hour_actions} actions in last hour")
        
        return {
            "risk_score": risk_score,
            "alerts": alerts,
            "requires_verification": risk_score >= 50
        }


class RateLimiter:
    """Rate limiting service to prevent abuse"""
    
    # Rate limit configurations (requests per time window)
    LIMITS = {
        'login': {'requests': 5, 'window_minutes': 15},
        'register': {'requests': 3, 'window_minutes': 60},
        'upload': {'requests': 10, 'window_minutes': 60},
        'chat': {'requests': 20, 'window_minutes': 1},
        'api': {'requests': 100, 'window_minutes': 1},
        'export': {'requests': 5, 'window_minutes': 60},
    }
    
    @staticmethod
    def check_rate_limit(
        db: Session,
        identifier: str,
        endpoint: str,
        limit_config: Optional[Dict[str, int]] = None
    ) -> bool:
        """
        Check if request is within rate limit
        Returns True if allowed, False if rate limit exceeded
        """
        if limit_config is None:
            limit_config = RateLimiter.LIMITS.get(endpoint, {'requests': 100, 'window_minutes': 1})
        
        window_minutes = limit_config['window_minutes']
        max_requests = limit_config['requests']
        window_start = datetime.utcnow() - timedelta(minutes=window_minutes)
        
        # Get or create rate limit tracker
        tracker = db.query(RateLimitTracker).filter(
            RateLimitTracker.identifier == identifier,
            RateLimitTracker.endpoint == endpoint,
            RateLimitTracker.window_start >= window_start
        ).first()
        
        if not tracker:
            # Create new tracker
            tracker = RateLimitTracker(
                identifier=identifier,
                endpoint=endpoint,
                request_count=1,
                window_start=datetime.utcnow()
            )
            db.add(tracker)
            db.commit()
            return True
        
        # Check if within limit
        if tracker.request_count >= max_requests:
            logger.warning(f"Rate limit exceeded: {identifier} on {endpoint}")
            return False
        
        # Increment counter
        tracker.request_count += 1
        tracker.last_request = datetime.utcnow()
        db.commit()
        return True
    
    @staticmethod
    def cleanup_old_trackers(db: Session):
        """Clean up old rate limit trackers (run periodically)"""
        cutoff = datetime.utcnow() - timedelta(hours=24)
        db.query(RateLimitTracker).filter(
            RateLimitTracker.last_request < cutoff
        ).delete()
        db.commit()


class FileSecurityValidator:
    """Validate uploaded files for security"""
    
    ALLOWED_EXTENSIONS = {'.pdf', '.jpg', '.jpeg', '.png'}
    ALLOWED_MIME_TYPES = {
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg'
    }
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    
    @staticmethod
    def validate_file(filename: str, content: bytes, content_type: str) -> Dict[str, Any]:
        """
        Validate uploaded file for security
        Returns dict with 'valid' boolean and 'error' message if invalid
        """
        import os
        
        # Check file size
        if len(content) > FileSecurityValidator.MAX_FILE_SIZE:
            return {
                'valid': False,
                'error': f'File size exceeds maximum allowed size of {FileSecurityValidator.MAX_FILE_SIZE / 1024 / 1024}MB'
            }
        
        # Check file extension
        file_ext = os.path.splitext(filename)[1].lower()
        if file_ext not in FileSecurityValidator.ALLOWED_EXTENSIONS:
            return {
                'valid': False,
                'error': f'File type not allowed. Allowed types: {", ".join(FileSecurityValidator.ALLOWED_EXTENSIONS)}'
            }
        
        # Check MIME type
        if content_type not in FileSecurityValidator.ALLOWED_MIME_TYPES:
            return {
                'valid': False,
                'error': f'Invalid file type. Expected: {", ".join(FileSecurityValidator.ALLOWED_MIME_TYPES)}'
            }
        
        # Check for malicious content patterns
        dangerous_patterns = [
            b'<script',
            b'javascript:',
            b'<?php',
            b'<%',
        ]
        
        content_lower = content.lower()
        for pattern in dangerous_patterns:
            if pattern in content_lower:
                return {
                    'valid': False,
                    'error': 'File contains potentially malicious content'
                }
        
        return {'valid': True, 'error': None}
    
    @staticmethod
    def generate_safe_filename(original_filename: str) -> str:
        """Generate a safe filename using UUID"""
        import os
        import uuid
        
        ext = os.path.splitext(original_filename)[1].lower()
        safe_name = f"{uuid.uuid4()}{ext}"
        return safe_name


class PasswordSecurityValidator:
    """Enhanced password security validation"""
    
    MIN_LENGTH = 12
    REQUIRE_UPPERCASE = True
    REQUIRE_LOWERCASE = True
    REQUIRE_DIGITS = True
    REQUIRE_SPECIAL = True
    
    @staticmethod
    def validate_password(password: str) -> Dict[str, Any]:
        """
        Validate password strength
        Returns dict with 'valid' boolean and 'errors' list
        """
        errors = []
        
        if len(password) < PasswordSecurityValidator.MIN_LENGTH:
            errors.append(f'Password must be at least {PasswordSecurityValidator.MIN_LENGTH} characters long')
        
        if PasswordSecurityValidator.REQUIRE_UPPERCASE and not any(c.isupper() for c in password):
            errors.append('Password must contain at least one uppercase letter')
        
        if PasswordSecurityValidator.REQUIRE_LOWERCASE and not any(c.islower() for c in password):
            errors.append('Password must contain at least one lowercase letter')
        
        if PasswordSecurityValidator.REQUIRE_DIGITS and not any(c.isdigit() for c in password):
            errors.append('Password must contain at least one digit')
        
        if PasswordSecurityValidator.REQUIRE_SPECIAL:
            special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
            if not any(c in special_chars for c in password):
                errors.append('Password must contain at least one special character')
        
        # Check for common passwords
        common_passwords = ['password', '12345678', 'qwerty', 'admin', 'letmein']
        if password.lower() in common_passwords:
            errors.append('Password is too common')
        
        return {
            'valid': len(errors) == 0,
            'errors': errors
        }
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using bcrypt"""
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify password against hash"""
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        return pwd_context.verify(plain_password, hashed_password)


def get_client_ip(request: Request) -> str:
    """Extract client IP address from request"""
    # Check for proxy headers
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    # Fallback to direct connection
    if request.client:
        return request.client.host
    
    return "unknown"


def generate_secure_token(length: int = 32) -> str:
    """Generate cryptographically secure random token"""
    return secrets.token_urlsafe(length)
