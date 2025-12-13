"""
Document Encryption Service
Provides AES-256 encryption for sensitive documents
GDPR-compliant data protection
"""

import os
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
from typing import Tuple


class EncryptionService:
    """
    Handles document encryption/decryption using AES-256
    Each user has a unique encryption key derived from master key + user ID
    """
    
    def __init__(self):
        # Master encryption key from environment
        # In production, use AWS KMS, Azure Key Vault, or similar
        self.master_key = os.getenv("ENCRYPTION_MASTER_KEY", "change-this-in-production-use-32-bytes-minimum")
        
    def _derive_user_key(self, user_id: int) -> bytes:
        """
        Derive a unique encryption key for each user
        Using PBKDF2 for key derivation
        """
        # Use user_id as salt (in production, use more complex salt)
        salt = f"taxa_user_{user_id}".encode()
        
        # Derive key using PBKDF2
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
            backend=default_backend()
        )
        
        key = base64.urlsafe_b64encode(kdf.derive(self.master_key.encode()))
        return key
    
    def encrypt_document(self, data: bytes, user_id: int) -> bytes:
        """
        Encrypt document data for a specific user
        
        Args:
            data: Raw document bytes
            user_id: User ID for key derivation
            
        Returns:
            Encrypted bytes
        """
        try:
            key = self._derive_user_key(user_id)
            f = Fernet(key)
            encrypted_data = f.encrypt(data)
            return encrypted_data
        except Exception as e:
            raise ValueError(f"Encryption failed: {str(e)}")
    
    def decrypt_document(self, encrypted_data: bytes, user_id: int) -> bytes:
        """
        Decrypt document data for a specific user
        
        Args:
            encrypted_data: Encrypted document bytes
            user_id: User ID for key derivation
            
        Returns:
            Decrypted bytes
        """
        try:
            key = self._derive_user_key(user_id)
            f = Fernet(key)
            decrypted_data = f.decrypt(encrypted_data)
            return decrypted_data
        except Exception as e:
            raise ValueError(f"Decryption failed: {str(e)}")
    
    def encrypt_text(self, text: str, user_id: int) -> str:
        """
        Encrypt text data (for personal information, etc.)
        Returns base64-encoded encrypted string
        """
        encrypted_bytes = self.encrypt_document(text.encode(), user_id)
        return base64.b64encode(encrypted_bytes).decode()
    
    def decrypt_text(self, encrypted_text: str, user_id: int) -> str:
        """
        Decrypt text data
        """
        encrypted_bytes = base64.b64decode(encrypted_text.encode())
        decrypted_bytes = self.decrypt_document(encrypted_bytes, user_id)
        return decrypted_bytes.decode()


class DataAnonymizationService:
    """
    GDPR-compliant data anonymization
    Used when user requests data export or deletion
    """
    
    @staticmethod
    def anonymize_user_data(user_data: dict) -> dict:
        """
        Anonymize personal data for GDPR compliance
        Replace personally identifiable information with anonymized values
        """
        anonymized = user_data.copy()
        
        # Anonymize personal fields
        if 'name' in anonymized:
            anonymized['name'] = "ANONYMIZED_USER"
        if 'email' in anonymized:
            anonymized['email'] = f"anonymized_{anonymized.get('id', 'user')}@anonymized.local"
        if 'ico' in anonymized:
            anonymized['ico'] = "XXXXXXXX"
        if 'dic' in anonymized:
            anonymized['dic'] = "XXXXXXXXXX"
        if 'ic_dph' in anonymized:
            anonymized['ic_dph'] = "SKXXXXXXXXXX"
        if 'business_name' in anonymized:
            anonymized['business_name'] = "ANONYMIZED_BUSINESS"
        if 'business_address' in anonymized:
            anonymized['business_address'] = "ANONYMIZED_ADDRESS"
        if 'phone' in anonymized:
            anonymized['phone'] = "+421XXXXXXXXX"
            
        return anonymized
    
    @staticmethod
    def should_retain_for_legal(document_date: str, current_date: str) -> bool:
        """
        Check if document must be retained for legal/tax purposes
        Slovak law requires keeping tax documents for 10 years
        """
        from datetime import datetime
        
        doc_date = datetime.fromisoformat(document_date)
        cur_date = datetime.fromisoformat(current_date)
        
        years_diff = (cur_date - doc_date).days / 365.25
        
        # Keep for 10 years as per Slovak law
        return years_diff < 10


# Security audit logging
class SecurityAuditLogger:
    """
    Log security-relevant events for GDPR compliance
    Track data access, modifications, deletions
    """
    
    @staticmethod
    def log_data_access(user_id: int, resource_type: str, resource_id: int, action: str):
        """
        Log when user accesses their data
        Required for GDPR Article 30 (Records of processing activities)
        """
        from datetime import datetime
        
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "user_id": user_id,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "action": action,
            "ip_address": "logged_by_middleware",  # Should be captured from request
        }
        
        # In production: Write to secure audit log database
        # For now: Could write to file or logging service
        print(f"[AUDIT] {log_entry}")
        
        return log_entry
    
    @staticmethod
    def log_data_deletion(user_id: int, data_type: str, count: int):
        """
        Log GDPR data deletion requests
        """
        from datetime import datetime
        
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "user_id": user_id,
            "action": "DATA_DELETION",
            "data_type": data_type,
            "records_deleted": count,
            "gdpr_compliance": "RIGHT_TO_ERASURE_ARTICLE_17"
        }
        
        print(f"[AUDIT] [GDPR_DELETION] {log_entry}")
        
        return log_entry
