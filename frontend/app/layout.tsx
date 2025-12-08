import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";

export const metadata: Metadata = {
    title: "TAXA - Jednoduchý digitálny sprievodca pre slovenských živnostníkov",
    description: "Automatizujte evidenciu príjmov a výdavkov. Vytvorte daňové priznanie jedným klikom. Žiadny stres z papierov a termínov.",
    icons: {
        icon: [
            { url: '/taxa logo.jpg' },
            { url: '/taxa logo.jpg', sizes: '32x32', type: 'image/jpeg' },
            { url: '/taxa logo.jpg', sizes: '16x16', type: 'image/jpeg' },
        ],
        shortcut: '/taxa logo.jpg',
        apple: '/taxa logo.jpg',
    },
    manifest: '/site.webmanifest',
    openGraph: {
        title: 'TAXA - Digitálny sprievodca pre živnostníkov',
        description: 'Automatická evidencia príjmov a výdavkov. Daňové priznanie na jeden klik. Pre slovenských živnostníkov.',
        url: 'https://taxa-platform.vercel.app',
        siteName: 'TAXA',
        images: [
            {
                url: '/taxa logo.jpg',
                width: 800,
                height: 800,
                alt: 'TAXA Logo',
            },
        ],
        locale: 'sk_SK',
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'TAXA - Digitálny sprievodca pre živnostníkov',
        description: 'Automatická evidencia príjmov a výdavkov. Daňové priznanie na jeden klik.',
        images: ['/taxa logo.jpg'],
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="sk">
            <body>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </body>
        </html>
    );
}
