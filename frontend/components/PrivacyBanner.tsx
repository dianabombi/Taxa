'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Cookie } from 'lucide-react';

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
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
            
            {/* Privacy Banner */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-bg-card rounded-3xl shadow-[12px_12px_24px_#A3B1C6,-12px_-12px_24px_#FFFFFF] max-w-2xl w-full p-8 relative animate-fade-in">
                    {/* Close Button */}
                    <button
                        onClick={handleDecline}
                        className="absolute top-4 right-4 p-2 text-text-light hover:text-error transition-colors rounded-lg hover:bg-error/10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Icon */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-bg-card rounded-xl p-4 flex items-center space-x-3 justify-center shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
                            <Image src="/moneybag.png" alt="TAXA Logo" width={60} height={60} className="object-contain" priority />
                            <span className="text-4xl font-bold text-primary">TAXA</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-primary text-center mb-4">
                        Privacy & Cookie Policy
                    </h2>

                    {/* Content */}
                    <div className="text-text-light text-sm leading-relaxed space-y-4 mb-6">
                        <p>
                            We value your privacy. TAXA uses cookies and similar technologies to provide you with a better experience, analyze site usage, and assist in our marketing efforts.
                        </p>
                        
                        <div className="bg-bg-main rounded-2xl p-4 shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF]">
                            <div className="flex items-start space-x-3">
                                <Cookie className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-primary mb-2">What we collect:</h3>
                                    <ul className="space-y-1 text-xs">
                                        <li>• Essential cookies for site functionality</li>
                                        <li>• Analytics to improve your experience</li>
                                        <li>• User preferences and settings</li>
                                        <li>• Authentication and security tokens</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <p>
                            By clicking "Accept", you consent to our use of cookies and agree to our{' '}
                            <Link href="/privacy" className="text-accent hover:underline font-medium">
                                Privacy Policy
                            </Link>
                            {' '}and{' '}
                            <Link href="/cookies" className="text-accent hover:underline font-medium">
                                Cookie Policy
                            </Link>
                            . You can change your preferences at any time in your account settings.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleAccept}
                            className="flex-1 px-6 py-3 bg-accent text-white rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all font-medium"
                        >
                            Accept All
                        </button>
                        <button
                            onClick={handleDecline}
                            className="flex-1 px-6 py-3 bg-bg-card text-text-dark rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all font-medium border border-text-light/20"
                        >
                            Decline
                        </button>
                    </div>

                    {/* GDPR Notice */}
                    <p className="text-xs text-text-light text-center mt-4">
                        This website complies with GDPR and other privacy regulations
                    </p>
                </div>
            </div>
        </>
    );
}
