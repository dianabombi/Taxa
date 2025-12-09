'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload as UploadIcon, X, FileText, ArrowLeft, LogOut, User, Home, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
import { API_BASE_URL } from '@/lib/api';

export default function UploadPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [user, setUser] = useState<any>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

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
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    if (!user) return null;

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                router.push('/dashboard');
            }
        } catch (err) {
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
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
                                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-accent bg-bg-main/50 transition-all"
                            >
                                <UploadIcon className="w-5 h-5" />
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
                        <div className="lg:hidden mr-14">
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-12">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-primary mb-2">{t('upload.title')}</h1>
                        <p className="text-text-light text-lg">{t('upload.description')}</p>
                    </div>

                    {/* Upload Area */}
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all bg-bg-card shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] ${dragActive
                            ? 'border-accent scale-105'
                            : 'border-text-light/20'
                            }`}
                    >
                        <div className="w-20 h-20 bg-accent rounded-xl flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
                            <UploadIcon className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-primary mb-2">
                            {t('upload.drag_drop')}
                        </h3>
                        <p className="text-text-light mb-6">{t('upload.or')}</p>
                        <label className="inline-block px-8 py-3 bg-accent text-white rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all cursor-pointer">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                            {t('upload.button')}
                        </label>
                        <p className="text-sm text-text-light mt-4">
                            {t('upload.file_types')}
                        </p>
                    </div>

                    {/* Selected Files */}
                    {files.length > 0 && (
                        <div className="mt-8 bg-bg-card rounded-3xl p-6 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF]">
                            <h3 className="text-lg font-bold text-primary mb-4">{t('upload.selected_files').replace('{{count}}', files.length.toString())}</h3>
                            <div className="space-y-3">
                                {files.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center shadow-[2px_2px_4px_#A3B1C6,-2px_-2px_4px_#FFFFFF]">
                                                <FileText className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-text-dark font-medium">{file.name}</p>
                                                <p className="text-sm text-text-light">{(file.size / 1024).toFixed(2)} KB</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                                            className="p-2 text-text-light hover:text-error transition-colors rounded-lg hover:bg-error/10"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="w-full mt-6 py-3 bg-accent text-white rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? t('upload.uploading') : t('upload.upload_button')}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            <MobileMenu user={user} onLogout={handleLogout} currentPath="/dashboard/upload" />
        </div>
    );
}
