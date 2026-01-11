
import React, { useState, useMemo } from 'react';
import { Student, AcademyConfig, ClassSchedule, IntroSlide, StaffStory } from '../types';
import { 
  Search, X, LogOut, Users, 
  LayoutDashboard, DollarSign, AlertCircle, 
  ChevronRight, Zap, ChevronLeft, Phone, Edit3, Trash, Calendar,
  Save, Image as ImageIcon, Wallet, Play, Star, PlusCircle, Trash2, ListChecks, Plus,
  Settings, UserPlus, Facebook, Instagram, Share2, Mail, MapPin, Video, Music2, Rocket,
  Info, CalendarDays, User as UserIcon, MapPin as MapPinIcon, CreditCard,
  // Fix: Added missing CheckCircle2 import
  CheckCircle2
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
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
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
      (`${s.firstName} ${s.lastName} ${s.parentPhone} ${s.parentName}`.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [students, selectedCategory, searchTerm]);

  const handleSaveAll = async () => {
    const configSuccess = await onUpdateConfig(localConfig);
    const schedSuccess = await onUpdateSchedules(localSchedules);
    if (configSuccess && schedSuccess) alert('¡Base de Datos Actualizada Correctamente!');
    else alert('Error al guardar. Verifica la conexión con Supabase.');
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
          <div className="flex flex-col"><span className="font-black text-xl tracking-tighter text-white uppercase">ATHLETIC ÉLITE</span><span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Panel Administrativo</span></div>
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
        
        <div className="mt-auto space-y-4">
           <a href="https://gaorsystem.vercel.app/" target="_blank" className="flex items-center gap-2 px-5 py-2 text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-400 transition-colors">
              <Rocket size={12} /> GaorSystem Support
           </a>
           <button onClick={onLogout} className="w-full flex items-center gap-4 px-5 py-4 text-rose-400 font-bold text-sm hover:bg-rose-500/10 rounded-[1.5rem] transition-all"><LogOut size={20}/> Cerrar Sesión</button>
        </div>
      </aside>

      <main className="flex-grow overflow-y-auto p-12 scroll-smooth">
        <header className="flex justify-between items-end mb-12">
          <div>
            <p className="text-blue-600 font-black text-[10px] tracking-widest uppercase mb-1">Centro de Control Athletic</p>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">
              {activeTab === 'overview' && 'Estadísticas'}
              {activeTab === 'students' && (selectedCategory ? selectedCategory : 'Categorías')}
              {activeTab === 'schedules' && 'Planificación Ciclos'}
              {activeTab === 'settings' && 'Contenidos Web'}
            </h1>
          </div>
          <div className="flex gap-4">
            <button onClick={handleSaveAll} className="flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-2xl hover:bg-blue-700 transition-all active:scale-95 transition-transform"><Save size={24}/> Guardar Todo</button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white"><Users size={32} className="text-blue-600 mb-8"/><p className={labelClasses}>Alumnos Totales</p><p className="text-6xl font-black tracking-tighter">{students.length}</p></div>
              <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white"><DollarSign size={32} className="text-emerald-600 mb-8"/><p className={labelClasses}>Ingresos Mensuales</p><p className="text-6xl font-black tracking-tighter">S/ {students.filter(s => s.paymentStatus === 'Paid').length * 150}</p></div>
              <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white"><AlertCircle size={32} className="text-rose-600 mb-8"/><p className={labelClasses}>Deudas Pendientes</p><p className="text-6xl font-black tracking-tighter">{students.filter(s => s.paymentStatus !== 'Paid').length}</p></div>
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
                    <div><label className={labelClasses}>Nombre de la Categoría</label><input value={sched.category} onChange={e => { const nl = [...localSchedules]; nl[idx].category = e.target.value; setLocalSchedules(nl); }} className={inputClasses}/></div>
                    <div className="grid grid-cols-2 gap-6">
                      <div><label className={labelClasses}>Edad</label><input value={sched.age} onChange={e => { const nl = [...localSchedules]; nl[idx].age = e.target.value; setLocalSchedules(nl); }} className={inputClasses}/></div>
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
                    <div><label className={labelClasses}>Horario (Ej: 4:00 PM - 5:30 PM)</label><input value={sched.time} onChange={e => { const nl = [...localSchedules]; nl[idx].time = e.target.value; setLocalSchedules(nl); }} className={inputClasses}/></div>
                  </div>
                </div>
              ))}
              <button onClick={() => setLocalSchedules([...localSchedules, { id: Math.random().toString(), category: 'Nuevo Grupo', age: 'Edad', days: [], time: '00:00 - 00:00', duration: '60 min', price: 150, objective: '', color: '#3b82f6' }])} className="p-12 border-4 border-dashed border-slate-200 rounded-[3.5rem] text-slate-300 font-black uppercase text-xs hover:border-blue-300 hover:text-blue-400 transition-all flex flex-col items-center gap-4 bg-slate-50/20"><Plus size={48}/> Añadir Ciclo</button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-16 pb-40">
               {/* Contacto & Social */}
               <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white space-y-10">
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.3em] flex items-center gap-3"><Share2 size={20} className="text-emerald-500"/> Redes Sociales y Contacto</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div><label className={labelClasses}>TikTok URL</label><input value={localConfig.socialTiktok} onChange={e => setLocalConfig({...localConfig, socialTiktok: e.target.value})} className={inputClasses} placeholder="https://tiktok.com/@..."/></div>
                    <div><label className={labelClasses}>Instagram URL</label><input value={localConfig.socialInstagram} onChange={e => setLocalConfig({...localConfig, socialInstagram: e.target.value})} className={inputClasses}/></div>
                    <div><label className={labelClasses}>WhatsApp Central (Ej: 51900000000)</label><input value={localConfig.socialWhatsapp} onChange={e => setLocalConfig({...localConfig, socialWhatsapp: e.target.value})} className={inputClasses}/></div>
                    <div><label className={labelClasses}>Email Academia</label><input value={localConfig.contactEmail} onChange={e => setLocalConfig({...localConfig, contactEmail: e.target.value})} className={inputClasses}/></div>
                    <div className="md:col-span-2"><label className={labelClasses}>Dirección de la Sede</label><input value={localConfig.contactAddress} onChange={e => setLocalConfig({...localConfig, contactAddress: e.target.value})} className={inputClasses}/></div>
                  </div>
               </div>

               {/* Multimedia Web */}
               <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white space-y-10">
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.3em] flex items-center gap-3"><ImageIcon size={20} className="text-rose-500"/> Galería de Portada (Hero Banners)</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {localConfig.heroImages.map((url, i) => (
                      <div key={i} className="relative group rounded-3xl overflow-hidden shadow-lg aspect-video border border-slate-100">
                        <img src={url} className="w-full h-full object-cover" alt="Hero"/>
                        <button onClick={() => setLocalConfig({...localConfig, heroImages: localConfig.heroImages.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                      </div>
                    ))}
                    <button onClick={() => { const u = prompt('Pega la URL de la imagen:'); if(u) setLocalConfig({...localConfig, heroImages: [...localConfig.heroImages, u]}); }} className="aspect-video border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-slate-300 hover:text-blue-500 hover:border-blue-500 transition-all bg-slate-50"><Plus size={32}/>Añadir Imagen</button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'students' && !selectedCategory && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoriesList.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.category)} className="bg-white p-12 rounded-[4rem] shadow-xl border border-white hover:-translate-y-2 transition-all text-left group relative overflow-hidden">
                  <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white mb-8 shadow-2xl group-hover:scale-110 transition-transform" style={{ backgroundColor: cat.color }}><Users size={32}/></div>
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">{cat.category}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.count} Atletas Inscritos</p>
                  <div className="mt-8 flex items-center gap-2 text-blue-600 font-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Gestionar Grupo <ChevronRight size={14}/></div>
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
                  <input type="text" placeholder="Buscar por nombre, papá o cel..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border border-slate-100 outline-none font-bold text-sm shadow-sm"/>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredStudents.map(s => (
                  <div key={s.id} className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-white flex flex-col relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 w-2 h-full ${s.paymentStatus === 'Paid' ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                    
                    <div className="cursor-pointer" onClick={() => setViewingStudent(s)}>
                      <p className="font-black text-xl mb-1 uppercase tracking-tighter leading-none group-hover:text-blue-600 transition-colors">{s.firstName} {s.lastName}</p>
                      <div className="flex items-center gap-2 mb-6">
                        <Phone size={10} className="text-blue-500"/>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.parentPhone}</p>
                      </div>
                      
                      <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Apoderado registrado</p>
                         <p className="text-xs font-black uppercase text-slate-700">{s.parentName || 'No especificado'}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-auto">
                       <button onClick={() => setPaymentStudent(s)} className="flex-grow py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2">
                         <Wallet size={16}/> Cobrar
                       </button>
                       <button onClick={() => setViewingStudent(s)} className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
                         <Info size={18}/>
                       </button>
                       <button onClick={() => onDelete(s.id)} className="p-4 bg-slate-50 text-rose-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
                         <Trash size={18}/>
                       </button>
                    </div>
                  </div>
                ))}
                <button onClick={() => setShowRegisterModal(true)} className="p-10 border-4 border-dashed border-slate-100 rounded-[3.5rem] flex flex-col items-center justify-center gap-4 text-slate-200 hover:text-blue-500 hover:border-blue-500 transition-all"><UserPlus size={48}/> Registrar Alumno</button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* MODALES ADMINISTRATIVOS */}
      <AnimatePresence>
        {/* MODAL DE DETALLES DEL ALUMNO */}
        {viewingStudent && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingStudent(null)} className="fixed inset-0 bg-slate-900/90 backdrop-blur-md"/>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-[4rem] shadow-2xl p-12 overflow-y-auto max-h-[90vh]">
               <button onClick={() => setViewingStudent(null)} className="absolute top-8 right-8 p-3 bg-slate-50 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"><X/></button>
               
               <div className="mb-12 flex items-center gap-6">
                 <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
                    <UserIcon size={48}/>
                 </div>
                 <div>
                   <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 inline-block ${viewingStudent.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                     {viewingStudent.paymentStatus === 'Paid' ? 'Ciclo Pagado' : 'Mensualidad Pendiente'}
                   </span>
                   <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">{viewingStudent.firstName} {viewingStudent.lastName}</h2>
                 </div>
               </div>

               <div className="grid md:grid-cols-2 gap-8 mb-12">
                 <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"><Zap size={14}/> Datos Deportivos</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Star size={16} className="text-slate-400"/>
                        <div><p className="text-[9px] font-black text-slate-400 uppercase leading-none">Categoría</p><p className="text-sm font-black uppercase">{viewingStudent.category}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CalendarDays size={16} className="text-slate-400"/>
                        <div><p className="text-[9px] font-black text-slate-400 uppercase leading-none">Fecha de Nacimiento</p><p className="text-sm font-black uppercase">{viewingStudent.birthDate}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Rocket size={16} className="text-slate-400"/>
                        <div><p className="text-[9px] font-black text-slate-400 uppercase leading-none">Modalidad</p><p className="text-sm font-black uppercase">{viewingStudent.modality}</p></div>
                      </div>
                    </div>
                 </div>

                 <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
                    <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2"><UserIcon size={14}/> Datos del Apoderado</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <UserIcon size={16} className="text-slate-400"/>
                        <div><p className="text-[9px] font-black text-slate-400 uppercase leading-none">Nombre del Padre/Madre</p><p className="text-sm font-black uppercase">{viewingStudent.parentName || 'No registrado'}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-slate-400"/>
                        <div><p className="text-[9px] font-black text-slate-400 uppercase leading-none">Teléfono de Contacto</p><p className="text-sm font-black uppercase">{viewingStudent.parentPhone}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPinIcon size={16} className="text-slate-400"/>
                        <div><p className="text-[9px] font-black text-slate-400 uppercase leading-none">Dirección Domicilio</p><p className="text-sm font-black uppercase">{viewingStudent.address || 'No registrado'}</p></div>
                      </div>
                    </div>
                 </div>
               </div>

               <div className="flex gap-4">
                 <button onClick={() => { setPaymentStudent(viewingStudent); setViewingStudent(null); }} className="flex-grow py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all"><Wallet size={20}/> Procesar Pago WhatsApp</button>
                 <button onClick={() => setViewingStudent(null)} className="px-10 py-6 bg-slate-900 text-white rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all">Cerrar Ficha</button>
               </div>
            </motion.div>
          </div>
        )}

        {showRegisterModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-8 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRegisterModal(false)} className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm"/>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-5xl bg-slate-50 rounded-[4rem] shadow-2xl p-12 overflow-y-auto max-h-[90vh]">
              <button onClick={() => setShowRegisterModal(false)} className="absolute top-8 right-8 p-4 bg-white rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-xl"><X/></button>
              <h2 className="text-4xl font-black uppercase text-center mb-12 tracking-tighter">Nueva Matrícula Administrativa</h2>
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
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CreditCard size={40}/>
              </div>
              <h2 className="text-3xl font-black uppercase mb-4 tracking-tighter">Registrar Pago</h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-12">Confirma que has recibido el voucher por WhatsApp para {paymentStudent.firstName}</p>
              
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
                alert('¡Cobro registrado! La ficha del alumno se ha actualizado con éxito.');
              }} className="space-y-8">
                <div>
                  <label className={labelClasses}>Fecha del Próximo Cobro</label>
                  <input required name="nextDate" type="date" className={inputClasses} defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}/>
                </div>
                <button type="submit" className="w-full py-7 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-sm tracking-widest hover:bg-emerald-700 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3">
                  <CheckCircle2 size={20}/> CONFIRMAR RECEPCIÓN
                </button>
                <button type="button" onClick={() => setPaymentStudent(null)} className="w-full py-4 text-slate-400 font-black uppercase text-[10px] hover:text-rose-500 transition-colors">Cancelar Cobro</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
