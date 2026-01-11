
import React, { useState, useMemo, useEffect } from 'react';
import { Student, AcademyConfig, ClassSchedule, Payment, IntroSlide, StaffStory } from '../types';
import { 
  Search, X, LogOut, Users, 
  LayoutDashboard, DollarSign, AlertCircle, 
  Zap, Phone, Trash, Edit,
  Save, Image as ImageIcon, Wallet, Trash2, ListChecks, Plus,
  Settings, UserPlus, Share2, MessageCircle,
  CreditCard, CheckCircle2, Bell, Edit3, Video, Music2, Mail, Facebook, Instagram, History, Receipt, ArrowDownCircle, ArrowUpCircle, Target, Film, Play
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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'Paid' | 'Pending'>('all');
  
  const [localConfig, setLocalConfig] = useState<AcademyConfig>({ ...config });
  const [localSchedules, setLocalSchedules] = useState<ClassSchedule[]>([...schedules]);

  useEffect(() => { setLocalConfig({ ...config }); }, [config]);
  useEffect(() => { setLocalSchedules([...schedules]); }, [schedules]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || s.parentPhone.includes(searchTerm);
      const matchesPayment = paymentFilter === 'all' || s.paymentStatus === paymentFilter;
      // Filtro por scheduleId para asegurar precisión en categorías
      const matchesCategory = !selectedCategoryId || s.scheduleId === selectedCategoryId;
      return matchesSearch && matchesPayment && matchesCategory;
    });
  }, [students, searchTerm, paymentFilter, selectedCategoryId]);

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
      await onUpdateStudent({ ...paymentStudent, pending_balance: newPending, total_paid: newTotalPaid, paymentStatus: newPending <= 0 ? 'Paid' : 'Pending' });
      setPaymentStudent(null);
      alert('Pago registrado.');
    }
  };

  const handleSaveAll = async () => {
    if (activeTab === 'settings') {
      const success = await onUpdateConfig(localConfig);
      if (success) alert('Configuración web guardada con éxito.');
    } else if (activeTab === 'schedules') {
      const success = await onUpdateSchedules(localSchedules);
      if (success) alert('Ciclos actualizados con éxito.');
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
            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Panel de Control</span>
          </div>
        </div>
        <nav className="space-y-2 flex-grow">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'students', icon: Users, label: 'Alumnos y Ciclos' },
            { id: 'schedules', icon: ListChecks, label: 'Gestión Ciclos' },
            { id: 'settings', icon: Settings, label: 'Web & Contacto' }
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
            {activeTab === 'overview' && 'Resumen General'}
            {activeTab === 'students' && 'Base de Datos'}
            {activeTab === 'schedules' && 'Planificación Ciclos'}
            {activeTab === 'settings' && 'Personalización Web'}
          </h1>
          {(activeTab === 'settings' || activeTab === 'schedules') && (
            <button onClick={handleSaveAll} className="flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-2xl hover:bg-blue-700 transition-all"><Save size={24}/> Grabar Cambios</button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-3 gap-8">
              <div onClick={() => setActiveTab('students')} className="bg-white p-12 rounded-[4rem] shadow-xl border border-white hover:scale-105 transition-all cursor-pointer">
                <Users size={32} className="text-blue-600 mb-8"/>
                <p className={labelClasses}>Alumnos Registrados</p>
                <p className="text-6xl font-black tracking-tighter">{students.length}</p>
              </div>
              <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white">
                <DollarSign size={32} className="text-emerald-600 mb-8"/>
                <p className={labelClasses}>Ingresos Totales</p>
                <p className="text-6xl font-black tracking-tighter">S/ {students.reduce((acc, s) => acc + (s.total_paid || 0), 0)}</p>
              </div>
              <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white">
                <AlertCircle size={32} className="text-rose-600 mb-8"/>
                <p className={labelClasses}>Pendiente Cobro</p>
                <p className="text-6xl font-black tracking-tighter">S/ {students.reduce((acc, s) => acc + (s.pending_balance || 0), 0)}</p>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-8 pb-32">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <button onClick={() => setSelectedCategoryId(null)} className={`p-6 rounded-[2.5rem] border-2 transition-all text-left ${!selectedCategoryId ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-500 border-slate-100'}`}><Users size={18} className="mb-3 opacity-50"/><p className="font-black text-xs uppercase tracking-tighter">Todos</p><p className="text-[10px] font-bold opacity-60 mt-1">{students.length} Total</p></button>
                {schedules.map(sched => {
                  const count = students.filter(s => s.scheduleId === sched.id).length;
                  return (
                    <button key={sched.id} onClick={() => setSelectedCategoryId(sched.id)} className={`p-6 rounded-[2.5rem] border-2 transition-all text-left ${selectedCategoryId === sched.id ? 'bg-blue-600 text-white border-blue-600 shadow-xl' : 'bg-white text-slate-500 border-slate-100'}`}>
                      <Target size={18} className="mb-3 opacity-50" style={{ color: selectedCategoryId === sched.id ? 'white' : sched.color }}/><p className="font-black text-[10px] uppercase tracking-tighter leading-tight">{sched.category}</p><p className="text-[9px] font-bold opacity-60 mt-1">{count} Niños</p>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[3rem] shadow-xl border border-white">
                <div className="flex bg-slate-50 rounded-2xl p-1 border border-slate-100">
                  <button onClick={() => setPaymentFilter('all')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${paymentFilter === 'all' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}>Todos</button>
                  <button onClick={() => setPaymentFilter('Pending')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${paymentFilter === 'Pending' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400'}`}>Deudores</button>
                </div>
                <div className="flex gap-4 flex-grow max-w-2xl">
                  <div className="relative flex-grow"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20}/><input type="text" placeholder="Buscar por nombre o celular..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm shadow-inner"/></div>
                  <button onClick={() => setShowRegisterModal(true)} className="px-8 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl flex items-center gap-2"><UserPlus size={18}/> Matrícula</button>
                </div>
              </div>

              <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white">
                <table className="w-full text-left">
                  <thead><tr className="bg-slate-900 text-white"><th className="p-8 text-[10px] font-black uppercase tracking-widest">Alumno / Ciclo</th><th className="p-8 text-[10px] font-black uppercase tracking-widest">Apoderado</th><th className="p-8 text-[10px] font-black uppercase tracking-widest">Estado Pago</th><th className="p-8 text-[10px] font-black uppercase tracking-widest text-center">Acciones</th></tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredStudents.map(s => {
                      const sched = schedules.find(sc => sc.id === s.scheduleId);
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-8"><p className="font-black text-slate-900 uppercase text-sm tracking-tighter">{s.firstName} {s.lastName}</p><span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 rounded text-slate-500">{sched?.category || s.category}</span></td>
                          <td className="p-8"><p className="font-bold text-xs text-slate-700">{s.parentName}</p><p className="text-[10px] font-bold text-emerald-500 flex items-center gap-1"><Phone size={10}/> {s.parentPhone}</p></td>
                          <td className="p-8"><p className={`font-black text-sm ${s.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-rose-600'}`}>{s.paymentStatus === 'Paid' ? 'AL DÍA' : `DEUDA S/ ${s.pending_balance}`}</p></td>
                          <td className="p-8 text-center"><div className="flex items-center justify-center gap-2">
                              <button onClick={() => setPaymentStudent(s)} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><Wallet size={16}/></button>
                              <button onClick={() => setEditingStudent(s)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><Edit3 size={16}/></button>
                              <button onClick={() => onDelete(s.id)} className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash size={16}/></button>
                            </div></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className="grid lg:grid-cols-2 gap-8 pb-32">
              {localSchedules.map((sched, idx) => (
                <div key={sched.id} className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-white relative group">
                  <div className="absolute top-8 right-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity"><input type="color" value={sched.color} onChange={e => { const nl = [...localSchedules]; nl[idx].color = e.target.value; setLocalSchedules(nl); }} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"/><button onClick={() => setLocalSchedules(localSchedules.filter((_, i) => i !== idx))} className="text-rose-300 hover:text-rose-600 p-2"><Trash2 size={24}/></button></div>
                  <div className="grid gap-6">
                    <div><label className={labelClasses}>Nombre del Ciclo</label><input value={sched.category} onChange={e => { const nl = [...localSchedules]; nl[idx].category = e.target.value; setLocalSchedules(nl); }} className={inputClasses}/></div>
                    <div className="grid grid-cols-2 gap-6"><div><label className={labelClasses}>Edad</label><input value={sched.age} onChange={e => { const nl = [...localSchedules]; nl[idx].age = e.target.value; setLocalSchedules(nl); }} className={inputClasses}/></div><div><label className={labelClasses}>Precio S/</label><input type="number" value={sched.price} onChange={e => { const nl = [...localSchedules]; nl[idx].price = Number(e.target.value); setLocalSchedules(nl); }} className={inputClasses}/></div></div>
                  </div>
                </div>
              ))}
              <button onClick={() => setLocalSchedules([...localSchedules, { id: Math.random().toString(), category: 'Nuevo Ciclo', age: '5-12', days: [], time: 'Por definir', duration: '60 min', price: 150, objective: '', color: '#3b82f6' }])} className="p-12 border-4 border-dashed border-slate-200 rounded-[3.5rem] text-slate-300 hover:text-blue-500 flex flex-col items-center gap-4 bg-slate-50/20 hover:bg-slate-50 transition-all"><Plus size={48}/> Crear Nuevo Ciclo</button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-16 pb-40">
               {/* WEB Y CONTACTO */}
               <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white space-y-10">
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-3"><Share2 size={20} className="text-emerald-500"/> Configuración de Contacto</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="md:col-span-2"><label className={labelClasses}>Logo URL</label><input value={localConfig.logoUrl} onChange={e => setLocalConfig({...localConfig, logoUrl: e.target.value})} className={inputClasses}/></div>
                    <div><label className={labelClasses}>WhatsApp</label><input value={localConfig.socialWhatsapp} onChange={e => setLocalConfig({...localConfig, socialWhatsapp: e.target.value})} className={inputClasses}/></div>
                    <div><label className={labelClasses}>Email</label><input value={localConfig.contactEmail} onChange={e => setLocalConfig({...localConfig, contactEmail: e.target.value})} className={inputClasses}/></div>
                    <div><label className={labelClasses}>Instagram</label><input value={localConfig.socialInstagram} onChange={e => setLocalConfig({...localConfig, socialInstagram: e.target.value})} className={inputClasses}/></div>
                    <div><label className={labelClasses}>Facebook</label><input value={localConfig.socialFacebook} onChange={e => setLocalConfig({...localConfig, socialFacebook: e.target.value})} className={inputClasses}/></div>
                    <div className="md:col-span-2"><label className={labelClasses}>Dirección</label><input value={localConfig.contactAddress} onChange={e => setLocalConfig({...localConfig, contactAddress: e.target.value})} className={inputClasses}/></div>
                  </div>
               </div>

               {/* GALERÍA HERO EDITABLE */}
               <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white space-y-10">
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-3"><ImageIcon size={20} className="text-blue-500"/> Galería Hero (Portada)</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {localConfig.heroImages.map((url, i) => (
                      <div key={i} className="relative group rounded-3xl overflow-hidden aspect-video border shadow-sm">
                        <img src={url} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { const u = prompt('Editar URL:', url); if(u) { const n = [...localConfig.heroImages]; n[i] = u; setLocalConfig({...localConfig, heroImages: n}); }}} className="p-2 bg-blue-500 text-white rounded-xl"><Edit size={14}/></button>
                          <button onClick={() => setLocalConfig({...localConfig, heroImages: localConfig.heroImages.filter((_, idx) => idx !== i)})} className="p-2 bg-rose-500 text-white rounded-xl"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => { const u = prompt('Añadir URL:'); if(u) setLocalConfig({...localConfig, heroImages: [...localConfig.heroImages, u]}); }} className="aspect-video border-4 border-dashed rounded-3xl flex items-center justify-center text-slate-300 font-black text-4xl hover:bg-slate-50 transition-all">+</button>
                  </div>
               </div>

               {/* SECCIÓN STAFF STORIES */}
               <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white space-y-10">
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-3"><Users size={20} className="text-purple-500"/> Historias del Staff (Hero Staff)</h3>
                  <div className="space-y-4">
                    {localConfig.staffStories.map((story, i) => (
                      <div key={story.id} className="p-6 bg-slate-50 rounded-[2rem] border grid md:grid-cols-4 gap-4 items-center">
                        <div><label className={labelClasses}>Nombre</label><input value={story.name} onChange={e => { const n = [...localConfig.staffStories]; n[i].name = e.target.value; setLocalConfig({...localConfig, staffStories: n}); }} className={inputClasses}/></div>
                        <div><label className={labelClasses}>Rol</label><input value={story.role} onChange={e => { const n = [...localConfig.staffStories]; n[i].role = e.target.value; setLocalConfig({...localConfig, staffStories: n}); }} className={inputClasses}/></div>
                        <div className="md:col-span-2"><label className={labelClasses}>Multimedia URL</label><div className="flex gap-2"><input value={story.url} onChange={e => { const n = [...localConfig.staffStories]; n[i].url = e.target.value; setLocalConfig({...localConfig, staffStories: n}); }} className={inputClasses}/><button onClick={() => setLocalConfig({...localConfig, staffStories: localConfig.staffStories.filter((_, idx) => idx !== i)})} className="p-4 bg-rose-50 text-rose-500 rounded-2xl"><Trash2 size={18}/></button></div></div>
                      </div>
                    ))}
                    <button onClick={() => setLocalConfig({...localConfig, staffStories: [...localConfig.staffStories, { id: Math.random().toString(), name: 'Nuevo Coach', role: 'Staff', url: '', type: 'image', duration: 5000 }]})} className="w-full py-4 border-2 border-dashed rounded-2xl text-slate-400 font-bold uppercase text-[10px] tracking-widest">+ Añadir Staff</button>
                  </div>
               </div>

               {/* SECCIÓN INTRO SLIDES */}
               <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white space-y-10">
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-3"><Film size={20} className="text-amber-500"/> Portal de Inicio (Intro Experience)</h3>
                  <div className="space-y-4">
                    {localConfig.introSlides.map((slide, i) => (
                      <div key={slide.id} className="p-6 bg-slate-50 rounded-[2rem] border grid md:grid-cols-3 gap-4">
                        <div><label className={labelClasses}>Título</label><input value={slide.title} onChange={e => { const n = [...localConfig.introSlides]; n[i].title = e.target.value; setLocalConfig({...localConfig, introSlides: n}); }} className={inputClasses}/></div>
                        <div><label className={labelClasses}>Subtítulo</label><input value={slide.subtitle} onChange={e => { const n = [...localConfig.introSlides]; n[i].subtitle = e.target.value; setLocalConfig({...localConfig, introSlides: n}); }} className={inputClasses}/></div>
                        <div><label className={labelClasses}>Video/Imagen URL</label><div className="flex gap-2"><input value={slide.url} onChange={e => { const n = [...localConfig.introSlides]; n[i].url = e.target.value; setLocalConfig({...localConfig, introSlides: n}); }} className={inputClasses}/><button onClick={() => setLocalConfig({...localConfig, introSlides: localConfig.introSlides.filter((_, idx) => idx !== i)})} className="p-4 bg-rose-50 text-rose-500 rounded-2xl"><Trash2 size={18}/></button></div></div>
                      </div>
                    ))}
                    <button onClick={() => setLocalConfig({...localConfig, introSlides: [...localConfig.introSlides, { id: Math.random().toString(), title: 'BIENVENIDO', subtitle: 'A LA ÉLITE', url: '', type: 'video', duration: 6000 }]})} className="w-full py-4 border-2 border-dashed rounded-2xl text-slate-400 font-bold uppercase text-[10px] tracking-widest">+ Añadir Slide Intro</button>
                  </div>
               </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {editingStudent && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingStudent(null)} className="absolute inset-0 bg-slate-900/95 backdrop-blur-md"/>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-4xl bg-white rounded-[4rem] shadow-2xl p-12 overflow-y-auto max-h-[90vh]">
               <button onClick={() => setEditingStudent(null)} className="absolute top-8 right-8 p-3 bg-slate-50 rounded-2xl hover:bg-slate-900 hover:text-white transition-all"><X/></button>
               <h2 className="text-4xl font-black uppercase tracking-tighter mb-12">Perfil Atleta</h2>
               <form onSubmit={async (e) => {
                 e.preventDefault();
                 const fd = new FormData(e.currentTarget);
                 await onUpdateStudent({ ...editingStudent, firstName: fd.get('firstName') as string, lastName: fd.get('lastName') as string, parentPhone: fd.get('parentPhone') as string, parentName: fd.get('parentName') as string, pending_balance: Number(fd.get('pending_balance')), total_paid: Number(fd.get('total_paid')), scheduleId: fd.get('scheduleId') as string, comments: fd.get('comments') as string });
                 setEditingStudent(null);
               }} className="grid md:grid-cols-2 gap-8">
                 <div><label className={labelClasses}>Nombres</label><input name="firstName" defaultValue={editingStudent.firstName} className={inputClasses}/></div>
                 <div><label className={labelClasses}>Apellidos</label><input name="lastName" defaultValue={editingStudent.lastName} className={inputClasses}/></div>
                 <div><label className={labelClasses}>Celular</label><input name="parentPhone" defaultValue={editingStudent.parentPhone} className={inputClasses}/></div>
                 <div><label className={labelClasses}>Apoderado</label><input name="parentName" defaultValue={editingStudent.parentName} className={inputClasses}/></div>
                 <div><label className={labelClasses}>Total Pagado S/</label><input name="total_paid" type="number" defaultValue={editingStudent.total_paid} className={inputClasses}/></div>
                 <div><label className={labelClasses}>Deuda S/</label><input name="pending_balance" type="number" defaultValue={editingStudent.pending_balance} className={inputClasses}/></div>
                 <div className="md:col-span-2"><label className={labelClasses}>Cambiar Ciclo</label><select name="scheduleId" defaultValue={editingStudent.scheduleId} className={inputClasses}>{schedules.map(s => <option key={s.id} value={s.id}>{s.category} ({s.age})</option>)}</select></div>
                 <div className="md:col-span-2"><label className={labelClasses}>Notas</label><textarea name="comments" defaultValue={editingStudent.comments} className={`${inputClasses} h-32 pt-4 resize-none`}></textarea></div>
                 <button type="submit" className="md:col-span-2 py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs shadow-2xl hover:bg-blue-600 transition-all">Actualizar Atleta</button>
               </form>
            </motion.div>
          </div>
        )}

        {showRegisterModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRegisterModal(false)} className="fixed inset-0 bg-slate-900/95 backdrop-blur-md"/>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-5xl bg-white rounded-[4rem] shadow-2xl p-16 overflow-y-auto max-h-[90vh]">
              <button onClick={() => setShowRegisterModal(false)} className="absolute top-8 right-8 p-4 bg-slate-50 rounded-2xl hover:bg-slate-900 hover:text-white transition-all"><X/></button>
              <h2 className="text-4xl font-black uppercase text-center mb-16 tracking-tighter">Matrícula</h2>
              <RegistrationForm config={config} isAdminView={true} onRegister={(student) => { onRegister(student); setShowRegisterModal(false); }} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
