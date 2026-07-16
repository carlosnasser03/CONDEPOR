import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidad | CONDEPOR',
  description: 'Conoce cómo protegemos tu privacidad y datos en CONDEPOR DeporteHN',
};

export default function PrivacyPage() {
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
            Privacidad &amp; Seguridad
          </span>
        </div>

        {/* Header */}
        <div className="mb-12 bg-gradient-to-b from-slate-900/60 to-slate-900/20 border border-slate-800/80 rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Política de Privacidad
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Compromiso absoluto con el resguardo, transparencia y protección de la información personal de atletas, clubes y organizadores de ligas en CONDEPOR DeporteHN.
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-950/60 w-fit px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
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
              Información que Recopilamos
            </h2>
            <p className="text-slate-300 leading-relaxed pl-11 mb-4">
              CONDEPOR recopila y administra información estrictamente necesaria para garantizar el correcto funcionamiento de las ligas y competiciones deportivas en Honduras:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2.5 ml-11 pl-2 border-l-2 border-amber-500/30">
              <li><strong className="text-white">Datos de Registro y Cuenta:</strong> Nombre completo, correo electrónico, número de teléfono de contacto y credenciales seguras de organizadores y delegados.</li>
              <li><strong className="text-white">Datos de Perfil Deportivo:</strong> Fotografía del jugador o entrenador, biografía deportiva, asignación a equipo, categoría, número de camiseta y estadísticas de rendimiento.</li>
              <li><strong className="text-white">Datos de Uso y Logs:</strong> Registro de actividad dentro de la Plataforma, preferencias de navegación, tipo de dispositivo, dirección IP y zona horaria.</li>
              <li><strong className="text-white">Cookies e Identificadores:</strong> Identificadores únicos de sesión, preferencias locales de interfaz y métricas de rendimiento técnico.</li>
              <li><strong className="text-white">Datos de Transacciones:</strong> Si corresponde en inscripciones o torneos, información de pago procesada bajo estrictos estándares de encriptación de proveedores autorizados.</li>
            </ul>
          </section>

          <section className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 sm:p-8 hover:border-slate-700/60 transition-colors">
            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-bold border border-amber-500/20">
                2
              </span>
              Cómo Usamos tu Información
            </h2>
            <p className="text-slate-300 leading-relaxed pl-11 mb-4">
              Utilizamos los datos recopilados bajo principios de minimización y finalidad legítima, específicamente para:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2.5 ml-11 pl-2 border-l-2 border-amber-500/30">
              <li>Proporcionar, operar, mantener y mejorar las funcionalidades y tablas estadísticas de la Plataforma.</li>
              <li>Personalizar tu experiencia de usuario, mostrando ligas, categorías y equipos favoritos.</li>
              <li>Comunicarnos de manera oficial para enviarte notificaciones de partidos, calendarios y reportes arbitrales.</li>
              <li>Enviar boletines informativos, actualizaciones del sistema o noticias relevantes del ámbito deportivo (siempre con tu autorización previa).</li>
              <li>Prevenir fraudes, suplantaciones de identidad y asegurar la equidad en el registro de jugadores de cada liga.</li>
              <li>Cumplir rigurosamente con las obligaciones legales y normativas aplicables en Honduras.</li>
            </ul>
          </section>

          <section className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 sm:p-8 hover:border-slate-700/60 transition-colors">
            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-bold border border-amber-500/20">
                3
              </span>
              Protección y Seguridad de Datos
            </h2>
            <p className="text-slate-300 leading-relaxed pl-11 mb-4">
              Implementamos medidas de seguridad técnicas y administrativas de nivel empresarial para salvaguardar la integridad y confidencialidad de tu información:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2.5 ml-11 pl-2 border-l-2 border-amber-500/30">
              <li><strong className="text-white">Encriptación en Tránsito:</strong> Todo el tráfico entre tu dispositivo y nuestros servidores está protegido con protocolos de encriptación SSL/TLS de alta robustez.</li>
              <li><strong className="text-white">Almacenamiento Encriptado:</strong> Las bases de datos en reposo cuentan con cifrado y copias de seguridad continuas y seguras.</li>
              <li><strong className="text-white">Monitoreo Continuo:</strong> Firewalls perimetrales, sistemas avanzados de detección de intrusiones y prevención de ataques de denegación de servicio (DDoS).</li>
              <li><strong className="text-white">Acceso Restringido:</strong> Solo el personal técnico autorizado, bajo estrictos acuerdos de confidencialidad, tiene acceso a información sensible para mantenimiento técnico.</li>
              <li><strong className="text-white">Auditorías Periódicas:</strong> Evaluaciones y escaneos de vulnerabilidades constantes al código y a la infraestructura en la nube.</li>
            </ul>
          </section>

          <section className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 sm:p-8 hover:border-slate-700/60 transition-colors">
            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-bold border border-amber-500/20">
                4
              </span>
              Compartir Información con Terceros
            </h2>
            <p className="text-slate-300 leading-relaxed pl-11 mb-4">
              En ningún caso vendemos, alquilamos ni comercializamos tus datos personales. Compartimos información exclusivamente bajo las siguientes circunstancias controladas:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2.5 ml-11 pl-2 border-l-2 border-amber-500/30">
              <li><strong className="text-white">Proveedores de Servicios Tecnológicos:</strong> Empresas especializadas de hosting, correo transaccional y bases de datos, sujetos a contratos vinculantes y acuerdos de confidencialidad (NDA).</li>
              <li><strong className="text-white">Requerimientos Legales:</strong> Cuando sea legalmente requerido por autoridades judiciales o administrativas competentes de Honduras.</li>
              <li><strong className="text-white">Protección de Derechos:</strong> Para defender los derechos legales, la propiedad intelectual y la seguridad de CONDEPOR, de nuestros atletas y del público.</li>
              <li><strong className="text-white">Consentimiento Explícito:</strong> Cuando nos otorgues tu autorización expresa y por escrito para compartir datos específicos.</li>
            </ul>
          </section>

          <section id="cookies" className="bg-slate-900/50 border border-amber-500/40 rounded-xl p-6 sm:p-8 hover:border-amber-500/60 transition-colors scroll-mt-24 shadow-lg relative">
            <div className="absolute top-4 right-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              #cookies
            </div>
            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500 text-slate-950 text-sm font-bold">
                5
              </span>
              Política de Cookies
            </h2>
            <p className="text-slate-300 leading-relaxed pl-11 mb-4">
              Nuestra plataforma utiliza cookies y tecnologías de almacenamiento local similares con el fin de optimizar el rendimiento y la usabilidad. Clasificamos nuestras cookies en cuatro categorías:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 pl-11 mt-6">
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                <h3 className="font-black text-amber-400 mb-1 flex items-center gap-2">
                  <span>🔒</span> Esenciales
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Indispensables para mantener tu sesión activa, autenticarte de forma segura en el sistema y prevenir falsificaciones de solicitudes.
                </p>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                <h3 className="font-black text-amber-400 mb-1 flex items-center gap-2">
                  <span>📊</span> Analíticas
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Nos permiten comprender de manera anónima cómo interactúan los usuarios con las tablas de posiciones y calendarios para optimizar la velocidad.
                </p>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                <h3 className="font-black text-amber-400 mb-1 flex items-center gap-2">
                  <span>⚙️</span> Personalizadas
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Recordadas localmente para conservar tus preferencias de navegación, filtro de ligas recientes o estado de vista oscura/clara.
                </p>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                <h3 className="font-black text-amber-400 mb-1 flex items-center gap-2">
                  <span>📢</span> Marketing
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Utilizadas únicamente con tu consentimiento explícito para mostrarte anuncios e iniciativas deportivas afines a tus intereses en la región.
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-xs pl-11 mt-4 italic">
              * Puedes configurar o desactivar el uso de cookies no esenciales en las preferencias de tu navegador web en cualquier momento.
            </p>
          </section>

          <section id="derechos" className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 sm:p-8 hover:border-slate-700/60 transition-colors scroll-mt-24">
            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-bold border border-amber-500/20">
                6
              </span>
              Tus Derechos de Privacidad
            </h2>
            <p className="text-slate-300 leading-relaxed pl-11 mb-4">
              En todo momento, como usuario o representante legal, conservas el control pleno sobre tu información personal. Tienes derecho irrenunciable a:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2.5 ml-11 pl-2 border-l-2 border-amber-500/30">
              <li><strong className="text-white">Acceso:</strong> Solicitar un informe detallado y una copia legible de todos los datos personales asociados a tu cuenta.</li>
              <li><strong className="text-white">Rectificación:</strong> Corregir de inmediato información inexacta, incompleta o desactualizada en tu perfil o ficha técnica.</li>
              <li><strong className="text-white">Eliminación (Derecho al olvido):</strong> Solicitar la supresión definitiva de tus datos personales de nuestros servidores, salvo obligación legal de resguardo.</li>
              <li><strong className="text-white">Oposición:</strong> Oponerte en cualquier momento al procesamiento de tu información para fines promocionales o de análisis estadístico secundario.</li>
              <li><strong className="text-white">Portabilidad:</strong> Solicitar la exportación de tu historial o estadísticas en un formato estructurado de lectura mecánica estándar.</li>
            </ul>
          </section>

          <section className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 sm:p-8 hover:border-slate-700/60 transition-colors">
            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-bold border border-amber-500/20">
                7
              </span>
              Retención de Datos
            </h2>
            <p className="text-slate-300 leading-relaxed pl-11">
              Retenemos tu información personal y los registros deportivos mientras tu cuenta o liga se mantenga activa en CONDEPOR. Una vez solicitada la eliminación de la cuenta, eliminaremos o anonimizaremos de manera irreversible tu información identificable en un plazo máximo de 30 días hábiles, conservando únicamente historiales de marcadores deportivos públicos que sean esenciales para la continuidad e integridad estadística de los torneos finalizados.
            </p>
          </section>

          <section className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 sm:p-8 hover:border-slate-700/60 transition-colors">
            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-bold border border-amber-500/20">
                8
              </span>
              Cambios a esta Política
            </h2>
            <p className="text-slate-300 leading-relaxed pl-11">
              Podemos actualizar o revisar periódicamente esta Política de Privacidad para reflejar mejoras en la seguridad de la información o reformas normativas. Te notificaremos con la debida anticipación cualquier cambio sustancial a través de un aviso destacado al iniciar sesión en la Plataforma o mediante un correo electrónico directo antes de la entrada en vigor del nuevo texto.
            </p>
          </section>

          <section className="bg-gradient-to-br from-slate-900/80 to-slate-900/30 border border-amber-500/30 rounded-xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500 text-slate-950 text-sm font-bold">
                9
              </span>
              Contacto de Privacidad y Protección de Datos
            </h2>
            <p className="text-slate-300 leading-relaxed pl-11 mb-6">
              Para ejercer tus derechos ARCO (Acceso, Rectificación, Cancelación u Oposición) o si tienes consultas técnicas respecto a nuestra protección de datos en Honduras, puedes comunicarte directamente con nuestro equipo responsable:
            </p>
            <div className="ml-11 p-5 bg-slate-950/80 border border-slate-800/90 rounded-xl space-y-3 shadow-inner">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-slate-400 text-sm font-medium">Oficina de Privacidad:</span>
                <a
                  href="mailto:privacy@condepor.com"
                  className="text-amber-400 hover:text-amber-300 font-bold transition-colors underline decoration-amber-400/40 underline-offset-4"
                >
                  privacy@condepor.com
                </a>
              </div>
              <div className="h-px bg-slate-800/80" />
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-slate-400 text-sm font-medium">Responsable de Protección de Datos:</span>
                <a
                  href="mailto:data-protection@condepor.com"
                  className="text-amber-400 hover:text-amber-300 font-bold transition-colors underline decoration-amber-400/40 underline-offset-4 break-all"
                >
                  data-protection@condepor.com
                </a>
              </div>
              <div className="h-px bg-slate-800/80" />
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-slate-400 text-sm font-medium">Sede Operativa:</span>
                <span className="text-white font-semibold">Tegucigalpa, Francisco Morazán, Honduras 🇭🇳</span>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm text-center sm:text-left">
            Consulta también nuestros{' '}
            <Link href="/terms" className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 transition-colors">
              Términos &amp; Condiciones
            </Link>.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              ← Términos de Uso
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
