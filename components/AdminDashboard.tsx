import React, { useState, useMemo, useEffect } from 'react';
import { Student, PaymentRecord, AcademyConfig, IntroSlide } from '../types';
import { 
  Search, X, CreditCard, Clock, LogOut, Users, 
  LayoutDashboard, DollarSign, TrendingUp, AlertCircle, 
  ChevronRight, Save, RefreshCcw, Layout, Video, 
  Plus, Trash, Check, History, Edit3, MessageCircle, Image as ImageIcon, Type, Zap, ChevronLeft, UserPlus, Phone, Calendar, Trash2
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

type AdminTab = 'overview' | 'students' | 'finance' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  students, config, onUpdateConfig, onRegister, onUpdateStudent, onDelete, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [newStudentForm, setNewStudentForm] = useState<Partial<Student>>({
    firstName: '', lastName: '', category: SCHEDULES[0].category, modality: 'Mensual Regular',
    parentName: '', parentPhone: '', parentEmail: '', paymentStatus: 'Pending', birthDate: ''
  });

  // Estado temporal para la configuración
  const [tempConfig, setTempConfig] = useState<AcademyConfig>({...config});

  // Sincronizar cuando la config base cambie (ej: tras guardar)
  useEffect(() => {
    setTempConfig({...config});
  }, [config]);

  const categoriesList = useMemo(() => {
    const unique = Array.from(new Set(SCHEDULES.map(s => s.category)));
    return unique.map(cat => ({
      name: cat,
      count: students.filter(s => s.category === cat).length,
      ageRange: SCHEDULES.find(s => s.category === cat)?.age || 'N/A'
    }));
  }, [students]);

  const filteredStudentsInCategory = useMemo(() => {
    if (!selectedCategory) return [];
    return students.filter(s => 
      s.category === selectedCategory && 
      (`${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [students, selectedCategory, searchTerm]);

  const financeStats = useMemo(() => {
    const totalCollected = students.reduce((acc, s) => {
      return acc + (s.paymentHistory?.reduce((sum, p) => sum + p.amount, 0) || 0);
    }, 0);
    return { totalCollected, pending: students.filter(s => s.paymentStatus !== 'Paid').length };
  }, [students]);

  const handleCreateStudent = () => {
    const student: any = {
      ...newStudentForm,
      qrCode: `ATH-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      nextPaymentDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      registrationDate: new Date().toISOString(),
      paymentHistory: [],
      attendanceHistory: []
    };
    onRegister(student);
    setShowAddModal(false);
    setNewStudentForm({firstName: '', lastName: '', category: SCHEDULES[0].category, modality: 'Mensual Regular', parentName: '', parentPhone: '', parentEmail: '', paymentStatus: 'Pending', birthDate: ''});
  };

  const handleUpdate = async () => {
    if (editingStudent) {
      const success = await onUpdateStudent(editingStudent);
      if (success) setEditingStudent(null);
    }
  };

  // Handlers para Configuración
  const addHeroImage = () => setTempConfig({...tempConfig, heroImages: [...(tempConfig.heroImages || []), '']});
  const removeHeroImage = (index: number) => setTempConfig({...tempConfig, heroImages: tempConfig.heroImages.filter((_, i) => i !== index)});
  const updateHeroImage = (index: number, val: string) => {
    const newImages = [...tempConfig.heroImages];
    newImages[index] = val;
    setTempConfig({...tempConfig, heroImages: newImages});
  };

  const addIntroSlide = () => {
    const newSlide: IntroSlide = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'image',
      url: '',
      title: 'NUEVO TÍTULO',
      subtitle: 'NUEVO SUBTÍTULO',
      duration: 5000
    };
    setTempConfig({...tempConfig, introSlides: [...(tempConfig.introSlides || []), newSlide]});
  };

  const removeIntroSlide = (id: string) => setTempConfig({...tempConfig, introSlides: tempConfig.introSlides.filter(s => s.id !== id)});
  
  const updateIntroSlide = (id: string, updates: Partial<IntroSlide>) => {
    setTempConfig({
      ...tempConfig,
      introSlides: tempConfig.introSlides.map(s => s.id === id ? {...s, ...updates} : s)
    });
  };

  const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5";
  const inputClasses = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm font-medium transition-all";

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden text-slate-900 font-ubuntu">
      {/* Sidebar Fija */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col p-6 shadow-2xl z-30">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><Zap size={22} className="fill-white" /></div>
          <span className="font-black text-lg tracking-tight uppercase">ATHLETIC</span>
        </div>

        <nav className="space-y-1.5 flex-grow">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Resumen' },
            { id: 'students', icon: Users, label: 'Alumnos' },
            { id: 'finance', icon: DollarSign, label: 'Finanzas' },
            { id: 'settings', icon: Layout, label: 'Personalizar' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id as AdminTab); setSelectedCategory(null); }} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto flex items-center gap-3 px-4 py-3.5 text-red-400 font-bold text-sm hover:bg-red-400/10 rounded-xl transition-all"><LogOut size={18}/> Salir</button>
      </aside>

      <main className="flex-grow overflow-y-auto p-10 relative bg-[#f8fafc]">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              {activeTab === 'overview' && 'Panel Principal'}
              {activeTab === 'students' && (selectedCategory ? `Grupo: ${selectedCategory}` : 'Grupos Académicos')}
              {activeTab === 'finance' && 'Ingresos'}
              {activeTab === 'settings' && 'Configuración Web'}
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Gestión Centralizada Supabase</p>
          </div>
          {activeTab === 'students' && !selectedCategory && (
            <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs flex items-center gap-2 shadow-xl uppercase tracking-widest hover:bg-blue-700 transition-all">
              <UserPlus size={16}/> Nueva Inscripción
            </button>
          )}
          {activeTab === 'settings' && (
            <button 
              onClick={async () => { 
                setIsSyncing(true); 
                const success = await onUpdateConfig(tempConfig); 
                setIsSyncing(false); 
                if(success) alert('¡Configuración guardada en la nube!');
              }} 
              className="bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs flex items-center gap-2 uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all"
            >
               {isSyncing ? <RefreshCcw className="animate-spin"/> : <Save/>} Guardar Cambios
            </button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6"><Users size={24}/></div>
                <div>
                  <p className={labelClasses}>Alumnos Activos</p>
                  <p className="text-4xl font-black">{students.length}</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6"><DollarSign size={24}/></div>
                <div>
                  <p className={labelClasses}>Recaudación Total</p>
                  <p className="text-4xl font-black">S/ {financeStats.totalCollected}</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-6"><AlertCircle size={24}/></div>
                <div>
                  <p className={labelClasses}>Pagos Pendientes</p>
                  <p className="text-4xl font-black">{financeStats.pending}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && !selectedCategory && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoriesList.map(cat => (
                <button 
                  key={cat.name} 
                  onClick={() => setSelectedCategory(cat.name)}
                  className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all text-left group flex flex-col"
                >
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                      <Users size={28}/>
                    </div>
                    <span className="bg-blue-50 px-4 py-1.5 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest">{cat.ageRange}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{cat.name}</h3>
                  <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center w-full">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{cat.count} Alumnos</p>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"/>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {activeTab === 'students' && selectedCategory && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex gap-4 items-center">
                 <button onClick={() => setSelectedCategory(null)} className="p-4 bg-white rounded-2xl shadow-sm hover:bg-slate-50 transition-all border border-slate-100"><ChevronLeft/></button>
                 <div className="flex-grow relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                    <input type="text" placeholder="Filtrar por nombre..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border-none shadow-sm outline-none font-bold text-sm"/>
                 </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredStudentsInCategory.map(s => (
                   <div key={s.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col group relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-2 h-full ${s.paymentStatus === 'Paid' ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                      
                      <div className="flex items-center gap-4 mb-6">
                         <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-slate-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl shadow-inner">{s.firstName[0]}</div>
                         <div>
                            <p className="font-black text-sm text-slate-900 leading-tight">{s.firstName} {s.lastName}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                               <div className={`w-1.5 h-1.5 rounded-full ${s.paymentStatus === 'Paid' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.paymentStatus === 'Paid' ? 'Al Día' : 'Deuda Vencida'}</p>
                            </div>
                         </div>
                      </div>
                      
                      <div className="space-y-3 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                         <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase">
                            <Phone size={14} className="text-slate-300"/> {s.parentPhone}
                         </div>
                         <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase">
                            <Calendar size={14} className="text-slate-300"/> {s.nextPaymentDate}
                         </div>
                      </div>

                      <div className="flex gap-2 mt-auto">
                         <button onClick={() => setEditingStudent(s)} className="flex-grow py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all flex items-center justify-center gap-2">
                           <Edit3 size={14}/> Gestionar
                         </button>
                         <button onClick={() => onDelete(s.id)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash size={18}/></button>
                      </div>
                   </div>
                 ))}
                 {filteredStudentsInCategory.length === 0 && (
                   <div className="col-span-full py-24 text-center text-slate-400 font-black uppercase tracking-widest bg-white rounded-[3rem] border border-dashed border-slate-200">No hay registros en este grupo</div>
                 )}
              </div>
            </motion.div>
          )}

          {activeTab === 'finance' && (
             <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 overflow-hidden">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black uppercase tracking-tight">Caja Supabase (Ingresos)</h3>
                  <div className="bg-emerald-50 text-emerald-600 px-6 py-2.5 rounded-2xl font-black text-sm shadow-sm">TOTAL: S/ {financeStats.totalCollected}</div>
                </div>
                <div className="space-y-4">
                   {students.flatMap(s => (s.paymentHistory || []).map(p => ({...p, studentName: `${s.firstName} ${s.lastName}`})))
                    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((p,i) => (
                      <div key={i} className="flex justify-between items-center p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                         <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shadow-inner"><Check size={22}/></div>
                            <div>
                               <p className="font-black text-sm text-slate-900">{p.studentName}</p>
                               <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{p.date.split('T')[0]} • {p.method}</p>
                            </div>
                         </div>
                         <p className="text-xl font-black text-slate-900">S/ {p.amount}</p>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === 'settings' && (
             <div className="space-y-12 pb-24 max-w-5xl">
                {/* 1. Logo y Marca */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                   <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-3 mb-10">
                      <Zap size={20} className="text-blue-600"/> Marca & Identidad
                   </h3>
                   <div className="grid md:grid-cols-2 gap-10">
                      <div>
                        <label className={labelClasses}>URL del Logo Principal</label>
                        <input value={tempConfig.logoUrl} onChange={e => setTempConfig({...tempConfig, logoUrl: e.target.value})} className={inputClasses} placeholder="https://..."/>
                        <p className="text-[10px] text-slate-400 mt-4 font-bold uppercase">Aparece en Navbar, Footer e Intro.</p>
                      </div>
                      <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                         {tempConfig.logoUrl ? <img src={tempConfig.logoUrl} className="h-20 object-contain drop-shadow-md"/> : <div className="w-16 h-16 bg-slate-200 rounded-xl"/>}
                      </div>
                   </div>
                </div>

                {/* 2. Hero Slider */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                   <div className="flex justify-between items-center mb-10">
                      <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-3">
                         <ImageIcon size={20} className="text-emerald-600"/> Galería Hero (Principal)
                      </h3>
                      <button onClick={addHeroImage} className="text-blue-600 font-black text-[10px] uppercase flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">
                        <Plus size={14}/> Añadir Imagen
                      </button>
                   </div>
                   <div className="space-y-4">
                      {tempConfig.heroImages?.map((img, i) => (
                        <div key={i} className="flex gap-4 items-center bg-slate-50 p-3 rounded-2xl">
                           <div className="w-16 h-16 rounded-xl bg-slate-200 overflow-hidden shrink-0 shadow-inner">
                              <img src={img} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}/>
                           </div>
                           <input value={img} onChange={e => updateHeroImage(i, e.target.value)} className={inputClasses} placeholder="https://unsplash.com/photo..."/>
                           <button onClick={() => removeHeroImage(i)} className="p-3 text-rose-500 hover:bg-rose-100 rounded-xl transition-all"><Trash2 size={18}/></button>
                        </div>
                      ))}
                      {(!tempConfig.heroImages || tempConfig.heroImages.length === 0) && (
                        <p className="text-center py-4 text-slate-400 text-xs font-bold uppercase">No hay imágenes configuradas</p>
                      )}
                   </div>
                </div>

                {/* 3. Mensaje de Bienvenida */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                   <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-3 mb-10">
                      <MessageCircle size={20} className="text-blue-500"/> Mensaje de Bienvenida
                   </h3>
                   <label className={labelClasses}>Texto de Campaña / Avisos</label>
                   <textarea 
                     value={tempConfig.welcomeMessage} 
                     onChange={e => setTempConfig({...tempConfig, welcomeMessage: e.target.value})} 
                     className={`${inputClasses} min-h-[100px] resize-none pt-4`}
                     placeholder="Ej: Inscripciones 2024 abiertas..."
                   />
                </div>

                {/* 4. Intro Portal Experience */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                   <div className="flex justify-between items-center mb-10">
                      <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-3">
                         <Video size={20} className="text-rose-500"/> Experiencia de Inicio (Stories)
                      </h3>
                      <button onClick={addIntroSlide} className="text-blue-600 font-black text-[10px] uppercase flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">
                        <Plus size={14}/> Añadir Story
                      </button>
                   </div>
                   <div className="grid gap-8">
                      {tempConfig.introSlides?.map((slide) => (
                        <div key={slide.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 relative group">
                           <button onClick={() => removeIntroSlide(slide.id)} className="absolute top-6 right-6 p-3 text-rose-500 bg-white shadow-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"><Trash2 size={18}/></button>
                           
                           <div className="grid md:grid-cols-2 gap-8">
                              <div className="space-y-6">
                                 <div>
                                    <label className={labelClasses}>Tipo de Contenido</label>
                                    <div className="flex gap-2">
                                       <button onClick={() => updateIntroSlide(slide.id, {type: 'video'})} className={`flex-grow py-3 rounded-xl text-[10px] font-black uppercase transition-all ${slide.type === 'video' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400'}`}>Video</button>
                                       <button onClick={() => updateIntroSlide(slide.id, {type: 'image'})} className={`flex-grow py-3 rounded-xl text-[10px] font-black uppercase transition-all ${slide.type === 'image' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400'}`}>Imagen</button>
                                    </div>
                                 </div>
                                 <div>
                                    <label className={labelClasses}>URL del Archivo</label>
                                    <input value={slide.url} onChange={e => updateIntroSlide(slide.id, {url: e.target.value})} className={inputClasses} placeholder="https://...mp4 o .jpg"/>
                                 </div>
                              </div>
                              <div className="space-y-6">
                                 <div>
                                    <label className={labelClasses}>Título Principal</label>
                                    <input value={slide.title} onChange={e => updateIntroSlide(slide.id, {title: e.target.value})} className={inputClasses} placeholder="EL COMIENZO..."/>
                                 </div>
                                 <div>
                                    <label className={labelClasses}>Subtítulo</label>
                                    <input value={slide.subtitle} onChange={e => updateIntroSlide(slide.id, {subtitle: e.target.value})} className={inputClasses} placeholder="DE UNA LEYENDA..."/>
                                 </div>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* 5. Imágenes Sección Nosotros */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                   <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-3 mb-10">
                      <Layout size={20} className="text-amber-500"/> Fotos Sección "Nosotros" (4 Fotos)
                   </h3>
                   <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Array.from({length: 4}).map((_, i) => (
                        <div key={i} className="space-y-3">
                           <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden shadow-inner border border-slate-200">
                              <img src={tempConfig.aboutImages?.[i] || ''} className="w-full h-full object-cover" onError={e => e.currentTarget.src = 'https://via.placeholder.com/150'}/>
                           </div>
                           <input 
                             value={tempConfig.aboutImages?.[i] || ''} 
                             onChange={e => {
                               const newImgs = [...(tempConfig.aboutImages || [])];
                               while(newImgs.length < 4) newImgs.push('');
                               newImgs[i] = e.target.value;
                               setTempConfig({...tempConfig, aboutImages: newImgs});
                             }} 
                             className={`${inputClasses} !py-2 !px-3 text-[10px]`} 
                             placeholder={`Foto ${i+1} URL`}
                           />
                        </div>
                      ))}
                   </div>
                </div>

             </div>
          )}
        </AnimatePresence>
      </main>

      {/* MODAL EDITAR / GESTIONAR ALUMNO */}
      <AnimatePresence>
         {editingStudent && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingStudent(null)} className="absolute inset-0 bg-slate-900/70 backdrop-blur-md cursor-pointer"/>
             <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl p-10 max-h-[90vh] overflow-y-auto border border-white/20">
                <div className="flex justify-between items-center mb-10">
                   <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl text-white text-2xl font-black flex items-center justify-center shadow-xl shadow-blue-500/30">{editingStudent.firstName[0]}</div>
                      <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight leading-none mb-1">{editingStudent.firstName} {editingStudent.lastName}</h2>
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Expediente de Jugador</span>
                      </div>
                   </div>
                   <button onClick={() => setEditingStudent(null)} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all shadow-inner"><X/></button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                   <div><label className={labelClasses}>Nombres Atleta</label><input value={editingStudent.firstName} onChange={e => setEditingStudent({...editingStudent, firstName: e.target.value})} className={inputClasses}/></div>
                   <div><label className={labelClasses}>Apellidos Atleta</label><input value={editingStudent.lastName} onChange={e => setEditingStudent({...editingStudent, lastName: e.target.value})} className={inputClasses}/></div>
                   <div><label className={labelClasses}>F. Nacimiento</label><input type="date" value={editingStudent.birthDate} onChange={e => setEditingStudent({...editingStudent, birthDate: e.target.value})} className={inputClasses}/></div>
                   <div><label className={labelClasses}>Cambiar Grupo</label>
                      <select value={editingStudent.category} onChange={e => setEditingStudent({...editingStudent, category: e.target.value})} className={inputClasses}>
                        {Array.from(new Set(SCHEDULES.map(s => s.category))).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                   </div>
                   <div><label className={labelClasses}>Estado Administrativo</label>
                      <select value={editingStudent.paymentStatus} onChange={e => setEditingStudent({...editingStudent, paymentStatus: e.target.value as any})} className={`${inputClasses} ${editingStudent.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        <option value="Paid">✓ AL DÍA (Pagado)</option><option value="Pending">⚠ PENDIENTE</option><option value="Overdue">✖ DEUDA VENCIDA</option>
                      </select>
                   </div>
                   <div><label className={labelClasses}>Celular del Apoderado</label><input value={editingStudent.parentPhone} onChange={e => setEditingStudent({...editingStudent, parentPhone: e.target.value})} className={inputClasses}/></div>
                </div>

                <div className="flex gap-4">
                   <button onClick={() => setEditingStudent(null)} className="flex-grow py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Cancelar</button>
                   <button onClick={handleUpdate} className="flex-grow py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                     <Save size={18}/> Actualizar Expediente
                   </button>
                </div>
             </motion.div>
           </div>
         )}
      </AnimatePresence>

      {/* MODAL NUEVA INSCRIPCIÓN */}
      <AnimatePresence>
         {showAddModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"/>
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-3xl bg-white rounded-[4rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-12">
                   <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4"><UserPlus className="text-blue-600" size={32}/> Inscribir Nuevo Atleta</h3>
                   <button onClick={() => setShowAddModal(false)} className="p-4 bg-slate-50 rounded-2xl shadow-inner"><X/></button>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-l-4 border-blue-600 pl-3">Datos del Alumno</p>
                      <div><label className={labelClasses}>Nombres</label><input value={newStudentForm.firstName} onChange={e => setNewStudentForm({...newStudentForm, firstName: e.target.value})} className={inputClasses} placeholder="Nombre del niño"/></div>
                      <div><label className={labelClasses}>Apellidos</label><input value={newStudentForm.lastName} onChange={e => setNewStudentForm({...newStudentForm, lastName: e.target.value})} className={inputClasses} placeholder="Apellidos del niño"/></div>
                      <div><label className={labelClasses}>F. Nacimiento</label><input type="date" value={newStudentForm.birthDate} onChange={e => setNewStudentForm({...newStudentForm, birthDate: e.target.value})} className={inputClasses}/></div>
                   </div>
                   <div className="space-y-6">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-l-4 border-emerald-600 pl-3">Datos Administrativos</p>
                      <div><label className={labelClasses}>Asignar Grupo Académico</label>
                        <select value={newStudentForm.category} onChange={e => setNewStudentForm({...newStudentForm, category: e.target.value})} className={inputClasses}>
                          {Array.from(new Set(SCHEDULES.map(s => s.category))).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div><label className={labelClasses}>Celular Apoderado</label><input value={newStudentForm.parentPhone} onChange={e => setNewStudentForm({...newStudentForm, parentPhone: e.target.value})} className={inputClasses} placeholder="9XXXXXXXX"/></div>
                      <div><label className={labelClasses}>Estado Inicial</label>
                        <select value={newStudentForm.paymentStatus} onChange={e => setNewStudentForm({...newStudentForm, paymentStatus: e.target.value as any})} className={inputClasses}>
                          <option value="Pending">Pendiente de Pago</option><option value="Paid">Ya Pagó (Matriculado)</option>
                        </select>
                      </div>
                   </div>
                </div>
                <div className="mt-16 flex gap-6">
                   <button onClick={() => setShowAddModal(false)} className="flex-grow py-5 bg-slate-50 text-slate-500 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Cancelar</button>
                   <button onClick={handleCreateStudent} className="flex-grow py-5 bg-blue-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-blue-500/40 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95">
                      <Check size={20}/> Registrar en Supabase
                   </button>
                </div>
             </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
};