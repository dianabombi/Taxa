import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";

export const metadata: Metadata = {
    title: "TAXA Platform",
    description: "Accounting Platform",
    icons: {
        icon: [
            { url: '/moneybag.png' },
            { url: '/moneybag.png', sizes: '32x32', type: 'image/png' },
            { url: '/moneybag.png', sizes: '16x16', type: 'image/png' },
        ],
        shortcut: '/moneybag.png',
        apple: '/moneybag.png',
    },
    manifest: '/site.webmanifest',
    openGraph: {
        title: 'TAXA Platform',
        description: 'AI-powered tax and accounting platform',
        url: 'https://taxa-platform.vercel.app',
        siteName: 'TAXA',
        images: [
            {
                url: '/moneybag.png',
                width: 512,
                height: 512,
                alt: 'TAXA Logo',
            },
        ],
        locale: 'sk_SK',
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'TAXA Platform',
        description: 'AI-powered tax and accounting platform',
        images: ['/moneybag.png'],
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
