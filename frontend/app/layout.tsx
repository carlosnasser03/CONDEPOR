import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BrandingFooter } from '@/components/common/BrandingFooter';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import './globals.css';

export const metadata: Metadata = {
  title: 'CONDEPOR - Gestión de Ligas de Fútbol en Honduras',
  description:
    'Plataforma profesional para gestionar ligas y torneos de fútbol juvenil. Powered by Bitnova-labs',
  keywords: 'fútbol, ligas, Honduras, gestión deportiva, torneos',
  metadataBase: new URL('https://condepor.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'es_HN',
    url: 'https://condepor.vercel.app',
    siteName: 'CONDEPOR',
    title: 'CONDEPOR - Gestión de Ligas de Fútbol',
    description: 'Plataforma profesional para gestionar ligas deportivas juveniles',
    images: [
      {
        url: 'https://condepor.vercel.app/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CONDEPOR - Gestión de Ligas de Fútbol',
    description: 'Plataforma profesional para gestionar ligas deportivas',
    creator: '@bitnovalabs',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#020617',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#020617" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="bg-[#080d1a] text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 bg-amber-500 text-slate-950 font-bold p-3 rounded-br-lg shadow-lg"
        >
          Saltar al contenido principal
        </a>
        <ErrorBoundary>
          <Header />
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
          <Footer />
          <BrandingFooter />
        </ErrorBoundary>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
