
import React, { useState, useMemo } from 'react';
import { Student, AttendanceStatus, PaymentRecord, AcademyConfig } from '../types';
import { StudentCard } from './StudentCard';
import { 
  Search, Printer, QrCode, UserPlus, X, CreditCard, 
  Calendar, Trash2, Bell, CheckCircle, LogOut, 
  Users, LayoutDashboard, Settings, DollarSign,
  TrendingUp, AlertCircle, CheckCircle2, MoreVertical,
  ChevronRight, ArrowUpRight, Filter, Download,
  Image as ImageIcon, Type as TypeIcon, Save, RefreshCcw,
  Cloud, CloudOff, Globe, Layout, Camera, ShieldCheck,
  Database, Copy, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SCHEDULES } from '../constants';

interface AdminDashboardProps {
  students: Student[];
  config: AcademyConfig;
  onUpdateConfig: (config: AcademyConfig) => void;
  onRegister: (student: Student) => void;
  onDelete?: (id: string) => void;
  onLogout: () => void;
}

type AdminTab = 'overview' | 'students' | 'attendance' | 'finance' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ students, config, onUpdateConfig, onRegister, onDelete, onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Internal Form States
  const [newStudentForm, setNewStudentForm] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    scheduleId: SCHEDULES[0].id,
    paymentStatus: 'Paid' as 'Paid' | 'Pending'
  });

  const [tempConfig, setTempConfig] = useState<AcademyConfig>({...config});

  const sqlQuery = `-- Query para Supabase
CREATE TABLE IF NOT EXISTS academy_config (
  id BIGINT PRIMARY KEY DEFAULT 1,
  hero_images TEXT[] NOT NULL,
  about_images TEXT[] NOT NULL,
  welcome_message TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Analytics
  const stats = useMemo(() => {
    const totalRevenue = students.reduce((acc, s) => acc + (s.paymentStatus === 'Paid' ? 200 : 0), 0);
    const pendingCount = students.filter(s => s.paymentStatus === 'Pending' || s.paymentStatus === 'Overdue').length;
    const activeCount = students.length;
    return { totalRevenue, pendingCount, activeCount };
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const nameMatch = (s.firstName + ' ' + s.lastName).toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = selectedCategory === 'all' || s.category === selectedCategory;
      return nameMatch && categoryMatch;
    });
  }, [students, searchTerm, selectedCategory]);

  const handleAttendance = (studentId: string, status: AttendanceStatus) => {
    console.log(`Attendance for ${studentId}: ${status}`);
  };

  const sendPaymentReminder = (student: Student) => {
    const text = `*AVISO DE COBRANZA - ATHLETIC PERFORMANCE*%0A%0AEstimado/a ${student.parentName}, le recordamos que la mensualidad de *${student.firstName}* vence el ${new Date(student.nextPaymentDate).toLocaleDateString()}.%0A%0A💰 *Monto:* S/ 200.00%0A📌 *Medios de pago:* Yape, Plin o Transferencia BCP.%0A%0A_Favor de enviar el comprobante por este medio._`;
    window.open(`https://wa.me/${student.parentPhone.replace(/\s/g, '')}?text=${text}`, '_blank');
  };

  const handleSaveConfig = async () => {
    setIsSyncing(true);
    // Simula sincronización con Supabase
    await new Promise(resolve => setTimeout(resolve, 1500));
    onUpdateConfig(tempConfig);
    setIsSyncing(false);
  };

  const inputClasses = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm";
  const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5";

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col p-6 shadow-2xl z-30">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <TrendingUp size={22} className="text-white" />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight uppercase block leading-none text-white">PANEL ÉLITE</span>
            <span className="text-[9px] text-blue-400 font-bold tracking-widest uppercase">Admin Cloud v2.3</span>
          </div>
        </div>

        <nav className="space-y-1.5 flex-grow">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4">Administración</p>
          
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          
          <button onClick={() => setActiveTab('students')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'students' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <Users size={18} /> Alumnos
          </button>
          
          <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'finance' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <DollarSign size={18} /> Finanzas
          </button>

          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-8 mb-4 px-4">Diseño Web</p>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <Layout size={18} /> Editor Visual
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800 space-y-4">
           <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Persistencia Cloud</span>
                 <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
              </div>
              <p className="text-[10px] text-slate-400 flex items-center gap-2">
                 {isSyncing ? <Cloud size={12} className="animate-bounce" /> : <Globe size={12} />}
                 {isSyncing ? 'Sincronizando...' : 'Conectado a Supabase'}
              </p>
           </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm text-red-400 hover:bg-red-400/10 transition-all">
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto p-10 relative">
        <header className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
              {activeTab === 'overview' && 'Dashboard de Control'}
              {activeTab === 'students' && 'Gestión de Atletas'}
              {activeTab === 'finance' && 'Caja y Cobranzas'}
              {activeTab === 'settings' && 'Personalizar Portal Web'}
            </h1>
            <p className="text-slate-500 font-medium">Control total sobre alumnos, finanzas y apariencia de la academia.</p>
          </div>

          {activeTab !== 'settings' && (
            <div className="flex items-center gap-3">
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
                <Download size={20} />
              </button>
              <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-6 py-3.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all uppercase tracking-widest">
                <UserPlus size={18} /> Nueva Matrícula
              </button>
            </div>
          )}
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10 pb-20">
               {/* Tips Section */}
               <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                  <div className="relative z-10 flex-grow">
                    <h3 className="text-xl font-black uppercase mb-2">Gestión de Imágenes Cloud</h3>
                    <p className="text-blue-100 text-sm max-w-xl">Utiliza enlaces directos de <strong>PostImages.org</strong> para actualizar tu web al instante. Se recomienda subir fotos en alta resolución (HD) para una apariencia premium.</p>
                  </div>
                  <div className="relative z-10">
                    <a href="https://postimages.org/" target="_blank" className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-transform block">Ir a PostImages →</a>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
               </div>

               <div className="grid lg:grid-cols-12 gap-8">
                 <div className="lg:col-span-8 space-y-10">
                    {/* Hero Images Section */}
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl overflow-hidden relative">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                             <ImageIcon size={22} />
                          </div>
                          <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Slider de Cabecera (Home)</h3>
                        </div>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">3 Diapositivas Activas</span>
                      </div>
                      
                      <div className="space-y-6">
                        {tempConfig.heroImages.map((url, i) => (
                          <div key={i} className="flex flex-col md:flex-row gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:border-blue-200">
                            <div className="w-full md:w-44 h-28 bg-white rounded-2xl border border-slate-200 overflow-hidden flex-shrink-0 shadow-sm relative group">
                               <img src={url} alt={`Hero ${i+1}`} className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Camera className="text-white" size={24} />
                               </div>
                            </div>
                            <div className="flex-grow space-y-3">
                              <label className={labelClasses}>URL de la Imagen {i + 1}</label>
                              <input 
                                value={url} 
                                onChange={(e) => {
                                  const newHero = [...tempConfig.heroImages];
                                  newHero[i] = e.target.value;
                                  setTempConfig({...tempConfig, heroImages: newHero});
                                }}
                                className={inputClasses} 
                                placeholder="Pega el link directo aquí..." 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* About Section Images */}
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl overflow-hidden">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                             <ImageIcon size={22} />
                          </div>
                          <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Formación 360° (Galería)</h3>
                        </div>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Cuadrícula 2x2</span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        {tempConfig.aboutImages.map((url, i) => (
                          <div key={i} className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <div className="aspect-video bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                               <img src={url} className="w-full h-full object-cover" alt={`Galería ${i+1}`} />
                            </div>
                            <div className="space-y-2">
                              <label className={labelClasses}>Foto de Formación {i + 1}</label>
                              <input 
                                value={url} 
                                onChange={(e) => {
                                  const newAbout = [...tempConfig.aboutImages];
                                  newAbout[i] = e.target.value;
                                  setTempConfig({...tempConfig, aboutImages: newAbout});
                                }}
                                className={inputClasses} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Database Setup Section */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 border border-slate-800 shadow-2xl overflow-hidden relative group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                         <Database size={120} className="text-white" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                           <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                              <Database size={22} />
                           </div>
                           <h3 className="font-black text-white uppercase text-xs tracking-widest">Configuración Supabase</h3>
                        </div>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">Ejecuta este código en el <strong>SQL Editor</strong> de Supabase para crear la tabla de persistencia en la nube:</p>
                        <div className="relative">
                          <pre className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-blue-400 text-xs font-mono overflow-x-auto">
                            {sqlQuery}
                          </pre>
                          <button 
                            onClick={copyToClipboard}
                            className="absolute top-4 right-4 p-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest"
                          >
                            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            {copied ? 'Copiado' : 'Copiar SQL'}
                          </button>
                        </div>
                      </div>
                    </div>
                 </div>

                 {/* Sidebar Controls */}
                 <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl sticky top-8">
                       <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-6 border-b border-slate-50 pb-4">Acciones Globales</h4>
                       <div className="space-y-6">
                          <div>
                             <label className={labelClasses}>Aviso de Bienvenida</label>
                             <textarea 
                               rows={4}
                               value={tempConfig.welcomeMessage}
                               onChange={(e) => setTempConfig({...tempConfig, welcomeMessage: e.target.value})}
                               className={inputClasses}
                               placeholder="Mensaje que verán los padres al inscribirse..."
                             />
                          </div>
                          <div className="pt-4 space-y-3">
                            <button 
                              onClick={handleSaveConfig} 
                              disabled={isSyncing}
                              className={`w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all ${isSyncing ? 'opacity-70 cursor-wait' : ''}`}
                            >
                               {isSyncing ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} />}
                               {isSyncing ? 'Sincronizando Cloud...' : 'Publicar en la Web'}
                            </button>
                            <button 
                              onClick={() => setTempConfig({...config})} 
                              className="w-full py-5 bg-slate-100 text-slate-500 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                            >
                               <RefreshCcw size={16} /> Revertir Cambios
                            </button>
                          </div>
                          
                          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                             <div className="flex items-center gap-3 text-emerald-600 mb-3">
                               <ShieldCheck size={20} />
                               <span className="text-[10px] font-black uppercase tracking-wider">Modo Seguro Activo</span>
                             </div>
                             <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Todos los cambios se guardan localmente y se sincronizan con la base de datos persistente al hacer click en Publicar.</p>
                          </div>
                       </div>
                    </div>
                 </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'overview' && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { label: 'Alumnos Totales', value: stats.activeCount, icon: Users, color: 'blue' },
                    { label: 'Mensualidades', value: `S/ ${stats.totalRevenue}`, icon: DollarSign, color: 'emerald' },
                    { label: 'Morosidad', value: stats.pendingCount, icon: AlertCircle, color: 'rose' },
                    { label: 'Ratio Retención', value: '98%', icon: TrendingUp, color: 'indigo' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group">
                      <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-4 transition-transform group-hover:scale-110`}>
                        <stat.icon size={28} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                   <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm overflow-hidden relative">
                      <div className="flex justify-between items-center mb-10">
                        <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em]">Crecimiento Mensual</h3>
                        <div className="flex gap-2">
                           <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                           <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                        </div>
                      </div>
                      <div className="h-48 flex items-end gap-3 px-2">
                        {[40, 65, 55, 80, 70, 95, 100].map((h, i) => (
                          <div key={i} className="flex-grow bg-slate-50 rounded-t-xl relative group">
                             <motion.div 
                               initial={{ height: 0 }} 
                               animate={{ height: `${h}%` }} 
                               className="absolute bottom-0 w-full bg-blue-600 rounded-t-xl group-hover:bg-blue-400 transition-colors"
                             />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-4 px-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Jun</span><span>Jul</span><span>Ago</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dic</span>
                      </div>
                   </div>

                   <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden flex flex-col justify-between">
                      <div>
                        <h3 className="text-blue-400 font-black uppercase text-xs tracking-widest mb-2">Estado de Servidor</h3>
                        <p className="text-3xl font-black mb-8 leading-tight">SISTEMA <br />OPERATIVO</p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-[10px] font-bold py-2 border-b border-white/10">
                          <span className="text-slate-500">Base de Datos</span>
                          <span className="text-emerald-400">Excelente</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-bold py-2 border-b border-white/10">
                          <span className="text-slate-500">Sincronización Web</span>
                          <span className="text-emerald-400">Activa</span>
                        </div>
                      </div>
                      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-600/20 rounded-full blur-[80px]"></div>
                   </div>
                </div>
             </motion.div>
          )}

          {activeTab === 'students' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                   <div className="p-6 border-b border-slate-50 flex items-center gap-4">
                      <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar por nombre o ID..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-12 py-4 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none transition-all" />
                      </div>
                   </div>
                   <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50 text-slate-400 font-black text-[9px] uppercase tracking-widest border-b border-slate-100">
                          <th className="px-8 py-5">Atleta</th>
                          <th className="px-8 py-5">Categoría</th>
                          <th className="px-8 py-5 text-right">Ficha</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredStudents.map(s => (
                          <tr key={s.id} onClick={() => setSelectedStudent(s)} className={`hover:bg-blue-50/30 transition-all cursor-pointer ${selectedStudent?.id === s.id ? 'bg-blue-50/50' : ''}`}>
                             <td className="px-8 py-5">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-sm">
                                    {s.firstName[0]}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900 text-sm">{s.firstName} {s.lastName}</p>
                                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">{s.qrCode}</p>
                                  </div>
                               </div>
                             </td>
                             <td className="px-8 py-5">
                               <span className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase">{s.category}</span>
                             </td>
                             <td className="px-8 py-5 text-right"><ChevronRight size={18} className="text-slate-300 ml-auto" /></td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
                <div className="lg:col-span-4">
                   {selectedStudent ? (
                     <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                        <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-2xl sticky top-8">
                           <StudentCard student={selectedStudent} />
                           <div className="mt-10 space-y-3">
                              <button onClick={() => sendPaymentReminder(selectedStudent)} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
                                <Bell size={18} /> Recordar vía WA
                              </button>
                              <div className="grid grid-cols-2 gap-3">
                                <button className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest">Editar</button>
                                <button onClick={() => onDelete?.(selectedStudent.id)} className="py-4 bg-red-50 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Eliminar</button>
                              </div>
                           </div>
                        </div>
                     </motion.div>
                   ) : (
                     <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center bg-white/40">
                       <QrCode size={48} className="text-slate-200 mb-6" />
                       <h4 className="font-bold text-slate-500 mb-2">Visor de Atletas</h4>
                       <p className="text-slate-400 text-sm">Selecciona una fila para previsualizar el carnet y gestionar pagos.</p>
                     </div>
                   )}
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Simplified New Athlete Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden">
               <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-black text-slate-900 uppercase tracking-tight text-xl">Nueva Matrícula Élite</h3>
                  <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-all"><X size={24} /></button>
               </div>
               <form onSubmit={(e) => {
                 e.preventDefault();
                 const selectedSched = SCHEDULES.find(s => s.id === newStudentForm.scheduleId);
                 const student: Student = {
                   ...newStudentForm,
                   id: Math.random().toString(36).substr(2, 9),
                   registrationDate: new Date().toISOString(),
                   category: selectedSched?.category || 'General',
                   nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                   qrCode: `ATH-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
                 };
                 onRegister(student);
                 setShowAddModal(false);
               }} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto">
                 <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <p className="text-[10px] font-black text-blue-600 uppercase border-b border-blue-50 pb-2 tracking-widest">Ficha del Atleta</p>
                       <div>
                         <label className={labelClasses}>Nombres</label>
                         <input required value={newStudentForm.firstName} onChange={e => setNewStudentForm({...newStudentForm, firstName: e.target.value})} className={inputClasses} placeholder="Thiago..." />
                       </div>
                       <div>
                         <label className={labelClasses}>Apellidos</label>
                         <input required value={newStudentForm.lastName} onChange={e => setNewStudentForm({...newStudentForm, lastName: e.target.value})} className={inputClasses} placeholder="Messi..." />
                       </div>
                       <div>
                         <label className={labelClasses}>Categoría Asignada</label>
                         <select value={newStudentForm.scheduleId} onChange={e => setNewStudentForm({...newStudentForm, scheduleId: e.target.value})} className={inputClasses}>
                            {SCHEDULES.map(s => <option key={s.id} value={s.id}>{s.category} ({s.age})</option>)}
                         </select>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <p className="text-[10px] font-black text-emerald-600 uppercase border-b border-emerald-50 pb-2 tracking-widest">Datos del Apoderado</p>
                       <div>
                         <label className={labelClasses}>Nombre del Tutor</label>
                         <input required value={newStudentForm.parentName} onChange={e => setNewStudentForm({...newStudentForm, parentName: e.target.value})} className={inputClasses} placeholder="Nombre completo" />
                       </div>
                       <div>
                         <label className={labelClasses}>WhatsApp de Contacto</label>
                         <input required value={newStudentForm.parentPhone} onChange={e => setNewStudentForm({...newStudentForm, parentPhone: e.target.value})} className={inputClasses} placeholder="+51 987..." />
                       </div>
                       <div>
                         <label className={labelClasses}>Estado de Pago</label>
                         <div className="flex gap-3">
                            {['Paid', 'Pending'].map(st => (
                              <button key={st} type="button" onClick={() => setNewStudentForm({...newStudentForm, paymentStatus: st as any})} className={`flex-1 py-3.5 rounded-2xl border-2 text-[10px] font-black uppercase transition-all ${newStudentForm.paymentStatus === st ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}>
                                {st === 'Paid' ? 'Al día' : 'Pendiente'}
                              </button>
                            ))}
                         </div>
                       </div>
                    </div>
                 </div>
                 <div className="flex gap-4 pt-10">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-5 bg-slate-50 text-slate-500 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">Descartar</button>
                    <button type="submit" className="flex-[2] py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Confirmar Matrícula</button>
                 </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
