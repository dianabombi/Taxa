/**
 * Authentication utility functions
 * Handles token validation, expiry checks, and remember me functionality
 */

export const checkTokenExpiry = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    if (!token || !tokenExpiry) {
        return false;
    }
    
    const expiryTime = parseInt(tokenExpiry);
    const currentTime = new Date().getTime();
    
    // Check if token has expired
    if (currentTime > expiryTime) {
        // Token expired, clear storage
        clearAuthData();
        return false;
    }
    
    return true;
};

export const clearAuthData = (): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('tokenExpiry');
};

export const isAuthenticated = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Check if token is still valid
    return checkTokenExpiry();
};

export const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    
    if (!checkTokenExpiry()) {
        return null;
    }
    
    return localStorage.getItem('token');
};

export const getUser = (): any | null => {
    if (typeof window === 'undefined') return null;
    
    if (!checkTokenExpiry()) {
        return null;
    }
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
        return JSON.parse(userStr);
    } catch (e) {
        return null;
    }
};

export const refreshTokenExpiry = (): void => {
    if (typeof window === 'undefined') return;
    
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (rememberMe) {
        // Extend for 30 days
        const expiryTime = new Date().getTime() + (30 * 24 * 60 * 60 * 1000);
        localStorage.setItem('tokenExpiry', expiryTime.toString());
    } else {
        // Extend for 1 day
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem('tokenExpiry', expiryTime.toString());
    }
};
