
import React, { useState, useMemo } from 'react';
import { Student, AcademyConfig, ClassSchedule, IntroSlide, StaffStory } from '../types';
import { 
  Search, X, LogOut, Users, 
  LayoutDashboard, DollarSign, AlertCircle, 
  ChevronRight, Layout, Zap, ChevronLeft, Phone, MessageCircle, Edit3, Trash, Calendar,
  Save, UserPlus, Image as ImageIcon, CheckCircle, Clock, MapPin, Plus,
  Layers, Settings, ExternalLink, Trash2, Camera, Info, Wallet, CreditCard, Play, Star, PlusCircle, Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SCHEDULES } from '../constants';

interface AdminDashboardProps {
  students: Student[];
  config: AcademyConfig;
  onUpdateConfig: (config: AcademyConfig) => Promise<boolean>;
  onRegister: (student: Student) => void;
  onUpdateStudent: (student: Student) => Promise<boolean>;
  onDelete: (id: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  students, config, onUpdateConfig, onRegister, onUpdateStudent, onDelete, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'finance' | 'settings'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [paymentStudent, setPaymentStudent] = useState<Student | null>(null);
  
  // Local Config State for CMS (Visual Edition)
  const [localConfig, setLocalConfig] = useState<AcademyConfig>({ 
    ...config,
    staffStories: config.staffStories || [],
    heroImages: config.heroImages || [],
    aboutImages: config.aboutImages || [],
    introSlides: config.introSlides || []
  });

  const categoriesList = useMemo(() => {
    return Array.from(new Set(SCHEDULES.map(s => s.category))).map(cat => ({
      name: cat,
      count: students.filter(s => s.category === cat).length,
      ageRange: SCHEDULES.find(s => s.category === cat)?.age || 'N/A',
      color: SCHEDULES.find(s => s.category === cat)?.color || '#3b82f6'
    }));
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      (!selectedCategory || s.category === selectedCategory) &&
      (`${s.firstName} ${s.lastName} ${s.parentPhone} ${s.parentName}`.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [students, selectedCategory, searchTerm]);

  const stats = useMemo(() => ({
    total: students.length,
    income: students.filter(s => s.paymentStatus === 'Paid').length * 50,
    pending: students.filter(s => s.paymentStatus !== 'Paid').length
  }), [students]);

  const handleSaveConfig = async () => {
    const success = await onUpdateConfig(localConfig);
    if (success) alert('¡Web actualizada con éxito! Refresca para ver los cambios.');
  };

  const updateListField = (field: keyof AcademyConfig, index: number, value: any) => {
    const newList: any = [...(localConfig[field] as any[])];
    newList[index] = value;
    setLocalConfig({ ...localConfig, [field]: newList });
  };

  const addItemToList = (field: keyof AcademyConfig, defaultValue: any) => {
    setLocalConfig({ ...localConfig, [field]: [...(localConfig[field] as any[]), defaultValue] });
  };

  const removeItemFromList = (field: keyof AcademyConfig, index: number) => {
    const newList: any = [...(localConfig[field] as any[])];
    newList.splice(index, 1);
    setLocalConfig({ ...localConfig, [field]: newList });
  };

  const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1";
  const inputClasses = "w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm font-bold transition-all shadow-inner";

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-slate-900 font-ubuntu">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-900 m-4 rounded-[2.5rem] text-white flex flex-col p-8 shadow-2xl z-30">
        <div className="mb-12 flex items-center gap-4 px-2">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="text-white fill-white" size={28} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter">ATHLETIC</span>
            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mt-1">SISTEMA INTEGRAL</span>
          </div>
        </div>
        
        <nav className="space-y-2 flex-grow">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Resumen' },
            { id: 'students', icon: Users, label: 'Alumnos y Grupos' },
            { id: 'finance', icon: Wallet, label: 'Caja y Cobranzas' },
            { id: 'settings', icon: Settings, label: 'Personalización Web' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => { setActiveTab(item.id as any); setSelectedCategory(null); }} 
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] font-bold text-sm transition-all ${activeTab === item.id ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon size={20}/> {item.label}
            </button>
          ))}
        </nav>

