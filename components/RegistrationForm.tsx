
import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { SCHEDULES, WHATSAPP_NUMBER } from '../constants';
import { Send, User, Phone, Check, CreditCard, Copy, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RegistrationFormProps {
  onRegister: (student: Student) => void;
  isAdminView?: boolean;
  initialCategory?: string;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  onRegister, 
  isAdminView = false,
  initialCategory 
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isCopied, setIsCopied] = useState<{ bcp: boolean; yape: boolean }>({ bcp: false, yape: false });
  const [hasCopiedAny, setHasCopiedAny] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    category: initialCategory || SCHEDULES[0].category,
    modality: 'Mensual Regular',
    parentName: '',
    parentPhone: '',
    address: '',
    scheduleId: SCHEDULES.find(s => s.category === initialCategory)?.id || SCHEDULES[0].id
  });

  useEffect(() => {
    if (initialCategory) {
      const sched = SCHEDULES.find(s => s.category === initialCategory);
      setFormData(prev => ({ 
        ...prev, 
        category: initialCategory, 
        scheduleId: sched?.id || prev.scheduleId 
      }));
    }
  }, [initialCategory]);

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdminView) {
      finalizeRegistration();
    } else {
      setShowPaymentModal(true);
    }
  };

  const finalizeRegistration = () => {
    const newStudent: Student = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      registrationDate: new Date().toISOString(),
      paymentStatus: isAdminView ? 'Paid' : 'Pending',
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      qrCode: `ATH-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      enrollmentPayment: 50
    };

    onRegister(newStudent);

    if (!isAdminView) {
      const selectedSched = SCHEDULES.find(s => s.id === formData.scheduleId);
      const text = `¡Hola Athletic Academy! 👋 %0A%0AHe completado mi ficha de inscripción para el ciclo 2026.%0A%0A*DATOS DEL ALUMNO:*%0A👤 *Nombre:* ${formData.firstName} ${formData.lastName}%0A⚽ *Categoría:* ${formData.category}%0A💰 *Monto elegido:* S/ ${selectedSched?.price || 0}%0A%0A*DATOS DEL PADRE:*%0A📞 *Celular:* ${formData.parentPhone}%0A👤 *Nombre:* ${formData.parentName}%0A%0A*A la brevedad adjuntaré el voucher del pago realizado.*`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
      setShowPaymentModal(false);
    } else {
      alert('Alumno inscrito exitosamente en el sistema administrativo.');
    }
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      birthDate: '',
      category: initialCategory || SCHEDULES[0].category,
      modality: 'Mensual Regular',
      parentName: '',
      parentPhone: '',
      address: '',
      scheduleId: SCHEDULES.find(s => s.category === initialCategory)?.id || SCHEDULES[0].id
    });
    setHasCopiedAny(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = (text: string, type: 'bcp' | 'yape') => {
    navigator.clipboard.writeText(text);
    setIsCopied(prev => ({ ...prev, [type]: true }));
    setHasCopiedAny(true);
    setTimeout(() => setIsCopied(prev => ({ ...prev, [type]: false })), 2000);
  };

  const inputClasses = "w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 font-medium shadow-inner";
  const labelClasses = "block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1";

  return (
    <div className="relative">
      <motion.div 
        initial={isAdminView ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
        whileInView={isAdminView ? {} : { opacity: 1, scale: 1 }}
        className={`${isAdminView ? '' : 'bg-white rounded-[2.5rem] shadow-2xl border border-slate-100'} overflow-hidden max-w-5xl mx-auto`}
      >
        <form onSubmit={handlePreSubmit} className={`${isAdminView ? 'p-4' : 'p-10 md:p-16'}`}>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="flex items-center gap-3 font-black text-2xl text-slate-900 uppercase tracking-tighter"><User className="text-blue-600" /> Datos del Atleta</h3>
              <div className="grid gap-6">
                <div><label className={labelClasses}>Nombres</label><input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" className={inputClasses} placeholder="Nombre del niño" /></div>
                <div><label className={labelClasses}>Apellidos</label><input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" className={inputClasses} placeholder="Apellidos completos" /></div>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className={labelClasses}>F. Nacimiento</label><input required name="birthDate" value={formData.birthDate} onChange={handleChange} type="date" className={inputClasses} /></div>
                  <div><label className={labelClasses}>Grupo / Categoría</label>
                    <select name="scheduleId" value={formData.scheduleId} onChange={(e) => {
                      const sched = SCHEDULES.find(s => s.id === e.target.value);
                      setFormData(prev => ({ ...prev, scheduleId: e.target.value, category: sched?.category || '' }));
                    }} className={inputClasses}>
                      {SCHEDULES.map(s => <option key={s.id} value={s.id}>{s.category} ({s.age})</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="flex items-center gap-3 font-black text-2xl text-slate-900 uppercase tracking-tighter"><Phone className="text-emerald-600" /> Información del Padre</h3>
              <div className="grid gap-6">
                <div><label className={labelClasses}>Nombre del Apoderado</label><input required name="parentName" value={formData.parentName} onChange={handleChange} type="text" className={inputClasses} placeholder="Nombre completo" /></div>
                <div><label className={labelClasses}>Celular WhatsApp</label><input required name="parentPhone" value={formData.parentPhone} onChange={handleChange} type="tel" className={inputClasses} placeholder="999 999 999" /></div>
                <div><label className={labelClasses}>Dirección de Domicilio</label><input required name="address" value={formData.address} onChange={handleChange} type="text" className={inputClasses} placeholder="Distrito / Av / Calle" /></div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 p-10 bg-slate-900 rounded-[2.5rem] shadow-2xl">
             <div className="max-w-md">
               <p className="text-white font-black text-lg mb-2 uppercase tracking-tighter">Completa tu Registro Élite</p>
               <p className="text-blue-300 text-xs font-bold uppercase tracking-widest leading-relaxed">
                 {isAdminView 
                   ? "Registro administrativo directo con estado de pago automático." 
                   : "Tras completar tus datos, deberás copiar una cuenta de pago para finalizar tu inscripción vía WhatsApp."
                 }
               </p>
             </div>
             <button type="submit" className="w-full md:w-auto px-16 py-6 bg-blue-600 text-white rounded-3xl font-black text-lg shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4 active:scale-95 group">
               {isAdminView ? 'MATRICULAR AHORA' : 'CONTINUAR AL PAGO'} <Send size={24} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </form>
      </motion.div>

      {/* MODAL DE PAGO PARA CLIENTE FINAL */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPaymentModal(false)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[4rem] p-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-slate-100 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600"></div>
              <button onClick={() => setShowPaymentModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"><X size={28} /></button>
              
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-inner">
                  <CreditCard size={40} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Paso Final: Pago</h3>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] max-w-xs mx-auto">Copia un número de cuenta para realizar tu pago de reserva (S/ 50) y finaliza la inscripción.</p>
              </div>

              <div className="space-y-4 mb-10">
                <div className="group relative bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center hover:bg-blue-50 transition-all">
                  <div>
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Cuenta Corriente BCP</p>
                    <p className="font-black text-slate-800 text-lg">191-98765432-0-12</p>
                  </div>
                  <button 
                    onClick={() => copyToClipboard('191-98765432-0-12', 'bcp')} 
                    className={`w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center transition-all ${isCopied.bcp ? 'bg-emerald-500 text-white' : 'bg-white text-blue-600 hover:scale-110'}`}
                  >
                    {isCopied.bcp ? <Check size={24} /> : <Copy size={24} />}
                  </button>
                  {isCopied.bcp && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-white text-[9px] font-black rounded-full shadow-lg">COPIADO</span>}
                </div>

                <div className="group relative bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex justify-between items-center hover:bg-emerald-100/50 transition-all">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Smartphone size={12} className="text-emerald-600" />
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Yape / Plin</p>
                    </div>
                    <p className="font-black text-emerald-800 text-lg">900 000 000</p>
                  </div>
                  <button 
                    onClick={() => copyToClipboard('900000000', 'yape')} 
                    className={`w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center transition-all ${isCopied.yape ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-600 hover:scale-110'}`}
                  >
                    {isCopied.yape ? <Check size={24} /> : <Copy size={24} />}
                  </button>
                  {isCopied.yape && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-white text-[9px] font-black rounded-full shadow-lg">COPIADO</span>}
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  disabled={!hasCopiedAny}
                  onClick={finalizeRegistration} 
                  className={`w-full py-7 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-4 ${hasCopiedAny ? 'bg-slate-900 text-white hover:bg-blue-600' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  <Send size={20} /> ENVIAR A WHATSAPP
                </button>
                <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                  {!hasCopiedAny ? "Por favor, copia un número de cuenta para continuar" : "Redirigiendo a WhatsApp para adjuntar voucher..."}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
