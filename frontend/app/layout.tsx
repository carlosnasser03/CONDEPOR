import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
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
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
