'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Home, Upload, MessageSquare, LogOut, User, FileText, Calendar, DollarSign, Eye } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
import { API_BASE_URL } from '@/lib/api';

export default function DocumentsPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [user, setUser] = useState<any>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    if (!user) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('sk-SK', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const getDocumentTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            'invoice': 'Faktúra',
            'receipt': 'Pokladničný doklad',
            'tax_form': 'Daňový formulár',
            'contract': 'Zmluva',
            'other': 'Iné'
        };
        return types[type] || type || 'Neznámy';
    };

    return (
        <div className="min-h-screen bg-bg-main">
            {/* Logo - Fixed Position */}
            <Link href="/" className="fixed top-2 left-4 lg:left-12 z-[100] flex items-center hover:opacity-80 transition-opacity">
                <Image src="/taxa logo.jpg" alt="TAXA Logo" width={80} height={80} className="lg:w-[90px] lg:h-[90px] object-contain rounded-xl" priority />
            </Link>
            
            {/* Navigation */}
            <nav className="border-b border-text-light/10 bg-bg-card shadow-[0_4px_8px_#A3B1C6]">
                <div className="container mx-auto px-4 lg:px-6 py-4">
                    <div className="flex items-center justify-end">
                        {/* Navigation Menu - Hidden on mobile */}
                        <div className="hidden lg:flex items-center space-x-2">
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

                        {/* Right Side - Hidden on mobile */}
                        <div className="hidden lg:flex items-center space-x-4">
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

                        {/* Mobile Language Switcher */}
                        <div className="lg:hidden mr-16">
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-primary mb-2">Evidované príjmy a výdavky</h1>
                        <p className="text-text-light text-lg">Prehľad všetkých nahraných dokladov</p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-bg-card rounded-2xl p-6 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF]">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-text-light text-sm">Celkom dokladov</p>
                                    <p className="text-3xl font-bold text-primary">{documents.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-bg-card rounded-2xl p-6 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF]">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-text-light text-sm">Tento mesiac</p>
                                    <p className="text-3xl font-bold text-primary">
                                        {documents.filter(doc => {
                                            const docDate = new Date(doc.uploaded_at);
                                            const now = new Date();
                                            return docDate.getMonth() === now.getMonth() && 
                                                   docDate.getFullYear() === now.getFullYear();
                                        }).length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-bg-card rounded-2xl p-6 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF]">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-text-light text-sm">Tento rok</p>
                                    <p className="text-3xl font-bold text-primary">
                                        {documents.filter(doc => {
                                            const docDate = new Date(doc.uploaded_at);
                                            const now = new Date();
                                            return docDate.getFullYear() === now.getFullYear();
                                        }).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Documents List */}
                    {loading ? (
                        <div className="bg-bg-card rounded-3xl p-12 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] text-center">
                            <p className="text-text-light">{t('documents.loading')}</p>
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="bg-bg-card rounded-3xl p-12 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] text-center">
                            <FileText className="w-16 h-16 text-text-light mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-primary mb-2">{t('documents.no_documents')}</h3>
                            <p className="text-text-light mb-6">{t('documents.upload_first')}</p>
                            <Link
                                href="/dashboard/upload"
                                className="inline-flex items-center space-x-2 px-6 py-3 bg-accent text-white rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all"
                            >
                                <Upload className="w-5 h-5" />
                                <span>{t('documents.upload_button')}</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-bg-card rounded-3xl p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF]">
                            <div className="space-y-4">
                                {documents.map((doc, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-6 bg-bg-main rounded-xl shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] hover:shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF] transition-all"
                                    >
                                        <div className="flex items-center space-x-4 flex-1">
                                            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                                                <FileText className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-lg font-bold text-primary truncate">{doc.filename}</h4>
                                                <div className="flex items-center space-x-4 mt-1">
                                                    <span className="text-sm text-text-light">
                                                        <Calendar className="w-4 h-4 inline mr-1" />
                                                        {formatDate(doc.uploaded_at)}
                                                    </span>
                                                    {doc.document_type && (
                                                        <span className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full font-medium">
                                                            {getDocumentTypeLabel(doc.document_type)}
                                                        </span>
                                                    )}
                                                    {doc.confidence && (
                                                        <span className="text-sm text-text-light">
                                                            Presnosť: {doc.confidence}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {doc.extracted_data && doc.extracted_data.total_amount && (
                                                <div className="text-right mr-4">
                                                    <p className="text-sm text-text-light">Suma</p>
                                                    <p className="text-xl font-bold text-primary">
                                                        {doc.extracted_data.total_amount} €
                                                    </p>
                                                </div>
                                            )}
                                            <button
                                                className="p-3 bg-accent text-white rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all"
                                                title="Zobraziť detail"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            <MobileMenu user={user} onLogout={handleLogout} currentPath="/dashboard/documents" />
        </div>
    );
}
