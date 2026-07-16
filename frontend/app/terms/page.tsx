import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | CONDEPOR',
  description: 'Lee los términos y condiciones de uso de CONDEPOR DeporteHN',
};

export default function TermsPage() {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#080d1a] py-12 px-4 sm:px-6 lg:px-8 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-4xl mx-auto">
        
        {/* Top Navigation Bar */}
        <div className="mb-8 flex items-center justify-between border-b border-slate-800/80 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            Volver al Inicio
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
            Documento Legal
          </span>
        </div>

        {/* Header */}
        <div className="mb-12 bg-gradient-to-b from-slate-900/60 to-slate-900/20 border border-slate-800/80 rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Términos &amp; Condiciones
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Reglas, lineamientos y condiciones generales de uso para la plataforma de gestión de ligas deportivas de CONDEPOR DeporteHN.
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-950/60 w-fit px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Última actualización: {currentDate}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-slate-300">
          
          <section className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 sm:p-8 hover:border-slate-700/60 transition-colors">
            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-bold border border-amber-500/20">
                1
              </span>
              Aceptación de Términos
            </h2>
            <p className="text-slate-300 leading-relaxed pl-11">
              Al acceder y utilizar CONDEPOR (en adelante &quot;la Plataforma&quot;), aceptas estar vinculado por estos Términos y Condiciones. Si no estás de acuerdo con alguno de estos términos, no debes usar la Plataforma. Nuestra plataforma está diseñada para fomentar la transparencia, la competitividad deportiva justa y el desarrollo de ligas juveniles y profesionales en todo el territorio nacional de Honduras.
            </p>
          </section>

          <section className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 sm:p-8 hover:border-slate-700/60 transition-colors">
            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-bold border border-amber-500/20">
                2
              </span>
              Licencia de Uso
            </h2>
            <p className="text-slate-300 leading-relaxed pl-11 mb-4">
              Te concedemos una licencia limitada, no exclusiva e intransferible para usar la Plataforma con propósitos legales y no comerciales, excepto donde se autorice específicamente. Está expresamente prohibido:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2.5 ml-11 pl-2 border-l-2 border-amber-500/30">
              <li><strong className="text-white">Reproducir o copiar:</strong> Distribuir contenido estadístico, logotipos o interfaces sin autorización previa por escrito.</li>
              <li><strong className="text-white">Modificar o adaptar:</strong> Alterar, descompilar o crear trabajos derivados a partir del software de CONDEPOR.</li>
              <li><strong className="text-white">Comercialización no autorizada:</strong> Vender, alquilar, sublicenciar o cobrar a terceros por el acceso a la Plataforma.</li>
              <li><strong className="text-white">Automatización masiva:</strong> Usar técnicas de scraping, bots, arañas web o herramientas automáticas para extraer datos de partidos o jugadores.</li>
              <li><strong className="text-white">Interferencia del sistema:</strong> Sobrecargar, atacar o interferir con el funcionamiento y la seguridad de los servidores de la Plataforma.</li>
            </ul>
          </section>

          <section className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 sm:p-8 hover:border-slate-700/60 transition-colors">
            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-bold border border-amber-500/20">
                3
              </span>
              Contenido del Usuario
            </h2>
            <p className="text-slate-300 leading-relaxed pl-11 mb-4">
              Eres el titular y único responsable de cualquier información, estadística, nómina de equipo o fotografía que subas o registres en la Plataforma. Al publicar o subir contenido, garantizas que:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2.5 ml-11 pl-2 border-l-2 border-amber-500/30">
              <li>Tienes los derechos necesarios para compartir y exhibir públicamente dicha información deportiva o gráfica.</li>
              <li>El contenido no viola derechos de propiedad intelectual, imagen, privacidad ni el honor de terceros (especialmente de atletas menores de edad).</li>
              <li>Es veraz, preciso y plenamente legal bajo todas las leyes aplicables de la República de Honduras.</li>
              <li>No contiene código malicioso, malware, virus ni elementos perjudiciales para los demás usuarios.</li>
            </ul>
          </section>

          <section className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 sm:p-8 hover:border-slate-700/60 transition-colors">
            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-bold border border-amber-500/20">
                4
              </span>
              Limitación de Responsabilidad
            </h2>
            <p className="text-slate-300 leading-relaxed pl-11 mb-4">
              La plataforma CONDEPOR se proporciona &quot;tal cual&quot; (as is) y según disponibilidad, sin garantías expresas o implícitas de ningún tipo. En la máxima medida permitida por la ley aplicable, CONDEPOR no será responsable por:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2.5 ml-11 pl-2 border-l-2 border-amber-500/30">
              <li>Daños indirectos, punitivos, especiales o incidentales derivados del uso de la Plataforma.</li>
              <li>Pérdida temporal de datos, interrupciones de conectividad, demoras en la actualización de resultados de partidos o errores en reportes arbitrales.</li>
              <li>Acciones, omisiones o conductas antideportivas de terceros organizadores de torneos o clubes registrados.</li>
              <li>Fallas originadas en proveedores de internet externos, cortes de energía eléctrica o causas de fuerza mayor.</li>
            </ul>
          </section>

          <section className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 sm:p-8 hover:border-slate-700/60 transition-colors">
            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-bold border border-amber-500/20">
                5
              </span>
              Modificaciones de Servicio
            </h2>
            <p className="text-slate-300 leading-relaxed pl-11">
              Nos reservamos el derecho exclusivo de modificar, actualizar, suspender o discontinuar temporal o permanentemente cualquier módulo, funcionalidad o servicio de la Plataforma en cualquier momento, con o sin previo aviso. No asumimos responsabilidad alguna frente a usuarios o terceros por modificaciones o ajustes en la estructura del servicio conducentes al mejoramiento del sistema.
            </p>
          </section>

          <section className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 sm:p-8 hover:border-slate-700/60 transition-colors">
            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-bold border border-amber-500/20">
                6
              </span>
              Ley Aplicable y Jurisdicción
            </h2>
            <p className="text-slate-300 leading-relaxed pl-11">
              Estos Términos y Condiciones se rigen e interpretan íntegramente de conformidad con las leyes de la República de Honduras, sin dar efecto a ningún principio de conflictos de leyes. Cualquier controversia, disputa o reclamo que surja del uso de CONDEPOR será sometida a la jurisdicción de los tribunales competentes en la ciudad de Tegucigalpa, Francisco Morazán, Honduras.
            </p>
          </section>

          <section className="bg-gradient-to-br from-slate-900/80 to-slate-900/30 border border-amber-500/30 rounded-xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500 text-slate-950 text-sm font-bold">
                7
              </span>
              Contacto Legal
            </h2>
            <p className="text-slate-300 leading-relaxed pl-11 mb-6">
              Si tienes preguntas sobre la interpretación o alcance de estos Términos y Condiciones, o necesitas realizar una notificación formal, puedes comunicarte directamente con nuestro departamento legal:
            </p>
            <div className="ml-11 p-5 bg-slate-950/80 border border-slate-800/90 rounded-xl space-y-3 shadow-inner">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-slate-400 text-sm font-medium">Correo electrónico oficial:</span>
                <a
                  href="mailto:legal@condepor.com"
                  className="text-amber-400 hover:text-amber-300 font-bold transition-colors underline decoration-amber-400/40 underline-offset-4"
                >
                  legal@condepor.com
                </a>
              </div>
              <div className="h-px bg-slate-800/80" />
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-slate-400 text-sm font-medium">Entidad legal y sede:</span>
                <span className="text-white font-semibold">Empresa: CONDEPOR, Honduras</span>
              </div>
              <div className="h-px bg-slate-800/80" />
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-slate-400 text-sm font-medium">Horario de atención legal:</span>
                <span className="text-slate-300 text-sm">Lunes a Viernes, 8:00 AM - 5:00 PM (CST)</span>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm text-center sm:text-left">
            ¿Necesitas asistencia adicional o tienes una consulta general?{' '}
            <Link href="/contact" className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 transition-colors">
              Contáctanos aquí
            </Link>.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Política de Privacidad →
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-sm font-semibold transition-all"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
