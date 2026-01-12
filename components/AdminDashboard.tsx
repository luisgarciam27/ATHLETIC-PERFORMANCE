
import React, { useState, useMemo, useEffect } from 'react';
import { Student, AcademyConfig, ClassSchedule, Payment, IntroSlide, StaffStory } from '../types';
import { 
  Search, X, LogOut, Users, 
  LayoutDashboard, DollarSign, AlertCircle, 
  Zap, Phone, Trash, Edit,
  Save, Image as ImageIcon, Wallet, ListChecks, Plus,
  Settings, MessageCircle, History, Check, Calendar, PlusCircle, Link as LinkIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegistrationForm } from './RegistrationForm';
import { supabaseFetch } from '../lib/supabase';

interface AdminDashboardProps {
  students: Student[];
  schedules: ClassSchedule[];
  config: AcademyConfig;
  onUpdateConfig: (config: AcademyConfig) => Promise<boolean>;
  onUpdateSchedules: (schedules: ClassSchedule[]) => Promise<boolean>;
  onRegister: (student: Student) => void;
  onUpdateStudent: (student: Student) => Promise<boolean>;
  onDelete: (id: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  students, schedules, config, onUpdateConfig, onUpdateSchedules, onRegister, onUpdateStudent, onDelete, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'schedules' | 'content' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStudent, setPaymentStudent] = useState<Student | null>(null);
  const [historyStudent, setHistoryStudent] = useState<Student | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  const [localConfig, setLocalConfig] = useState<AcademyConfig>({ ...config });
  const [localSchedules, setLocalSchedules] = useState<ClassSchedule[]>([...schedules]);

