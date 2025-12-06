'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

export default function PrivacyBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already accepted/declined
        const privacyAccepted = localStorage.getItem('privacyAccepted');
        if (!privacyAccepted) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('privacyAccepted', 'true');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('privacyAccepted', 'false');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-bg-card/98 backdrop-blur-md border-t border-text-light/10 shadow-[0_-4px_12px_rgba(163,177,198,0.3)] animate-fade-in">
            <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center justify-between gap-4">
                    {/* Left side - Icon + Text */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <Cookie className="w-6 h-6 text-accent flex-shrink-0" />
                        <p className="text-text-dark text-sm">
                            We use cookies to improve your experience.{' '}
                            <Link href="/privacy" className="text-accent hover:underline font-medium">
                                Privacy Policy
                            </Link>
                            {' '}|{' '}
                            <Link href="/cookies" className="text-accent hover:underline font-medium">
                                Cookie Policy
                            </Link>
                        </p>
                    </div>

                    {/* Right side - Buttons */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                            onClick={handleAccept}
                            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all font-medium text-sm"
                        >
                            Accept
                        </button>
                        <button
                            onClick={handleDecline}
                            className="px-4 py-2 text-text-light hover:text-error transition-colors text-sm"
                            title="Decline"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="sm:hidden space-y-3">
                    {/* Text with close button */}
                    <div className="flex items-start gap-3">
                        <Cookie className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <p className="text-text-dark text-xs flex-1">
                            We use cookies.{' '}
                            <Link href="/privacy" className="text-accent underline font-medium">
                                Privacy
                            </Link>
                            {' '}|{' '}
                            <Link href="/cookies" className="text-accent underline font-medium">
                                Cookies
                            </Link>
                        </p>
                        <button
                            onClick={handleDecline}
                            className="p-1 text-text-light hover:text-error transition-colors flex-shrink-0"
                            title="Decline"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    
                    {/* Accept button */}
                    <button
                        onClick={handleAccept}
                        className="w-full px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all font-medium text-sm"
                    >
                        Accept Cookies
                    </button>
                </div>
            </div>
        </div>
    );
}
