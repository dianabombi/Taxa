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
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
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
            </div>
        </div>
    );
}
