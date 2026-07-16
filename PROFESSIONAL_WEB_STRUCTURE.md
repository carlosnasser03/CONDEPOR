# 🎯 ESTRUCTURA PROFESIONAL COMPLETA - CONDEPOR
## Términos, Privacy, Footer, Header, Branding + SEO

---

# 📋 CHECKLIST DE PROFESIONALISMO

```
✅ Header profesional con logo
✅ Footer con links legales
✅ Página Terms & Conditions
✅ Página Privacy Policy
✅ Página About Us
✅ Página Contact
✅ Branding "Powered by Bitnova-labs" en todas partes
✅ Metadata SEO
✅ Responsive design
✅ Dark mode (tu tema actual)
✅ Links en footer
✅ Cookies consent (opcional)
```

---

# 📁 ESTRUCTURA DE CARPETAS

```
frontend/
├── app/
│   ├── page.tsx (Home)
│   ├── layout.tsx
│   ├── globals.css
│   ├── terms/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── privacy/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── about/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── contact/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   └── sitemap.xml (SEO)
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── common/
│   │   │   └── BrandingFooter.tsx
│   │   └── ...
│   └── ...
├── public/
│   ├── sitemap.xml
│   ├── robots.txt
│   └── ...
└── ...
```

---

# 🏗️ COMPONENTES A CREAR

## 1. Header.tsx (Logo + Nav)

**Archivo:** `frontend/src/components/layout/Header.tsx`

```typescript
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[1000] bg-[#080d1a]/95 backdrop-blur-md border-b border-slate-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center font-black text-slate-950 group-hover:shadow-lg group-hover:shadow-amber-500/50 transition-shadow">
              ⚽
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-black text-lg text-white tracking-tight">CONDEPOR</span>
              <span className="text-[10px] text-amber-400 font-bold tracking-wider uppercase">DeporteHN</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-slate-300 hover:text-amber-400 font-semibold text-sm transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-slate-300 hover:text-amber-400 font-semibold text-sm transition-colors"
            >
              Acerca de
            </Link>
            <Link
              href="/contact"
              className="text-slate-300 hover:text-amber-400 font-semibold text-sm transition-colors"
            >
              Contacto
            </Link>
            <Link
              href="/terms"
              className="text-slate-300 hover:text-amber-400 font-semibold text-sm transition-colors"
            >
              Términos
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden pb-4 border-t border-slate-800 flex flex-col gap-3 pt-4"
          >
            <Link
              href="/"
              className="text-slate-300 hover:text-amber-400 font-semibold text-sm transition-colors block py-2"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-slate-300 hover:text-amber-400 font-semibold text-sm transition-colors block py-2"
            >
              Acerca de
            </Link>
            <Link
              href="/contact"
              className="text-slate-300 hover:text-amber-400 font-semibold text-sm transition-colors block py-2"
            >
              Contacto
            </Link>
            <Link
              href="/terms"
              className="text-slate-300 hover:text-amber-400 font-semibold text-sm transition-colors block py-2"
            >
              Términos
            </Link>
          </motion.div>
        )}
      </nav>
    </header>
  );
};
```

---

## 2. Footer.tsx (Footer Profesional)

**Archivo:** `frontend/src/components/layout/Footer.tsx`

```typescript
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

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
          {/* Powered by Bitnova */}
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

        {/* Social Links (Optional) */}
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
```

---

## 3. BrandingFooter.tsx (Minimal Branding)

**Archivo:** `frontend/src/components/common/BrandingFooter.tsx`

```typescript
'use client';

import Link from 'next/link';

export const BrandingFooter = () => {
  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-amber-500/50 transition-colors group">
      <span className="text-slate-400 text-xs font-semibold group-hover:text-slate-300">Powered by</span>
      <a
        href="https://bitnova-labs.com"
        target="_blank"
        rel="noopener noreferrer"
        className="font-black text-amber-400 hover:text-amber-300 text-xs transition-colors tracking-widest"
      >
        BITNOVA-LABS
      </a>
    </div>
  );
};
```

