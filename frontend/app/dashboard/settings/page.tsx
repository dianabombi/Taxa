'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Home, Upload, MessageSquare, LogOut, User, Shield, Download, Trash2, Info, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
import { API_BASE_URL } from '@/lib/api';

export default function SettingsPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [privacyInfo, setPrivacyInfo] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (!token || !userData) {
            router.push('/login');
            return;
        }
        
        setUser(JSON.parse(userData));
        loadPrivacyInfo();
    }, []);

    const loadPrivacyInfo = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/gdpr/privacy-info`);
            const data = await response.json();
            setPrivacyInfo(data);
        } catch (error) {
            console.error('Failed to load privacy info:', error);
        }
    };

    const handleExportData = async () => {
        setLoading(true);
        setMessage(null);
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/gdpr/my-data`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Download as JSON file
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `taxa-data-export-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                setMessage({ type: 'success', text: t('settings.export_success') });
            } else {
                setMessage({ type: 'error', text: t('settings.export_error') });
            }
        } catch (error) {
            setMessage({ type: 'error', text: t('settings.connection_error') });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        setMessage(null);
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/gdpr/delete-account`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Clear local storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                // Show success message and redirect
                alert(`${t('settings.delete_success')}\n\n${t('settings.deleted_data')}:\n- ${t('settings.profile')}: 1\n- ${t('settings.documents')}: ${data.data_deleted.documents}\n- ${t('settings.messages')}: ${data.data_deleted.chat_messages}\n\n${t('settings.all_data_removed')}`);
                
                router.push('/');
            } else {
                setMessage({ type: 'error', text: t('settings.delete_error') });
                setShowDeleteConfirm(false);
            }
        } catch (error) {
            setMessage({ type: 'error', text: t('settings.connection_error') });
            setShowDeleteConfirm(false);
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

    return (
        <div className="min-h-screen bg-bg-main">
            {/* Logo */}
            <Link href="/" className="fixed top-2 left-4 lg:left-12 z-[100] flex items-center hover:opacity-80 transition-opacity">
                <Image src="/taxa logo.jpg" alt="TAXA Logo" width={80} height={80} className="lg:w-[90px] lg:h-[90px] object-contain rounded-xl" priority />
            </Link>
            
            {/* Navigation */}
            <nav className="border-b border-text-light/10 bg-bg-card shadow-[0_4px_8px_#A3B1C6]">
                <div className="container mx-auto px-4 lg:px-6 py-4">
                    <div className="flex items-center justify-end">
                        <div className="hidden lg:flex items-center space-x-2">
                            <Link href="/dashboard" className="flex items-center space-x-2 px-4 py-2 rounded-xl text-text-dark hover:text-accent hover:bg-bg-main/50 transition-all">
                                <Home className="w-5 h-5" />
                                <span className="font-medium">{t('dashboard.nav.dashboard')}</span>
                            </Link>
                            <Link href="/dashboard/upload" className="flex items-center space-x-2 px-4 py-2 rounded-xl text-text-dark hover:text-accent hover:bg-bg-main/50 transition-all">
                                <Upload className="w-5 h-5" />
                                <span className="font-medium">{t('dashboard.nav.upload')}</span>
                            </Link>
                            <Link href="/dashboard/chat" className="flex items-center space-x-2 px-4 py-2 rounded-xl text-text-dark hover:text-accent hover:bg-bg-main/50 transition-all">
                                <MessageSquare className="w-5 h-5" />
                                <span className="font-medium">{t('dashboard.nav.chat')}</span>
                            </Link>
                        </div>

                        <div className="hidden lg:flex items-center space-x-4">
                            <LanguageSwitcher />
                            <div className="flex items-center space-x-3 px-4 py-2 bg-bg-card rounded-xl shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                <User className="w-5 h-5 text-accent" />
                                <span className="text-text-dark font-medium">{user.name}</span>
                            </div>
                            <button onClick={handleLogout} className="p-2 text-text-light hover:text-error transition-colors rounded-lg hover:bg-error/10" title={t('dashboard.logout')}>
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="lg:hidden mr-16">
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-primary mb-2 flex items-center">
                            <Shield className="w-10 h-10 mr-3" />
                            {t('settings.title')}
                        </h1>
                        <p className="text-text-light text-lg">{t('settings.subtitle')}</p>
                    </div>

                    {/* Message */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
                            message.type === 'success' 
                                ? 'bg-green-100 text-green-800 border-2 border-green-500'
                                : 'bg-red-100 text-red-800 border-2 border-red-500'
                        }`}>
                            {message.type === 'success' ? (
                                <CheckCircle className="w-6 h-6" />
                            ) : (
                                <AlertTriangle className="w-6 h-6" />
                            )}
                            <span className="font-medium">{message.text}</span>
                        </div>
                    )}

                    {/* GDPR Information Card */}
                    {privacyInfo && (
                        <div className="bg-bg-card rounded-3xl p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] mb-6">
                            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
                                <Info className="w-6 h-6 mr-2" />
                                {t('settings.gdpr_compliance')}
                            </h2>
                            
                            <div className="space-y-4">
                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <p className="text-text-light text-sm mb-1">📍 {t('settings.data_location')}</p>
                                    <p className="text-text-dark font-bold">{privacyInfo.data_storage.location}</p>
                                    <p className="text-text-light text-sm mt-2">🔒 {t('settings.encryption')}</p>
                                    <p className="text-text-dark font-medium">{privacyInfo.data_storage.encryption}</p>
                                </div>
                                
                                <div className="bg-accent/10 border-2 border-accent rounded-xl p-4">
                                    <p className="text-accent font-bold mb-2">✓ {t('settings.your_rights')}</p>
                                    <ul className="text-text-dark text-sm space-y-1">
                                        <li>• {t('settings.right_access')}</li>
                                        <li>• {t('settings.right_delete')}</li>
                                        <li>• {t('settings.right_portability')}</li>
                                        <li>• {t('settings.right_rectification')}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Data Export Section */}
                    <div className="bg-bg-card rounded-3xl p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] mb-6">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
                            <Download className="w-6 h-6 mr-2" />
                            {t('settings.export_title')}
                        </h2>
                        
                        <p className="text-text-dark mb-6">
                            {t('settings.export_description')}
                        </p>
                        
                        <button
                            onClick={handleExportData}
                            disabled={loading}
                            className="px-6 py-3 bg-accent text-white rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] transition-all flex items-center space-x-2 disabled:opacity-50"
                        >
                            <Download className="w-5 h-5" />
                            <span>{loading ? t('settings.exporting') : t('settings.download_data')}</span>
                        </button>
                        
                        <p className="text-text-light text-sm mt-4">
                            {t('settings.export_includes')}
                        </p>
                    </div>

                    {/* Account Deletion Section */}
                    <div className="bg-bg-card rounded-3xl p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] mb-6 border-2 border-error/20">
                        <h2 className="text-2xl font-bold text-error mb-4 flex items-center">
                            <Trash2 className="w-6 h-6 mr-2" />
                            {t('settings.delete_account_title')}
                        </h2>
                        
                        <p className="text-text-dark mb-4">
                            {t('settings.delete_description')}
                        </p>
                        
                        <div className="bg-error/10 border-2 border-error rounded-xl p-4 mb-6">
                            <p className="text-error font-bold mb-2">⚠️ {t('settings.warning')}</p>
                            <ul className="text-text-dark text-sm space-y-1">
                                <li>• {t('settings.warning_irreversible')}</li>
                                <li>• {t('settings.warning_documents')}</li>
                                <li>• {t('settings.warning_chat')}</li>
                                <li>• {t('settings.warning_profile')}</li>
                                <li>• {t('settings.warning_no_recovery')}</li>
                            </ul>
                        </div>
                        
                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-6 py-3 bg-error text-white rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] transition-all flex items-center space-x-2"
                            >
                                <Trash2 className="w-5 h-5" />
                                <span>{t('settings.want_delete')}</span>
                            </button>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-error font-bold text-lg">
                                    {t('settings.confirm_delete')}
                                </p>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={loading}
                                        className="px-6 py-3 bg-error text-white rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all flex items-center space-x-2 disabled:opacity-50"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                        <span>{loading ? t('settings.deleting') : t('settings.yes_delete')}</span>
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-6 py-3 bg-bg-main text-text-dark rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all"
                                    >
                                        {t('settings.cancel')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Security Info */}
                    <div className="bg-bg-card rounded-3xl p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF]">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
                            <Lock className="w-6 h-6 mr-2" />
                            {t('settings.security_measures')}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {privacyInfo?.security_measures.map((measure: string, index: number) => (
                                <div key={index} className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                    <span className="text-text-dark text-sm">{measure}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <MobileMenu user={user} onLogout={handleLogout} currentPath="/dashboard/settings" />
        </div>
    );
}
