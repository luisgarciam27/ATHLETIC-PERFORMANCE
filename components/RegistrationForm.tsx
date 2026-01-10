
import React, { useState } from 'react';
import { Student } from '../types';
import { SCHEDULES, WHATSAPP_NUMBER } from '../constants';
import { Send, User, Phone, Mail, Check, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

interface RegistrationFormProps {
  onRegister: (student: Student) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    category: SCHEDULES[0].category,
    modality: 'Mensual Regular',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    scheduleId: SCHEDULES[0].id
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSchedule = SCHEDULES.find(s => s.id === formData.scheduleId);
    
    const newStudent: Student = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      registrationDate: new Date().toISOString(),
      paymentStatus: 'Pending',
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      qrCode: `ATH-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    };

    onRegister(newStudent);

    const text = `Hola! 👋 Quisiera inscribir a mi hijo a la Academia Athletic Performance.%0A%0A*DATOS DEL ALUMNO:*%0A⚽ Nombre: ${formData.firstName} ${formData.lastName}%0A🏆 Categoría: ${formData.category}%0A📝 Modalidad: ${formData.modality}%0A%0A*DATOS DEL PADRE:*%0A👤 Nombre: ${formData.parentName}%0A📞 Teléfono: ${formData.parentPhone}%0A%0A¡Espero su respuesta!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const inputClasses = "w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium shadow-inner";
  const labelClasses = "block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-w-5xl mx-auto border border-slate-100"
    >
      <form onSubmit={handleSubmit} className="p-10 md:p-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Alumno */}
          <div className="space-y-8">
            <h3 className="flex items-center gap-3 font-black text-2xl text-slate-900">
               <User className="text-blue-600" /> ATLETA
            </h3>
            <div className="grid gap-6">
              <div>
                <label className={labelClasses}>Nombre Completo del Alumno</label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" placeholder="Nombres" className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Apellidos</label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" placeholder="Apellidos" className={inputClasses} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>F. Nacimiento</label>
                  <input required name="birthDate" value={formData.birthDate} onChange={handleChange} type="date" className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Categoría / Edad</label>
                  <select name="scheduleId" value={formData.scheduleId} onChange={(e) => {
                    const sched = SCHEDULES.find(s => s.id === e.target.value);
                    setFormData(prev => ({ ...prev, scheduleId: e.target.value, category: sched?.category || '' }));
                  }} className={inputClasses}>
                    {SCHEDULES.map(s => <option key={s.id} value={s.id}>{s.category} ({s.age})</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClasses}>Modalidad de Entrenamiento</label>
                <select name="modality" value={formData.modality} onChange={handleChange} className={inputClasses}>
                  <option value="Mensual Regular">Mensual Regular (3 veces/semana)</option>
                  <option value="Vacacional Intensivo">Vacacional Intensivo</option>
                  <option value="Solo Sábados">Solo Sábados</option>
                  <option value="Full Deporte">Full Deporte (5 veces/semana)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Padre */}
          <div className="space-y-8">
            <h3 className="flex items-center gap-3 font-black text-2xl text-slate-900">
               <Phone className="text-emerald-600" /> APODERADO
            </h3>
            <div className="grid gap-6">
              <div>
                <label className={labelClasses}>Nombre del Padre/Madre/Tutor</label>
                <input required name="parentName" value={formData.parentName} onChange={handleChange} type="text" placeholder="Nombre completo" className={inputClasses} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>WhatsApp de Contacto</label>
                  <input required name="parentPhone" value={formData.parentPhone} onChange={handleChange} type="tel" placeholder="987654321" className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Correo Electrónico</label>
                  <input required name="parentEmail" value={formData.parentEmail} onChange={handleChange} type="email" placeholder="correo@ejemplo.com" className={inputClasses} />
                </div>
              </div>
              <div>
                <label className={labelClasses}>Dirección de Domicilio</label>
                <input required name="address" value={formData.address} onChange={handleChange} type="text" placeholder="Distrito y urbanización" className={inputClasses} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 p-8 bg-slate-50 rounded-3xl">
           <div className="flex items-start gap-4 max-w-md">
             <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
               <Check size={20} />
             </div>
             <p className="text-sm text-slate-500 font-medium">
               Al inscribir a tu hijo, un asesor de Athletic Performance se contactará contigo vía WhatsApp para confirmar los horarios y el proceso de pago.
             </p>
           </div>
           <button type="submit" className="w-full md:w-auto px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 group">
             ENVIAR INSCRIPCIÓN <Send size={20} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </form>
    </motion.div>
  );
};
