'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
    ArrowRight, 
    ArrowLeft, 
    Check, 
    Upload, 
    FileText, 
    Briefcase,
    Calculator,
    Receipt,
    Phone,
    Mail,
    User
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { API_BASE_URL } from '@/lib/api';

export default function OnboardingPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState<any>(null);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        phone: '',
        business_type: '',
        expense_type: '',
        vat_status: 'non_payer'
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // If already completed onboarding, redirect to dashboard
        if (parsedUser.onboarding_completed >= 3) {
            router.push('/dashboard');
        }
    }, []);

    const updateOnboarding = async (data: any) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/auth/onboarding`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                return true;
            } else {
                const errorData = await response.json();
                setError(errorData.detail || t('onboarding.error_update'));
                return false;
            }
        } catch (err) {
            setError(t('onboarding.error_connection'));
            return false;
        }
    };

    const handleStep1Next = async () => {
        if (!formData.business_type || !formData.expense_type) {
            setError(t('onboarding.error_required_fields'));
            return;
        }

        setLoading(true);
        setError('');

        const success = await updateOnboarding({
            phone: formData.phone || null,
            business_type: formData.business_type,
            expense_type: formData.expense_type,
            vat_status: formData.vat_status,
            onboarding_completed: 1
        });

        setLoading(false);

        if (success) {
            setCurrentStep(2);
        }
    };

    const handleStep2Next = async () => {
        setLoading(true);
        setError('');

        // Upload documents if any
        if (uploadedFiles.length > 0) {
            try {
                const token = localStorage.getItem('token');
                const formData = new FormData();
                uploadedFiles.forEach(file => {
                    formData.append('files', file);
                });

                const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }
            } catch (err) {
                setError(t('onboarding.error_upload'));
                setLoading(false);
                return;
            }
        }

        // Mark step 2 as complete
        const success = await updateOnboarding({
            onboarding_completed: 2
        });

        setLoading(false);

        if (success) {
            setCurrentStep(3);
        }
    };

    const handleComplete = async () => {
        setLoading(true);
        setError('');

        const success = await updateOnboarding({
            onboarding_completed: 3
        });

        setLoading(false);

        if (success) {
            router.push('/dashboard');
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        const files = Array.from(e.dataTransfer.files);
        setUploadedFiles(prev => [...prev, ...files]);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setUploadedFiles(prev => [...prev, ...files]);
        }
    };

    const handleSkipUpload = async () => {
        setLoading(true);
        const success = await updateOnboarding({
            onboarding_completed: 2
        });
        setLoading(false);
        if (success) {
            setCurrentStep(3);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-bg-main">
            {/* Logo */}
            <Link href="/" className="fixed top-2 left-12 z-[100] flex items-center hover:opacity-80 transition-opacity">
                <Image src="/taxa logo.jpg" alt="TAXA Logo" width={100} height={100} className="object-contain rounded-xl" priority />
            </Link>

            {/* Top Navigation */}
            <nav className="container mx-auto px-6 py-4">
                <div className="flex justify-end items-center">
                    <LanguageSwitcher />
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-8">
                {/* Progress Bar */}
                <div className="max-w-3xl mx-auto mb-12">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center flex-1">
                                <div className={`
                                    w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                                    ${currentStep >= step 
                                        ? 'bg-accent text-white shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]' 
                                        : 'bg-bg-card text-text-light shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]'
                                    }
                                `}>
                                    {currentStep > step ? <Check className="w-6 h-6" /> : step}
                                </div>
                                {step < 3 && (
                                    <div className={`flex-1 h-1 mx-4 rounded-full ${
                                        currentStep > step ? 'bg-accent' : 'bg-text-light/20'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 px-2">
                        <span className="text-sm text-text-light font-medium">{t('onboarding.step1_title')}</span>
                        <span className="text-sm text-text-light font-medium">{t('onboarding.step2_title')}</span>
                        <span className="text-sm text-text-light font-medium">{t('onboarding.step3_title')}</span>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="max-w-3xl mx-auto mb-6">
                        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    </div>
                )}

                {/* Step Content */}
                <div className="max-w-3xl mx-auto">
                    {/* Step 1: Business Setup */}
                    {currentStep === 1 && (
                        <div className="bg-bg-card rounded-3xl p-12 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF]">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-primary mb-3">{t('onboarding.step1_title')}</h2>
                                <p className="text-text-light">{t('onboarding.step1_description')}</p>
                            </div>

                            <div className="space-y-6">
                                {/* Phone (optional) */}
                                <div>
                                    <label className="block text-sm font-medium text-text-dark mb-2">
                                        {t('onboarding.phone')} ({t('onboarding.optional')})
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-light" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 bg-bg-card rounded-xl text-text-dark placeholder-text-light shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] focus:outline-none focus:shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] transition-shadow"
                                            placeholder="+421 XXX XXX XXX"
                                        />
                                    </div>
                                </div>

                                {/* Business Type */}
                                <div>
                                    <label className="block text-sm font-medium text-text-dark mb-3">
                                        {t('onboarding.business_type')} *
                                    </label>
                                    <div className="grid gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, business_type: 'flat_rate', expense_type: 'pausalne_vydavky' })}
                                            className={`p-6 rounded-xl text-left transition-all ${
                                                formData.business_type === 'flat_rate'
                                                    ? 'bg-accent/10 border-2 border-accent shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]'
                                                    : 'bg-bg-card border-2 border-transparent shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] hover:border-accent/30'
                                            }`}
                                        >
                                            <div className="flex items-start space-x-4">
                                                <Calculator className={`w-6 h-6 mt-1 ${formData.business_type === 'flat_rate' ? 'text-accent' : 'text-text-light'}`} />
                                                <div>
                                                    <h3 className="font-bold text-primary mb-1">{t('onboarding.flat_rate')}</h3>
                                                    <p className="text-sm text-text-light">{t('onboarding.flat_rate_desc')}</p>
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, business_type: 'actual_expenses', expense_type: 'skutocne_vydavky' })}
                                            className={`p-6 rounded-xl text-left transition-all ${
                                                formData.business_type === 'actual_expenses'
                                                    ? 'bg-accent/10 border-2 border-accent shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]'
                                                    : 'bg-bg-card border-2 border-transparent shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] hover:border-accent/30'
                                            }`}
                                        >
                                            <div className="flex items-start space-x-4">
                                                <Receipt className={`w-6 h-6 mt-1 ${formData.business_type === 'actual_expenses' ? 'text-accent' : 'text-text-light'}`} />
                                                <div>
                                                    <h3 className="font-bold text-primary mb-1">{t('onboarding.actual_expenses')}</h3>
                                                    <p className="text-sm text-text-light">{t('onboarding.actual_expenses_desc')}</p>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* VAT Status */}
                                <div>
                                    <label className="block text-sm font-medium text-text-dark mb-3">
                                        {t('onboarding.vat_status')} *
                                    </label>
                                    <div className="grid gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, vat_status: 'non_payer' })}
                                            className={`p-6 rounded-xl text-left transition-all ${
                                                formData.vat_status === 'non_payer'
                                                    ? 'bg-success/10 border-2 border-success shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]'
                                                    : 'bg-bg-card border-2 border-transparent shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] hover:border-success/30'
                                            }`}
                                        >
                                            <div className="flex items-start space-x-4">
                                                <Check className={`w-6 h-6 mt-1 ${formData.vat_status === 'non_payer' ? 'text-success' : 'text-text-light'}`} />
                                                <div>
                                                    <h3 className="font-bold text-primary mb-1">{t('onboarding.vat_non_payer')}</h3>
                                                    <p className="text-sm text-text-light">{t('onboarding.vat_non_payer_desc')}</p>
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, vat_status: 'payer' })}
                                            className={`p-6 rounded-xl text-left transition-all ${
                                                formData.vat_status === 'payer'
                                                    ? 'bg-success/10 border-2 border-success shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]'
                                                    : 'bg-bg-card border-2 border-transparent shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] hover:border-success/30'
                                            }`}
                                        >
                                            <div className="flex items-start space-x-4">
                                                <Briefcase className={`w-6 h-6 mt-1 ${formData.vat_status === 'payer' ? 'text-success' : 'text-text-light'}`} />
                                                <div>
                                                    <h3 className="font-bold text-primary mb-1">{t('onboarding.vat_payer')}</h3>
                                                    <p className="text-sm text-text-light">{t('onboarding.vat_payer_desc')}</p>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleStep1Next}
                                disabled={loading}
                                className="w-full mt-8 py-4 bg-accent text-white rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg font-medium"
                            >
                                <span>{loading ? t('onboarding.saving') : t('onboarding.next_step')}</span>
                                {!loading && <ArrowRight className="w-6 h-6" />}
                            </button>
                        </div>
                    )}

                    {/* Step 2: Upload First Document */}
                    {currentStep === 2 && (
                        <div className="bg-bg-card rounded-3xl p-12 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF]">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-primary mb-3">{t('onboarding.step2_title')}</h2>
                                <p className="text-text-light">{t('onboarding.step2_description')}</p>
                            </div>

                            {/* Upload Area */}
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                                    isDragging
                                        ? 'border-accent bg-accent/5'
                                        : 'border-text-light/30 bg-bg-main/50'
                                }`}
                            >
                                <Upload className="w-16 h-16 text-accent mx-auto mb-4" />
                                <p className="text-lg text-primary font-medium mb-2">{t('onboarding.upload_drag_drop')}</p>
                                <p className="text-text-light mb-6">{t('onboarding.upload_or')}</p>
                                
                                <label className="inline-block px-6 py-3 bg-accent text-white rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] cursor-pointer transition-all">
                                    <span className="font-medium">{t('onboarding.upload_button')}</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </label>
                                
                                <p className="text-sm text-text-light mt-4">{t('onboarding.upload_file_types')}</p>
                            </div>

                            {/* Selected Files */}
                            {uploadedFiles.length > 0 && (
                                <div className="mt-6 space-y-2">
                                    <p className="text-sm font-medium text-text-dark mb-3">
                                        {t('onboarding.selected_files').replace('{{count}}', uploadedFiles.length.toString())}
                                    </p>
                                    {uploadedFiles.map((file, idx) => (
                                        <div key={idx} className="flex items-center space-x-3 p-3 bg-bg-main rounded-lg">
                                            <FileText className="w-5 h-5 text-accent" />
                                            <span className="text-sm text-text-dark flex-1">{file.name}</span>
                                            <button
                                                onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                                                className="text-error hover:text-error/80 text-sm"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* How TAXA Works */}
                            <div className="mt-8 p-6 bg-accent/5 rounded-xl border border-accent/20">
                                <h3 className="font-bold text-primary mb-3 flex items-center space-x-2">
                                    <FileText className="w-5 h-5 text-accent" />
                                    <span>{t('onboarding.how_it_works')}</span>
                                </h3>
                                <ul className="space-y-2 text-sm text-text-light">
                                    <li className="flex items-start space-x-2">
                                        <Check className="w-4 h-4 text-success mt-0.5" />
                                        <span>{t('onboarding.how_it_works_1')}</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <Check className="w-4 h-4 text-success mt-0.5" />
                                        <span>{t('onboarding.how_it_works_2')}</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <Check className="w-4 h-4 text-success mt-0.5" />
                                        <span>{t('onboarding.how_it_works_3')}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex space-x-4 mt-8">
                                <button
                                    onClick={() => setCurrentStep(1)}
                                    className="flex-1 py-4 bg-bg-main text-text-dark rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all flex items-center justify-center space-x-2 font-medium"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    <span>{t('onboarding.back')}</span>
                                </button>
                                
                                {uploadedFiles.length > 0 ? (
                                    <button
                                        onClick={handleStep2Next}
                                        disabled={loading}
                                        className="flex-1 py-4 bg-accent text-white rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
                                    >
                                        <span>{loading ? t('onboarding.uploading') : t('onboarding.next_step')}</span>
                                        {!loading && <ArrowRight className="w-6 h-6" />}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSkipUpload}
                                        disabled={loading}
                                        className="flex-1 py-4 bg-text-light/20 text-text-dark rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
                                    >
                                        <span>{t('onboarding.skip_for_now')}</span>
                                        <ArrowRight className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review & Complete */}
                    {currentStep === 3 && (
                        <div className="bg-bg-card rounded-3xl p-12 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF]">
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
                                    <Check className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-primary mb-3">{t('onboarding.step3_title')}</h2>
                                <p className="text-text-light text-lg">{t('onboarding.step3_description')}</p>
                            </div>

                            {/* Summary */}
                            <div className="space-y-4 mb-8">
                                <div className="p-6 bg-bg-main rounded-xl">
                                    <h3 className="font-bold text-primary mb-4">{t('onboarding.your_setup')}</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-text-light">{t('onboarding.business_type')}</span>
                                            <span className="text-text-dark font-medium">
                                                {formData.business_type === 'flat_rate' 
                                                    ? t('onboarding.flat_rate') 
                                                    : t('onboarding.actual_expenses')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-text-light">{t('onboarding.vat_status')}</span>
                                            <span className="text-text-dark font-medium">
                                                {formData.vat_status === 'non_payer' 
                                                    ? t('onboarding.vat_non_payer') 
                                                    : t('onboarding.vat_payer')}
                                            </span>
                                        </div>
                                        {uploadedFiles.length > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-text-light">{t('onboarding.documents_uploaded')}</span>
                                                <span className="text-text-dark font-medium">{uploadedFiles.length}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Next Steps */}
                                <div className="p-6 bg-accent/5 rounded-xl border border-accent/20">
                                    <h3 className="font-bold text-primary mb-3">{t('onboarding.next_steps')}</h3>
                                    <ul className="space-y-2 text-sm text-text-light">
                                        <li className="flex items-start space-x-2">
                                            <Check className="w-4 h-4 text-accent mt-0.5" />
                                            <span>{t('onboarding.next_steps_1')}</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <Check className="w-4 h-4 text-accent mt-0.5" />
                                            <span>{t('onboarding.next_steps_2')}</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <Check className="w-4 h-4 text-accent mt-0.5" />
                                            <span>{t('onboarding.next_steps_3')}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <button
                                onClick={handleComplete}
                                disabled={loading}
                                className="w-full py-4 bg-accent text-white rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg font-medium"
                            >
                                <span>{loading ? t('onboarding.loading') : t('onboarding.go_to_dashboard')}</span>
                                {!loading && <ArrowRight className="w-6 h-6" />}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
