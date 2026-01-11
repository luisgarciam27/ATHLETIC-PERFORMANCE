
import React, { useState, useMemo, useEffect } from 'react';
import { Student, AcademyConfig, ClassSchedule, IntroSlide, StaffStory } from '../types';
import { 
  Search, X, LogOut, Users, 
  LayoutDashboard, DollarSign, AlertCircle, 
  ChevronRight, Zap, ChevronLeft, Phone, Trash,
  Save, Image as ImageIcon, Wallet, Star, Trash2, ListChecks, Plus,
  Settings, UserPlus, Share2,
  Info, CalendarDays, User as UserIcon, MapPin as MapPinIcon, CreditCard,
  CheckCircle2, Bell, FileText, Edit3, Video, Music2, Mail, Facebook, Instagram
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegistrationForm } from './RegistrationForm';

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

const DAYS_OF_WEEK = [
  { label: 'L', full: 'Lunes' },
  { label: 'M', full: 'Martes' },
  { label: 'Mi', full: 'Miércoles' },
  { label: 'J', full: 'Jueves' },
  { label: 'V', full: 'Viernes' },
  { label: 'S', full: 'Sábado' },
  { label: 'D', full: 'Domingo' }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  students, schedules, config, onUpdateConfig, onUpdateSchedules, onRegister, onUpdateStudent, onDelete, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'schedules' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStudent, setPaymentStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'Paid' | 'Pending'>('all');
  
  const [localConfig, setLocalConfig] = useState<AcademyConfig>({ ...config });
  const [localSchedules, setLocalSchedules] = useState<ClassSchedule[]>([...schedules]);

  useEffect(() => { setLocalConfig({ ...config }); }, [config]);
  useEffect(() => { setLocalSchedules([...schedules]); }, [schedules]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = `${s.firstName} ${s.lastName} ${s.parentPhone} ${s.parentName} ${s.qrCode}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPayment = paymentFilter === 'all' || s.paymentStatus === paymentFilter;
      return matchesSearch && matchesPayment;
    });
  }, [students, searchTerm, paymentFilter]);

  const handleSaveAll = async () => {
    const s1 = await onUpdateConfig(localConfig);
    const s2 = await onUpdateSchedules(localSchedules);
    if (s1 && s2) alert('¡Datos sincronizados con éxito!');
  };

  const handleSendReminder = (student: Student) => {
    const debt = student.pending_balance || 0;
    const message = `¡Hola ${student.parentName}! 👋 Te saludamos de Athletic Academy. Te recordamos que ${student.firstName} tiene un *saldo pendiente de S/ ${debt}*. ⚽ Por favor, confírmanos el envío del voucher para actualizar su carnet virtual. ¡Gracias!`;
    window.open(`https://wa.me/${student.parentPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1";
  const inputClasses = "w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-bold transition-all shadow-inner";

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-slate-900 font-ubuntu">
      <aside className="w-80 bg-slate-900 m-4 rounded-[2.5rem] text-white flex flex-col p-8 shadow-2xl z-30">
        <div className="mb-12 flex items-center gap-4 px-2">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg"><Zap className="text-white fill-white" size={28} /></div>
          <div className="flex flex-col"><span className="font-black text-xl tracking-tighter text-white uppercase">ATHLETIC ÉLITE</span><span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Admin Panel</span></div>
        </div>
        <nav className="space-y-2 flex-grow">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Resumen' },
            { id: 'students', icon: Users, label: 'Alumnos' },
            { id: 'schedules', icon: ListChecks, label: 'Ciclos / Horarios' },
            { id: 'settings', icon: Settings, label: 'Configuración Web' }
          ].map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id as any); setPaymentFilter('all'); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] font-bold text-sm transition-all ${activeTab === item.id ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={20}/> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto w-full flex items-center gap-4 px-5 py-4 text-rose-400 font-bold text-sm hover:bg-rose-500/10 rounded-[1.5rem] transition-all"><LogOut size={20}/> Cerrar Sesión</button>
      </aside>

      <main className="flex-grow overflow-y-auto p-12 scroll-smooth">
        <header className="flex justify-between items-end mb-12">
          <div>
            <p className="text-blue-600 font-black text-[10px] tracking-widest uppercase mb-1">Centro de Control Athletic</p>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">
              {activeTab === 'overview' && 'Estadísticas'}
              {activeTab === 'students' && 'Atletas Inscritos'}
              {activeTab === 'schedules' && 'Planificación Ciclos'}
              {activeTab === 'settings' && 'Personalización Web'}
            </h1>
          </div>
          {(activeTab === 'settings' || activeTab === 'schedules') && (
            <button onClick={handleSaveAll} className="flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-2xl hover:bg-blue-700 transition-all"><Save size={24}/> Guardar Todo</button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-3 gap-8">
              <div onClick={() => { setActiveTab('students'); setPaymentFilter('all'); }} className="bg-white p-12 rounded-[4rem] shadow-xl border border-white hover:scale-105 transition-all cursor-pointer group">
                <Users size={32} className="text-blue-600 mb-8 group-hover:rotate-12 transition-transform"/>
                <p className={labelClasses}>Alumnos Totales</p>
                <p className="text-6xl font-black tracking-tighter">{students.length}</p>
                <p className="text-[10px] font-bold text-blue-500 mt-4 uppercase tracking-widest">Ver lista completa →</p>
              </div>
              <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white">
                <DollarSign size={32} className="text-emerald-600 mb-8"/>
                <p className={labelClasses}>Ingresos Estimados</p>
                <p className="text-6xl font-black tracking-tighter">S/ {students.filter(s => s.paymentStatus === 'Paid').reduce((acc, s) => acc + (schedules.find(sc => sc.category === s.category)?.price || 0), 0)}</p>
              </div>
              <div onClick={() => { setActiveTab('students'); setPaymentFilter('Pending'); }} className="bg-white p-12 rounded-[4rem] shadow-xl border border-white hover:scale-105 transition-all cursor-pointer group border-rose-100">
                <AlertCircle size={32} className="text-rose-600 mb-8 group-hover:shake transition-transform"/>
                <p className={labelClasses}>Deudores</p>
                <p className="text-6xl font-black tracking-tighter">{students.filter(s => s.paymentStatus !== 'Paid').length}</p>
                <p className="text-[10px] font-bold text-rose-500 mt-4 uppercase tracking-widest">Gestionar deudas →</p>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-8 pb-32">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[3rem] shadow-xl border border-white">
                <div className="flex bg-slate-50 rounded-2xl p-1 border border-slate-100">
                  <button onClick={() => setPaymentFilter('all')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentFilter === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>Todos</button>
                  <button onClick={() => setPaymentFilter('Pending')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentFilter === 'Pending' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400'}`}>Pendientes</button>
                </div>
                <div className="flex gap-4 flex-grow max-w-2xl">
                  <div className="relative flex-grow">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20}/>
                    <input type="text" placeholder="Buscar por Nombre, DNI o Celular..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none font-bold text-sm"/>
                  </div>
                  <button onClick={() => setShowRegisterModal(true)} className="px-8 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"><UserPlus size={18}/> Matricular</button>
                </div>
              </div>

              <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        <th className="p-8 text-[10px] font-black uppercase tracking-widest">Atleta / Categoría</th>
                        <th className="p-8 text-[10px] font-black uppercase tracking-widest">Apoderado</th>
                        <th className="p-8 text-[10px] font-black uppercase tracking-widest">Estado Pago</th>
                        <th className="p-8 text-[10px] font-black uppercase tracking-widest">Saldo Deuda</th>
                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredStudents.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="p-8">
                            <p className="font-black text-slate-900 uppercase tracking-tighter text-sm mb-1">{s.firstName} {s.lastName}</p>
                            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest">{s.category}</span>
                          </td>
                          <td className="p-8">
                            <p className="font-bold text-xs text-slate-700 uppercase mb-1">{s.parentName}</p>
                            <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-1"><Phone size={10}/> {s.parentPhone}</p>
                          </td>
                          <td className="p-8">
                            <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${s.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {s.paymentStatus === 'Paid' ? 'PAGADO' : 'PENDIENTE'}
                            </span>
                          </td>
                          <td className="p-8">
                             <p className={`font-black text-sm ${s.pending_balance && s.pending_balance > 0 ? 'text-rose-600' : 'text-slate-400'}`}>S/ {s.pending_balance || 0}</p>
                          </td>
                          <td className="p-8 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => setPaymentStudent(s)} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><Wallet size={16}/></button>
                              <button onClick={() => handleSendReminder(s)} className="p-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all"><Bell size={16}/></button>
                              <button onClick={() => setEditingStudent(s)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={16}/></button>
                              <button onClick={() => onDelete(s.id)} className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash size={16}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className="grid lg:grid-cols-2 gap-8 pb-32">
              {localSchedules.map((sched, idx) => (
                <div key={sched.id} className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-white relative">
                  <div className="absolute top-8 right-8 flex gap-3">
                     <input type="color" value={sched.color} onChange={e => { const nl = [...localSchedules]; nl[idx].color = e.target.value; setLocalSchedules(nl); }} className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"/>
                     <button onClick={() => setLocalSchedules(localSchedules.filter((_, i) => i !== idx))} className="text-rose-300 hover:text-rose-600 transition-colors"><Trash2 size={24}/></button>
                  </div>
                  <div className="grid gap-6">
                    <div><label className={labelClasses}>Categoría</label><input value={sched.category} onChange={e => { const nl = [...localSchedules]; nl[idx].category = e.target.value; setLocalSchedules(nl); }} className={inputClasses}/></div>
                    <div className="grid grid-cols-2 gap-6">
                      <div><label className={labelClasses}>Rango Edad</label><input value={sched.age} onChange={e => { const nl = [...localSchedules]; nl[idx].age = e.target.value; setLocalSchedules(nl); }} className={inputClasses}/></div>
                      <div><label className={labelClasses}>Mensualidad S/</label><input type="number" value={sched.price} onChange={e => { const nl = [...localSchedules]; nl[idx].price = Number(e.target.value); setLocalSchedules(nl); }} className={inputClasses}/></div>
                    </div>
                    <div><label className={labelClasses}>Horario</label><input value={sched.time} onChange={e => { const nl = [...localSchedules]; nl[idx].time = e.target.value; setLocalSchedules(nl); }} className={inputClasses}/></div>
                  </div>
                </div>
              ))}
              <button onClick={() => setLocalSchedules([...localSchedules, { id: Math.random().toString(), category: 'Nuevo Grupo', age: 'Edad', days: [], time: '0:00', duration: '60 min', price: 150, objective: '', color: '#3b82f6' }])} className="p-12 border-4 border-dashed border-slate-200 rounded-[3.5rem] text-slate-300 hover:text-blue-500 transition-all flex flex-col items-center gap-4 bg-slate-50/20"><Plus size={48}/> Añadir Ciclo</button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-16 pb-40">
               {/* 1. SECCIÓN: DATOS DE CONTACTO Y REDES */}
               <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white space-y-10">
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-3"><Share2 size={20} className="text-emerald-500"/> Redes Sociales y Contacto</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="md:col-span-2"><label className={labelClasses}>Mensaje de Bienvenida Web</label><input value={localConfig.welcomeMessage} onChange={e => setLocalConfig({...localConfig, welcomeMessage: e.target.value})} className={inputClasses}/></div>
                    <div><label className={labelClasses}>Facebook URL</label><div className="relative"><Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18}/><input value={localConfig.socialFacebook} onChange={e => setLocalConfig({...localConfig, socialFacebook: e.target.value})} className={`${inputClasses} pl-12`}/></div></div>
                    <div><label className={labelClasses}>Instagram URL</label><div className="relative"><Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={18}/><input value={localConfig.socialInstagram} onChange={e => setLocalConfig({...localConfig, socialInstagram: e.target.value})} className={`${inputClasses} pl-12`}/></div></div>
                    <div><label className={labelClasses}>TikTok URL</label><div className="relative"><Music2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900" size={18}/><input value={localConfig.socialTiktok} onChange={e => setLocalConfig({...localConfig, socialTiktok: e.target.value})} className={`${inputClasses} pl-12`}/></div></div>
                    <div><label className={labelClasses}>WhatsApp Central (Solo números)</label><div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18}/><input value={localConfig.socialWhatsapp} onChange={e => setLocalConfig({...localConfig, socialWhatsapp: e.target.value})} className={`${inputClasses} pl-12`}/></div></div>
                    <div><label className={labelClasses}>Email Academia</label><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18}/><input value={localConfig.contactEmail} onChange={e => setLocalConfig({...localConfig, contactEmail: e.target.value})} className={`${inputClasses} pl-12`}/></div></div>
                    <div><label className={labelClasses}>Teléfono de Atención</label><div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/><input value={localConfig.contactPhone} onChange={e => setLocalConfig({...localConfig, contactPhone: e.target.value})} className={`${inputClasses} pl-12`}/></div></div>
                    <div className="md:col-span-2"><label className={labelClasses}>Dirección de la Sede</label><div className="relative"><MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500" size={18}/><input value={localConfig.contactAddress} onChange={e => setLocalConfig({...localConfig, contactAddress: e.target.value})} className={`${inputClasses} pl-12`}/></div></div>
                  </div>
               </div>
               
               {/* 2. SECCIÓN: MULTIMEDIA HERO Y ABOUT */}
               <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white space-y-10">
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-3"><ImageIcon size={20} className="text-rose-500"/> Galerías (Hero y Nosotros)</h3>
                  
                  <div className="space-y-6">
                    <p className={labelClasses}>Banners Principales (Hero)</p>
                    <div className="grid md:grid-cols-3 gap-6">
                      {localConfig.heroImages.map((url, i) => (
                        <div key={i} className="relative group rounded-3xl overflow-hidden shadow-lg aspect-video border border-slate-100">
                          <img src={url} className="w-full h-full object-cover" alt="Hero"/>
                          <button onClick={() => setLocalConfig({...localConfig, heroImages: localConfig.heroImages.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                        </div>
                      ))}
                      <button onClick={() => { const u = prompt('URL Imagen Hero:'); if(u) setLocalConfig({...localConfig, heroImages: [...localConfig.heroImages, u]}); }} className="aspect-video border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-slate-300 hover:text-blue-500 transition-all bg-slate-50"><Plus size={32}/>Hero</button>
                    </div>
                  </div>

                  <div className="space-y-6 pt-10 border-t border-slate-50">
                    <p className={labelClasses}>Imágenes Sección "Nosotros"</p>
                    <div className="grid md:grid-cols-4 gap-6">
                      {localConfig.aboutImages.map((url, i) => (
                        <div key={i} className="relative group rounded-3xl overflow-hidden shadow-lg aspect-square border border-slate-100">
                          <img src={url} className="w-full h-full object-cover" alt="About"/>
                          <button onClick={() => setLocalConfig({...localConfig, aboutImages: localConfig.aboutImages.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                        </div>
                      ))}
                      <button onClick={() => { const u = prompt('URL Imagen Nosotros:'); if(u) setLocalConfig({...localConfig, aboutImages: [...localConfig.aboutImages, u]}); }} className="aspect-square border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-slate-300 hover:text-emerald-500 transition-all bg-slate-50"><Plus size={32}/>Nosotros</button>
                    </div>
                  </div>
               </div>

               {/* 3. SECCIÓN: EXPERIENCIA INTERACTIVA (SLIDES E HISTORIAS) */}
               <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white space-y-10">
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-3"><Video size={20} className="text-blue-500"/> Experiencia Inicial e Historias</h3>
                  
                  {/* Intro Slides */}
                  <div className="space-y-6">
                    <p className={labelClasses}>Diapositivas de Bienvenida (Portal)</p>
                    {localConfig.introSlides.map((slide, i) => (
                      <div key={slide.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center gap-8">
                        <div className="w-32 h-48 bg-slate-200 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                          {slide.type === 'video' ? <video src={slide.url} className="w-full h-full object-cover" muted /> : <img src={slide.url} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-grow grid md:grid-cols-2 gap-4">
                          <div className="md:col-span-2"><label className={labelClasses}>URL Multimedia</label><input value={slide.url} onChange={e => { const ns = [...localConfig.introSlides]; ns[i].url = e.target.value; setLocalConfig({...localConfig, introSlides: ns}); }} className={inputClasses}/></div>
                          <div><label className={labelClasses}>Título</label><input value={slide.title} onChange={e => { const ns = [...localConfig.introSlides]; ns[i].title = e.target.value; setLocalConfig({...localConfig, introSlides: ns}); }} className={inputClasses}/></div>
                          <div><label className={labelClasses}>Subtítulo</label><input value={slide.subtitle} onChange={e => { const ns = [...localConfig.introSlides]; ns[i].subtitle = e.target.value; setLocalConfig({...localConfig, introSlides: ns}); }} className={inputClasses}/></div>
                        </div>
                        <button onClick={() => setLocalConfig({...localConfig, introSlides: localConfig.introSlides.filter((_, idx) => idx !== i)})} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={24}/></button>
                      </div>
                    ))}
                    <button onClick={() => setLocalConfig({...localConfig, introSlides: [...localConfig.introSlides, { id: Math.random().toString(), type: 'video', url: '', title: 'NUEVO', subtitle: 'SLIDE', duration: 5000 }]})} className="w-full py-8 border-2 border-dashed rounded-[2.5rem] text-slate-300 font-black uppercase text-xs hover:border-blue-500 hover:text-blue-500 transition-all">+ Añadir Diapositiva Portal</button>
                  </div>

                  {/* Staff Stories */}
                  <div className="space-y-6 pt-10 border-t border-slate-50">
                    <p className={labelClasses}>Historias del Staff (Círculos Hero)</p>
                    {localConfig.staffStories.map((story, i) => (
                      <div key={story.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center gap-8">
                        <div className="w-24 h-24 rounded-full border-2 border-emerald-500 overflow-hidden flex-shrink-0">
                          <img src={story.url} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow grid md:grid-cols-2 gap-4">
                          <div><label className={labelClasses}>Nombre del Profesional</label><input value={story.name} onChange={e => { const nst = [...localConfig.staffStories]; nst[i].name = e.target.value; setLocalConfig({...localConfig, staffStories: nst}); }} className={inputClasses}/></div>
                          <div><label className={labelClasses}>Cargo / Especialidad</label><input value={story.role} onChange={e => { const nst = [...localConfig.staffStories]; nst[i].role = e.target.value; setLocalConfig({...localConfig, staffStories: nst}); }} className={inputClasses}/></div>
                          <div className="md:col-span-2"><label className={labelClasses}>URL Multimedia (Video o Imagen)</label><input value={story.url} onChange={e => { const nst = [...localConfig.staffStories]; nst[i].url = e.target.value; setLocalConfig({...localConfig, staffStories: nst}); }} className={inputClasses}/></div>
                        </div>
                        <button onClick={() => setLocalConfig({...localConfig, staffStories: localConfig.staffStories.filter((_, idx) => idx !== i)})} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={24}/></button>
                      </div>
                    ))}
                    <button onClick={() => setLocalConfig({...localConfig, staffStories: [...localConfig.staffStories, { id: Math.random().toString(), type: 'image', url: '', name: 'PROFESOR', role: 'DT', duration: 5000 }]})} className="w-full py-8 border-2 border-dashed rounded-[2.5rem] text-slate-300 font-black uppercase text-xs hover:border-emerald-500 hover:text-emerald-500 transition-all">+ Añadir Historia Staff</button>
                  </div>
               </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* MODALES DE ACCIÓN */}
      <AnimatePresence>
        {editingStudent && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingStudent(null)} className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"/>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-4xl bg-white rounded-[4rem] shadow-2xl p-12 max-h-[90vh] overflow-y-auto">
               <button onClick={() => setEditingStudent(null)} className="absolute top-8 right-8 p-3 bg-slate-50 rounded-2xl hover:bg-slate-900 hover:text-white transition-all"><X/></button>
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
                   comments: fd.get('comments') as string
                 };
                 await onUpdateStudent(updated);
                 setEditingStudent(null);
               }} className="grid md:grid-cols-2 gap-8">
                 <div><label className={labelClasses}>Nombres</label><input name="firstName" defaultValue={editingStudent.firstName} className={inputClasses}/></div>
                 <div><label className={labelClasses}>Apellidos</label><input name="lastName" defaultValue={editingStudent.lastName} className={inputClasses}/></div>
                 <div><label className={labelClasses}>WhatsApp</label><input name="parentPhone" defaultValue={editingStudent.parentPhone} className={inputClasses}/></div>
                 <div><label className={labelClasses}>Deuda S/</label><input name="pending_balance" type="number" defaultValue={editingStudent.pending_balance || 0} className={inputClasses}/></div>
                 <div className="md:col-span-2"><label className={labelClasses}>Observaciones</label><textarea name="comments" defaultValue={editingStudent.comments} className={`${inputClasses} h-32 pt-4 resize-none`}></textarea></div>
                 <button type="submit" className="md:col-span-2 py-6 bg-blue-600 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-blue-700">Actualizar Atleta</button>
               </form>
            </motion.div>
          </div>
        )}

        {paymentStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPaymentStudent(null)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"/>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-[4rem] p-16 shadow-2xl text-center">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner"><CreditCard size={40}/></div>
              <h2 className="text-3xl font-black uppercase mb-12 tracking-tighter text-slate-900">Módulo de Cobro</h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const updated: Student = {
                  ...paymentStudent,
                  paymentStatus: Number(fd.get('pendingBalance')) <= 0 ? 'Paid' : 'Pending',
                  pending_balance: Number(fd.get('pendingBalance')),
                  comments: (paymentStudent.comments || '') + `\n[PAGO ${new Date().toLocaleDateString()}]`
                };
                await onUpdateStudent(updated);
                setPaymentStudent(null);
              }} className="space-y-6 text-left">
                <div><label className={labelClasses}>SALDO RESTANTE (Deuda) S/</label><input required name="pendingBalance" type="number" className={`${inputClasses} border-rose-200 text-rose-600`} defaultValue="0"/></div>
                <button type="submit" className="w-full py-7 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-sm tracking-widest hover:bg-emerald-700 shadow-2xl flex items-center justify-center gap-3">CONFIRMAR PAGO</button>
              </form>
            </motion.div>
          </div>
        )}

        {showRegisterModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRegisterModal(false)} className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm"/>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-5xl bg-slate-50 rounded-[4rem] shadow-2xl p-12 max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowRegisterModal(false)} className="absolute top-8 right-8 p-4 bg-white rounded-2xl hover:bg-slate-900 hover:text-white transition-all"><X/></button>
              <h2 className="text-4xl font-black uppercase text-center mb-12 tracking-tighter">Matrícula Administrativa</h2>
              <RegistrationForm config={config} isAdminView={true} onRegister={(student) => { onRegister(student); setShowRegisterModal(false); }} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
