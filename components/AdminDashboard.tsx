
import React, { useState, useMemo, useEffect } from 'react';
import { Student, AcademyConfig, ClassSchedule, Payment } from '../types';
import { 
  Search, X, LogOut, Users, 
  LayoutDashboard, DollarSign, AlertCircle, 
  Zap, Phone, Trash,
  Save, Image as ImageIcon, Wallet, Trash2, ListChecks, Plus,
  Settings, UserPlus, Share2,
  CreditCard, CheckCircle2, Bell, Edit3, Video, Music2, Mail, Facebook, Instagram, History, Receipt, ArrowDownCircle, ArrowUpCircle
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
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'schedules' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStudent, setPaymentStudent] = useState<Student | null>(null);
  const [historyStudent, setHistoryStudent] = useState<Student | null>(null);
  const [studentPayments, setStudentPayments] = useState<Payment[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'Paid' | 'Pending'>('all');
  
  const [localConfig, setLocalConfig] = useState<AcademyConfig>({ ...config });
  const [localSchedules, setLocalSchedules] = useState<ClassSchedule[]>([...schedules]);

  useEffect(() => { setLocalConfig({ ...config }); }, [config]);
  useEffect(() => { setLocalSchedules([...schedules]); }, [schedules]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || s.parentPhone.includes(searchTerm) || (s.qrCode && s.qrCode.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPayment = paymentFilter === 'all' || s.paymentStatus === paymentFilter;
      return matchesSearch && matchesPayment;
    });
  }, [students, searchTerm, paymentFilter]);

  const loadPaymentHistory = async (studentId: string) => {
    const res: any = await supabaseFetch('GET', 'payments', null, `student_id=eq.${studentId}&order=payment_date.desc`);
    if (res && !res.error) setStudentPayments(res);
  };

  useEffect(() => {
    if (historyStudent) loadPaymentHistory(historyStudent.id);
  }, [historyStudent]);

  const handleRegisterPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!paymentStudent) return;
    const fd = new FormData(e.currentTarget);
    const amount = Number(fd.get('amount'));
    const method = fd.get('method') as any;
    const concept = fd.get('concept') as string;

    const paymentPayload = {
      student_id: paymentStudent.id,
      amount,
      method,
      concept,
      payment_date: new Date().toISOString()
    };
    const res = await supabaseFetch('POST', 'payments', paymentPayload);

    if (res && !res.error) {
      const newPending = Math.max(0, (paymentStudent.pending_balance || 0) - amount);
      const newTotalPaid = (paymentStudent.total_paid || 0) + amount;
      
      const updatedStudent: Student = {
        ...paymentStudent,
        pending_balance: newPending,
        total_paid: newTotalPaid,
        paymentStatus: newPending <= 0 ? 'Paid' : 'Pending'
      };
      
      await onUpdateStudent(updatedStudent);
      setPaymentStudent(null);
      alert('Pago registrado.');
    }
  };

  const handleAnularPago = async (payment: Payment) => {
    if (!window.confirm('¿Anular pago? Se sumará a la deuda.')) return;
    const delRes = await supabaseFetch('DELETE', 'payments', { id: payment.id });
    if (delRes && !delRes.error) {
      const student = students.find(s => s.id === payment.student_id);
      if (student) {
        const updated: Student = {
          ...student,
          pending_balance: (student.pending_balance || 0) + payment.amount,
          total_paid: Math.max(0, (student.total_paid || 0) - payment.amount),
          paymentStatus: 'Pending'
        };
        await onUpdateStudent(updated);
        if (historyStudent) loadPaymentHistory(historyStudent.id);
      }
    }
  };

  const handleSaveAll = async () => {
    if (activeTab === 'settings') {
      const success = await onUpdateConfig(localConfig);
      if (success) alert('Configuración web guardada.');
    } else if (activeTab === 'schedules') {
      const success = await onUpdateSchedules(localSchedules);
      if (success) alert('Horarios actualizados.');
    }
  };

  const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1";
  const inputClasses = "w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-bold transition-all shadow-inner";

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-slate-900 font-ubuntu">
      {/* SIDEBAR */}
      <aside className="w-80 bg-slate-900 m-4 rounded-[3rem] text-white flex flex-col p-8 shadow-2xl z-30">
        <div className="mb-12 flex items-center gap-4 px-2">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg"><Zap className="text-white fill-white" size={28} /></div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter uppercase leading-none">ATHLETIC ÉLITE</span>
            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Dashboard Admin</span>
          </div>
        </div>
        <nav className="space-y-2 flex-grow">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Resumen' },
            { id: 'students', icon: Users, label: 'Alumnos' },
            { id: 'schedules', icon: ListChecks, label: 'Ciclos / Horarios' },
            { id: 'settings', icon: Settings, label: 'Personalización Web' }
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] font-bold text-sm transition-all ${activeTab === item.id ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={20}/> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto w-full flex items-center gap-4 px-5 py-4 text-rose-400 font-bold text-sm hover:bg-rose-500/10 rounded-[1.5rem] transition-all"><LogOut size={20}/> Salir</button>
      </aside>

      <main className="flex-grow overflow-y-auto p-12">
        <header className="flex justify-between items-end mb-12">
          <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">
            {activeTab === 'overview' && 'Estadísticas'}
            {activeTab === 'students' && 'Matrícula Pro'}
            {activeTab === 'schedules' && 'Planificación'}
            {activeTab === 'settings' && 'Gestor de Contenidos'}
          </h1>
          {(activeTab === 'settings' || activeTab === 'schedules') && (
            <button onClick={handleSaveAll} className="flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-2xl hover:bg-blue-700 transition-all"><Save size={24}/> Guardar Todo</button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-3 gap-8">
              <div onClick={() => setActiveTab('students')} className="bg-white p-12 rounded-[4rem] shadow-xl border border-white hover:scale-105 transition-all cursor-pointer">
                <Users size={32} className="text-blue-600 mb-8"/>
                <p className={labelClasses}>Alumnos Totales</p>
                <p className="text-6xl font-black tracking-tighter">{students.length}</p>
              </div>
              <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white">
                <DollarSign size={32} className="text-emerald-600 mb-8"/>
                <p className={labelClasses}>Total Recaudado</p>
                <p className="text-6xl font-black tracking-tighter">S/ {students.reduce((acc, s) => acc + (s.total_paid || 0), 0)}</p>
              </div>
              <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white">
                <AlertCircle size={32} className="text-rose-600 mb-8"/>
                <p className={labelClasses}>Deuda Pendiente</p>
                <p className="text-6xl font-black tracking-tighter">S/ {students.reduce((acc, s) => acc + (s.pending_balance || 0), 0)}</p>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-8 pb-32">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[3rem] shadow-xl border border-white">
                <div className="flex bg-slate-50 rounded-2xl p-1 border border-slate-100">
                  <button onClick={() => setPaymentFilter('all')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${paymentFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>Todos</button>
                  <button onClick={() => setPaymentFilter('Pending')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${paymentFilter === 'Pending' ? 'bg-rose-500 text-white' : 'text-slate-400'}`}>Deudores</button>
                </div>
                <div className="flex gap-4 flex-grow max-w-2xl">
                  <div className="relative flex-grow">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20}/>
                    <input type="text" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm"/>
                  </div>
                  <button onClick={() => setShowRegisterModal(true)} className="px-8 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl"><UserPlus size={18}/> Nuevo</button>
                </div>
              </div>

              <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="p-8 text-[10px] font-black uppercase">Atleta</th>
                      <th className="p-8 text-[10px] font-black uppercase">Padre/Madre</th>
                      <th className="p-8 text-[10px] font-black uppercase text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredStudents.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-8">
                          <p className="font-black text-slate-900 uppercase text-sm">{s.firstName} {s.lastName}</p>
                          <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">{s.category}</span>
                        </td>
                        <td className="p-8">
                          <p className="font-bold text-xs text-slate-700">{s.parentName}</p>
                          <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-1"><Phone size={10}/> {s.parentPhone}</p>
                        </td>
                        <td className="p-8 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => setPaymentStudent(s)} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white"><Wallet size={16}/></button>
                            <button onClick={() => setHistoryStudent(s)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white"><History size={16}/></button>
                            <button onClick={() => setEditingStudent(s)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white"><Edit3 size={16}/></button>
                            <button onClick={() => onDelete(s.id)} className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className="grid lg:grid-cols-2 gap-8 pb-32">
              {localSchedules.map((sched, idx) => (
                <div key={sched.id} className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-white relative">
                  <div className="absolute top-8 right-8 flex gap-3">
                     <input type="color" value={sched.color} onChange={e => { const nl = [...localSchedules]; nl[idx].color = e.target.value; setLocalSchedules(nl); }} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"/>
                     <button onClick={() => setLocalSchedules(localSchedules.filter((_, i) => i !== idx))} className="text-rose-300 hover:text-rose-600"><Trash2 size={24}/></button>
                  </div>
                  <div className="grid gap-6">
                    <div><label className={labelClasses}>Categoría</label><input value={sched.category} onChange={e => { const nl = [...localSchedules]; nl[idx].category = e.target.value; setLocalSchedules(nl); }} className={inputClasses}/></div>
                    <div className="grid grid-cols-2 gap-6">
                      <div><label className={labelClasses}>Edad</label><input value={sched.age} onChange={e => { const nl = [...localSchedules]; nl[idx].age = e.target.value; setLocalSchedules(nl); }} className={inputClasses}/></div>
                      <div><label className={labelClasses}>Precio S/</label><input type="number" value={sched.price} onChange={e => { const nl = [...localSchedules]; nl[idx].price = Number(e.target.value); setLocalSchedules(nl); }} className={inputClasses}/></div>
                    </div>
                    <div><label className={labelClasses}>Horario</label><input value={sched.time} onChange={e => { const nl = [...localSchedules]; nl[idx].time = e.target.value; setLocalSchedules(nl); }} className={inputClasses}/></div>
                  </div>
                </div>
              ))}
              <button onClick={() => setLocalSchedules([...localSchedules, { id: Math.random().toString(), category: 'Nuevo', age: '3-10', days: [], time: '4pm', duration: '60 min', price: 150, objective: '', color: '#3b82f6' }])} className="p-12 border-4 border-dashed border-slate-200 rounded-[3.5rem] text-slate-300 hover:text-blue-500 flex flex-col items-center gap-4 bg-slate-50/20"><Plus size={48}/> Nuevo Ciclo</button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-16 pb-40">
               {/* BLOQUE 1: REDES Y CONTACTO */}
               <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white space-y-10">
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-3"><Share2 size={20} className="text-emerald-500"/> Redes y Contacto</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="md:col-span-2"><label className={labelClasses}>Mensaje Bienvenida</label><input value={localConfig.welcomeMessage} onChange={e => setLocalConfig({...localConfig, welcomeMessage: e.target.value})} className={inputClasses}/></div>
                    <div><label className={labelClasses}>WhatsApp</label><input value={localConfig.socialWhatsapp} onChange={e => setLocalConfig({...localConfig, socialWhatsapp: e.target.value})} className={inputClasses}/></div>
                    <div><label className={labelClasses}>Facebook</label><input value={localConfig.socialFacebook} onChange={e => setLocalConfig({...localConfig, socialFacebook: e.target.value})} className={inputClasses}/></div>
                    <div><label className={labelClasses}>Instagram</label><input value={localConfig.socialInstagram} onChange={e => setLocalConfig({...localConfig, socialInstagram: e.target.value})} className={inputClasses}/></div>
                    <div><label className={labelClasses}>TikTok</label><input value={localConfig.socialTiktok} onChange={e => setLocalConfig({...localConfig, socialTiktok: e.target.value})} className={inputClasses}/></div>
                    <div><label className={labelClasses}>Email</label><input value={localConfig.contactEmail} onChange={e => setLocalConfig({...localConfig, contactEmail: e.target.value})} className={inputClasses}/></div>
                    <div className="md:col-span-2"><label className={labelClasses}>Dirección</label><input value={localConfig.contactAddress} onChange={e => setLocalConfig({...localConfig, contactAddress: e.target.value})} className={inputClasses}/></div>
                  </div>
               </div>

               {/* BLOQUE 2: GALERÍAS */}
               <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white space-y-10">
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-3"><ImageIcon size={20} className="text-rose-500"/> Imágenes Principales</h3>
                  <div className="space-y-6">
                    <p className={labelClasses}>Hero Banners</p>
                    <div className="grid md:grid-cols-3 gap-4">
                      {localConfig.heroImages.map((url, i) => (
                        <div key={i} className="relative group rounded-3xl overflow-hidden aspect-video">
                          <img src={url} className="w-full h-full object-cover" />
                          <button onClick={() => setLocalConfig({...localConfig, heroImages: localConfig.heroImages.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                        </div>
                      ))}
                      <button onClick={() => { const u = prompt('URL:'); if(u) setLocalConfig({...localConfig, heroImages: [...localConfig.heroImages, u]}); }} className="aspect-video border-2 border-dashed rounded-3xl flex items-center justify-center text-slate-300 font-black text-3xl">+</button>
                    </div>
                  </div>
                  <div className="space-y-6 pt-10 border-t">
                    <p className={labelClasses}>Sección Nosotros</p>
                    <div className="grid md:grid-cols-4 gap-4">
                      {localConfig.aboutImages.map((url, i) => (
                        <div key={i} className="relative group rounded-3xl overflow-hidden aspect-square">
                          <img src={url} className="w-full h-full object-cover" />
                          <button onClick={() => setLocalConfig({...localConfig, aboutImages: localConfig.aboutImages.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                        </div>
                      ))}
                      <button onClick={() => { const u = prompt('URL:'); if(u) setLocalConfig({...localConfig, aboutImages: [...localConfig.aboutImages, u]}); }} className="aspect-square border-2 border-dashed rounded-3xl flex items-center justify-center text-slate-300 font-black text-3xl">+</button>
                    </div>
                  </div>
               </div>

               {/* BLOQUE 3: EXPERIENCIA */}
               <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white space-y-10">
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-3"><Video size={20} className="text-blue-500"/> Intro y Staff</h3>
                  <div className="space-y-6">
                    <p className={labelClasses}>Slides del Portal</p>
                    {localConfig.introSlides.map((slide, i) => (
                      <div key={slide.id} className="p-8 bg-slate-50 rounded-[2.5rem] border flex items-center gap-8">
                        <div className="w-32 h-40 bg-slate-200 rounded-3xl overflow-hidden flex-shrink-0">
                          {slide.type === 'video' ? <video src={slide.url} className="w-full h-full object-cover" muted /> : <img src={slide.url} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-grow grid gap-4">
                          <input value={slide.url} onChange={e => { const ns = [...localConfig.introSlides]; ns[i].url = e.target.value; setLocalConfig({...localConfig, introSlides: ns}); }} className={inputClasses} placeholder="URL Video o Imagen"/>
                          <div className="grid grid-cols-2 gap-4">
                            <input value={slide.title} onChange={e => { const ns = [...localConfig.introSlides]; ns[i].title = e.target.value; setLocalConfig({...localConfig, introSlides: ns}); }} className={inputClasses} placeholder="Título"/>
                            <input value={slide.subtitle} onChange={e => { const ns = [...localConfig.introSlides]; ns[i].subtitle = e.target.value; setLocalConfig({...localConfig, introSlides: ns}); }} className={inputClasses} placeholder="Subtítulo"/>
                          </div>
                        </div>
                        <button onClick={() => setLocalConfig({...localConfig, introSlides: localConfig.introSlides.filter((_, idx) => idx !== i)})} className="p-4 bg-rose-50 text-rose-500 rounded-2xl"><Trash2/></button>
                      </div>
                    ))}
                    <button onClick={() => setLocalConfig({...localConfig, introSlides: [...localConfig.introSlides, { id: Math.random().toString(), type: 'video', url: '', title: 'NUEVO', subtitle: 'SLIDE', duration: 5000 }]})} className="w-full py-4 border-2 border-dashed rounded-[2rem] text-slate-300">+ Añadir Slide</button>
                  </div>
                  <div className="space-y-6 pt-10 border-t">
                    <p className={labelClasses}>Staff (Historias)</p>
                    {localConfig.staffStories.map((story, i) => (
                      <div key={story.id} className="p-8 bg-slate-50 rounded-[2.5rem] border flex items-center gap-8">
                         <div className="w-20 h-20 rounded-full border-2 border-blue-500 overflow-hidden flex-shrink-0">
                           <img src={story.url} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-grow grid grid-cols-2 gap-4">
                           <input value={story.name} onChange={e => { const nst = [...localConfig.staffStories]; nst[i].name = e.target.value; setLocalConfig({...localConfig, staffStories: nst}); }} className={inputClasses} placeholder="Nombre"/>
                           <input value={story.role} onChange={e => { const nst = [...localConfig.staffStories]; nst[i].role = e.target.value; setLocalConfig({...localConfig, staffStories: nst}); }} className={inputClasses} placeholder="Cargo"/>
                           <input value={story.url} onChange={e => { const nst = [...localConfig.staffStories]; nst[i].url = e.target.value; setLocalConfig({...localConfig, staffStories: nst}); }} className={`${inputClasses} col-span-2`} placeholder="URL Foto"/>
                         </div>
                         <button onClick={() => setLocalConfig({...localConfig, staffStories: localConfig.staffStories.filter((_, idx) => idx !== i)})} className="p-4 bg-rose-50 text-rose-500 rounded-2xl"><Trash2/></button>
                      </div>
                    ))}
                    <button onClick={() => setLocalConfig({...localConfig, staffStories: [...localConfig.staffStories, { id: Math.random().toString(), type: 'image', url: '', name: 'Nuevo Prof', role: 'DT', duration: 5000 }]})} className="w-full py-4 border-2 border-dashed rounded-[2rem] text-slate-300">+ Añadir Miembro</button>
                  </div>
               </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* MODALES: COBRO, HISTORIAL, EDICIÓN, MATRÍCULA */}
      <AnimatePresence>
        {paymentStudent && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPaymentStudent(null)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"/>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-[4rem] p-12 shadow-2xl">
              <button onClick={() => setPaymentStudent(null)} className="absolute top-8 right-8 text-slate-400"><X size={24}/></button>
              <h2 className="text-3xl font-black uppercase text-center mb-10 tracking-tighter">Registrar Cobro</h2>
              <form onSubmit={handleRegisterPayment} className="space-y-6">
                <div><label className={labelClasses}>Monto S/</label><input required name="amount" type="number" defaultValue={paymentStudent.pending_balance} className={inputClasses} /></div>
                <div><label className={labelClasses}>Método</label><select name="method" className={inputClasses}><option value="Yape">Yape</option><option value="Plin">Plin</option><option value="BCP">Transferencia</option><option value="Efectivo">Efectivo</option></select></div>
                <div><label className={labelClasses}>Concepto</label><select name="concept" className={inputClasses}><option value="Mensualidad">Mensualidad</option><option value="Matrícula">Matrícula</option><option value="Uniforme">Uniforme</option></select></div>
                <button type="submit" className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-xs shadow-2xl hover:bg-emerald-700 transition-all">Confirmar Pago</button>
              </form>
            </motion.div>
          </div>
        )}

        {historyStudent && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setHistoryStudent(null)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"/>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-white rounded-[4rem] p-12 shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
              <button onClick={() => setHistoryStudent(null)} className="absolute top-8 right-8 text-slate-400"><X size={24}/></button>
              <h2 className="text-3xl font-black uppercase text-center mb-10 tracking-tighter">Historial: {historyStudent.firstName}</h2>
              <div className="flex-grow overflow-y-auto space-y-4">
                {studentPayments.length === 0 ? <p className="text-center py-20 text-slate-300 font-black uppercase text-xs">Sin registros</p> : studentPayments.map(p => (
                    <div key={p.id} className="p-6 bg-slate-50 rounded-3xl border flex justify-between items-center group">
                      <div>
                        <p className="font-black text-slate-900 uppercase text-xs">{p.concept} • {p.method}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{new Date(p.payment_date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-black text-emerald-600">S/ {p.amount}</p>
                        <button onClick={() => handleAnularPago(p)} className="p-2 bg-rose-50 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"><Trash size={14}/></button>
                      </div>
                    </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {editingStudent && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingStudent(null)} className="absolute inset-0 bg-slate-900/95 backdrop-blur-md"/>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-4xl bg-white rounded-[4rem] shadow-2xl p-12 overflow-y-auto max-h-[90vh]">
               <button onClick={() => setEditingStudent(null)} className="absolute top-8 right-8 p-3 bg-slate-50 rounded-2xl"><X/></button>
               <h2 className="text-4xl font-black uppercase tracking-tighter mb-12">Ficha de Atleta</h2>
               <form onSubmit={async (e) => {
                 e.preventDefault();
                 const fd = new FormData(e.currentTarget);
                 const updated: Student = {
                   ...editingStudent,
                   firstName: fd.get('firstName') as string,
                   lastName: fd.get('lastName') as string,
                   parentPhone: fd.get('parentPhone') as string,
                   parentName: fd.get('parentName') as string,
                   pending_balance: Number(fd.get('pending_balance')),
                   total_paid: Number(fd.get('total_paid')),
                   modality: fd.get('modality') as string,
                   comments: fd.get('comments') as string
                 };
                 await onUpdateStudent(updated);
                 setEditingStudent(null);
               }} className="grid md:grid-cols-2 gap-8">
                 <div><label className={labelClasses}>Nombres</label><input name="firstName" defaultValue={editingStudent.firstName} className={inputClasses}/></div>
                 <div><label className={labelClasses}>Apellidos</label><input name="lastName" defaultValue={editingStudent.lastName} className={inputClasses}/></div>
                 <div><label className={labelClasses}>Modalidad</label><select name="modality" defaultValue={editingStudent.modality} className={inputClasses}><option value="Mensual Regular">Mensual Regular</option><option value="Becado Parcial">Becado Parcial</option><option value="Becado Total">Becado Total</option></select></div>
                 <div><label className={labelClasses}>WhatsApp</label><input name="parentPhone" defaultValue={editingStudent.parentPhone} className={inputClasses}/></div>
                 <div><label className={labelClasses}>Recaudado S/</label><input name="total_paid" type="number" defaultValue={editingStudent.total_paid} className={inputClasses}/></div>
                 <div><label className={labelClasses}>Deuda S/</label><input name="pending_balance" type="number" defaultValue={editingStudent.pending_balance} className={inputClasses}/></div>
                 <div className="md:col-span-2"><label className={labelClasses}>Notas</label><textarea name="comments" defaultValue={editingStudent.comments} className={`${inputClasses} h-32 pt-4 resize-none`}></textarea></div>
                 <button type="submit" className="md:col-span-2 py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase text-xs shadow-2xl hover:bg-blue-700 transition-all">Guardar</button>
               </form>
            </motion.div>
          </div>
        )}

        {showRegisterModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRegisterModal(false)} className="fixed inset-0 bg-slate-900/95 backdrop-blur-md"/>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-5xl bg-white rounded-[4rem] shadow-2xl p-16 overflow-y-auto max-h-[90vh]">
              <button onClick={() => setShowRegisterModal(false)} className="absolute top-8 right-8 p-4 bg-slate-50 rounded-2xl hover:bg-slate-900 hover:text-white transition-all"><X/></button>
              <h2 className="text-4xl font-black uppercase text-center mb-16 tracking-tighter">Nueva Matrícula Admin</h2>
              <RegistrationForm config={config} isAdminView={true} onRegister={(student) => { onRegister(student); setShowRegisterModal(false); }} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
