
import React, { useState, useMemo } from 'react';
import { Student, AcademyConfig, ClassSchedule, IntroSlide, StaffStory } from '../types';
import { 
  Search, X, LogOut, Users, 
  LayoutDashboard, DollarSign, AlertCircle, 
  ChevronRight, Zap, ChevronLeft, Phone, Edit3, Trash, Calendar,
  Save, Image as ImageIcon, Wallet, Play, Star, PlusCircle, Trash2, ListChecks, Plus,
  Settings, UserPlus, Facebook, Instagram, Share2, Mail, MapPin, Video, Music2
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStudent, setPaymentStudent] = useState<Student | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  const [localConfig, setLocalConfig] = useState<AcademyConfig>({ ...config });
  const [localSchedules, setLocalSchedules] = useState<ClassSchedule[]>([...schedules]);

  const categoriesList = useMemo(() => {
    return localSchedules.map(cat => ({
      ...cat,
      count: students.filter(s => s.category === cat.category).length
    }));
  }, [students, localSchedules]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      (!selectedCategory || s.category === selectedCategory) &&
      (`${s.firstName} ${s.lastName} ${s.parentPhone}`.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [students, selectedCategory, searchTerm]);

  const handleSaveAll = async () => {
    const configSuccess = await onUpdateConfig(localConfig);
    const schedSuccess = await onUpdateSchedules(localSchedules);
    if (configSuccess && schedSuccess) alert('¡Base de Datos Actualizada!');
    else alert('Error al guardar algunos campos. Revisa la consola.');
  };

  const toggleDay = (schedIdx: number, day: string) => {
    const nl = [...localSchedules];
    const currentDays = nl[schedIdx].days || [];
    nl[schedIdx].days = currentDays.includes(day) 
      ? currentDays.filter(d => d !== day) 
      : [...currentDays, day];
    setLocalSchedules(nl);
  };

  const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1";
  const inputClasses = "w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-bold transition-all shadow-inner";

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-slate-900 font-ubuntu">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-900 m-4 rounded-[2.5rem] text-white flex flex-col p-8 shadow-2xl z-30">
        <div className="mb-12 flex items-center gap-4 px-2">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg"><Zap className="text-white fill-white" size={28} /></div>
          <div className="flex flex-col"><span className="font-black text-xl tracking-tighter text-white uppercase">ATHLETIC ÉLITE</span><span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Admin Hub</span></div>
        </div>
        
        <nav className="space-y-2 flex-grow">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Resumen' },
            { id: 'students', icon: Users, label: 'Alumnos' },
            { id: 'schedules', icon: ListChecks, label: 'Ciclos / Horarios' },
            { id: 'settings', icon: Settings, label: 'Configuración Web' }
          ].map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id as any); setSelectedCategory(null); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] font-bold text-sm transition-all ${activeTab === item.id ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={20}/> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto flex items-center gap-4 px-5 py-4 text-rose-400 font-bold text-sm hover:bg-rose-500/10 rounded-[1.5rem] transition-all"><LogOut size={20}/> Cerrar Sesión</button>
      </aside>

      <main className="flex-grow overflow-y-auto p-12 scroll-smooth">
        <header className="flex justify-between items-end mb-12">
          <div>
            <p className="text-blue-600 font-black text-[10px] tracking-widest uppercase mb-1">Centro de Gestión Integral</p>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">
              {activeTab === 'overview' && 'Dashboard'}
              {activeTab === 'students' && (selectedCategory ? selectedCategory : 'Grupos Activos')}
              {activeTab === 'schedules' && 'Ciclos Académicos'}
              {activeTab === 'settings' && 'Gestión de Contenidos'}
            </h1>
          </div>
          <div className="flex gap-4">
            <button onClick={handleSaveAll} className="flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-2xl hover:bg-blue-700 transition-all active:scale-95 transition-transform"><Save size={24}/> Guardar en Nube</button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white"><Users size={32} className="text-blue-600 mb-8"/><p className={labelClasses}>Atletas Registrados</p><p className="text-6xl font-black tracking-tighter">{students.length}</p></div>
              <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white"><DollarSign size={32} className="text-emerald-600 mb-8"/><p className={labelClasses}>Recaudación Mes</p><p className="text-6xl font-black tracking-tighter">S/ {students.filter(s => s.paymentStatus === 'Paid').length * 150}</p></div>
              <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white"><AlertCircle size={32} className="text-rose-600 mb-8"/><p className={labelClasses}>Mensualidades Pendientes</p><p className="text-6xl font-black tracking-tighter">{students.filter(s => s.paymentStatus !== 'Paid').length}</p></div>
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className="grid lg:grid-cols-2 gap-8 pb-32">
              {localSchedules.map((sched, idx) => (
                <div key={sched.id} className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-white relative group">
                  <div className="absolute top-8 right-8 flex gap-3">
                     <input type="color" value={sched.color} onChange={e => { const nl = [...localSchedules]; nl[idx].color = e.target.value; setLocalSchedules(nl); }} className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"/>
                     <button onClick={() => { if(window.confirm('¿Eliminar grupo?')) setLocalSchedules(localSchedules.filter((_, i) => i !== idx)); }} className="text-rose-300 hover:text-rose-600 transition-colors"><Trash2 size={24}/></button>
                  </div>
                  <div className="grid gap-6">
                    <div><label className={labelClasses}>Nombre del Grupo / Categoría</label><input value={sched.category} onChange={e => { const nl = [...localSchedules]; nl[idx].category = e.target.value; setLocalSchedules(nl); }} className={inputClasses}/></div>
                    <div className="grid grid-cols-2 gap-6">
                      <div><label className={labelClasses}>Rango de Edades</label><input value={sched.age} onChange={e => { const nl = [...localSchedules]; nl[idx].age = e.target.value; setLocalSchedules(nl); }} className={inputClasses}/></div>
                      <div><label className={labelClasses}>Precio Mensual S/</label><input type="number" value={sched.price} onChange={e => { const nl = [...localSchedules]; nl[idx].price = Number(e.target.value); setLocalSchedules(nl); }} className={inputClasses}/></div>
                    </div>
                    <div>
                      <label className={labelClasses}>Días de Entrenamiento</label>
                      <div className="flex flex-wrap gap-2">
                        {DAYS_OF_WEEK.map(d => (
                          <button 
                            key={d.label} 
                            onClick={() => toggleDay(idx, d.full)} 
                            className={`w-12 h-12 rounded-2xl font-black text-[10px] transition-all ${sched.days?.includes(d.full) ? 'bg-blue-600 text-white shadow-xl scale-110' : 'bg-slate-50 text-slate-300 hover:bg-slate-100 border border-slate-100'}`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div><label className={labelClasses}>Horario de Clases (Ej: 4:00 PM - 5:30 PM)</label><input value={sched.time} onChange={e => { const nl = [...localSchedules]; nl[idx].time = e.target.value; setLocalSchedules(nl); }} className={inputClasses}/></div>
                  </div>
                </div>
              ))}
              <button onClick={() => setLocalSchedules([...localSchedules, { id: Math.random().toString(), category: 'Nuevo Grupo', age: 'Edad', days: [], time: '00:00 - 00:00', duration: '60 min', price: 150, objective: '', color: '#3b82f6' }])} className="p-12 border-4 border-dashed border-slate-200 rounded-[3.5rem] text-slate-300 font-black uppercase text-xs hover:border-blue-300 hover:text-blue-400 transition-all flex flex-col items-center gap-4 bg-slate-50/30"><Plus size={48}/> Añadir Categoría</button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-16 pb-40">
               {/* Contacto & Social */}
               <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white space-y-10">
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.3em] flex items-center gap-3"><Share2 size={20} className="text-emerald-500"/> Contacto y Redes</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div><label className={labelClasses}>TikTok URL</label><input value={localConfig.socialTiktok} onChange={e => setLocalConfig({...localConfig, socialTiktok: e.target.value})} className={inputClasses} placeholder="https://tiktok.com/@..."/></div>
                    <div><label className={labelClasses}>Instagram URL</label><input value={localConfig.socialInstagram} onChange={e => setLocalConfig({...localConfig, socialInstagram: e.target.value})} className={inputClasses}/></div>
                    <div><label className={labelClasses}>WhatsApp Central (Solo números)</label><input value={localConfig.socialWhatsapp} onChange={e => setLocalConfig({...localConfig, socialWhatsapp: e.target.value})} className={inputClasses}/></div>
                    <div><label className={labelClasses}>Email de la Academia</label><input value={localConfig.contactEmail} onChange={e => setLocalConfig({...localConfig, contactEmail: e.target.value})} className={inputClasses}/></div>
                    <div className="md:col-span-2"><label className={labelClasses}>Dirección de la Sede</label><input value={localConfig.contactAddress} onChange={e => setLocalConfig({...localConfig, contactAddress: e.target.value})} className={inputClasses}/></div>
                  </div>
               </div>

               {/* Multimedia Web */}
               <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white space-y-10">
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.3em] flex items-center gap-3"><ImageIcon size={20} className="text-rose-500"/> Fotos de Portada (Hero)</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {localConfig.heroImages.map((url, i) => (
                      <div key={i} className="relative group rounded-3xl overflow-hidden shadow-lg aspect-video">
                        <img src={url} className="w-full h-full object-cover" alt="Hero"/>
                        <button onClick={() => setLocalConfig({...localConfig, heroImages: localConfig.heroImages.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                      </div>
                    ))}
                    <button onClick={() => { const u = prompt('URL Imagen:'); if(u) setLocalConfig({...localConfig, heroImages: [...localConfig.heroImages, u]}); }} className="aspect-video border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-slate-300 hover:text-blue-500 hover:border-blue-500 transition-all bg-slate-50"><Plus size={32}/>Añadir Foto</button>
                  </div>
               </div>

               {/* Intro Slides */}
               <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white space-y-10">
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.3em] flex items-center gap-3"><Video size={20} className="text-blue-500"/> Sliders de Entrada</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    {localConfig.introSlides.map((slide, i) => (
                      <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-4 relative">
                        <button onClick={() => setLocalConfig({...localConfig, introSlides: localConfig.introSlides.filter((_, idx) => idx !== i)})} className="absolute top-6 right-6 text-rose-300 hover:text-rose-600 transition-colors"><Trash2 size={24}/></button>
                        <div><label className={labelClasses}>Título Principal</label><input value={slide.title} onChange={e => { const nl = [...localConfig.introSlides]; nl[i].title = e.target.value; setLocalConfig({...localConfig, introSlides: nl}); }} className={inputClasses}/></div>
                        <div><label className={labelClasses}>Subtítulo</label><input value={slide.subtitle} onChange={e => { const nl = [...localConfig.introSlides]; nl[i].subtitle = e.target.value; setLocalConfig({...localConfig, introSlides: nl}); }} className={inputClasses}/></div>
                        <div><label className={labelClasses}>URL Video/Foto</label><input value={slide.url} onChange={e => { const nl = [...localConfig.introSlides]; nl[i].url = e.target.value; setLocalConfig({...localConfig, introSlides: nl}); }} className={inputClasses}/></div>
                        <div className="flex gap-4">
                          <button onClick={() => { const nl = [...localConfig.introSlides]; nl[i].type = 'video'; setLocalConfig({...localConfig, introSlides: nl}); }} className={`flex-grow py-3 rounded-xl font-bold text-[10px] ${slide.type === 'video' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border text-slate-400'}`}>VIDEO</button>
                          <button onClick={() => { const nl = [...localConfig.introSlides]; nl[i].type = 'image'; setLocalConfig({...localConfig, introSlides: nl}); }} className={`flex-grow py-3 rounded-xl font-bold text-[10px] ${slide.type === 'image' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border text-slate-400'}`}>FOTO</button>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setLocalConfig({...localConfig, introSlides: [...localConfig.introSlides, { id: Math.random().toString(), type: 'video', url: '', title: 'Nuevo Slide', subtitle: '', duration: 5000 }]})} className="border-4 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-slate-300 hover:text-blue-500 hover:border-blue-500 transition-all bg-slate-50"><PlusCircle size={48}/>Añadir Diapositiva</button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'students' && !selectedCategory && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoriesList.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.category)} className="bg-white p-12 rounded-[4rem] shadow-xl border border-white hover:-translate-y-2 transition-all text-left group">
                  <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white mb-8 shadow-2xl group-hover:scale-110 transition-transform" style={{ backgroundColor: cat.color }}><Users size={32}/></div>
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">{cat.category}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.count} Atletas Inscritos</p>
                  <div className="mt-8 flex items-center gap-2 text-blue-600 font-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Ver Fichas <ChevronRight size={14}/></div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'students' && selectedCategory && (
            <div className="space-y-8 pb-32">
              <div className="flex items-center justify-between">
                <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors uppercase text-xs tracking-widest"><ChevronLeft/> Volver a Grupos</button>
                <div className="relative w-80">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20}/>
                  <input type="text" placeholder="Buscar por nombre..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border border-slate-100 outline-none font-bold text-sm shadow-sm"/>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredStudents.map(s => (
                  <div key={s.id} className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-white flex flex-col relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-2 h-full ${s.paymentStatus === 'Paid' ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                    <p className="font-black text-xl mb-1 uppercase tracking-tighter">{s.firstName} {s.lastName}</p>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-6">{s.parentPhone}</p>
                    <div className="flex gap-3 mt-auto">
                       <button onClick={() => setPaymentStudent(s)} className="flex-grow py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg"><Wallet size={16} className="inline mr-2"/> Cobrar</button>
                       <button onClick={() => onDelete(s.id)} className="p-4 bg-slate-50 text-rose-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"><Trash size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* MODALES REUTILIZABLES (Inscripción y Pagos) */}
      <AnimatePresence>
        {showRegisterModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-8 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRegisterModal(false)} className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm"/>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-5xl bg-slate-50 rounded-[4rem] shadow-2xl p-12 overflow-y-auto max-h-[90vh]">
              <button onClick={() => setShowRegisterModal(false)} className="absolute top-8 right-8 p-4 bg-white rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-xl"><X/></button>
              <h2 className="text-4xl font-black uppercase text-center mb-12 tracking-tighter">Nueva Ficha de Atleta</h2>
              <RegistrationForm isAdminView={true} initialCategory={selectedCategory || undefined} onRegister={(student) => { onRegister(student); setShowRegisterModal(false); }} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {paymentStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPaymentStudent(null)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"/>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-white rounded-[4rem] p-16 shadow-2xl text-center">
              <h2 className="text-3xl font-black uppercase mb-12 tracking-tighter">Registrar Pago</h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const updated: Student = {
                  ...paymentStudent,
                  paymentStatus: 'Paid',
                  nextPaymentDate: fd.get('nextDate') as string
                };
                await onUpdateStudent(updated);
                setPaymentStudent(null);
                alert('¡Mensualidad Actualizada!');
              }} className="space-y-8">
                <div><label className={labelClasses}>Fecha Próximo Pago</label><input required name="nextDate" type="date" className={inputClasses} defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}/></div>
                <button type="submit" className="w-full py-7 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-sm tracking-widest hover:bg-emerald-600 transition-all shadow-2xl active:scale-95">CONFIRMAR COBRO</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
