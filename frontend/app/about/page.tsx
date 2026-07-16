import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Acerca de | CONDEPOR',
  description: 'Conoce más sobre CONDEPOR DeporteHN, nuestra misión en Honduras y el equipo de desarrollo detrás de la plataforma',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navigation Bar */}
      <div className="max-w-6xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            Volver al Inicio
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
            Sobre Nosotros
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider mb-8 shadow-inner">
            <span>🇭🇳</span> Orgullo y Compromiso Nacional
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-md">
            Acerca de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">CONDEPOR</span>
          </h1>
          <p className="text-lg sm:text-2xl text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto">
            Transformando la gestión de ligas deportivas juveniles y torneos en Honduras con tecnología profesional, transparente y accesible.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-widest border border-amber-500/20">
                Nuestra Razón de Ser
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Nuestra Misión en Honduras
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Facilitar la organización y gestión integral de competiciones deportivas en todo el territorio hondureño, proporcionando una plataforma digital moderna, intuitiva y de nivel profesional para clubes, entrenadores, árbitros y familias.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Creemos firmemente en el poder del deporte como herramienta fundamental de cohesión social para transformar vidas y comunidades. Nuestro principal objetivo es eliminar las barreras burocráticas y administrativas para que los organizadores de torneos puedan enfocarse al 100% en lo que realmente importa: <strong className="text-amber-400 font-semibold">el desarrollo del talento joven y el juego limpio</strong>.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-sm font-semibold text-slate-400">
                <div className="flex items-center gap-2 bg-slate-900/70 px-4 py-2 rounded-xl border border-slate-800">
                  <span className="text-emerald-400">✓</span> Estadísticas en Tiempo Real
                </div>
                <div className="flex items-center gap-2 bg-slate-900/70 px-4 py-2 rounded-xl border border-slate-800">
                  <span className="text-emerald-400">✓</span> Transparencia Competitiva
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-amber-500/30 rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden shadow-2xl group hover:border-amber-500/50 transition-all duration-300">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/25 transition-colors duration-500" />
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/30 flex items-center justify-center text-5xl shadow-inner transform group-hover:scale-110 transition-transform duration-300">
                  ⚽
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
                  Desarrollo Deportivo
                </h3>
                <p className="text-amber-400 font-semibold text-base mb-4">
                  Herramientas profesionales para organizadores de ligas
                </p>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Desde la administración de calendarios y designaciones arbitrales hasta tablas generales y reportes de goleo individuales al instante.
                </p>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent my-6" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                  DeporteHN &bull; Tecnología Hondureña
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-widest border border-amber-500/20 mb-3">
              Pilares Fundamentales
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Nuestros Valores
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mt-4">
              Cada funcionalidad que construimos en CONDEPOR está regida por tres principios innegociables:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Value 1 */}
            <div className="bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-8 transition-all duration-300 group hover:-translate-y-1 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                🎯
              </div>
              <h3 className="text-2xl font-black text-white mb-3 group-hover:text-amber-400 transition-colors">
                Precisión
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Datos estadísticos exactos, alineaciones verificadas y marcadores actualizados en tiempo real para tomar decisiones informadas con absoluta certeza.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-8 transition-all duration-300 group hover:-translate-y-1 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                🤝
              </div>
              <h3 className="text-2xl font-black text-white mb-3 group-hover:text-amber-400 transition-colors">
                Confiabilidad
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Una plataforma de alta disponibilidad, segura y estable en la que organizadores, árbitros y aficionados pueden confiar día tras día, jornada tras jornada.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-8 transition-all duration-300 group hover:-translate-y-1 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                🚀
              </div>
              <h3 className="text-2xl font-black text-white mb-3 group-hover:text-amber-400 transition-colors">
                Innovación
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Tecnología moderna y diseño centrado en el usuario que simplifican procesos administrativos complejos y digitalizan el deporte nacional.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Team / Developer Section */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
              Ingeniería &amp; Desarrollo
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight">
              Desarrollado por
            </h2>
          </div>

          <div className="bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 border border-amber-500/30 rounded-3xl p-8 sm:p-12 text-center relative shadow-2xl hover:border-amber-500/50 transition-all">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="inline-block mb-6 relative z-10">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-2xl flex items-center justify-center font-black text-slate-950 text-3xl sm:text-4xl shadow-xl hover:scale-105 transition-transform duration-300">
                BN
              </div>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-white mb-3 tracking-tight relative z-10">
              Bitnova-labs
            </h3>
            <p className="text-amber-400 font-bold text-sm sm:text-base mb-6 tracking-wide uppercase">
              Excelencia Tecnológica en Centroamérica
            </p>
            <p className="text-slate-300 mb-4 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed relative z-10">
              Agencia de desarrollo de software y consultoría tecnológica especializada en soluciones empresariales, plataformas web de alta concurrencia y arquitecturas cloud para Honduras y la región.
            </p>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8 relative z-10">
              Contamos con amplia experiencia e historial comprobado en desarrollo web profesional, aplicaciones móviles, inteligencia artificial (AI/ML) y transformación digital de organizaciones.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
              <a
                href="https://bitnova-labs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all transform hover:-translate-y-0.5"
              >
                Visitar Sitio Web
              </a>
              <a
                href="mailto:info@bitnova-labs.com"
                className="px-8 py-3.5 bg-slate-950/80 border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 font-black rounded-xl transition-all"
              >
                Contactar a Bitnova-labs
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80 text-xs font-medium text-slate-500">
              Desarrollado por Bitnova-labs &bull; Todos los derechos reservados &bull; Honduras
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight">
            ¿Listo para comenzar a gestionar tu liga?
          </h2>
          <p className="text-slate-300 mb-10 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Únete a CONDEPOR y transforma para siempre la forma en que administras tus ligas deportivas, partidos y estadísticas en tiempo real.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-lg rounded-xl shadow-xl shadow-amber-500/25 hover:shadow-amber-500/50 transition-all transform hover:-translate-y-0.5"
            >
              Ir a la Plataforma →
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-lg rounded-xl transition-all"
            >
              Hablar con Soporte
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