---

# 📄 PÁGINAS LEGALES

## 1. Página: Terms & Conditions

**Archivo:** `frontend/app/terms/page.tsx`

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | CONDEPOR',
  description: 'Lee los términos y condiciones de uso de CONDEPOR DeporteHN',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#080d1a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Términos & Condiciones
          </h1>
          <p className="text-slate-400 text-lg">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          
          <section>
            <h2 className="text-2xl font-black text-white mb-4">1. Aceptación de Términos</h2>
            <p className="text-slate-300 leading-relaxed">
              Al acceder y utilizar CONDEPOR (en adelante "la Plataforma"), aceptas estar vinculado por estos Términos y Condiciones. Si no estás de acuerdo con alguno de estos términos, no debes usar la Plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">2. Licencia de Uso</h2>
            <p className="text-slate-300 leading-relaxed">
              Te concedemos una licencia limitada, no exclusiva e intransferible para usar la Plataforma con propósitos legales y no comerciales, excepto donde se autorize específicamente. Está prohibido:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4 ml-4">
              <li>Reproducir o copiar contenido sin autorización</li>
              <li>Modificar, adaptar o crear trabajos derivados</li>
              <li>Vender, alquilar o licenciar acceso a la Plataforma</li>
              <li>Usar técnicas de scraping o automatización</li>
              <li>Interferir con el funcionamiento de la Plataforma</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">3. Contenido del Usuario</h2>
            <p className="text-slate-300 leading-relaxed">
              Eres responsable de cualquier contenido que subas a la Plataforma. Al subir contenido, garantizas que:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4 ml-4">
              <li>Tienes los derechos necesarios</li>
              <li>No viola derechos de terceros</li>
              <li>Es legal en todas las jurisdicciones aplicables</li>
              <li>No contiene malware u código malicioso</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">4. Limitación de Responsabilidad</h2>
            <p className="text-slate-300 leading-relaxed">
              CONDEPOR se proporciona "tal cual" sin garantías de ningún tipo. No seremos responsables por:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4 ml-4">
              <li>Daños indirectos o incidentales</li>
              <li>Pérdida de datos o ingresos</li>
              <li>Interrupciones del servicio</li>
              <li>Acciones de terceros</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">5. Modificaciones de Servicio</h2>
            <p className="text-slate-300 leading-relaxed">
              Nos reservamos el derecho de modificar, suspender o discontinuar la Plataforma en cualquier momento, con o sin previo aviso. No seremos responsables por cambios en el servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">6. Ley Aplicable</h2>
            <p className="text-slate-300 leading-relaxed">
              Estos Términos se rigen por las leyes de Honduras, sin considerar sus disposiciones sobre conflictos de leyes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">7. Contacto</h2>
            <p className="text-slate-300 leading-relaxed">
              Si tienes preguntas sobre estos Términos, contacta a:
            </p>
            <div className="mt-4 p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
              <p className="text-amber-400 font-semibold">Email: legal@condepor.com</p>
              <p className="text-amber-400 font-semibold">Empresa: CONDEPOR, Honduras</p>
            </div>
          </section>

        </div>

        {/* Footer Link */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">
            ¿Necesitas ayuda? Contacta a nuestro equipo de soporte.
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## 2. Página: Privacy Policy

**Archivo:** `frontend/app/privacy/page.tsx`

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad | CONDEPOR',
  description: 'Conoce cómo protegemos tu privacidad en CONDEPOR DeporteHN',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#080d1a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Política de Privacidad
          </h1>
          <p className="text-slate-400 text-lg">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          
          <section>
            <h2 className="text-2xl font-black text-white mb-4">1. Información que Recopilamos</h2>
            <p className="text-slate-300 leading-relaxed">
              CONDEPOR recopila información de varias formas:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4 ml-4">
              <li><strong>Datos de Registro:</strong> Nombre, email, teléfono</li>
              <li><strong>Datos de Perfil:</strong> Foto, biografía, equipo</li>
              <li><strong>Datos de Uso:</strong> Actividad, preferencias, dispositivo</li>
              <li><strong>Cookies:</strong> Identificadores únicos, preferencias</li>
              <li><strong>Datos de Pago:</strong> Si corresponde (procesados de forma segura)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">2. Cómo Usamos tu Información</h2>
            <p className="text-slate-300 leading-relaxed">
              Usamos tu información para:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4 ml-4">
              <li>Proporcionar y mejorar el servicio</li>
              <li>Personalizar tu experiencia</li>
              <li>Comunicarnos contigo</li>
              <li>Enviar actualizaciones y noticias (si lo autorizas)</li>
              <li>Prevenir fraude y abuso</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">3. Protección de Datos</h2>
            <p className="text-slate-300 leading-relaxed">
              Implementamos medidas de seguridad robustas:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4 ml-4">
              <li>Encriptación SSL/TLS en tránsito</li>
              <li>Almacenamiento encriptado en reposo</li>
              <li>Firewalls y sistemas de detección de intrusiones</li>
              <li>Acceso restringido a datos sensibles</li>
              <li>Auditorías de seguridad regulares</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">4. Compartir Información</h2>
            <p className="text-slate-300 leading-relaxed">
              No compartimos tu información personal con terceros, excepto:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4 ml-4">
              <li>Proveedores de servicios confiables (bajo acuerdos de confidencialidad)</li>
              <li>Cuando lo requiera la ley</li>
              <li>Para proteger derechos legales</li>
              <li>Con tu consentimiento explícito</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">5. Cookies</h2>
            <p className="text-slate-300 leading-relaxed">
              Usamos cookies para:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4 ml-4">
              <li><strong>Esenciales:</strong> Mantener sesión activa</li>
              <li><strong>Analíticas:</strong> Entender cómo usas la Plataforma</li>
              <li><strong>Personalizadas:</strong> Recordar preferencias</li>
              <li><strong>Marketing:</strong> Mostrarte contenido relevante (con consentimiento)</li>
            </ul>
          </section>

          <section id="cookies">
            <h2 className="text-2xl font-black text-white mb-4">6. Tus Derechos</h2>
            <p className="text-slate-300 leading-relaxed">
              Tienes derecho a:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4 ml-4">
              <li>Acceder a tus datos personales</li>
              <li>Rectificar información incorrecta</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Oponerme al procesamiento de tus datos</li>
              <li>Portabilidad de datos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">7. Retención de Datos</h2>
            <p className="text-slate-300 leading-relaxed">
              Retenemos tus datos mientras tu cuenta esté activa. Después de la eliminación, algunos datos pueden retenerse por razones legales o operativas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">8. Cambios a esta Política</h2>
            <p className="text-slate-300 leading-relaxed">
              Podemos actualizar esta política ocasionalmente. Notificaremos cambios significativos via email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">9. Contacto</h2>
            <p className="text-slate-300 leading-relaxed">
              Preguntas sobre privacidad:
            </p>
            <div className="mt-4 p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
              <p className="text-amber-400 font-semibold">Email: privacy@condepor.com</p>
              <p className="text-amber-400 font-semibold">Responsable de Datos: data-protection@condepor.com</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
```

---

## 3. Página: About Us

**Archivo:** `frontend/app/about/page.tsx`

```typescript
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Acerca de | CONDEPOR',
  description: 'Conoce más sobre CONDEPOR DeporteHN y nuestra misión',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#080d1a]">
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 tracking-tight">
            Acerca de CONDEPOR
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            Transformando la gestión de ligas deportivas juveniles en Honduras con tecnología profesional y accesible.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black text-white mb-6">Nuestra Misión</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Facilitar la organización y gestión de competiciones deportivas en Honduras, proporcionando una plataforma moderna, intuitiva y profesional para clubes, entrenadores y familias.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Creemos en el poder del deporte para transformar vidas y comunidades. Nuestro objetivo es eliminar barreras administrativas para que los organizadores se enfoquen en lo que realmente importa: el desarrollo de talento joven.
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 border border-amber-500/20 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">⚽</div>
              <h3 className="text-2xl font-black text-amber-400 mb-2">Desarrollo Deportivo</h3>
              <p className="text-slate-400">
                Herramientas profesionales para organizadores de ligas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-12 text-center">Nuestros Valores</h2>
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Value 1 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-black text-white mb-3">Precisión</h3>
              <p className="text-slate-400">
                Datos exactos y actualizados en tiempo real para decisiones informadas.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-black text-white mb-3">Confiabilidad</h3>
              <p className="text-slate-400">
                Plataforma estable y segura que puedes usar sin preocupaciones.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-black text-white mb-3">Innovación</h3>
              <p className="text-slate-400">
                Tecnología moderna que simplifica procesos complejos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-12 text-center">Desarrollado por</h2>
          <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 rounded-xl p-8 text-center">
            <div className="inline-block mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center font-black text-slate-950 text-2xl">
                BN
              </div>
            </div>
            <h3 className="text-2xl font-black text-white mb-3">Bitnova-labs</h3>
            <p className="text-slate-300 mb-4">
              Agencia de desarrollo de software especializada en soluciones empresariales para Honduras y Centroamérica.
            </p>
            <p className="text-slate-400 text-sm">
              Contamos con experiencia en desarrollo web, móvil, AI/ML y consultoría tecnológica.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <a
                href="https://bitnova-labs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg transition-colors"
              >
                Visitar Sitio
              </a>
              <a
                href="mailto:info@bitnova-labs.com"
                className="px-6 py-2 border border-amber-500 text-amber-400 hover:bg-amber-500/10 font-black rounded-lg transition-colors"
              >
                Contactar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-6">¿Listo para comenzar?</h2>
          <p className="text-slate-300 mb-8 text-lg">
            Únete a CONDEPOR y transforma la forma en que gestionas tus ligas deportivas.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all"
          >
            Ir a la Plataforma
          </Link>
        </div>
      </section>
    </div>
  );
}
```

---

## 4. Página: Contact

**Archivo:** `frontend/app/contact/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Metadata } from 'next';

