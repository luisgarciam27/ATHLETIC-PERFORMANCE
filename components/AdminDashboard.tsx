
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
  onUpdateConfig: (config: AcademyConfig) => Promise<boolean>;
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

  const sqlQuery = `-- REQUISITO: Política RLS para permitir edición
DROP POLICY IF EXISTS "Permitir edición a admin" ON academy_config;
CREATE POLICY "Permitir edición pública" 
ON academy_config FOR UPDATE 
USING (true) WITH CHECK (true);

-- Estructura de la tabla
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

  const handleSaveConfig = async () => {
    setIsSyncing(true);
    const success = await onUpdateConfig(tempConfig);
    if (success) {
      alert("¡Web actualizada con éxito!");
    }
    setIsSyncing(false);
  };

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
            <span className="text-[9px] text-blue-400 font-bold tracking-widest uppercase">Admin Cloud v2.4</span>
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

      <main className="flex-grow overflow-y-auto p-10 relative">
        <header className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
              {activeTab === 'overview' && 'Dashboard de Control'}
              {activeTab === 'students' && 'Gestión de Atletas'}
              {activeTab === 'settings' && 'Personalizar Portal Web'}
            </h1>
          </div>

          {activeTab !== 'settings' && (
            <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-6 py-3.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all uppercase tracking-widest">
              <UserPlus size={18} /> Nueva Matrícula
            </button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10 pb-20">
               <div className="grid lg:grid-cols-12 gap-8">
                 <div className="lg:col-span-8 space-y-10">
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <ImageIcon size={22} className="text-blue-600" />
                          <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Slider Home</h3>
                        </div>
                      </div>
                      <div className="space-y-6">
                        {tempConfig.heroImages.map((url, i) => (
                          <div key={i} className="flex flex-col md:flex-row gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <div className="w-full md:w-44 h-28 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                               <img src={url} alt={`Hero ${i+1}`} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow space-y-3">
                              <label className={labelClasses}>Imagen {i + 1}</label>
                              <input value={url} onChange={(e) => {
                                const n = [...tempConfig.heroImages];
                                n[i] = e.target.value;
                                setTempConfig({...tempConfig, heroImages: n});
                              }} className={inputClasses} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl">
                      <div className="flex items-center gap-3 mb-6">
                         <Database size={22} className="text-blue-400" />
                         <h3 className="font-black text-white uppercase text-xs tracking-widest">Fix de Persistencia (RLS)</h3>
                      </div>
                      <p className="text-slate-400 text-sm mb-6">Si los cambios no se guardan, ejecuta este SQL en Supabase para arreglar los permisos:</p>
                      <div className="relative">
                        <pre className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-blue-400 text-xs font-mono overflow-x-auto">
                          {sqlQuery}
                        </pre>
                        <button onClick={copyToClipboard} className="absolute top-4 right-4 p-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all">
                          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                 </div>

                 <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl sticky top-8">
                       <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-6 border-b pb-4">Publicación</h4>
                       <div className="space-y-6">
                          <div>
                             <label className={labelClasses}>Bienvenida</label>
                             <textarea rows={4} value={tempConfig.welcomeMessage} onChange={(e) => setTempConfig({...tempConfig, welcomeMessage: e.target.value})} className={inputClasses} />
                          </div>
                          <button onClick={handleSaveConfig} disabled={isSyncing} className={`w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl ${isSyncing ? 'opacity-50' : ''}`}>
                             {isSyncing ? <RefreshCcw className="animate-spin" /> : <Save />}
                             {isSyncing ? 'Guardando...' : 'Publicar Ahora'}
                          </button>
                       </div>
                    </div>
                 </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'overview' && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-4 gap-6">
                {[
                  { label: 'Alumnos', value: stats.activeCount, icon: Users, color: 'blue' },
                  { label: 'Mensualidades', value: `S/ ${stats.totalRevenue}`, icon: DollarSign, color: 'emerald' },
                  { label: 'Pendientes', value: stats.pendingCount, icon: AlertCircle, color: 'rose' },
                  { label: 'Status', value: 'Online', icon: Globe, color: 'indigo' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-4`}>
                      <stat.icon size={28} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
                  </div>
                ))}
             </motion.div>
          )}

          {activeTab === 'students' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-white rounded-[2rem] shadow-sm overflow-hidden">
                   <div className="p-6 border-b">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar..." className="w-full bg-slate-50 rounded-2xl px-12 py-4 text-sm outline-none" />
                      </div>
                   </div>
                   <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50/50 text-slate-400 text-[9px] uppercase tracking-widest border-b">
                          <th className="px-8 py-5 text-left">Atleta</th>
                          <th className="px-8 py-5 text-left">Categoría</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map(s => (
                          <tr key={s.id} onClick={() => setSelectedStudent(s)} className="hover:bg-blue-50/30 cursor-pointer border-b last:border-0">
                             <td className="px-8 py-5 font-bold text-sm">{s.firstName} {s.lastName}</td>
                             <td className="px-8 py-5"><span className="px-3 py-1 bg-white border rounded-lg text-[10px] uppercase">{s.category}</span></td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
                {selectedStudent && (
                  <div className="lg:col-span-4">
                    <StudentCard student={selectedStudent} />
                  </div>
                )}
             </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
