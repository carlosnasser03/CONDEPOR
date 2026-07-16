import { Metadata } from 'next';
import { ContactFormClient } from './ContactFormClient';

export const metadata: Metadata = {
  title: 'Contáctanos | CONDEPOR',
  description: 'Ponte en contacto con el equipo de CONDEPOR en Tegucigalpa, Honduras. Soporte técnico, atención a ligas deportivas y consultas oficiales.',
};

export default function ContactPage() {
  return <ContactFormClient />;
}
