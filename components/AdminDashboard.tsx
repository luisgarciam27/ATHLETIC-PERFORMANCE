
import React, { useState, useMemo } from 'react';
import { Student, AttendanceStatus, PaymentRecord, AcademyConfig } from '../types';
import { StudentCard } from './StudentCard';
import { 
  Search, Printer, QrCode, UserPlus, X, CreditCard, 
  Calendar, Trash2, Bell, CheckCircle, LogOut, 
  Users, LayoutDashboard, Settings, DollarSign,
  TrendingUp, AlertCircle, CheckCircle2, MoreVertical,
  ChevronRight, ArrowUpRight, Filter, Download,
  Image as ImageIcon, Type as TypeIcon, Save, RefreshCcw
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

  const handleSaveConfig = () => {
    onUpdateConfig(tempConfig);
    alert("Configuración de la web guardada exitosamente.");
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
            <span className="text-[9px] text-blue-400 font-bold tracking-widest uppercase">Admin v2.1</span>
          </div>
        </div>

        <nav className="space-y-1.5 flex-grow">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4">Menu Principal</p>
          
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <LayoutDashboard size={18} /> Vista General
          </button>
          
          <button onClick={() => setActiveTab('students')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'students' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <Users size={18} /> Base de Alumnos
          </button>
          
          <button onClick={() => setActiveTab('attendance')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'attendance' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <CheckCircle2 size={18} /> Asistencia Diaria
          </button>
          
          <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'finance' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <DollarSign size={18} /> Finanzas y Pagos
          </button>

          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-8 mb-4 px-4">Diseño Web</p>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <Settings size={18} /> Configuración Web
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm text-red-400 hover:bg-red-400/10 transition-all">
            <LogOut size={18} /> Salir del Sistema
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto p-10 relative">
        <header className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              {activeTab === 'overview' && 'Dashboard de Control'}
              {activeTab === 'students' && 'Gestión de Atletas'}
              {activeTab === 'attendance' && 'Pasar Lista'}
              {activeTab === 'finance' && 'Caja y Cobranzas'}
              {activeTab === 'settings' && 'Personalizar Landing Page'}
            </h1>
            <p className="text-slate-500 font-medium">Panel administrativo de Athletic Performance Academy.</p>
          </div>

          {activeTab !== 'settings' && (
            <div className="flex items-center gap-3">
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
                <Download size={20} />
              </button>
              <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-6 py-3.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all uppercase tracking-widest">
                <UserPlus size={18} /> Nuevo Atleta
              </button>
            </div>
          )}
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { label: 'Matriculados', value: stats.activeCount, icon: Users, color: 'blue' },
                  { label: 'Recaudación S/', value: stats.totalRevenue, icon: DollarSign, color: 'emerald' },
                  { label: 'Por Cobrar', value: stats.pendingCount, icon: AlertCircle, color: 'amber' },
                  { label: 'Asistencia Hoy', value: '92%', icon: CheckCircle2, color: 'indigo' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
                    <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 shadow-inner`}>
                      <stat.icon size={28} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                 <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                    <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-8">Nuevos Ingresos</h3>
                    <div className="space-y-4">
                       {students.slice(-4).reverse().map(s => (
                         <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-bold text-slate-400">{s.firstName[0]}</div>
                              <p className="font-bold text-slate-900 text-sm">{s.firstName} {s.lastName}</p>
                           </div>
                           <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{s.category}</span>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                    <h3 className="font-black text-blue-400 uppercase text-xs tracking-[0.2em] mb-8">Resumen de Pagos</h3>
                    <div className="space-y-6 relative z-10">
                       <div className="flex justify-between items-center border-b border-white/10 pb-4">
                          <p className="text-slate-400 font-bold text-sm">Al día</p>
                          <p className="text-emerald-400 font-black text-xl">{students.filter(s => s.paymentStatus === 'Paid').length}</p>
                       </div>
                       <div className="flex justify-between items-center border-b border-white/10 pb-4">
                          <p className="text-slate-400 font-bold text-sm">Vencidos</p>
                          <p className="text-amber-400 font-black text-xl">{students.filter(s => s.paymentStatus === 'Pending').length}</p>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 pb-20">
               <div className="grid lg:grid-cols-12 gap-8">
                 <div className="lg:col-span-8 space-y-8">
                    {/* Hero Images Section */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
                      <div className="flex items-center gap-3 mb-8">
                        <ImageIcon className="text-blue-600" />
                        <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Slider Principal (Hero)</h3>
                      </div>
                      <p className="text-xs text-slate-400 mb-6 italic">Agregue las URLs directas de sus imágenes (se recomienda formato 16:9 de alta calidad).</p>
                      <div className="space-y-4">
                        {tempConfig.heroImages.map((url, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="flex-grow">
                              <label className={labelClasses}>Imagen {i + 1}</label>
                              <input 
                                value={url} 
                                onChange={(e) => {
                                  const newHero = [...tempConfig.heroImages];
                                  newHero[i] = e.target.value;
                                  setTempConfig({...tempConfig, heroImages: newHero});
                                }}
                                className={inputClasses} 
                                placeholder="https://postimages.org/direct-link" 
                              />
                            </div>
                            <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex-shrink-0">
                               <img src={url} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* About Section Images */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
                      <div className="flex items-center gap-3 mb-8">
                        <ImageIcon className="text-emerald-600" />
                        <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Sección Formación 360°</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        {tempConfig.aboutImages.map((url, i) => (
                          <div key={i} className="space-y-2">
                            <label className={labelClasses}>Foto Galería {i + 1}</label>
                            <div className="flex gap-3">
                              <input 
                                value={url} 
                                onChange={(e) => {
                                  const newAbout = [...tempConfig.aboutImages];
                                  newAbout[i] = e.target.value;
                                  setTempConfig({...tempConfig, aboutImages: newAbout});
                                }}
                                className={inputClasses} 
                              />
                              <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={url} className="w-full h-full object-cover" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                 </div>

                 <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl sticky top-8">
                       <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-6 border-b border-slate-50 pb-4">Control de Contenido</h4>
                       <div className="space-y-6">
                          <div>
                             <label className={labelClasses}>Mensaje de Inscripción</label>
                             <textarea 
                               rows={4}
                               value={tempConfig.welcomeMessage}
                               onChange={(e) => setTempConfig({...tempConfig, welcomeMessage: e.target.value})}
                               className={inputClasses}
                             />
                          </div>
                          <div className="pt-4 space-y-3">
                            <button onClick={handleSaveConfig} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">
                               <Save size={16} /> Publicar Cambios
                            </button>
                            <button onClick={() => setTempConfig({...config})} className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
                               <RefreshCcw size={16} /> Descartar
                            </button>
                          </div>
                       </div>
                    </div>
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
                        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar atleta..." className="w-full bg-slate-50 border border-slate-100 rounded-xl px-10 py-3 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none" />
                      </div>
                   </div>
                   <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50 text-slate-400 font-black text-[9px] uppercase tracking-widest border-b border-slate-100">
                          <th className="px-8 py-5">Atleta</th>
                          <th className="px-8 py-5">Categoría</th>
                          <th className="px-8 py-5 text-right">Detalle</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredStudents.map(s => (
                          <tr key={s.id} onClick={() => setSelectedStudent(s)} className={`hover:bg-blue-50/30 transition-all cursor-pointer ${selectedStudent?.id === s.id ? 'bg-blue-50/50' : ''}`}>
                             <td className="px-8 py-5">
                               <p className="font-bold text-slate-900 text-sm">{s.firstName} {s.lastName}</p>
                               <p className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{s.qrCode}</p>
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
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-2xl sticky top-8">
                           <StudentCard student={selectedStudent} />
                           <div className="mt-8 space-y-4">
                              <button onClick={() => sendPaymentReminder(selectedStudent)} className="w-full py-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-white transition-all">
                                <Bell size={16} /> Recordar Pago
                              </button>
                              <button onClick={() => onDelete?.(selectedStudent.id)} className="w-full py-4 bg-red-50 text-red-500 border border-red-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                                Dar de Baja
                              </button>
                           </div>
                        </div>
                     </motion.div>
                   ) : (
                     <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center bg-white/40">
                       <QrCode size={40} className="text-slate-200 mb-4" />
                       <p className="text-slate-400 font-bold text-sm">Selecciona un atleta para ver su carnet virtual.</p>
                     </div>
                   )}
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Registration Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
               <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-black text-slate-900 uppercase tracking-tight">Registro Directo de Alumno</h3>
                  <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-all"><X size={20} /></button>
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
               }} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                       <p className="text-[10px] font-black text-blue-600 uppercase border-b border-blue-50 pb-2">Identidad</p>
                       <div>
                         <label className={labelClasses}>Nombres</label>
                         <input required value={newStudentForm.firstName} onChange={e => setNewStudentForm({...newStudentForm, firstName: e.target.value})} className={inputClasses} />
                       </div>
                       <div>
                         <label className={labelClasses}>Apellidos</label>
                         <input required value={newStudentForm.lastName} onChange={e => setNewStudentForm({...newStudentForm, lastName: e.target.value})} className={inputClasses} />
                       </div>
                       <div>
                         <label className={labelClasses}>Categoría</label>
                         <select value={newStudentForm.scheduleId} onChange={e => setNewStudentForm({...newStudentForm, scheduleId: e.target.value})} className={inputClasses}>
                            {SCHEDULES.map(s => <option key={s.id} value={s.id}>{s.category}</option>)}
                         </select>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <p className="text-[10px] font-black text-emerald-600 uppercase border-b border-emerald-50 pb-2">Apoderado</p>
                       <div>
                         <label className={labelClasses}>Nombre Completo</label>
                         <input required value={newStudentForm.parentName} onChange={e => setNewStudentForm({...newStudentForm, parentName: e.target.value})} className={inputClasses} />
                       </div>
                       <div>
                         <label className={labelClasses}>WhatsApp</label>
                         <input required value={newStudentForm.parentPhone} onChange={e => setNewStudentForm({...newStudentForm, parentPhone: e.target.value})} className={inputClasses} />
                       </div>
                       <div>
                         <label className={labelClasses}>Estado Inicial</label>
                         <div className="flex gap-2">
                            {['Paid', 'Pending'].map(st => (
                              <button key={st} type="button" onClick={() => setNewStudentForm({...newStudentForm, paymentStatus: st as any})} className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${newStudentForm.paymentStatus === st ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white text-slate-400'}`}>
                                {st === 'Paid' ? 'Pagado' : 'Pendiente'}
                              </button>
                            ))}
                         </div>
                       </div>
                    </div>
                 </div>
                 <div className="flex gap-4 pt-8">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest">Cancelar</button>
                    <button type="submit" className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20">Matricular Ahora</button>
                 </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