export const metadata: any = {
  title: 'Contacto | CONDEPOR',
  description: 'Ponte en contacto con el equipo de CONDEPOR',
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    // Aquí integrarías con un servicio de email (Formspree, SendGrid, etc.)
    console.log('Form submitted:', formData);
    
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#080d1a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Contáctanos
          </h1>
          <p className="text-xl text-slate-400">
            Estamos aquí para ayudarte. Envía tu mensaje y nos pondremos en contacto pronto.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          
          {/* Contact Info */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Email */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="text-2xl mb-3">📧</div>
              <h3 className="font-black text-white mb-2">Email</h3>
              <a
                href="mailto:info@condepor.com"
                className="text-amber-400 hover:text-amber-300 break-all"
              >
                info@condepor.com
              </a>
            </div>

            {/* Phone */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="text-2xl mb-3">📱</div>
              <h3 className="font-black text-white mb-2">Teléfono</h3>
              <a
                href="tel:+50412345678"
                className="text-amber-400 hover:text-amber-300"
              >
                +504 1234-5678
              </a>
            </div>

            {/* Location */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="text-2xl mb-3">📍</div>
              <h3 className="font-black text-white mb-2">Ubicación</h3>
              <p className="text-slate-300">
                Tegucigalpa<br />
                Honduras 🇭🇳
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name */}
              <div>
                <label className="block text-white font-bold mb-2 text-sm">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition-colors"
                  placeholder="Tu nombre completo"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-white font-bold mb-2 text-sm">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition-colors"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-white font-bold mb-2 text-sm">
                  Asunto *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition-colors"
                  placeholder="Ej: Soporte técnico"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-white font-bold mb-2 text-sm">
                  Mensaje *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition-colors resize-none"
                  placeholder="Cuéntanos tu pregunta o comentario..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all"
              >
                Enviar Mensaje
              </button>

              {/* Success Message */}
              {submitted && (
                <div className="p-4 bg-emerald-500/20 border border-emerald-500 rounded-lg text-emerald-300 text-center font-semibold">
                  ✓ Mensaje enviado correctamente. Nos contactaremos pronto.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Powered by Footer Mini */}
        <div className="text-center border-t border-slate-800 pt-8">
          <p className="text-slate-500 text-sm">
            Powered by{' '}
            <a
              href="https://bitnova-labs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-bold"
            >
              Bitnova-labs
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

# 🔧 ACTUALIZAR layout.tsx PRINCIPAL

**Archivo:** `frontend/app/layout.tsx`

```typescript
import type { Metadata } from 'next';
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
```

---

# 📊 FILES PARA SEO

## robots.txt

**Archivo:** `frontend/public/robots.txt`

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /*.json$

Sitemap: https://condepor.vercel.app/sitemap.xml
```

---

## sitemap.xml

**Archivo:** `frontend/public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://condepor.vercel.app/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://condepor.vercel.app/about</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://condepor.vercel.app/contact</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://condepor.vercel.app/terms</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://condepor.vercel.app/privacy</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://condepor.vercel.app/categories</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://condepor.vercel.app/matches</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

---

# ✅ CHECKLIST FINAL

```
COMPONENTES:
[ ] Header.tsx - Navegación profesional
[ ] Footer.tsx - Footer con links legales
[ ] BrandingFooter.tsx - "Powered by Bitnova-labs"

PÁGINAS:
[ ] app/terms/page.tsx - Términos y Condiciones
[ ] app/privacy/page.tsx - Política de Privacidad
[ ] app/about/page.tsx - Acerca de nosotros
[ ] app/contact/page.tsx - Formulario de contacto

LAYOUT:
[ ] app/layout.tsx - Actualizar con Header + Footer
[ ] Agregar metadatos SEO
[ ] Agregar Open Graph (redes sociales)
[ ] Agregar Twitter Card

SEO FILES:
[ ] public/robots.txt
[ ] public/sitemap.xml
[ ] public/favicon.ico (tu logo)
[ ] public/icon-192.png (PWA)

FEATURES:
[ ] "Powered by Bitnova-labs" en todas las páginas
[ ] Links en footer a Terms, Privacy, About, Contact
[ ] Formulario de contacto funcional
[ ] Metadata SEO en cada página
[ ] Responsive design (mobile-first)
```

---

# 🎨 COLORES PROFESIONALES (Tu tema actual)

```
Primario:    #020617 (Negro)
Secundario:  #f59e0b (Oro/Amber)
Accent:      #7B61FF (Púrpura)
Slate:       #6b7280 (Gris)
White:       #ffffff (Blanco)
```

---

# 📋 CHECKLIST DE INSTALACIÓN

```bash
# 1. Crear componentes
mkdir -p src/components/layout
touch src/components/layout/Header.tsx
touch src/components/layout/Footer.tsx
touch src/components/common/BrandingFooter.tsx

# 2. Crear páginas
mkdir -p app/terms app/privacy app/about app/contact
touch app/terms/page.tsx
touch app/privacy/page.tsx
touch app/about/page.tsx
touch app/contact/page.tsx

# 3. Crear SEO files
touch public/robots.txt
touch public/sitemap.xml

# 4. Actualizar layout principal
# Edita: app/layout.tsx

# 5. Build y test
npm run dev
```

---

**¿Necesitas ayuda con la instalación? Avísame cuál parte quieres que haga primero. 👇**
