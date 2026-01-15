
import React, { useState, useMemo, useEffect } from 'react';
import { Student, AcademyConfig, ClassSchedule, AttendanceRecord } from '../types';
import { 
  Search, X, LogOut, Users, 
  LayoutDashboard, DollarSign, AlertCircle, 
  Zap, Phone, Trash, Save, Eye,
  Image as ImageIcon, Wallet, ListChecks, Plus,
  Settings, PlusCircle, CreditCard, 
  CheckCircle, UserCheck, Smartphone, Globe, Landmark, CalendarDays
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegistrationForm } from './RegistrationForm';

interface AdminDashboardProps {
  students: Student[];
  schedules: ClassSchedule[];
  config: AcademyConfig;
  onUpdateConfig: (config: AcademyConfig) => Promise<boolean>;
  onUpdateSchedules: (schedules: ClassSchedule[]) => Promise<boolean>;
  onRegister: (student: Student) => Promise<boolean>;
  onUpdateStudent: (student: Student) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onLogout: () => void;
}

const DAYS_MAP: Record<string, number> = {
  "Domingo": 0, "Lunes": 1, "Martes": 2, "Miércoles": 3, "Jueves": 4, "Viernes": 5, "Sábado": 6
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  students, schedules, config, onUpdateConfig, onUpdateSchedules, onRegister, onUpdateStudent, onDelete, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'schedules' | 'content' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [paymentStudent, setPaymentStudent] = useState<Student | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [attendanceGroupId, setAttendanceGroupId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [localConfig, setLocalConfig] = useState<AcademyConfig>({ ...config });
  const [localSchedules, setLocalSchedules] = useState<ClassSchedule[]>([...schedules]);

  useEffect(() => { setLocalConfig({ ...config }); }, [config]);
  useEffect(() => { setLocalSchedules([...schedules]); }, [schedules]);

  const getTrainingDates = (schedule: ClassSchedule) => {
    if (!schedule.startDate || !schedule.endDate || !schedule.days || schedule.days.length === 0) return [];
    
    const dates: { formatted: string, label: string }[] = [];
    const [sYear, sMonth, sDay] = schedule.startDate.split('-').map(Number);
    const [eYear, eMonth, eDay] = schedule.endDate.split('-').map(Number);
    
    const start = new Date(sYear, sMonth - 1, sDay);
    const end = new Date(eYear, eMonth - 1, eDay);
    const targetDays = schedule.days.map(d => DAYS_MAP[d]);

    let current = new Date(start);
    let safety = 0;
    while (current <= end && safety < 100) {
      if (targetDays.includes(current.getDay())) {
        const y = current.getFullYear();
        const m = String(current.getMonth() + 1).padStart(2, '0');
        const d = String(current.getDate()).padStart(2, '0');
        const formatted = `${y}-${m}-${d}`;
        const label = current.toLocaleDateString('es-PE', { weekday: 'short', day: '2-digit' });
        dates.push({ formatted, label });
      }
      current.setDate(current.getDate() + 1);
      safety++;
    }
    return dates;
  };

  const studentsBySchedule = useMemo(() => {
    const groups: Record<string, Student[]> = {};
    schedules.forEach(s => groups[s.id] = []);
    groups['unassigned'] = [];
    students.forEach(student => {
      const sId = student.scheduleId || 'unassigned';
      if (!groups[sId]) groups[sId] = [];
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      if (fullName.includes(searchTerm.toLowerCase()) || student.parentPhone?.includes(searchTerm)) {
        groups[sId].push(student);
      }
    });
    return groups;
  }, [students, schedules, searchTerm]);

  const handleAttendanceToggle = async (student: Student, date: string) => {
    const history = Array.isArray(student.attendance_history) ? [...student.attendance_history] : [];
    const index = history.findIndex(h => h.date === date);
    if (index >= 0) history[index].status = history[index].status === 'present' ? 'absent' : 'present';
    else history.push({ date, status: 'present' });
    await onUpdateStudent({ ...student, attendance_history: history });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      if(activeTab === 'schedules') {
        await onUpdateSchedules(localSchedules);
        alert('¡Horarios actualizados con éxito!');
      } else {
        const ok = await onUpdateConfig(localConfig);
        if (ok) alert('¡Configuración guardada correctamente en la nube!');
      }
    } catch (e) {
      alert('Error inesperado al guardar. Revisa la consola.');
    } finally {
      setIsSaving(false);
    }
  };

  const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1";
  const inputClasses = "w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-bold transition-all shadow-inner";

  return (
    <div className="flex h-screen bg-white overflow-hidden text-slate-900 font-ubuntu">
      {/* SIDEBAR */}
      <aside className="w-80 bg-slate-950 m-4 rounded-[2.5rem] text-white flex flex-col p-8 shadow-2xl z-30 shrink-0">
        <div className="mb-12 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><Zap className="text-white fill-white" size={24} /></div>
          <span className="font-black text-xl tracking-tighter uppercase italic">ATHLETIC <span className="text-blue-500">STAFF</span></span>
        </div>
        <nav className="space-y-2 flex-grow">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Resumen' },
            { id: 'students', icon: Users, label: 'Alumnos & Asistencia' },
            { id: 'schedules', icon: ListChecks, label: 'Ciclos & Horarios' },
            { id: 'content', icon: ImageIcon, label: 'Contenidos Web' },
            { id: 'settings', icon: Settings, label: 'Configuración' }
          ].map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id as any); setAttendanceGroupId(null); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={20}/> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto flex items-center gap-4 px-6 py-4 text-rose-400 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/10 rounded-2xl transition-all"><LogOut size={20}/> CERRAR SESIÓN</button>
      </aside>

      {/* MAIN */}
      <main className="flex-grow overflow-y-auto p-12 bg-slate-50 relative">
        <header className="flex justify-between items-end mb-16">
          <div>
            <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2 italic">Sistema de Gestión Élite</p>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none italic">{attendanceGroupId ? 'Control de Asistencia' : activeTab.toUpperCase()}</h1>
          </div>
          <div className="flex gap-4">
            {activeTab === 'students' && !attendanceGroupId && (
               <button onClick={() => setShowRegisterModal(true)} className="px-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase shadow-xl flex items-center gap-3 hover:bg-blue-600 transition-all"><Plus size={20}/> Nueva Matrícula</button>
            )}
            {(activeTab === 'schedules' || activeTab === 'content' || activeTab === 'settings') && (
               <button 
                 disabled={isSaving}
                 onClick={handleSaveAll} 
                 className={`px-10 py-5 ${isSaving ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-2xl font-black text-xs uppercase shadow-2xl transition-all flex items-center gap-3`}
               >
                 {isSaving ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/> : <Save size={20}/>}
                 {isSaving ? 'Guardando...' : 'Publicar Cambios'}
               </button>
            )}
            {attendanceGroupId && <button onClick={() => setAttendanceGroupId(null)} className="px-8 py-5 bg-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase hover:bg-slate-300 transition-all">Regresar</button>}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100"><Users size={32} className="text-blue-600 mb-6"/><p className={labelClasses}>Alumnos</p><p className="text-7xl font-black tracking-tighter">{students.length}</p></div>
              <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100"><DollarSign size={32} className="text-emerald-600 mb-6"/><p className={labelClasses}>Recaudado</p><p className="text-7xl font-black tracking-tighter">S/ {students.reduce((acc, s) => acc + (s.total_paid || 0), 0)}</p></div>
              <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100"><AlertCircle size={32} className="text-rose-600 mb-6"/><p className={labelClasses}>Deudas</p><p className="text-7xl font-black tracking-tighter">S/ {students.reduce((acc, s) => acc + (s.pending_balance || 0), 0)}</p></div>
            </motion.div>
          )}

          {activeTab === 'students' && (
            <motion.div key="students" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-32">
              {!attendanceGroupId ? (
                <>
                  <div className="relative max-w-xl"><Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24}/><input placeholder="Buscar atleta..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-3xl outline-none font-bold text-sm shadow-sm"/></div>
                  <div className="grid gap-8">
                    {schedules.map(s => (
                      <div key={s.id} className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center" style={{ borderLeft: `12px solid ${s.color}` }}>
                           <div><h3 className="text-2xl font-black uppercase italic leading-none">{s.category}</h3><p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">{studentsBySchedule[s.id]?.length} Alumnos • {s.time}</p></div>
                           <button onClick={() => setAttendanceGroupId(s.id)} className="px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Pasar Asistencia</button>
                        </div>
                        <div className="p-4 overflow-x-auto">
                           <table className="w-full text-left min-w-[600px]">
                              <thead><tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b"><th className="p-4">Jugador</th><th className="p-4">Apoderado</th><th className="p-4 text-center">Saldo</th><th className="p-4 text-center">Acciones</th></tr></thead>
                              <tbody>
                                {studentsBySchedule[s.id]?.map(st => (
                                  <tr key={st.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                    <td className="p-4 font-bold text-sm uppercase">{st.firstName} {st.lastName}</td>
                                    <td className="p-4 text-xs text-slate-500 font-medium">{st.parentName}<br/><span className="text-emerald-500 font-bold">{st.parentPhone}</span></td>
                                    <td className="p-4 text-center"><span className={`px-3 py-1 rounded-lg font-black text-[9px] ${st.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>S/ {st.pending_balance}</span></td>
                                    <td className="p-4 flex justify-center gap-2">
                                       <button onClick={() => setSelectedStudent(st)} className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-900 hover:text-white"><Eye size={16}/></button>
                                       <button onClick={() => setPaymentStudent(st)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white"><Wallet size={16}/></button>
                                       <button onClick={() => onDelete(st.id)} className="p-2 bg-rose-50 text-rose-400 rounded-lg hover:bg-rose-600 hover:text-white"><Trash size={16}/></button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                           </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-[3.5rem] shadow-xl border border-slate-100 overflow-hidden">
                   <div className="p-10 border-b border-slate-100 bg-slate-50">
                      <h3 className="text-3xl font-black uppercase italic tracking-tighter">Asistencia: {schedules.find(s => s.id === attendanceGroupId)?.category}</h3>
                      <p className="text-slate-400 text-xs font-bold mt-2">Días del ciclo proyectados según configuración.</p>
                   </div>
                   <div className="overflow-x-auto p-8">
                      {(() => {
                        const sched = schedules.find(s => s.id === attendanceGroupId);
                        const trainingDates = sched ? getTrainingDates(sched) : [];
                        if (trainingDates.length === 0) return <div className="p-12 text-center text-rose-500 font-black uppercase text-xs tracking-widest">Configura el ciclo en Horarios para generar la asistencia.</div>;
                        return (
                          <table className="w-full text-left border-collapse min-w-max">
                            <thead>
                               <tr>
                                  <th className="p-4 bg-white sticky left-0 z-20 border-b-2 font-black text-[10px] uppercase text-slate-400">Atleta</th>
                                  {trainingDates.map(d => (
                                    <th key={d.formatted} className="p-4 text-center border-b-2 font-black text-[10px] uppercase text-slate-500 bg-slate-50/50">
                                      {d.label}
                                    </th>
                                  ))}
                               </tr>
                            </thead>
                            <tbody>
                               {studentsBySchedule[attendanceGroupId]?.map(st => (
                                  <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                                     <td className="p-4 font-black uppercase text-[11px] sticky left-0 bg-white border-b z-10 shadow-[5px_0_10px_rgba(0,0,0,0.02)]">{st.firstName} {st.lastName}</td>
                                     {trainingDates.map(d => {
                                        const isPresent = st.attendance_history?.some(h => h.date === d.formatted && h.status === 'present');
                                        return (
                                          <td key={d.formatted} className="p-4 text-center border-b border-slate-50">
                                             <button onClick={() => handleAttendanceToggle(st, d.formatted)} className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto transition-all ${isPresent ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'}`}><CheckCircle size={18}/></button>
                                          </td>
                                        );
                                     })}
                                  </tr>
                               ))}
                            </tbody>
                          </table>
                        );
                      })()}
                   </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'schedules' && (
            <motion.div key="schedules" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-12 pb-32">
               {localSchedules.map((s, idx) => (
                 <div key={s.id} className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-6">
                    <div className="flex justify-between items-center"><h3 className="font-black text-xl uppercase italic tracking-tighter" style={{ color: s.color }}>{s.category}</h3><input type="color" value={s.color} onChange={e => { let n = [...localSchedules]; n[idx].color = e.target.value; setLocalSchedules(n); }} className="w-8 h-8 rounded-lg border-none cursor-pointer"/></div>
                    <div className="grid grid-cols-2 gap-4">
                       <div><label className={labelClasses}>Inicio Ciclo</label><input type="date" value={s.startDate} onChange={e => { let n = [...localSchedules]; n[idx].startDate = e.target.value; setLocalSchedules(n); }} className={inputClasses}/></div>
                       <div><label className={labelClasses}>Fin Ciclo</label><input type="date" value={s.endDate} onChange={e => { let n = [...localSchedules]; n[idx].endDate = e.target.value; setLocalSchedules(n); }} className={inputClasses}/></div>
                    </div>
                    <div><label className={labelClasses}>Días Entrenamiento</label><div className="flex flex-wrap gap-2">{Object.keys(DAYS_MAP).map(day => { const isSelected = s.days.includes(day); return <button key={day} onClick={() => { let n = [...localSchedules]; n[idx].days = isSelected ? n[idx].days.filter(d => d !== day) : [...n[idx].days, day]; setLocalSchedules(n); }} className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${isSelected ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>{day.substring(0, 3)}</button>; })}</div></div>
                    <div className="grid grid-cols-2 gap-4">
                       <div><label className={labelClasses}>Precio S/</label><input type="number" value={s.price} onChange={e => { let n = [...localSchedules]; n[idx].price = Number(e.target.value); setLocalSchedules(n); }} className={inputClasses}/></div>
                       <div><label className={labelClasses}>Horario</label><input value={s.time} onChange={e => { let n = [...localSchedules]; n[idx].time = e.target.value; setLocalSchedules(n); }} className={inputClasses}/></div>
                    </div>
                 </div>
               ))}
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-32">
               <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-8">
                  <div className="flex justify-between items-center"><h3 className="font-black text-slate-900 uppercase italic text-xl flex items-center gap-4"><Globe className="text-blue-600"/> Identidad Visual</h3></div>
                  <div><label className={labelClasses}>URL del Logo Principal</label><input value={localConfig.logoUrl} onChange={e => setLocalConfig({...localConfig, logoUrl: e.target.value})} className={inputClasses} placeholder="https://ejemplo.com/logo.png"/></div>
               </div>
               <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-8">
                  <div className="flex justify-between items-center"><h3 className="font-black text-slate-900 uppercase italic text-xl flex items-center gap-4"><ImageIcon className="text-blue-600"/> Galería Hero</h3><button onClick={() => setLocalConfig({...localConfig, heroImages: [...localConfig.heroImages, '']})} className="text-blue-600 text-[10px] font-black uppercase flex items-center gap-2"><PlusCircle size={20}/> Añadir</button></div>
                  <div className="grid gap-4">{localConfig.heroImages.map((url, i) => (
                    <div key={i} className="flex gap-4 items-center"><input value={url} onChange={e => { let n = [...localConfig.heroImages]; n[i] = e.target.value; setLocalConfig({...localConfig, heroImages: n}); }} className={inputClasses}/><button onClick={() => { let n = [...localConfig.heroImages]; n.splice(i, 1); setLocalConfig({...localConfig, heroImages: n}); }} className="p-4 text-rose-400 hover:bg-rose-50 rounded-xl"><Trash size={20}/></button></div>
                  ))}</div>
               </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-32">
              <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 grid md:grid-cols-2 gap-8">
                 <div className="md:col-span-2 text-blue-600 font-black text-xl italic uppercase tracking-tighter border-b pb-4 flex items-center gap-4"><Smartphone/> Contacto Principal</div>
                 <div><label className={labelClasses}>Teléfono</label><input value={localConfig.contactPhone} onChange={e => setLocalConfig({...localConfig, contactPhone: e.target.value})} className={inputClasses}/></div>
                 <div><label className={labelClasses}>WhatsApp</label><input value={localConfig.socialWhatsapp} onChange={e => setLocalConfig({...localConfig, socialWhatsapp: e.target.value})} className={inputClasses}/></div>
                 <div><label className={labelClasses}>Correo Electrónico</label><input value={localConfig.contactEmail} onChange={e => setLocalConfig({...localConfig, contactEmail: e.target.value})} className={inputClasses}/></div>
                 <div><label className={labelClasses}>Dirección Principal</label><input value={localConfig.contactAddress} onChange={e => setLocalConfig({...localConfig, contactAddress: e.target.value})} className={inputClasses}/></div>
              </div>
              
              <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 grid md:grid-cols-4 gap-8">
                 <div className="md:col-span-4 text-emerald-600 font-black text-xl italic uppercase tracking-tighter border-b pb-4 flex items-center gap-4"><CreditCard/> Pasarelas & Cuentas de Pago</div>
                 
                 <div className="space-y-4 bg-slate-50 p-6 rounded-[2.5rem] shadow-inner">
                   <p className="font-black text-[10px] text-blue-500 uppercase">YAPE</p>
                   <input value={localConfig.yapeNumber} onChange={e => setLocalConfig({...localConfig, yapeNumber: e.target.value})} className={inputClasses} placeholder="Número"/>
                   <input value={localConfig.yapeName} onChange={e => setLocalConfig({...localConfig, yapeName: e.target.value})} className={inputClasses} placeholder="Nombre"/>
                 </div>
                 
                 <div className="space-y-4 bg-slate-50 p-6 rounded-[2.5rem] shadow-inner">
                   <p className="font-black text-[10px] text-emerald-500 uppercase">PLIN</p>
                   <input value={localConfig.plinNumber} onChange={e => setLocalConfig({...localConfig, plinNumber: e.target.value})} className={inputClasses} placeholder="Número"/>
                   <input value={localConfig.plinName} onChange={e => setLocalConfig({...localConfig, plinName: e.target.value})} className={inputClasses} placeholder="Nombre"/>
                 </div>
                 
                 <div className="space-y-4 bg-slate-50 p-6 rounded-[2.5rem] shadow-inner">
                   <p className="font-black text-[10px] text-slate-900 uppercase">BCP</p>
                   <input value={localConfig.bcpAccount} onChange={e => setLocalConfig({...localConfig, bcpAccount: e.target.value})} className={inputClasses} placeholder="Cuenta"/>
                   <input value={localConfig.bcpCCI} onChange={e => setLocalConfig({...localConfig, bcpCCI: e.target.value})} className={inputClasses} placeholder="CCI"/>
                   <input value={localConfig.bcpName} onChange={e => setLocalConfig({...localConfig, bcpName: e.target.value})} className={inputClasses} placeholder="Titular"/>
                 </div>

                 <div className="space-y-4 bg-orange-50 border border-orange-100 p-6 rounded-[2.5rem] shadow-inner">
                   <p className="font-black text-[10px] text-orange-600 uppercase italic">INTERBANK</p>
                   <input value={localConfig.interbankAccount} onChange={e => setLocalConfig({...localConfig, interbankAccount: e.target.value})} className={inputClasses} placeholder="N° Cuenta"/>
                   <input value={localConfig.interbankCCI} onChange={e => setLocalConfig({...localConfig, interbankCCI: e.target.value})} className={inputClasses} placeholder="CCI Interbank"/>
                   <input value={localConfig.interbankName} onChange={e => setLocalConfig({...localConfig, interbankName: e.target.value})} className={inputClasses} placeholder="Titular Interbank"/>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* MODALES */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedStudent(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"/>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative w-full max-w-2xl bg-white rounded-[4rem] p-12 shadow-2xl">
              <button onClick={() => setSelectedStudent(null)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-900"><X size={32}/></button>
              <div className="flex gap-8 items-center mb-10"><div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center font-black text-4xl text-slate-300 uppercase">{selectedStudent.firstName[0]}</div><div><h3 className="text-3xl font-black uppercase italic leading-none">{selectedStudent.firstName} {selectedStudent.lastName}</h3><p className="text-blue-600 font-bold uppercase text-[10px] mt-2 tracking-widest">{selectedStudent.category}</p></div></div>
              <div className="grid grid-cols-2 gap-8 border-t pt-8">
                <div><p className={labelClasses}>Apoderado</p><p className="font-bold text-slate-700">{selectedStudent.parentName}</p></div>
                <div><p className={labelClasses}>WhatsApp</p><p className="font-bold text-emerald-600">{selectedStudent.parentPhone}</p></div>
                <div><p className={labelClasses}>Saldo</p><p className="font-black text-rose-500 text-xl">S/ {selectedStudent.pending_balance}</p></div>
              </div>
            </motion.div>
          </div>
        )}
        {paymentStudent && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPaymentStudent(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"/>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative w-full max-w-lg bg-white rounded-[3.5rem] p-12 shadow-2xl">
               <button onClick={() => setPaymentStudent(null)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-900"><X size={32}/></button>
               <h3 className="text-3xl font-black uppercase tracking-tighter mb-8 italic">COBRAR ABONO</h3>
               <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 mb-10 text-center"><p className={labelClasses}>Deuda Actual</p><p className="font-black text-slate-900 text-6xl tracking-tighter">S/ {paymentStudent.pending_balance}</p></div>
               <form onSubmit={async (e) => { 
                  e.preventDefault(); 
                  const amount = Number((e.currentTarget.elements[0] as HTMLInputElement).value);
                  const updated = { ...paymentStudent, total_paid: (paymentStudent.total_paid || 0) + amount, pending_balance: Math.max(0, (paymentStudent.pending_balance || 0) - amount), paymentStatus: ((paymentStudent.pending_balance || 0) - amount) <= 0 ? 'Paid' : 'Pending' } as Student;
                  await onUpdateStudent(updated); setPaymentStudent(null); alert('Abono registrado.');
               }}><input type="number" step="0.01" className={inputClasses} placeholder="Monto S/" required/><button type="submit" className="w-full py-6 mt-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-emerald-700 shadow-2xl transition-all">Confirmar Pago</button></form>
            </motion.div>
          </div>
        )}
        {showRegisterModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRegisterModal(false)} className="fixed inset-0 bg-slate-950/90 backdrop-blur-md"/>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative w-full max-w-5xl bg-white rounded-[4rem] shadow-2xl p-12 overflow-y-auto max-h-[90vh]"><div className="mb-12 flex justify-between items-center"><h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">NUEVA MATRÍCULA</h2><button onClick={() => setShowRegisterModal(false)} className="text-slate-300 hover:text-slate-900"><X size={32}/></button></div><RegistrationForm config={config} isAdminView={true} onRegister={async (s) => { const ok = await onRegister(s); if(ok) setShowRegisterModal(false); return ok; }} /></motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
