import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import './globals.css';

export const metadata: Metadata = {
  title: 'DeporteHN - Gestión de Ligas de Fútbol',
  description:
    'Plataforma interactiva para gestionar ligas y torneos de fútbol',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#080d1a] text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 bg-amber-500 text-slate-950 font-bold p-3 rounded-br-lg shadow-lg"
        >
          Saltar al contenido principal
        </a>
        <ErrorBoundary>
          <main id="main-content">
            {children}
          </main>
        </ErrorBoundary>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
