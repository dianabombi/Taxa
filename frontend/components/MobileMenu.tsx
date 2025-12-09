'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Home, Upload, MessageSquare, FileText, LogOut, User as UserIcon } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface MobileMenuProps {
    user?: any;
    onLogout?: () => void;
    currentPath?: string;
}

export default function MobileMenu({ user, onLogout, currentPath }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const drawerRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    // Handle touch events for swipe down
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientY);
    };

    const handleTouchEnd = () => {
        // Swipe down detected (moved down more than 50px)
        if (touchStart - touchEnd < -50) {
            setIsOpen(false);
        }
        setTouchStart(0);
        setTouchEnd(0);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden'; // Prevent body scroll
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const menuItems = user ? [
        { href: '/dashboard', icon: Home, label: t('dashboard.nav.dashboard') },
        { href: '/dashboard/upload', icon: Upload, label: t('dashboard.nav.upload') },
        { href: '/dashboard/chat', icon: MessageSquare, label: t('dashboard.nav.chat') },
        { href: '/dashboard/documents', icon: FileText, label: 'Dokumenty' },
    ] : [];

    const quickLinks = user ? [
        { href: '/dashboard', icon: Home, label: t('footer.dashboard') },
        { href: '/dashboard/upload', icon: Upload, label: t('footer.upload_documents') },
        { href: '/dashboard/chat', icon: MessageSquare, label: t('footer.ai_consultant') },
        { href: '/dashboard/declaration', icon: FileText, label: t('footer.tax_declaration') },
    ] : [
        { href: '/dashboard', icon: Home, label: t('footer.dashboard') },
        { href: '/dashboard/chat', icon: MessageSquare, label: t('footer.ai_consultant') },
    ];

    return (
        <>
            {/* Burger Button - Only visible on mobile */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 right-4 z-[90] w-12 h-12 bg-accent rounded-xl shadow-[4px_4px_12px_#A3B1C6,-4px_-4px_12px_#FFFFFF] flex items-center justify-center active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] transition-all"
                aria-label="Menu"
            >
                <div className="w-6 h-6 flex flex-col justify-center items-center gap-3">
                    {/* Top line */}
                    <span
                        className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                            isOpen ? 'rotate-45 translate-y-[6.5px]' : ''
                        }`}
                    />
                    {/* Bottom line */}
                    <span
                        className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                            isOpen ? '-rotate-45 -translate-y-[6.5px]' : ''
                        }`}
                    />
                </div>
            </button>

            {/* Overlay */}
            <div
                className={`lg:hidden fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[95] transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Bottom Drawer */}
            <div
                ref={drawerRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-bg-card rounded-t-3xl shadow-[0_-8px_32px_rgba(163,177,198,0.4)] transition-transform duration-300 ${
                    isOpen ? 'translate-y-0' : 'translate-y-full'
                }`}
                style={{ maxHeight: '80vh' }}
            >
                {/* Drag Handle */}
                <div className="w-full flex justify-center pt-4 pb-2">
                    <div className="w-12 h-1.5 bg-text-light/30 rounded-full" />
                </div>

                {/* Menu Content */}
                <div className="px-6 pb-8 pt-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 60px)' }}>
                    {/* User Info */}
                    {user && (
                        <div className="flex items-center space-x-4 p-4 bg-bg-main rounded-xl mb-6 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                                <UserIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-text-dark font-bold">{user.name}</p>
                                <p className="text-text-light text-sm">{user.email}</p>
                            </div>
                        </div>
                    )}

                    {/* Quick Links Section */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-text-light uppercase tracking-wide mb-3 px-2">
                            {t('footer.quick_links')}
                        </h3>
                        <nav className="space-y-2">
                            {quickLinks.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentPath === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center space-x-4 p-4 rounded-xl transition-all ${
                                            isActive
                                                ? 'bg-accent text-white shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]'
                                                : 'bg-bg-main text-text-dark hover:bg-bg-main/50 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Logout Button */}
                    {user && onLogout && (
                        <button
                            onClick={() => {
                                onLogout();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center justify-center space-x-3 p-4 bg-error/10 text-error rounded-xl hover:bg-error/20 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">{t('dashboard.logout')}</span>
                        </button>
                    )}

                    {/* Guest Menu */}
                    {!user && (
                        <div className="space-y-3">
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="block w-full text-center py-4 bg-bg-main text-text-dark rounded-xl font-medium shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] hover:bg-bg-main/50 transition-all"
                            >
                                Prihlásiť sa
                            </Link>
                            <Link
                                href="/register"
                                onClick={() => setIsOpen(false)}
                                className="block w-full text-center py-4 bg-accent text-white rounded-xl font-medium shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all"
                            >
                                Vytvoriť účet
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
