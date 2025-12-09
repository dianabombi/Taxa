'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Send, Bot, User as UserIcon, LogOut, Home, Upload, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { API_BASE_URL } from '@/lib/api';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [user, setUser] = useState<any>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: t('ai.welcome')
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: userMessage })
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: t('ai.error_retry')
                }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: t('ai.error_connection')
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-main flex flex-col">
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
                                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-accent bg-bg-main/50 transition-all"
                            >
                                <MessageSquare className="w-5 h-5" />
                                <span className="font-medium">{t('dashboard.nav.chat')}</span>
                            </Link>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center space-x-4">
                            <LanguageSwitcher />
                            <div className="flex items-center space-x-3 px-4 py-2 bg-bg-card rounded-xl shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                <UserIcon className="w-5 h-5 text-accent" />
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

            {/* Chat Container */}
            <div className="flex-1 container mx-auto px-6 py-8 flex flex-col max-w-4xl">
                <h1 className="text-3xl font-bold text-primary mb-6">{t('ai.title')}</h1>

                {/* Messages */}
                <div className="flex-1 bg-bg-card rounded-3xl shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] p-6 overflow-y-auto mb-6 space-y-4 min-h-[500px]">
                    {messages.map((message, idx) => (
                        <div
                            key={idx}
                            className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] ${message.role === 'user'
                                ? 'bg-accent'
                                : 'bg-primary'
                                }`}>
                                {message.role === 'user' ? (
                                    <UserIcon className="w-5 h-5 text-white" />
                                ) : (
                                    <Bot className="w-5 h-5 text-white" />
                                )}
                            </div>
                            <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                                <div className={`inline-block max-w-[80%] px-4 py-3 rounded-xl ${message.role === 'user'
                                    ? 'bg-accent text-white shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]'
                                    : 'bg-bg-main text-text-dark shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]'
                                    }`}>
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-bg-main px-4 py-3 rounded-xl shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="flex space-x-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('ai.placeholder')}
                        className="flex-1 px-6 py-4 bg-bg-card rounded-xl text-text-dark placeholder-text-light shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] focus:outline-none focus:shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] transition-shadow"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="px-6 py-4 bg-accent text-white rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>

                {/* Suggestions */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {[t('ai.suggestions.1'), t('ai.suggestions.2'), t('ai.suggestions.3')].map((suggestion, idx) => (
                        <button
                            key={idx}
                            onClick={() => setInput(suggestion)}
                            className="px-4 py-2 bg-bg-card hover:bg-bg-main text-text-dark text-sm rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