  useEffect(() => { setLocalConfig({ ...config }); }, [config]);
  useEffect(() => { setLocalSchedules([...schedules]); }, [schedules]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase()) || s.parentPhone.includes(searchTerm);
    });
  }, [students, searchTerm]);

  const fetchPayments = async (id: string) => {
    const res: any = await supabaseFetch('GET', 'payments', null, `student_id=eq.${id}&order=payment_date.desc`);
    if (res && !res.error) setPaymentHistory(res);
  };

  const handleSendReminder = (student: Student) => {
    const waNumber = student.parentPhone.replace(/\D/g, '');
    const message = `Hola ${student.parentName}, Academia Athletic te saluda. Recordamos el pago pendiente de S/ ${student.pending_balance} de ${student.firstName}. ¿Deseas regularizarlo hoy? ¡Gracias!`;
    window.open(`https://wa.me/51${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleRegisterPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!paymentStudent) return;
    const fd = new FormData(e.currentTarget);
    const amount = Number(fd.get('amount'));
    
    const res = await supabaseFetch('POST', 'payments', {
      student_id: paymentStudent.id,
      amount,
      method: fd.get('method') as any,
      concept: fd.get('concept') as string,
      payment_date: new Date().toISOString()
    });

    if (res && !res.error) {
      const newPending = Math.max(0, (paymentStudent.pending_balance || 0) - amount);
      const newTotalPaid = (paymentStudent.total_paid || 0) + amount;
      await onUpdateStudent({ 
        ...paymentStudent, 
        pending_balance: newPending, 
        total_paid: newTotalPaid, 
        paymentStatus: newPending <= 0 ? 'Paid' : 'Pending' 
      });
      setPaymentStudent(null);
      alert('Pago registrado con éxito.');
    }
  };

  const updateList = (key: keyof AcademyConfig, index: number, value: any) => {
    const list = [...(localConfig[key] as any[])];
    list[index] = value;
    setLocalConfig({ ...localConfig, [key]: list });
  };

  const removeFromList = (key: keyof AcademyConfig, index: number) => {
    const list = [...(localConfig[key] as any[])];
    list.splice(index, 1);
    setLocalConfig({ ...localConfig, [key]: list });
  };

  const addToList = (key: keyof AcademyConfig, defaultValue: any) => {
    const list = [...(localConfig[key] as any[])];
    list.push(defaultValue);
    setLocalConfig({ ...localConfig, [key]: list });
  };

  const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1";
  const inputClasses = "w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-bold transition-all shadow-inner";

  return (
    <div className="flex h-screen bg-white overflow-hidden text-slate-900 font-ubuntu">
      {/* SIDEBAR */}
      <aside className="w-80 bg-slate-950 m-4 rounded-[2.5rem] text-white flex flex-col p-8 shadow-2xl z-30 overflow-hidden relative shrink-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[80px] rounded-full -mr-16 -mt-16"></div>
        <div className="mb-12 flex items-center gap-4 px-2 relative z-10">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg"><Zap className="text-white fill-white" size={28} /></div>
          <div><span className="font-black text-xl tracking-tighter uppercase leading-none block">ATHLETIC</span><span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Admin v2.5</span></div>
        </div>
        <nav className="space-y-2 flex-grow relative z-10">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'students', icon: Users, label: 'Atletas & Pagos' },
            { id: 'schedules', icon: ListChecks, label: 'Ciclos & Fechas' },
            { id: 'content', icon: ImageIcon, label: 'Carrusel & Historias' },
            { id: 'settings', icon: Settings, label: 'Redes & Datos' }
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-white text-slate-900 shadow-xl scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={20}/> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto w-full flex items-center gap-4 px-6 py-4 text-rose-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-500/10 rounded-2xl transition-all"><LogOut size={20}/> Salir del Sistema</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow overflow-y-auto p-12 bg-slate-50 relative">
        <header className="flex justify-between items-end mb-16">
          <div><p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Administrador</p><h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">{activeTab === 'overview' ? 'Resumen' : activeTab === 'content' ? 'Contenidos' : activeTab}</h1></div>
          {(activeTab !== 'overview' && activeTab !== 'students') && (
            <button onClick={async () => {
              const ok = activeTab === 'schedules' ? await onUpdateSchedules(localSchedules) : await onUpdateConfig(localConfig);
              if (ok) alert('Sitio Web actualizado.');
            }} className="flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-2xl hover:bg-blue-700 transition-all active:scale-95"><Save size={24}/> Publicar Cambios</button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col group hover:border-blue-200 transition-all">
                <Users size={32} className="text-blue-600 mb-6"/><p className={labelClasses}>Total Alumnos</p><p className="text-7xl font-black tracking-tighter">{students.length}</p>
              </div>
              <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col group hover:border-emerald-200 transition-all">
                <DollarSign size={32} className="text-emerald-600 mb-6"/><p className={labelClasses}>Recaudado S/</p><p className="text-7xl font-black tracking-tighter">{students.reduce((acc, s) => acc + (s.total_paid || 0), 0)}</p>
              </div>
              <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col group hover:border-rose-200 transition-all">
                <AlertCircle size={32} className="text-rose-600 mb-6"/><p className={labelClasses}>Pendiente Cobro S/</p><p className="text-7xl font-black tracking-tighter">{students.reduce((acc, s) => acc + (s.pending_balance || 0), 0)}</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'students' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="relative flex-grow"><Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24}/><input type="text" placeholder="Buscar alumno..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-16 pr-8 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm"/></div>
                <button onClick={() => setShowRegisterModal(true)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase shadow-xl flex items-center gap-3 active:scale-95"><Plus size={20}/> Matrícula Admin</button>
              </div>
              <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-slate-100">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 border-b border-slate-100"><tr className="text-[10px] font-black uppercase tracking-widest"><th className="p-8">Alumno</th><th className="p-8">Apoderado</th><th className="p-8 text-center">Estado</th><th className="p-8 text-center">Acciones</th></tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredStudents.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-8"><p className="font-black text-slate-900 uppercase text-lg mb-1">{s.firstName} {s.lastName}</p><span className="text-[10px] font-black uppercase text-blue-500">{s.category}</span></td>
                        <td className="p-8"><p className="font-bold text-sm">{s.parentName}</p><div className="flex items-center gap-2 text-emerald-500 mt-1"><Phone size={12}/> <span className="text-[11px] font-black">{s.parentPhone}</span></div></td>
                        <td className="p-8 text-center"><div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest ${s.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{s.paymentStatus === 'Paid' ? 'CANCELADO' : `DEUDA S/ ${s.pending_balance}`}</div></td>
                        <td className="p-8 text-center"><div className="flex items-center justify-center gap-3">
                          <button title="Cobrar" onClick={() => setPaymentStudent(s)} className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><Wallet size={20}/></button>
                          <button title="Historial" onClick={() => { setHistoryStudent(s); fetchPayments(s.id); }} className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><History size={20}/></button>
                          {s.paymentStatus !== 'Paid' && <button title="Recordatorio WA" onClick={() => handleSendReminder(s)} className="p-4 bg-amber-50 text-amber-600 rounded-2xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"><MessageCircle size={20}/></button>}
                          <button title="Eliminar" onClick={() => onDelete(s.id)} className="p-4 bg-rose-50 text-rose-400 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"><Trash size={20}/></button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'schedules' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
              {localSchedules.map((s, idx) => (
                <div key={s.id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col space-y-6">
                   <div className="flex justify-between items-center mb-4"><div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl" style={{ backgroundColor: s.color }}><ListChecks size={24}/></div><input type="color" value={s.color} onChange={e => { const ns = [...localSchedules]; ns[idx].color = e.target.value; setLocalSchedules(ns); }} className="w-12 h-12 rounded-xl cursor-pointer" /></div>
                   <div><label className={labelClasses}>Categoría</label><input value={s.category} onChange={e => { const ns = [...localSchedules]; ns[idx].category = e.target.value; setLocalSchedules(ns); }} className={inputClasses}/></div>
                   <div className="grid grid-cols-2 gap-4">
                     <div><label className={labelClasses}>Precio S/</label><input type="number" value={s.price} onChange={e => { const ns = [...localSchedules]; ns[idx].price = Number(e.target.value); setLocalSchedules(ns); }} className={inputClasses}/></div>
                     <div><label className={labelClasses}>Horario</label><input value={s.time} onChange={e => { const ns = [...localSchedules]; ns[idx].time = e.target.value; setLocalSchedules(ns); }} className={inputClasses}/></div>
                   </div>
                   <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                     <div><label className={labelClasses}>F. Inicio Ciclo</label><input type="date" value={s.startDate} onChange={e => { const ns = [...localSchedules]; ns[idx].startDate = e.target.value; setLocalSchedules(ns); }} className={inputClasses}/></div>
                     <div><label className={labelClasses}>F. Fin Ciclo</label><input type="date" value={s.endDate} onChange={e => { const ns = [...localSchedules]; ns[idx].endDate = e.target.value; setLocalSchedules(ns); }} className={inputClasses}/></div>
                   </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-32">
              <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
                <div className="flex justify-between items-center"><h3 className="font-black text-slate-900 uppercase italic text-xl">Imágenes Hero (Carrusel)</h3><button onClick={() => addToList('heroImages', '')} className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase"><PlusCircle size={20}/> Añadir Imagen</button></div>
                <div className="grid gap-4">{localConfig.heroImages.map((url, i) => (
                  <div key={i} className="flex gap-4 items-center"><span className="text-[10px] font-black text-slate-300">#{i+1}</span><input value={url} onChange={e => updateList('heroImages', i, e.target.value)} className={inputClasses} placeholder="URL de imagen..."/><button onClick={() => removeFromList('heroImages', i)} className="p-4 text-rose-400"><Trash size={20}/></button></div>
                ))}</div>
              </div>

              <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
                <div className="flex justify-between items-center"><h3 className="font-black text-slate-900 uppercase italic text-xl">Fotos Sección "Nosotros"</h3><button onClick={() => addToList('aboutImages', '')} className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase"><PlusCircle size={20}/> Añadir Foto</button></div>
                <div className="grid md:grid-cols-2 gap-6">{localConfig.aboutImages.map((url, i) => (
                  <div key={i} className="flex gap-4 items-center"><input value={url} onChange={e => updateList('aboutImages', i, e.target.value)} className={inputClasses} placeholder="URL de imagen..."/><button onClick={() => removeFromList('aboutImages', i)} className="p-4 text-rose-400"><Trash size={20}/></button></div>
                ))}</div>
              </div>

              <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
                <div className="flex justify-between items-center"><h3 className="font-black text-slate-900 uppercase italic text-xl">Slides de la Intro</h3><button onClick={() => addToList('introSlides', { id: Math.random().toString(), type: 'image', url: '', title: 'NUEVO', subtitle: 'SLIDE', duration: 4000 })} className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase"><PlusCircle size={20}/> Añadir Slide</button></div>
                <div className="grid md:grid-cols-2 gap-8">{localConfig.introSlides.map((slide, i) => (
                  <div key={slide.id} className="p-6 bg-slate-50 rounded-3xl border space-y-4">
                    <div className="flex justify-between"><div><label className={labelClasses}>Título</label><input value={slide.title} onChange={e => { const list = [...localConfig.introSlides]; list[i].title = e.target.value; setLocalConfig({...localConfig, introSlides: list})}} className={inputClasses}/></div><button onClick={() => removeFromList('introSlides', i)} className="text-rose-400"><Trash size={20}/></button></div>
                    <div><label className={labelClasses}>URL Multimedia</label><input value={slide.url} onChange={e => { const list = [...localConfig.introSlides]; list[i].url = e.target.value; setLocalConfig({...localConfig, introSlides: list})}} className={inputClasses}/></div>
                  </div>
                ))}</div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-32">
              <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 grid md:grid-cols-2 gap-8">
                <div className="md:col-span-2"><h3 className="font-black text-slate-900 uppercase italic tracking-tighter text-xl">Datos de Contacto & Redes</h3></div>
                <div><label className={labelClasses}>Celular WhatsApp (9 dígitos)</label><input value={localConfig.socialWhatsapp} onChange={e => setLocalConfig({...localConfig, socialWhatsapp: e.target.value})} className={inputClasses} placeholder="999888777"/></div>
                <div><label className={labelClasses}>Instagram Link</label><input value={localConfig.socialInstagram} onChange={e => setLocalConfig({...localConfig, socialInstagram: e.target.value})} className={inputClasses}/></div>
                <div><label className={labelClasses}>TikTok Link</label><input value={localConfig.socialTiktok} onChange={e => setLocalConfig({...localConfig, socialTiktok: e.target.value})} className={inputClasses}/></div>
                <div><label className={labelClasses}>Facebook Link</label><input value={localConfig.socialFacebook} onChange={e => setLocalConfig({...localConfig, socialFacebook: e.target.value})} className={inputClasses}/></div>
                <div><label className={labelClasses}>Email Institucional</label><input value={localConfig.contactEmail} onChange={e => setLocalConfig({...localConfig, contactEmail: e.target.value})} className={inputClasses}/></div>
                <div><label className={labelClasses}>Dirección Principal</label><input value={localConfig.contactAddress} onChange={e => setLocalConfig({...localConfig, contactAddress: e.target.value})} className={inputClasses}/></div>
                <div className="md:col-span-2"><label className={labelClasses}>URL Logo (Transparente)</label><input value={localConfig.logoUrl} onChange={e => setLocalConfig({...localConfig, logoUrl: e.target.value})} className={inputClasses}/></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* MODALES */}
      <AnimatePresence>
        {paymentStudent && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPaymentStudent(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"/>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-[3rem] p-12 shadow-2xl border border-emerald-100">
               <button onClick={() => setPaymentStudent(null)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900"><X size={28}/></button>
               <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-8">NUEVO PAGO</h3>
               <p className="text-slate-500 font-bold mb-8 uppercase text-[10px] tracking-widest bg-slate-50 p-4 rounded-xl">Atleta: {paymentStudent.firstName} {paymentStudent.lastName}</p>
               <form onSubmit={handleRegisterPayment} className="space-y-6">
                  <div><label className={labelClasses}>Monto a Cobrar S/</label><input required name="amount" type="number" defaultValue={paymentStudent.pending_balance} className={inputClasses}/></div>
                  <div><label className={labelClasses}>Concepto</label><input required name="concept" defaultValue="Mensualidad Ciclo 2026" className={inputClasses}/></div>
                  <div><label className={labelClasses}>Canal</label><select name="method" className={inputClasses}><option value="Yape">Yape</option><option value="Plin">Plin</option><option value="Efectivo">Efectivo</option><option value="BCP">BCP Transferencia</option></select></div>
                  <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-emerald-700 transition-all">Registrar Transacción</button>
               </form>
            </motion.div>
          </div>
        )}

        {historyStudent && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setHistoryStudent(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"/>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-white rounded-[3rem] p-12 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
               <button onClick={() => setHistoryStudent(null)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900"><X size={28}/></button>
               <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-8 italic">MOVIMIENTOS DE PAGO</h3>
               <p className="text-slate-500 font-bold mb-8 uppercase text-[10px] tracking-widest bg-slate-50 p-4 rounded-xl">Atleta: {historyStudent.firstName} {historyStudent.lastName}</p>
               <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                 {paymentHistory.length > 0 ? paymentHistory.map(p => (
                   <div key={p.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group">
                     <div><p className="font-black text-slate-900 uppercase text-xl">S/ {p.amount}</p><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(p.payment_date).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })} • {p.method}</p></div>
                     <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-black text-[9px] uppercase tracking-widest">PAGO VÁLIDO</span>
                   </div>
                 )) : <p className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest">Sin registros de pago.</p>}
               </div>
            </motion.div>
          </div>
        )}

        {showRegisterModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRegisterModal(false)} className="fixed inset-0 bg-slate-950/90 backdrop-blur-md"/>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl p-12 overflow-y-auto max-h-[90vh]">
              <RegistrationForm config={config} isAdminView={true} onRegister={(student) => { onRegister(student); setShowRegisterModal(false); }} />
              <button onClick={() => setShowRegisterModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900"><X size={32}/></button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
