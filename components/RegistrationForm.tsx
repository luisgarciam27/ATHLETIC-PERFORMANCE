
import React, { useState, useEffect } from 'react';
import { Student, AcademyConfig } from '../types';
import { SCHEDULES } from '../constants';
import { Send, User, Phone, Check, CreditCard, Copy, X, Smartphone, DollarSign, FileText, MapPin } from 'lucide-react';
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
    
    const currentPaid = isAdminView ? formData.total_paid : 50; 
    const currentPending = isAdminView ? Math.max(0, monthlyPrice - formData.total_paid) : monthlyPrice - 50;

    const newStudent: Student = {
      ...formData,
      // IMPORTANTE: Si es admin, no enviamos ID para que Supabase genere el UUID automáticamente
      id: isAdminView ? undefined as any : Math.random().toString(36).substr(2, 9),
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
      alert('Matrícula registrada en base de datos.');
    }
    
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
    setFormData(prev => ({ ...prev, [name]: (name === 'total_paid' || name === 'pending_balance') ? Number(value) : value }));
  };

  const copyToClipboard = (text: string, type: 'bcp' | 'yape') => {
    navigator.clipboard.writeText(text);
    setIsCopied(prev => ({ ...prev, [type]: true }));
    setHasCopiedAny(true);
    setTimeout(() => setIsCopied(prev => ({ ...prev, [type]: false })), 2000);
  };

  const inputClasses = "w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 font-bold shadow-sm text-sm";
  const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1";

  return (
    <div className="relative">
      <motion.div 
        initial={isAdminView ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
        whileInView={isAdminView ? {} : { opacity: 1, scale: 1 }}
        className={`${isAdminView ? '' : 'bg-white rounded-[4rem] shadow-2xl border border-slate-100 p-10 md:p-16'} overflow-hidden max-w-5xl mx-auto`}
      >
        <form onSubmit={handlePreSubmit} className="space-y-12">
          {!isAdminView && (
            <div className="text-center mb-12">
               <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">RESERVA TU CUPO 2026</h2>
               <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Completa tus datos para iniciar la formación</p>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-12">
            {/* SECCIÓN 1: IDENTIDAD */}
            <div className="space-y-8">
              <h3 className="flex items-center gap-3 font-black text-xl text-slate-900 uppercase tracking-tighter border-b border-slate-100 pb-4">
                <User className="text-blue-600" size={24} /> {isAdminView ? "DATOS DEL ATLETA" : "FICHA DEL NIÑO"}
              </h3>
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClasses}>Nombres</label><input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" className={inputClasses} placeholder="..." /></div>
                  <div><label className={labelClasses}>Apellidos</label><input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" className={inputClasses} placeholder="..." /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClasses}>Fecha Nacimiento</label><input required name="birthDate" value={formData.birthDate} onChange={handleChange} type="date" className={inputClasses} /></div>
                  <div><label className={labelClasses}>Grupo de Edad</label>
                    <select name="scheduleId" value={formData.scheduleId} onChange={(e) => {
                      const sched = SCHEDULES.find(s => s.id === e.target.value);
                      setFormData(prev => ({ ...prev, scheduleId: e.target.value, category: sched?.category || '' }));
                    }} className={inputClasses}>
                      {SCHEDULES.map(s => <option key={s.id} value={s.id}>{s.category} ({s.age})</option>)}
                    </select>
                  </div>
                </div>
                {isAdminView && (
                   <div>
                     <label className={labelClasses}>Dirección de Domicilio</label>
                     <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
                       <input name="address" value={formData.address} onChange={handleChange} className={`${inputClasses} pl-12`} placeholder="Distrito / Calle" />
                     </div>
                   </div>
                )}
              </div>
            </div>

            {/* SECCIÓN 2: CONTROL ADMIN O APODERADO */}
            <div className="space-y-8">
              <h3 className="flex items-center gap-3 font-black text-xl text-slate-900 uppercase tracking-tighter border-b border-slate-100 pb-4">
                {isAdminView ? <CreditCard className="text-emerald-600" size={24}/> : <Phone className="text-emerald-600" size={24}/>}
                {isAdminView ? "CONTROL DE PAGOS" : "CONTACTO APODERADO"}
              </h3>
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2"><label className={labelClasses}>Nombre de Apoderado</label><input required name="parentName" value={formData.parentName} onChange={handleChange} type="text" className={inputClasses} placeholder="Nombre Mamá / Papá" /></div>
                  <div className="col-span-2"><label className={labelClasses}>WhatsApp de Contacto</label><input required name="parentPhone" value={formData.parentPhone} onChange={handleChange} type="tel" className={inputClasses} placeholder="9..." /></div>
                </div>
                
                {isAdminView && (
                  <>
                    <div className="grid grid-cols-2 gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <div>
                        <label className={labelClasses}>Monto Cobrado S/</label>
                        <input name="total_paid" value={formData.total_paid} onChange={handleChange} type="number" className={inputClasses} placeholder="0.00" />
                      </div>
                      <div>
                        <label className={labelClasses}>Modalidad</label>
                        <select name="modality" value={formData.modality} onChange={handleChange} className={inputClasses}>
                          <option value="Mensual Regular">Mensual Regular</option>
                          <option value="Becado">Becado</option>
                          <option value="Matrícula Solo">Matrícula Solo</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={labelClasses}>Notas y Observaciones</label>
                      <textarea name="comments" value={formData.comments} onChange={handleChange} className={`${inputClasses} h-28 pt-4 resize-none`} placeholder="Escribe aquí cualquier observación relevante..."></textarea>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 bg-slate-900 rounded-[3rem] shadow-2xl">
             <div className="text-center md:text-left">
               <p className="text-white font-black text-2xl uppercase tracking-tighter mb-1">
                 {isAdminView ? "REGISTRAR EN SISTEMA" : "FINALIZAR INSCRIPCIÓN"}
               </p>
               <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                 {isAdminView ? "Se generará carnet y código QR automáticamente" : "Tus datos se guardarán de forma segura"}
               </p>
             </div>
             <button type="submit" className="w-full md:w-auto px-16 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4 group">
               {isAdminView ? 'GRABAR MATRÍCULA' : 'CONTINUAR'} <Send size={20} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </form>
      </motion.div>

      {/* MODAL DE PAGO (SOLO PARA PADRES) */}
      <AnimatePresence>
        {!isAdminView && showPaymentModal && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPaymentModal(false)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-[4rem] p-12 shadow-2xl">
              <button onClick={() => setShowPaymentModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><X size={28} /></button>
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600"><CreditCard size={32} /></div>
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">PAGO DE RESERVA</h3>
                <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-2">Copia los datos de cuenta para pagar</p>
              </div>
              <div className="space-y-4 mb-10">
                <div className="bg-slate-50 p-6 rounded-[2rem] border flex justify-between items-center group">
                  <div><p className="text-[9px] font-black text-blue-600 uppercase">BCP Soles</p><p className="font-black text-slate-800 text-lg">191-98765432-0-12</p></div>
                  <button onClick={() => copyToClipboard('191-98765432-0-12', 'bcp')} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isCopied.bcp ? 'bg-emerald-500 text-white' : 'bg-white text-blue-600 border shadow-sm'}`}>{isCopied.bcp ? <Check size={20} /> : <Copy size={20} />}</button>
                </div>
                <div className="bg-emerald-50 p-6 rounded-[2rem] border flex justify-between items-center group">
                  <div><p className="text-[9px] font-black text-emerald-600 uppercase">Yape / Plin</p><p className="font-black text-emerald-800 text-lg">900 000 000</p></div>
                  <button onClick={() => copyToClipboard('900000000', 'yape')} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isCopied.yape ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-600 border shadow-sm'}`}>{isCopied.yape ? <Check size={20} /> : <Copy size={20} />}</button>
                </div>
              </div>
              <button disabled={!hasCopiedAny} onClick={finalizeRegistration} className={`w-full py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-widest transition-all ${hasCopiedAny ? 'bg-slate-900 text-white shadow-2xl' : 'bg-slate-100 text-slate-300'}`}>ENVIAR COMPROBANTE</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
