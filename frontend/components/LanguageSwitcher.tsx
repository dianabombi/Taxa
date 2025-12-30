'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'sk', label: 'Slovenčina', flag: '🇸🇰' },
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'uk', label: 'Українська', flag: '🇺🇦' },
        { code: 'ru', label: 'Русский', flag: '🇷🇺' },
        { code: 'hu', label: 'Magyar', flag: '🇭🇺' },
    ] as const;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLanguage = languages.find(l => l.code === language) || languages[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-bg-card text-text-dark shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all font-medium"
            >
                <Globe className="w-5 h-5 text-accent" />
                <span className="hidden sm:inline text-sm">{currentLanguage.label}</span>
                <span className="sm:hidden text-xl">{currentLanguage.flag}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-bg-card rounded-2xl shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] overflow-hidden z-50">
                    <div className="py-2">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLanguage(lang.code);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-sm flex items-center space-x-3 transition-all ${language === lang.code 
                                    ? 'bg-accent/10 text-accent font-semibold shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]' 
                                    : 'text-text-dark hover:bg-accent/5 hover:text-accent'
                                }`}
                            >
                                <span className="text-xl">{lang.flag}</span>
                                <span>{lang.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
