
import React, { useState, useEffect } from 'react';
import { Student, AcademyConfig } from '../types';
import { SCHEDULES } from '../constants';
import { Send, User, Phone, Check, CreditCard, Copy, X, Smartphone, DollarSign, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RegistrationFormProps {
  onRegister: (student: Student) => void;
  isAdminView?: boolean;
  initialCategory?: string;
  config?: AcademyConfig;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  onRegister, 
  isAdminView = false,
  initialCategory,
  config
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
    scheduleId: SCHEDULES.find(s => s.category === initialCategory)?.id || SCHEDULES[0].id,
    comments: '',
    total_paid: 0,
    paymentStatus: 'Pending' as 'Paid' | 'Pending'
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
    const selectedSched = SCHEDULES.find(s => s.id === formData.scheduleId);
    const monthlyPrice = selectedSched?.price || 0;
    
    // Si es admin, usamos lo que ingresó, si no, calculamos deuda estándar
    const currentPaid = isAdminView ? formData.total_paid : 50; 
    const currentPending = isAdminView ? Math.max(0, monthlyPrice - formData.total_paid) : monthlyPrice - 50;

    const newStudent: Student = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      registrationDate: new Date().toISOString(),
      paymentStatus: isAdminView ? formData.paymentStatus : 'Pending',
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      qrCode: `ATH-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      total_paid: currentPaid,
      pending_balance: currentPending,
      comments: formData.comments
    };

    onRegister(newStudent);

    if (!isAdminView) {
      const waNumber = (config?.socialWhatsapp || '51900000000').replace(/\D/g, '');
      const text = `¡Hola Athletic Academy! 👋 %0A%0AHe completado mi ficha de inscripción.%0A%0A*DATOS:* ${formData.firstName} ${formData.lastName}%0A⚽ *Cat:* ${formData.category}%0A%0A*Adjunto mi comprobante de pago.*`;
      window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
      setShowPaymentModal(false);
    } else {
      alert('Alumno registrado correctamente en el sistema.');
    }
    
    // Reset
    setFormData({
      firstName: '', lastName: '', birthDate: '',
      category: initialCategory || SCHEDULES[0].category,
      modality: 'Mensual Regular', parentName: '', parentPhone: '',
      address: '', scheduleId: SCHEDULES.find(s => s.category === initialCategory)?.id || SCHEDULES[0].id,
      comments: '', total_paid: 0, paymentStatus: 'Pending'
    });
    setHasCopiedAny(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'total_paid' ? Number(value) : value }));
  };

  const copyToClipboard = (text: string, type: 'bcp' | 'yape') => {
    navigator.clipboard.writeText(text);
    setIsCopied(prev => ({ ...prev, [type]: true }));
    setHasCopiedAny(true);
    setTimeout(() => setIsCopied(prev => ({ ...prev, [type]: false })), 2000);
  };

  const inputClasses = "w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 font-bold shadow-inner text-sm";
  const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1";

  return (
    <div className="relative">
      <motion.div 
        initial={isAdminView ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
        whileInView={isAdminView ? {} : { opacity: 1, scale: 1 }}
        className={`${isAdminView ? '' : 'bg-white rounded-[4rem] shadow-2xl border border-slate-100'} overflow-hidden max-w-5xl mx-auto`}
      >
        <form onSubmit={handlePreSubmit} className={`${isAdminView ? 'p-0' : 'p-10 md:p-16'}`}>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* ATLETA */}
            <div className="space-y-8">
              <h3 className="flex items-center gap-3 font-black text-xl text-slate-900 uppercase tracking-tighter"><User className="text-blue-600" /> Datos del Atleta</h3>
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClasses}>Nombres</label><input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" className={inputClasses} placeholder="Nombre" /></div>
                  <div><label className={labelClasses}>Apellidos</label><input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" className={inputClasses} placeholder="Apellidos" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClasses}>F. Nacimiento</label><input required name="birthDate" value={formData.birthDate} onChange={handleChange} type="date" className={inputClasses} /></div>
                  <div><label className={labelClasses}>Ciclo / Grupo</label>
                    <select name="scheduleId" value={formData.scheduleId} onChange={(e) => {
                      const sched = SCHEDULES.find(s => s.id === e.target.value);
                      setFormData(prev => ({ ...prev, scheduleId: e.target.value, category: sched?.category || '' }));
                    }} className={inputClasses}>
                      {SCHEDULES.map(s => <option key={s.id} value={s.id}>{s.category}</option>)}
                    </select>
                  </div>
                </div>
                {isAdminView && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 mt-4">
                    <div>
                      <label className={labelClasses}>Modalidad</label>
                      <select name="modality" value={formData.modality} onChange={handleChange} className={inputClasses}>
                        <option value="Mensual Regular">Mensual Regular</option>
                        <option value="Becado Parcial">Becado Parcial</option>
                        <option value="Becado Total">Becado Total</option>
                        <option value="Entrenamiento Diario">Por Sesión</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClasses}>Dirección</label>
                      <input name="address" value={formData.address} onChange={handleChange} type="text" className={inputClasses} placeholder="Distrito" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* APODERADO / PAGOS ADMIN */}
            <div className="space-y-8">
              <h3 className="flex items-center gap-3 font-black text-xl text-slate-900 uppercase tracking-tighter"><Phone className="text-emerald-600" /> Apoderado {isAdminView && " & Cobro"}</h3>
              <div className="grid gap-6">
                <div><label className={labelClasses}>Nombre de Apoderado</label><input required name="parentName" value={formData.parentName} onChange={handleChange} type="text" className={inputClasses} placeholder="Mamá / Papá" /></div>
                <div><label className={labelClasses}>WhatsApp</label><input required name="parentPhone" value={formData.parentPhone} onChange={handleChange} type="tel" className={inputClasses} placeholder="999..." /></div>
                
                {isAdminView && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 mt-4">
                    <div>
                      <label className={labelClasses}><DollarSign size={10} className="inline"/> Abono Inicial S/</label>
                      <input name="total_paid" value={formData.total_paid} onChange={handleChange} type="number" className={inputClasses} placeholder="0.00" />
                    </div>
                    <div>
                      <label className={labelClasses}>Estado Inicial</label>
                      <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className={inputClasses}>
                        <option value="Paid">Cancelado</option>
                        <option value="Pending">Pendiente</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className={labelClasses}><FileText size={10} className="inline"/> Notas de Matrícula</label>
                      <textarea name="comments" value={formData.comments} onChange={handleChange} className={`${inputClasses} h-24 pt-4 resize-none`} placeholder="Observaciones adicionales..."></textarea>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 p-10 bg-slate-900 rounded-[3rem]">
             <div className="max-w-md">
               <p className="text-white font-black text-xl mb-1 uppercase tracking-tighter">
                 {isAdminView ? "Confirmar Registro Admin" : "Reserva tu Cupo 2026"}
               </p>
               <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                 {isAdminView ? "El alumno será añadido a la base de datos de inmediato." : "Tras enviar, copia los datos de pago para confirmar por WhatsApp."}
               </p>
             </div>
             <button type="submit" className="w-full md:w-auto px-16 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4 group">
               {isAdminView ? 'REGISTRAR ATLETA' : 'CONTINUAR'} <Send size={20} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {!isAdminView && showPaymentModal && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPaymentModal(false)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[4rem] p-12 shadow-2xl overflow-hidden">
              <button onClick={() => setShowPaymentModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><X size={28} /></button>
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-inner"><CreditCard size={32} /></div>
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Pago de Reserva</h3>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Copia los datos de pago para finalizar.</p>
              </div>
              <div className="space-y-4 mb-10">
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center">
                  <div><p className="text-[9px] font-black text-blue-600 uppercase mb-1">Cuenta BCP</p><p className="font-black text-slate-800 text-lg">191-98765432-0-12</p></div>
                  <button onClick={() => copyToClipboard('191-98765432-0-12', 'bcp')} className={`w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center ${isCopied.bcp ? 'bg-emerald-500 text-white' : 'bg-white text-blue-600 hover:scale-110'}`}>{isCopied.bcp ? <Check size={20} /> : <Copy size={20} />}</button>
                </div>
                <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex justify-between items-center">
                  <div><p className="text-[9px] font-black text-emerald-600 uppercase mb-1">Yape / Plin</p><p className="font-black text-emerald-800 text-lg">900 000 000</p></div>
                  <button onClick={() => copyToClipboard('900000000', 'yape')} className={`w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center ${isCopied.yape ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-600 hover:scale-110'}`}>{isCopied.yape ? <Check size={20} /> : <Copy size={20} />}</button>
                </div>
              </div>
              <button disabled={!hasCopiedAny} onClick={finalizeRegistration} className={`w-full py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-4 transition-all ${hasCopiedAny ? 'bg-slate-900 text-white hover:bg-black' : 'bg-slate-200 text-slate-400'}`}><Send size={20} /> ENVIAR VOUCHER</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
