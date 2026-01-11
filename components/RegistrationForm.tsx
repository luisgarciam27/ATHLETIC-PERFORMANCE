
import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { SCHEDULES, WHATSAPP_NUMBER } from '../constants';
import { Send, User, Phone, Check, CreditCard, Copy, X } from 'lucide-react';
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
      // Si es admin, no necesita pasar por la pasarela de pago simulada
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
      const text = `¡Hola Athletic! 👋 He realizado el pago de inscripción de S/ 50.%0A%0A*ALUMNO:* ${formData.firstName} ${formData.lastName}%0A*PADRE:* ${formData.parentName}%0A%0AAdjunto comprobante.`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
      setShowPaymentModal(false);
    } else {
      alert('Alumno inscrito exitosamente en el sistema.');
    }
    
    // Reset form after register
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = (text: string, type: 'bcp' | 'yape') => {
    navigator.clipboard.writeText(text);
    setIsCopied(prev => ({ ...prev, [type]: true }));
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
              <h3 className="flex items-center gap-3 font-black text-2xl text-slate-900"><User className="text-blue-600" /> ALUMNO</h3>
              <div className="grid gap-6">
                <div><label className={labelClasses}>Nombres</label><input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" className={inputClasses} /></div>
                <div><label className={labelClasses}>Apellidos</label><input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" className={inputClasses} /></div>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className={labelClasses}>F. Nacimiento</label><input required name="birthDate" value={formData.birthDate} onChange={handleChange} type="date" className={inputClasses} /></div>
                  <div><label className={labelClasses}>Categoría</label>
                    <select name="scheduleId" value={formData.scheduleId} onChange={(e) => {
                      const sched = SCHEDULES.find(s => s.id === e.target.value);
                      setFormData(prev => ({ ...prev, scheduleId: e.target.value, category: sched?.category || '' }));
                    }} className={inputClasses}>
                      {SCHEDULES.map(s => <option key={s.id} value={s.id}>{s.category}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="flex items-center gap-3 font-black text-2xl text-slate-900"><Phone className="text-emerald-600" /> APODERADO</h3>
              <div className="grid gap-6">
                <div><label className={labelClasses}>Nombre completo</label><input required name="parentName" value={formData.parentName} onChange={handleChange} type="text" className={inputClasses} /></div>
                <div><label className={labelClasses}>WhatsApp</label><input required name="parentPhone" value={formData.parentPhone} onChange={handleChange} type="tel" className={inputClasses} /></div>
                <div><label className={labelClasses}>Dirección</label><input required name="address" value={formData.address} onChange={handleChange} type="text" className={inputClasses} /></div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 p-8 bg-slate-50 rounded-3xl">
             <p className="text-sm text-slate-500 font-medium max-w-md italic">
               {isAdminView 
                 ? "El alumno será registrado con estado de pago 'PAGADO' por defecto para el primer mes." 
                 : "* Reserva tu vacante pagando un monto mínimo de inscripción de S/ 50."
               }
             </p>
             <button type="submit" className="w-full md:w-auto px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 transition-all flex items-center gap-3">
               {isAdminView ? 'CONFIRMAR INGRESO' : 'RESERVAR CUPO'} <Send size={20} />
             </button>
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPaymentModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100">
              <button onClick={() => setShowPaymentModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X /></button>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600"><CreditCard size={32} /></div>
                <h3 className="text-2xl font-black text-slate-900 uppercase">Confirmar Reserva</h3>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">PAGO MÍNIMO: S/ 50.00</p>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-2xl border flex justify-between items-center">
                  <div><p className="text-[10px] font-black text-blue-600 uppercase mb-1">CTA BCP</p><p className="font-black text-slate-800 text-sm">191-98765432-0-12</p></div>
                  <button onClick={() => copyToClipboard('191-98765432-0-12', 'bcp')} className="p-3 bg-white rounded-xl shadow-sm hover:bg-blue-600 hover:text-white transition-all">{isCopied.bcp ? <Check size={18} /> : <Copy size={18} />}</button>
                </div>
                <div className="bg-emerald-50 p-5 rounded-2xl border flex justify-between items-center">
                  <div><p className="text-[10px] font-black text-emerald-600 uppercase mb-1">YAPE / PLIN</p><p className="font-black text-emerald-800 text-sm">900 000 000</p></div>
                  <button onClick={() => copyToClipboard('900000000', 'yape')} className="p-3 bg-white rounded-xl shadow-sm hover:bg-emerald-600 hover:text-white transition-all">{isCopied.yape ? <Check size={18} /> : <Copy size={18} />}</button>
                </div>
              </div>
              <button onClick={finalizeRegistration} className="w-full mt-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl">
                <Check size={20} /> YA REALICÉ EL PAGO
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
