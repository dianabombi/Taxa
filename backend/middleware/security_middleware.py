"""
Security Middleware for TAXA
Implements security headers, rate limiting, and request validation
"""

from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware
from typing import Callable
import time
import logging

logger = logging.getLogger(__name__)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses"""
    
    async def dispatch(self, request: Request, call_next: Callable):
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        # Content Security Policy
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self' data:; "
            "connect-src 'self' https://api.openai.com; "
            "frame-ancestors 'none';"
        )
        response.headers["Content-Security-Policy"] = csp
        
        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware"""
    
    def __init__(self, app, rate_limit: int = 100, window: int = 60):
        super().__init__(app)
        self.rate_limit = rate_limit  # requests per window
        self.window = window  # seconds
        self.requests = {}  # {ip: [(timestamp, count)]}
    
    async def dispatch(self, request: Request, call_next: Callable):
        # Get client IP
        client_ip = self._get_client_ip(request)
        current_time = time.time()
        
        # Clean old entries
        if client_ip in self.requests:
            self.requests[client_ip] = [
                (ts, count) for ts, count in self.requests[client_ip]
                if current_time - ts < self.window
            ]
        
        # Check rate limit
        if client_ip in self.requests:
            total_requests = sum(count for _, count in self.requests[client_ip])
            if total_requests >= self.rate_limit:
                logger.warning(f"Rate limit exceeded for IP: {client_ip}")
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={
                        "detail": "Too many requests. Please try again later.",
                        "retry_after": self.window
                    }
                )
        
        # Add current request
        if client_ip not in self.requests:
            self.requests[client_ip] = []
        self.requests[client_ip].append((current_time, 1))
        
        response = await call_next(request)
        
        # Add rate limit headers
        response.headers["X-RateLimit-Limit"] = str(self.rate_limit)
        response.headers["X-RateLimit-Remaining"] = str(
            max(0, self.rate_limit - sum(count for _, count in self.requests.get(client_ip, [])))
        )
        response.headers["X-RateLimit-Reset"] = str(int(current_time + self.window))
        
        return response
    
    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP from request"""
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        if request.client:
            return request.client.host
        
        return "unknown"


class RequestValidationMiddleware(BaseHTTPMiddleware):
    """Validate and sanitize incoming requests"""
    
    MAX_REQUEST_SIZE = 20 * 1024 * 1024  # 20MB
    
    async def dispatch(self, request: Request, call_next: Callable):
        # Check request size
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > self.MAX_REQUEST_SIZE:
            return JSONResponse(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                content={"detail": "Request body too large"}
            )
        
        # Validate content type for POST/PUT requests
        if request.method in ["POST", "PUT", "PATCH"]:
            content_type = request.headers.get("content-type", "")
            
            # Allow specific content types
            allowed_types = [
                "application/json",
                "application/x-www-form-urlencoded",
                "multipart/form-data"
            ]
            
            if not any(allowed in content_type for allowed in allowed_types):
                logger.warning(f"Invalid content type: {content_type}")
        
        response = await call_next(request)
        return response


class AuditLoggingMiddleware(BaseHTTPMiddleware):
    """Log all requests for audit purposes"""
    
    async def dispatch(self, request: Request, call_next: Callable):
        start_time = time.time()
        
        # Extract request info
        client_ip = self._get_client_ip(request)
        user_agent = request.headers.get("user-agent", "unknown")
        method = request.method
        path = request.url.path
        
        # Process request
        try:
            response = await call_next(request)
            status_code = response.status_code
            success = 200 <= status_code < 400
        except Exception as e:
            logger.error(f"Request failed: {method} {path} - {str(e)}")
            raise
        
        # Calculate processing time
        process_time = time.time() - start_time
        
        # Log request (exclude health checks and static files)
        if not path.startswith(("/health", "/static", "/favicon")):
            log_data = {
                "method": method,
                "path": path,
                "status": status_code,
                "ip": client_ip,
                "user_agent": user_agent,
                "duration_ms": round(process_time * 1000, 2)
            }
            
            if success:
                logger.info(f"Request: {log_data}")
            else:
                logger.warning(f"Failed request: {log_data}")
        
        # Add processing time header
        response.headers["X-Process-Time"] = str(process_time)
        
        return response
    
    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP from request"""
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        if request.client:
            return request.client.host
        
        return "unknown"


class IPWhitelistMiddleware(BaseHTTPMiddleware):
    """Restrict access to specific IPs for admin endpoints"""
    
    def __init__(self, app, whitelist: list = None, protected_paths: list = None):
        super().__init__(app)
        self.whitelist = whitelist or []
        self.protected_paths = protected_paths or ["/api/admin"]
    
    async def dispatch(self, request: Request, call_next: Callable):
        # Check if path is protected
        path = request.url.path
        is_protected = any(path.startswith(protected) for protected in self.protected_paths)
        
        if is_protected and self.whitelist:
            client_ip = self._get_client_ip(request)
            
            if client_ip not in self.whitelist:
                logger.warning(f"Unauthorized IP attempted to access admin: {client_ip}")
                return JSONResponse(
                    status_code=status.HTTP_403_FORBIDDEN,
                    content={"detail": "Access denied"}
                )
        
        response = await call_next(request)
        return response
    
    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP from request"""
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        if request.client:
            return request.client.host
        
        return "unknown"


def setup_security_middleware(app, config: dict = None):
    """
    Setup all security middleware
    
    Args:
        app: FastAPI application
        config: Configuration dictionary with security settings
    """
    config = config or {}
    
    # Add security headers
    app.add_middleware(SecurityHeadersMiddleware)
    
    # Add rate limiting
    if config.get("enable_rate_limiting", True):
        app.add_middleware(
            RateLimitMiddleware,
            rate_limit=config.get("rate_limit", 100),
            window=config.get("rate_limit_window", 60)
        )
    
    # Add request validation
    app.add_middleware(RequestValidationMiddleware)
    
    # Add audit logging
    if config.get("enable_audit_logging", True):
        app.add_middleware(AuditLoggingMiddleware)
    
    # Add IP whitelist for admin
    admin_whitelist = config.get("admin_ip_whitelist", [])
    if admin_whitelist:
        app.add_middleware(
            IPWhitelistMiddleware,
            whitelist=admin_whitelist,
            protected_paths=["/api/admin"]
        )
    
    logger.info("Security middleware initialized")
