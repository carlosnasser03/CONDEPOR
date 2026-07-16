'use client';

import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#040711] border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center font-black text-slate-950">
                ⚽
              </div>
              <div className="flex flex-col">
                <span className="font-black text-white">CONDEPOR</span>
                <span className="text-[10px] text-amber-400 font-bold">DeporteHN</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Plataforma profesional de gestión de ligas deportivas juveniles en Honduras.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-black text-white text-sm uppercase tracking-wider mb-4">
              Producto
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-slate-400 hover:text-amber-400 text-sm transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-slate-400 hover:text-amber-400 text-sm transition-colors"
                >
                  Categorías
                </Link>
              </li>
              <li>
                <Link
                  href="/matches"
                  className="text-slate-400 hover:text-amber-400 text-sm transition-colors"
                >
                  Partidos
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-black text-white text-sm uppercase tracking-wider mb-4">
              Empresa
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-slate-400 hover:text-amber-400 text-sm transition-colors"
                >
                  Acerca de
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-400 hover:text-amber-400 text-sm transition-colors"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@condepor.com"
                  className="text-slate-400 hover:text-amber-400 text-sm transition-colors"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-black text-white text-sm uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-slate-400 hover:text-amber-400 text-sm transition-colors"
                >
                  Términos & Condiciones
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-slate-400 hover:text-amber-400 text-sm transition-colors"
                >
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy#cookies"
                  className="text-slate-400 hover:text-amber-400 text-sm transition-colors"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="text-center sm:text-left">
              <p className="text-slate-500 text-xs font-semibold">
                © {currentYear} CONDEPOR. Todos los derechos reservados.
              </p>
              <p className="text-slate-600 text-xs mt-1">
                Hecho en Honduras 🇭🇳
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-800">
              <span className="text-slate-400 text-xs font-semibold">Powered by</span>
              <a
                href="https://bitnova-labs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-black text-amber-400 hover:text-amber-300 text-xs transition-colors tracking-wider"
              >
                Bitnova-labs
              </a>
            </div>

          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-6 pt-8 border-t border-slate-800">
          <a
            href="https://twitter.com/bitnovalabs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-amber-400 transition-colors"
            aria-label="Twitter"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7s1.1 1.5 2-1.5a6 6 0 01-6-6c0-.28.15-.55.46-.75z" />
            </svg>
          </a>
          <a
            href="https://facebook.com/bitnovalabs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-amber-400 transition-colors"
            aria-label="Facebook"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 011-1h3z" />
            </svg>
          </a>
          <a
            href="https://instagram.com/bitnovalabs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-amber-400 transition-colors"
            aria-label="Instagram"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M16 11.37A4 4 0 1112.63 8A4 4 0 0116 11.37Z" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};
