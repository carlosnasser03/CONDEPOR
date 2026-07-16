'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface FormDataState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactFormClient() {
  const [formData, setFormData] = useState<FormDataState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulación de envío o integración con servicio (Formspree/API local)
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSubmitting(false);
    setSubmitted(true);
    toast.success('¡Mensaje enviado con éxito! Nos comunicaremos contigo pronto.');

    setFormData({ name: '', email: '', subject: '', message: '' });

    setTimeout(() => {
      setSubmitted(false);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-[#080d1a] py-12 px-4 sm:px-6 lg:px-8 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-5xl mx-auto">
        
        {/* Top Navigation Bar */}
        <div className="mb-10 flex items-center justify-between border-b border-slate-800/80 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            Volver al Inicio
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
            Soporte &amp; Consultas
          </span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider mb-4 shadow-inner">
            Atención Personalizada
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-md">
            Contáctanos
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">
            Estamos aquí en <strong className="text-white">Tegucigalpa, Honduras</strong> para ayudarte con dudas técnicas, inscripciones de ligas o soporte general de CONDEPOR.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-16 items-start">
          
          {/* Contact Cards */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Email Card */}
            <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800/80 hover:border-amber-500/40 rounded-2xl p-6 transition-all duration-300 shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                📧
              </div>
              <h3 className="font-black text-white text-lg mb-1 group-hover:text-amber-400 transition-colors">
                Correo Electrónico
              </h3>
              <p className="text-slate-400 text-xs mb-3">
                Para consultas oficiales y soporte técnico
              </p>
              <a
                href="mailto:info@condepor.com"
                className="text-amber-400 hover:text-amber-300 font-bold text-sm sm:text-base break-all underline decoration-amber-400/30 underline-offset-4 transition-colors"
              >
                info@condepor.com
              </a>
            </div>

            {/* Phone Card */}
            <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800/80 hover:border-amber-500/40 rounded-2xl p-6 transition-all duration-300 shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                📱
              </div>
              <h3 className="font-black text-white text-lg mb-1 group-hover:text-amber-400 transition-colors">
                Teléfono &amp; WhatsApp
              </h3>
              <p className="text-slate-400 text-xs mb-3">
                Atención directa de lunes a viernes
              </p>
              <a
                href="tel:+50412345678"
                className="text-amber-400 hover:text-amber-300 font-bold text-sm sm:text-base underline decoration-amber-400/30 underline-offset-4 transition-colors"
              >
                +504 1234-5678
              </a>
            </div>

            {/* Location Card */}
            <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-amber-500/30 rounded-2xl p-6 transition-all duration-300 shadow-xl group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                📍
              </div>
              <h3 className="font-black text-white text-lg mb-1 group-hover:text-amber-400 transition-colors">
                Ubicación Central
              </h3>
              <p className="text-slate-400 text-xs mb-3">
                Sede principal de operaciones
              </p>
              <div className="text-slate-200 font-semibold text-sm leading-relaxed">
                Tegucigalpa, Francisco Morazán<br />
                <span className="text-amber-400 font-bold">Honduras 🇭🇳</span>
              </div>
            </div>

          </div>

          {/* Contact Form Container */}
          <div className="lg:col-span-8 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800/90 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white">Envíanos un mensaje</h2>
              <p className="text-slate-400 text-sm mt-1">Completa el formulario y responderemos a tu correo en menos de 24 horas.</p>
            </div>

            {/* Success Toast / Banner on Submit */}
            {submitted && (
              <div className="mb-6 p-5 bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent border-l-4 border border-emerald-500/50 rounded-xl text-emerald-300 font-semibold shadow-lg flex items-start gap-3.5 animate-fadeIn">
                <span className="text-xl mt-0.5">✓</span>
                <div>
                  <div className="font-black text-white text-base">¡Mensaje Recibido!</div>
                  <div className="text-sm text-emerald-200/90 mt-0.5">
                    Hemos registrado tu mensaje en nuestro sistema de soporte. Nuestro equipo en Tegucigalpa te responderá a la brevedad posible.
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-white font-bold mb-2 text-sm">
                    Nombre Completo <span className="text-amber-400">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all disabled:opacity-50"
                    placeholder="Ej. Carlos Avilez"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-white font-bold mb-2 text-sm">
                    Correo Electrónico <span className="text-amber-400">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all disabled:opacity-50"
                    placeholder="tu@correo.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-white font-bold mb-2 text-sm">
                  Asunto <span className="text-amber-400">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all disabled:opacity-50"
                  placeholder="Ej. Registro de nueva liga juvenil o consulta arbitral"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-white font-bold mb-2 text-sm">
                  Mensaje <span className="text-amber-400">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all resize-none disabled:opacity-50 leading-relaxed"
                  placeholder="Describe detalladamente tu consulta, duda o solicitud para el equipo de CONDEPOR DeporteHN..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-slate-700 disabled:to-slate-800 text-slate-950 disabled:text-slate-400 font-black text-base rounded-xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Enviando mensaje...</span>
                  </>
                ) : (
                  <>
                    <span>Enviar Mensaje</span>
                    <span className="text-lg">→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Powered by Footer Mini */}
        <div className="text-center border-t border-slate-800/80 pt-8 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            Powered by{' '}
            <a
              href="https://bitnova-labs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-bold transition-colors"
            >
              Bitnova-labs
            </a>{' '}
            &bull; Honduras 🇭🇳
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <Link href="/terms" className="hover:text-white transition-colors">Términos</Link>
            <span>&bull;</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacidad</Link>
            <span>&bull;</span>
            <Link href="/about" className="hover:text-white transition-colors">Acerca de</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
