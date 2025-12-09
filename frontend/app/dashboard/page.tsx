'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, FileText, MessageSquare, LogOut, User, Home, Settings, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { API_BASE_URL } from '@/lib/api';

export default function DashboardPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [user, setUser] = useState<any>(null);
    const [documents, setDocuments] = useState<any[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        
        // Redirect to onboarding if not completed
        if (parsedUser.onboarding_completed < 3) {
            router.push('/onboarding');
            return;
        }

        setUser(parsedUser);
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/documents`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setDocuments(data);
            }
        } catch (err) {
            console.error('Error loading documents:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-bg-main">
            {/* Logo - Fixed Position */}
            <Link href="/" className="fixed top-2 left-12 z-[100] flex items-center hover:opacity-80 transition-opacity">
                <Image src="/taxa logo.jpg" alt="TAXA Logo" width={90} height={90} className="object-contain rounded-xl" priority />
            </Link>
            
            {/* Navigation */}
            <nav className="border-b border-text-light/10 bg-bg-card shadow-[0_4px_8px_#A3B1C6]">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-end">
                        {/* Navigation Menu */}
                        <div className="flex items-center space-x-2">
                            <Link
                                href="/dashboard"
                                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-text-dark hover:text-accent hover:bg-bg-main/50 transition-all"
                            >
                                <Home className="w-5 h-5" />
                                <span className="font-medium">{t('dashboard.nav.dashboard')}</span>
                            </Link>
                            <Link
                                href="/dashboard/upload"
                                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-text-dark hover:text-accent hover:bg-bg-main/50 transition-all"
                            >
                                <Upload className="w-5 h-5" />
                                <span className="font-medium">{t('dashboard.nav.upload')}</span>
                            </Link>
                            <Link
                                href="/dashboard/chat"
                                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-text-dark hover:text-accent hover:bg-bg-main/50 transition-all"
                            >
                                <MessageSquare className="w-5 h-5" />
                                <span className="font-medium">{t('dashboard.nav.chat')}</span>
                            </Link>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center space-x-4">
                            <LanguageSwitcher />
                            <div className="flex items-center space-x-3 px-4 py-2 bg-bg-card rounded-xl shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                <User className="w-5 h-5 text-accent" />
                                <span className="text-text-dark font-medium">{user.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-text-light hover:text-error transition-colors rounded-lg hover:bg-error/10"
                                title={t('dashboard.logout')}
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-12">
                {/* Welcome Section */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-primary mb-2">
                        {t('dashboard.welcome').replace('{{name}}', user.name)}
                    </h1>
                    <p className="text-text-light text-lg">
                        {t('dashboard.subtitle')}
                    </p>
                </div>

                {/* Action Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {/* Upload Document */}
                    <Link href="/dashboard/upload" className="h-full">
                        <div className="h-full min-h-[280px] bg-bg-card rounded-3xl p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] hover:shadow-[10px_10px_20px_#A3B1C6,-10px_-10px_20px_#FFFFFF] hover:scale-105 transition-all cursor-pointer group flex flex-col">
                            <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
                                <Upload className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-3">{t('dashboard.upload_card.title')}</h3>
                            <p className="text-text-light leading-relaxed">
                                {t('dashboard.upload_card.description')}
                            </p>
                        </div>
                    </Link>

                    {/* Tax Declaration */}
                    <Link href="/dashboard/declaration" className="h-full">
                        <div className="h-full min-h-[280px] bg-bg-card rounded-3xl p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] hover:shadow-[10px_10px_20px_#A3B1C6,-10px_-10px_20px_#FFFFFF] hover:scale-105 transition-all cursor-pointer group flex flex-col">
                            <div className="w-16 h-16 bg-success rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-3">{t('dashboard.declaration_card.title')}</h3>
                            <p className="text-text-light leading-relaxed">
                                {t('dashboard.declaration_card.description')}
                            </p>
                        </div>
                    </Link>

                    {/* AI Chat */}
                    <Link href="/dashboard/chat" className="h-full">
                        <div className="h-full min-h-[280px] bg-bg-card rounded-3xl p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] hover:shadow-[10px_10px_20px_#A3B1C6,-10px_-10px_20px_#FFFFFF] hover:scale-105 transition-all cursor-pointer group flex flex-col">
                            <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
                                <MessageSquare className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-3">{t('dashboard.chat_card.title')}</h3>
                            <p className="text-text-light leading-relaxed">
                                {t('dashboard.chat_card.description')}
                            </p>
                        </div>
                    </Link>

                    {/* Documents */}
                    <Link href="/dashboard/documents" className="h-full">
                        <div className="h-full min-h-[280px] bg-bg-card rounded-3xl p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] hover:shadow-[10px_10px_20px_#A3B1C6,-10px_-10px_20px_#FFFFFF] hover:scale-105 transition-all cursor-pointer group flex flex-col">
                            <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-3">{t('dashboard.documents_card.title')}</h3>
                            <p className="text-text-light mb-4">
                                {t('dashboard.documents_card.count').replace('{{count}}', documents.length.toString())}
                            </p>
                            <div className="space-y-2 flex-1">
                                {documents.slice(0, 3).map((doc, idx) => (
                                    <div key={idx} className="flex items-center space-x-2 text-sm text-text-light">
                                        <FileText className="w-4 h-4" />
                                        <span className="truncate">{doc.filename}</span>
                                    </div>
                                ))}
                                {documents.length === 0 && (
                                    <p className="text-sm text-text-light">{t('dashboard.documents_card.no_documents')}</p>
                                )}
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-bg-card rounded-2xl p-6 shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF]">
                        <p className="text-text-light text-sm mb-1">{t('dashboard.stats.documents_month')}</p>
                        <p className="text-3xl font-bold text-primary">{documents.length}</p>
                    </div>
                    <div className="bg-bg-card rounded-2xl p-6 shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF]">
                        <p className="text-text-light text-sm mb-1">{t('dashboard.stats.ai_consultations')}</p>
                        <p className="text-3xl font-bold text-primary">0</p>
                    </div>
                    <div className="bg-bg-card rounded-2xl p-6 shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF]">
                        <p className="text-text-light text-sm mb-1">{t('dashboard.stats.tax_declarations')}</p>
                        <p className="text-3xl font-bold text-primary">0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