        <button onClick={onLogout} className="mt-auto flex items-center gap-4 px-5 py-4 text-rose-400 font-bold text-sm hover:bg-rose-500/10 rounded-[1.5rem] transition-all">
          <LogOut size={20}/> Salir
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto p-12 scroll-smooth">
        <header className="flex justify-between items-end mb-12">
          <div>
            <p className="text-blue-600 font-black text-[10px] tracking-[0.3em] uppercase mb-2">Administración Élite</p>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">
              {activeTab === 'overview' && 'Panel Principal'}
              {activeTab === 'students' && (selectedCategory ? selectedCategory : 'Categorías')}
              {activeTab === 'finance' && 'Control Financiero'}
              {activeTab === 'settings' && 'Diseño de Web'}
            </h1>
          </div>
          
          <div className="flex gap-4">
            {(activeTab === 'students' || activeTab === 'finance') && (
              <button onClick={() => setShowAddModal(true)} className="flex items-center gap-3 px-8 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-blue-700 transition-all">
                <Plus size={20}/> Nuevo Alumno
              </button>
            )}
            {selectedCategory && (
              <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-2 px-6 py-4 bg-white text-slate-400 font-black text-xs uppercase rounded-2xl hover:text-slate-900 transition-all shadow-sm border border-slate-100">
                <ChevronLeft size={18}/> Ver Grupos
              </button>
            )}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-white">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8"><Users size={32}/></div>
                <p className={labelClasses}>Alumnos</p>
                <p className="text-6xl font-black">{stats.total}</p>
              </div>
              <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-white">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8"><DollarSign size={32}/></div>
                <p className={labelClasses}>Ingresos Totales</p>
                <p className="text-6xl font-black">S/ {stats.income}</p>
              </div>
              <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-white">
                <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-8"><AlertCircle size={32}/></div>
                <p className={labelClasses}>Deudas</p>
                <p className="text-6xl font-black">{stats.pending}</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'students' && !selectedCategory && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoriesList.map(cat => (
                <button 
                  key={cat.name} 
                  onClick={() => setSelectedCategory(cat.name)}
                  className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-white hover:border-blue-200 hover:-translate-y-2 transition-all text-left flex flex-col group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-12">
                    <span className="px-5 py-2 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400">{cat.ageRange}</span>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20" style={{ backgroundColor: cat.color }}><Users size={24}/></div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 leading-tight mb-2">{cat.name}</h3>
                  <div className="mt-auto pt-8 border-t border-slate-50 flex justify-between items-center w-full">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{cat.count} Alumnos Registrados</p>
                    <ChevronRight size={22} className="text-slate-300 group-hover:translate-x-2 transition-all"/>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {(activeTab === 'students' || activeTab === 'finance') && (selectedCategory || activeTab === 'finance') && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={24}/>
                <input type="text" placeholder="Buscar por alumno, DNI o WhatsApp..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-16 pr-8 py-7 bg-white rounded-[2.5rem] border-none shadow-xl outline-none font-bold text-xl placeholder:text-slate-300"/>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {filteredStudents.map(s => (
                   <div key={s.id} className="bg-white p-8 rounded-[3rem] shadow-xl border border-white flex flex-col group relative overflow-hidden hover:border-blue-100 transition-all">
                      <div className={`absolute top-0 right-0 w-3 h-full ${s.paymentStatus === 'Paid' ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                      <div className="flex items-center gap-6 mb-8">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 font-black text-3xl shadow-inner border border-slate-100 uppercase">{s.firstName[0]}</div>
                        <div>
                          <p className="font-black text-xl text-slate-900 leading-tight">{s.firstName} {s.lastName}</p>
                          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">{s.category}</p>
                        </div>
                      </div>
                      <div className="space-y-4 mb-8 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase">
                          <span className="flex items-center gap-2"><Phone size={14} className="text-slate-400"/> {s.parentPhone}</span>
                          <span className="opacity-40">{s.parentName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600 uppercase">
                          <Calendar size={14} className="text-slate-400"/> Vence: <span className={s.paymentStatus !== 'Paid' ? 'text-rose-600' : 'text-emerald-600'}>{s.nextPaymentDate || 'Pendiente'}</span>
                        </div>
                        <div className={`text-[9px] font-black uppercase text-center py-2.5 rounded-xl mt-4 ${s.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                          {s.paymentStatus === 'Paid' ? 'CUOTA AL DÍA' : 'DEUDA PENDIENTE'}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <button onClick={() => setPaymentStudent(s)} className="flex-grow py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"><Wallet size={16}/> Cobrar</button>
                        <button onClick={() => setEditingStudent(s)} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={18}/></button>
                        <button onClick={() => onDelete(s.id)} className="p-4 bg-slate-50 text-rose-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"><Trash size={18}/></button>
                      </div>
                   </div>
                 ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
               {/* Sección General */}
               <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white">
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.3em] flex items-center gap-3 mb-10">
                    <Star size={20} className="text-blue-600"/> Identidad de la Academia
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div><label className={labelClasses}>URL del Logo Principal</label><input value={localConfig.logoUrl} onChange={e => setLocalConfig({...localConfig, logoUrl: e.target.value})} className={inputClasses}/></div>
                    <div><label className={labelClasses}>Mensaje de Bienvenida (Slogan)</label><input value={localConfig.welcomeMessage} onChange={e => setLocalConfig({...localConfig, welcomeMessage: e.target.value})} className={inputClasses}/></div>
                  </div>
               </div>

               {/* Banners Hero */}
               <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.3em] flex items-center gap-3">
                      <ImageIcon size={20} className="text-emerald-500"/> Banners Principales (Hero)
                    </h3>
                    <button onClick={() => addItemToList('heroImages', '')} className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all">
                      <PlusCircle size={16}/> Añadir Banner
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {localConfig.heroImages.map((url, idx) => (
                      <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                        <div className="flex items-center gap-4">
                          <input value={url} onChange={e => updateListField('heroImages', idx, e.target.value)} className={inputClasses} placeholder="Pega el link de la imagen aquí..."/>
                          <button onClick={() => removeItemFromList('heroImages', idx)} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={20}/></button>
                        </div>
                        {url && <img src={url} className="w-full h-32 object-cover rounded-2xl shadow-sm border border-white" alt="Preview"/>}
                      </div>
                    ))}
                  </div>
               </div>

               {/* Intro Portal Slides */}
               <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.3em] flex items-center gap-3">
                      <Play size={20} className="text-rose-500"/> Diapositivas de Entrada (Intro Portal)
                    </h3>
                    <button onClick={() => addItemToList('introSlides', { id: Math.random().toString(), type: 'video', url: '', title: '', subtitle: '', duration: 5000 })} className="flex items-center gap-2 text-rose-600 font-black text-[10px] uppercase tracking-widest bg-rose-50 px-4 py-2 rounded-xl hover:bg-rose-100 transition-all">
                      <PlusCircle size={16}/> Añadir Diapositiva
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {localConfig.introSlides.map((slide, idx) => (
                      <div key={idx} className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4"><button onClick={() => removeItemFromList('introSlides', idx)} className="text-rose-400 hover:text-rose-600"><X size={24}/></button></div>
                        <div className="grid gap-4">
                          <div><label className={labelClasses}>Tipo</label>
                            <select value={slide.type} onChange={e => updateListField('introSlides', idx, {...slide, type: e.target.value})} className={inputClasses}>
                              <option value="image">Imagen</option><option value="video">Video</option>
                            </select>
                          </div>
                          <div><label className={labelClasses}>URL del Media</label><input value={slide.url} onChange={e => updateListField('introSlides', idx, {...slide, url: e.target.value})} className={inputClasses} placeholder="https://..."/></div>
                          <div><label className={labelClasses}>Título Principal</label><input value={slide.title} onChange={e => updateListField('introSlides', idx, {...slide, title: e.target.value})} className={inputClasses}/></div>
                          <div><label className={labelClasses}>Subtítulo</label><input value={slide.subtitle} onChange={e => updateListField('introSlides', idx, {...slide, subtitle: e.target.value})} className={inputClasses}/></div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Staff Stories */}
               <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.3em] flex items-center gap-3">
                      <Play size={20} className="text-amber-500"/> Carrusel del Staff (Historias)
                    </h3>
                    <button onClick={() => addItemToList('staffStories', { id: Math.random().toString(), name: '', role: '', url: '', type: 'video', duration: 10000 })} className="flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-widest bg-amber-50 px-4 py-2 rounded-xl hover:bg-amber-100 transition-all">
                      <PlusCircle size={16}/> Añadir Miembro
                    </button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {localConfig.staffStories?.map((story, idx) => (
                      <div key={idx} className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 space-y-4 relative">
                        <button onClick={() => removeItemFromList('staffStories', idx)} className="absolute top-4 right-4 text-rose-400 hover:text-rose-600"><X size={20}/></button>
                        <div><label className={labelClasses}>Nombre</label><input value={story.name} onChange={e => updateListField('staffStories', idx, {...story, name: e.target.value})} className={inputClasses}/></div>
                        <div><label className={labelClasses}>Cargo/Rol</label><input value={story.role} onChange={e => updateListField('staffStories', idx, {...story, role: e.target.value})} className={inputClasses}/></div>
                        <div><label className={labelClasses}>URL Foto/Video</label><input value={story.url} onChange={e => updateListField('staffStories', idx, {...story, url: e.target.value})} className={inputClasses}/></div>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Botón Flotante de Guardar */}
               <div className="sticky bottom-8 z-40 flex justify-center">
                  <button onClick={handleSaveConfig} className="flex items-center gap-4 px-12 py-7 bg-blue-600 text-white rounded-[2.5rem] font-black uppercase text-sm tracking-[0.4em] shadow-[0_20px_60px_-15px_rgba(37,99,235,0.6)] hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all">
                    <Save size={28}/> GUARDAR TODOS LOS CAMBIOS
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* MODAL COBRAR PAGO */}
      <AnimatePresence>
        {paymentStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPaymentStudent(null)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"/>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} className="relative w-full max-w-md bg-white rounded-[4rem] p-16 shadow-2xl">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-black uppercase tracking-tighter">Cobrar Alumno</h2>
                <button onClick={() => setPaymentStudent(null)} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all"><X/></button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const updated: Student = {
                  ...paymentStudent,
                  paymentStatus: 'Paid',
                  modality: fd.get('method') as string,
                  nextPaymentDate: fd.get('nextDate') as string
                };
                await onUpdateStudent(updated);
                setPaymentStudent(null);
                alert('Pago registrado correctamente.');
              }} className="space-y-8">
                <div><label className={labelClasses}>Monto (S/)</label><input required name="amount" type="number" defaultValue="50" className={inputClasses}/></div>
                <div><label className={labelClasses}>Medio de Pago</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Yape', 'Plin', 'BCP', 'Efectivo'].map(m => (
                      <label key={m} className="relative cursor-pointer">
                        <input type="radio" name="method" value={m} defaultChecked={m==='Yape'} className="peer sr-only" />
                        <div className="p-4 border border-slate-100 rounded-2xl text-center font-bold text-xs uppercase transition-all peer-checked:bg-blue-600 peer-checked:text-white">
                          {m}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div><label className={labelClasses}>Próximo Vencimiento</label><input required name="nextDate" type="date" className={inputClasses} defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}/></div>
                <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-sm tracking-widest hover:bg-emerald-600 transition-all shadow-xl">PROCESAR PAGO</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL NUEVO ALUMNO */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"/>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} className="relative w-full max-w-4xl bg-white rounded-[4.5rem] p-16 shadow-2xl max-h-[90vh] overflow-y-auto">
               <div className="flex justify-between items-center mb-12">
                  <h2 className="text-4xl font-black uppercase tracking-tighter">Nueva Matrícula</h2>
                  <button onClick={() => setShowAddModal(false)} className="p-5 bg-slate-50 text-slate-400 rounded-3xl hover:bg-slate-900 hover:text-white transition-all"><X size={24}/></button>
               </div>
               
               <form onSubmit={(e) => {
                 e.preventDefault();
                 const fd = new FormData(e.currentTarget);
                 const newStudent: Student = {
                   id: Math.random().toString(36).substr(2, 9),
                   registrationDate: new Date().toISOString(),
                   firstName: fd.get('firstName') as string, lastName: fd.get('lastName') as string,
                   birthDate: fd.get('birthDate') as string, category: fd.get('category') as string,
                   modality: fd.get('paymentMethod') as string, parentName: fd.get('parentName') as string,
                   parentPhone: fd.get('parentPhone') as string, address: fd.get('address') as string,
                   scheduleId: 'manual', paymentStatus: fd.get('hasPaid') === 'on' ? 'Paid' : 'Pending',
                   nextPaymentDate: fd.get('nextDate') as string,
                   qrCode: `ATH-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
                 };
                 onRegister(newStudent);
                 setShowAddModal(false);
               }} className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Información del Alumno</p>
                    <div className="grid gap-6">
                      <div><label className={labelClasses}>Nombres</label><input required name="firstName" className={inputClasses}/></div>
                      <div><label className={labelClasses}>Apellidos</label><input required name="lastName" className={inputClasses}/></div>
                      <div><label className={labelClasses}>Grupo/Categoría</label>
                        <select name="category" className={inputClasses}>
                          {SCHEDULES.map(s => <option key={s.id} value={s.category}>{s.category}</option>)}
                        </select>
                      </div>
                      <div><label className={labelClasses}>Fecha Nacimiento</label><input required type="date" name="birthDate" className={inputClasses}/></div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Cobro Inicial</p>
                    <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 shadow-inner space-y-6">
                      <div className="flex items-center justify-between"><label className="text-sm font-black text-slate-700 uppercase">¿Registrar Pago?</label><input type="checkbox" name="hasPaid" defaultChecked className="w-6 h-6 rounded-lg accent-emerald-500" /></div>
                      <div><label className={labelClasses}>Medio</label>
                        <select name="paymentMethod" className={inputClasses}>
                          <option value="Yape">Yape</option><option value="Plin">Plin</option><option value="BCP">BCP</option><option value="Efectivo">Efectivo</option>
                        </select>
                      </div>
                      <div><label className={labelClasses}>Próximo Vencimiento</label><input required name="nextDate" type="date" className={inputClasses} defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}/></div>
                    </div>
                  </div>
                  <div className="md:col-span-2 pt-6 border-t border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Datos de Contacto</p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div><label className={labelClasses}>Apoderado</label><input required name="parentName" className={inputClasses}/></div>
                      <div><label className={labelClasses}>Celular WhatsApp</label><input required name="parentPhone" className={inputClasses}/></div>
                      <div className="md:col-span-2"><label className={labelClasses}>Dirección</label><input required name="address" className={inputClasses}/></div>
                    </div>
                  </div>
                  <div className="md:col-span-2 mt-8">
                    <button type="submit" className="w-full py-7 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase text-sm tracking-widest shadow-2xl active:scale-95 transition-all">INSCRIBIR Y COBRAR</button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
