
import React, { useState, useEffect } from 'react';
import { Student, AcademyConfig } from '../types';
import { SCHEDULES } from '../constants';
import { Send, User, Smartphone, DollarSign, PlusCircle, RotateCcw, CheckCircle2, Copy, X, CreditCard, Plus } from 'lucide-react';
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [isBrotherMode, setIsBrotherMode] = useState(false);
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
    paymentStatus: 'Pending' as 'Paid' | 'Pending',
    adminMethod: 'Yape' 
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

  const finalizeRegistration = () => {
    const selectedSched = SCHEDULES.find(s => s.id === formData.scheduleId);
    const monthlyPrice = selectedSched?.price || 0;
    
    // Si es admin, usa el monto que pongan, si es público, asume 50 de reserva
    const currentPaid = isAdminView ? formData.total_paid : 50; 
    const currentPending = isAdminView ? Math.max(0, monthlyPrice - formData.total_paid) : monthlyPrice - 50;

    const newStudent: Student = {
      ...formData,
      id: isAdminView ? undefined as any : Math.random().toString(36).substr(2, 9),
      registrationDate: new Date().toISOString(),
      paymentStatus: isAdminView && formData.total_paid >= monthlyPrice ? 'Paid' : 'Pending',
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      qrCode: `ATH-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      total_paid: currentPaid,
      pending_balance: currentPending
    };

    onRegister(newStudent);

    if (!isAdminView) {
      const waNumber = (config?.socialWhatsapp || '51900000000').replace(/\D/g, '');
      const text = `¡Hola!%20Registro%20a%20*${formData.firstName}%20${formData.lastName}*%20en%20Athletic.%0AGrupo:%20${formData.category}.%0AApoderado:%20${formData.parentName}.%0A%0AAdjunto%20comprobante%20de%20reserva.`;
      window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
      setShowPaymentModal(false);
      setIsSuccess(true);
    } else {
      resetForm(true); 
    }
  };

  const resetForm = (isAnotherChild = false) => {
    if (isAnotherChild) {
      setIsBrotherMode(true);
      setFormData(prev => ({
        ...prev,
        firstName: '',
        lastName: '',
        birthDate: '',
        total_paid: 0,
        comments: '',
        paymentStatus: 'Pending'
      }));
    } else {
      setIsBrotherMode(false);
      setFormData({
        firstName: '', lastName: '', birthDate: '',
        category: initialCategory || SCHEDULES[0].category,
        modality: 'Mensual Regular', parentName: '', parentPhone: '',
        address: '', scheduleId: SCHEDULES.find(s => s.category === initialCategory)?.id || SCHEDULES[0].id,
        comments: '', total_paid: 0, paymentStatus: 'Pending',
        adminMethod: 'Yape'
      });
    }
    setIsSuccess(false);
    setHasCopiedAny(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: (name === 'total_paid') ? Number(value) : value }));
  };

  const inputClasses = "w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 font-bold shadow-sm text-sm disabled:bg-slate-50 disabled:text-slate-400";
  const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1";

  if (!isAdminView && isSuccess) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[4rem] shadow-2xl p-16 text-center max-w-2xl mx-auto border border-emerald-100">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-500"><CheckCircle2 size={48} /></div>
        <h2 className="text-4xl font-black text-slate-900 uppercase mb-4 tracking-tighter italic">¡REGISTRO EXITOSO!</h2>
        <p className="text-slate-500 font-medium mb-10 leading-relaxed">¿Deseas matricular a otro hijo? Hemos guardado tus datos de contacto para que sea más rápido.</p>
        <div className="flex flex-col gap-4">
          <button onClick={() => resetForm(true)} className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-4 hover:bg-blue-700 transition-all"><PlusCircle size={20}/> MATRICULAR HERMANO</button>
          <button onClick={() => resetForm(false)} className="w-full py-6 bg-slate-100 text-slate-500 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-200 transition-all">TERMINAR</button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative">
      <motion.div initial={{ opacity: 1 }} className={`${isAdminView ? '' : 'bg-white rounded-[4rem] shadow-2xl border border-slate-100 p-10 md:p-16'} overflow-hidden max-w-5xl mx-auto`}>
        <form onSubmit={(e) => { e.preventDefault(); isAdminView ? finalizeRegistration() : setShowPaymentModal(true); }} className="space-y-12">
          {!isAdminView && (
            <div className="text-center mb-12">
               <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4 italic leading-none">{isBrotherMode ? 'NUEVO HERMANO' : 'FICHA DE INSCRIPCIÓN'}</h2>
               <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">RESERVA TU CUPO PARA EL CICLO 2026</p>
            </div>
          )}
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="flex items-center gap-3 font-black text-xl text-slate-900 uppercase tracking-tighter border-b border-slate-100 pb-4"><User className="text-blue-600" size={24} /> Datos del Atleta</h3>
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClasses}>Nombres</label><input required name="firstName" value={formData.firstName} onChange={handleChange} className={inputClasses}/></div>
                  <div><label className={labelClasses}>Apellidos</label><input required name="lastName" value={formData.lastName} onChange={handleChange} className={inputClasses}/></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClasses}>F. Nacimiento</label><input required name="birthDate" value={formData.birthDate} onChange={handleChange} type="date" className={inputClasses} /></div>
                  <div><label className={labelClasses}>Categoría</label>
                    <select name="scheduleId" value={formData.scheduleId} onChange={(e) => { const s = SCHEDULES.find(x => x.id === e.target.value); setFormData(prev => ({ ...prev, scheduleId: e.target.value, category: s?.category || '' })); }} className={inputClasses}>
                      {SCHEDULES.map(s => <option key={s.id} value={s.id}>{s.category}</option>)}
                    </select>
                  </div>
                </div>
                <div><label className={labelClasses}>Dirección</label><input required disabled={isBrotherMode} name="address" value={formData.address} onChange={handleChange} className={inputClasses} /></div>
              </div>
            </div>
            <div className="space-y-8">
              <h3 className="flex items-center gap-3 font-black text-xl text-slate-900 uppercase tracking-tighter border-b border-slate-100 pb-4"><Smartphone className="text-emerald-600" size={24}/> Apoderado</h3>
              <div className="grid gap-6">
                <div><label className={labelClasses}>Nombre Completo</label><input required disabled={isBrotherMode} name="parentName" value={formData.parentName} onChange={handleChange} className={inputClasses}/></div>
                <div><label className={labelClasses}>WhatsApp</label><input required disabled={isBrotherMode} name="parentPhone" value={formData.parentPhone} onChange={handleChange} type="tel" maxLength={9} className={inputClasses} placeholder="9XXXXXXXX" /></div>
                
                {isAdminView && (
                  <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 space-y-6">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b pb-2">Sección de Cobro Manual</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={labelClasses}>S/ Recibido</label><input name="total_paid" value={formData.total_paid} onChange={handleChange} type="number" className={inputClasses}/></div>
                      <div><label className={labelClasses}>Método</label>
                        <select name="adminMethod" value={formData.adminMethod} onChange={handleChange} className={inputClasses}>
                          <option value="Yape">Yape</option>
                          <option value="Plin">Plin</option>
                          <option value="BCP">BCP Transferencia</option>
                          <option value="Efectivo">Efectivo / Caja</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button type="submit" className="w-full py-7 bg-blue-600 text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4 active:scale-95">
            {isAdminView ? 'CONFIRMAR REGISTRO MANUAL' : 'ENVIAR SOLICITUD DE MATRÍCULA'} <Send size={20} />
          </button>
        </form>
      </motion.div>

      <AnimatePresence>
        {!isAdminView && showPaymentModal && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPaymentModal(false)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-[4rem] p-12 shadow-2xl">
              <button onClick={() => setShowPaymentModal(false)} className="absolute top-8 right-8 text-slate-400"><X size={24}/></button>
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600"><DollarSign size={32} /></div>
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">RESERVA DE CUPO</h3>
                <p className="text-slate-400 font-bold uppercase text-[9px] mt-3 italic tracking-widest">Reserva tu cupo hoy con S/ 50.00</p>
              </div>

              <div className="space-y-4 mb-10">
                {/* YAPE - VISIBLE EN WEB */}
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600"><Plus size={20}/></div>
                    <div><p className="text-[9px] font-black text-blue-600 uppercase italic leading-none mb-1">Yape Oficial</p><p className="font-black text-slate-800 text-lg leading-none mb-1">{config?.yapeNumber || '900 000 000'}</p><p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{config?.yapeName || 'ATHLETIC PERFORMANCE'}</p></div>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(config?.yapeNumber || '900000000'); alert('Número copiado'); setHasCopiedAny(true); }} className="w-12 h-12 rounded-2xl bg-white border flex items-center justify-center text-blue-600 shadow-sm hover:bg-blue-600 hover:text-white transition-all"><Copy size={20} /></button>
                </div>

                {/* BCP - VISIBLE EN WEB */}
                <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600"><CreditCard size={20}/></div>
                    <div><p className="text-[9px] font-black text-emerald-600 uppercase italic leading-none mb-1">Transferencia BCP</p><p className="font-black text-slate-800 text-sm leading-none mb-1">{config?.bcpAccount || '191-XXXXXXXX-0-XX'}</p><p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{config?.bcpName || 'ATHLETIC PERFORMANCE SAC'}</p></div>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(config?.bcpAccount || '19198765432012'); alert('Cuenta copiada'); setHasCopiedAny(true); }} className="w-12 h-12 rounded-2xl bg-white border flex items-center justify-center text-emerald-600 shadow-sm hover:bg-emerald-600 hover:text-white transition-all"><Copy size={20} /></button>
                </div>
              </div>
              
              <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 mb-8">
                <p className="text-[9px] font-bold text-amber-800 uppercase leading-relaxed text-center">
                  * Copia los datos, realiza el pago y luego pulsa el botón inferior para confirmar tu inscripción por WhatsApp adjuntando tu captura.
                </p>
              </div>

              <button disabled={!hasCopiedAny} onClick={finalizeRegistration} className={`w-full py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-widest transition-all ${hasCopiedAny ? 'bg-slate-900 text-white shadow-2xl hover:bg-blue-600' : 'bg-slate-100 text-slate-300'}`}>CONFIRMAR MATRÍCULA</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
