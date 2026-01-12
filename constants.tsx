
import { ClassSchedule } from './types';

export const ACADEMY_LOGO = "https://raw.githubusercontent.com/frapastor/assets/main/athletic_logo.png";
export const WHATSAPP_NUMBER = "51900000000";

export const SCHEDULES: ClassSchedule[] = [
  {
    id: 'baby-futbol',
    category: 'Baby Fútbol',
    age: '3 a 4 años',
    days: ['Lunes', 'Miércoles', 'Viernes'],
    time: '4:00 PM – 5:00 PM',
    duration: '60 min',
    price: 180,
    objective: 'Primeros pasos: desarrollo psicomotor y adaptación al balón.',
    color: '#3b82f6' // Blue
  },
  {
    id: 'formativo-lmv',
    category: 'Grupo Formativo',
    age: '6, 7 y 8 años',
    days: ['Lunes', 'Miércoles', 'Viernes'],
    time: '4:00 PM – 5:30 PM',
    duration: '90 min',
    price: 200,
    objective: 'Nivel principiantes: fundamentos técnicos y calidad de servicio.',
    color: '#10b981' // Emerald
  },
  {
    id: 'competitivo-lmv',
    category: 'Categorías Competitivas',
    age: 'Sub-8 y Sub-10',
    days: ['Lunes', 'Miércoles', 'Viernes'],
    time: '5:30 PM – 7:00 PM',
    duration: '90 min',
    price: 220,
    objective: 'Desarrollo técnico–táctico avanzado y preparación para torneos.',
    color: '#f59e0b' // Amber
  },
  {
    id: 'alto-rendimiento-lmv',
    category: 'Alto Rendimiento',
    age: '12+ (Proyección)',
    days: ['Lunes', 'Miércoles', 'Viernes'],
    time: '7:00 PM – 8:00 PM',
    duration: '60 min',
    price: 250,
    objective: 'Preparación física de alta exigencia y especialización táctica.',
    color: '#f43f5e' // Rose
  }
];

export const NAV_LINKS = [
  { name: 'Inicio', href: '#home' },
  { name: 'Nosotros', href: '#about' },
  { name: 'Horarios', href: '#schedules' },
  { name: 'Inscripción', href: '#register' }
];
