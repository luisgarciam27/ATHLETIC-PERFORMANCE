
import React, { useState, useMemo, useEffect } from 'react';
import { Student, AcademyConfig, ClassSchedule, Payment } from '../types';
import { 
  Search, X, LogOut, Users, 
  LayoutDashboard, DollarSign, AlertCircle, 
  Zap, Phone, Trash, Edit,
  Save, Image as ImageIcon, Wallet, ListChecks, Plus,
  Settings, UserPlus, Share2, MessageCircle,
  Edit3, History, Receipt, Film, UserCircle2, Mail, MapPin, Globe
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
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  const [localConfig, setLocalConfig] = useState<AcademyConfig>({ ...config });
  const [localSchedules, setLocalSchedules] = useState<ClassSchedule[]>([...schedules]);

  useEffect(() => { setLocalConfig({ ...config }); }, [config]);
  useEffect(() => { setLocalSchedules([...schedules]); }, [schedules]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || s.parentPhone.includes(searchTerm);
      const matchesCategory = !selectedCategoryId || s.scheduleId === selectedCategoryId;
      return matchesSearch && matchesCategory;
    });
  }, [students, searchTerm, selectedCategoryId]);

  const fetchPayments = async (id: string) => {
    const res: any = await supabaseFetch('GET', 'payments', null, `student_id=eq.${id}&order=payment_date.desc`);
    if (res && !res.error) setPaymentHistory(res);
  };

  const handleRegisterPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!paymentStudent) return;
    const fd = new FormData(e.currentTarget);
    const amount = Number(fd.get('amount'));
    
    const res = await supabaseFetch('POST', 'payments', {
      student_id: paymentStudent.id,
      amount,
      method: fd.get('method') as any,
      concept: fd.get('concept') as string,
      payment_date: new Date().toISOString()
    });

    if (res && !res.error) {
      const newPending = Math.max(0, (paymentStudent.pending_balance || 0) - amount);
      const newTotalPaid = (paymentStudent.total_paid || 0) + amount;
      await onUpdateStudent({ 
        ...paymentStudent, 
        pending_balance: newPending, 
        total_paid: newTotalPaid, 
        paymentStatus: newPending <= 0 ? 'Paid' : 'Pending' 
      });
      setPaymentStudent(null);
      alert('Pago registrado.');
    }
  };

  const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1";
  const inputClasses = "w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-bold transition-all shadow-inner";

  return (
    <div className="flex h-screen bg-white overflow-hidden text-slate-900 font-ubuntu">
      {/* SIDEBAR */}
      <aside className="w-80 bg-slate-900 m-4 rounded-[3rem] text-white flex flex-col p-8 shadow-2xl z-30">
        <div className="mb-12 flex items-center gap-4 px-2">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg"><Zap className="text-white fill-white" size={28} /></div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter uppercase leading-none text-white">ATHLETIC</span>
            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Portal Admin</span>
          </div>
        </div>
        <nav className="space-y-2 flex-grow">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Resumen' },
            { id: 'students', icon: Users, label: 'Alumnos' },
            { id: 'schedules', icon: ListChecks, label: 'Ciclos' },
            { id: 'settings', icon: Settings, label: 'Personalizar' }
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] font-bold text-sm transition-all ${activeTab === item.id ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={20}/> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto w-full flex items-center gap-4 px-5 py-4 text-slate-400 font-bold text-sm hover:text-white transition-all"><LogOut size={20}/> Salir al Landing</button>
      </aside>

      <main className="flex-grow overflow-y-auto p-12 bg-slate-50">
        <header className="flex justify-between items-end mb-12">
          <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900">
            {activeTab === 'overview' && 'Dashboard'}
            {activeTab === 'students' && 'Atletas'}
            {activeTab === 'schedules' && 'Ciclos'}
            {activeTab === 'settings' && 'Personalizar'}
          </h1>
          {(activeTab === 'settings' || activeTab === 'schedules') && (
            <button onClick={async () => {
              if (activeTab === 'settings') {
                const ok = await onUpdateConfig(localConfig);
                if (ok) alert('Guardado con éxito.');
              } else {
                const ok = await onUpdateSchedules(localSchedules);
                if (ok) alert('Horarios actualizados.');
              }
            }} className="flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-2xl hover:bg-blue-700 transition-all"><Save size={24}/> Guardar Cambios</button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100">
                <Users size={32} className="text-blue-600 mb-8"/><p className={labelClasses}>Total Alumnos</p><p className="text-6xl font-black tracking-tighter">{students.length}</p>
              </div>
              <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100">
                <DollarSign size={32} className="text-emerald-600 mb-8"/><p className={labelClasses}>Recaudado</p><p className="text-6xl font-black tracking-tighter">S/ {students.reduce((acc, s) => acc + (s.total_paid || 0), 0)}</p>
              </div>
              <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100">
                <AlertCircle size={32} className="text-rose-600 mb-8"/><p className={labelClasses}>Saldo Pendiente</p><p className="text-6xl font-black tracking-tighter">S/ {students.reduce((acc, s) => acc + (s.pending_balance || 0), 0)}</p>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-8 pb-32">
              <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-[3rem] shadow-sm border border-slate-100">
                <div className="relative flex-grow"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20}/><input type="text" placeholder="Buscar atleta..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm"/></div>
                <button onClick={() => setShowRegisterModal(true)} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl flex items-center gap-2"><Plus size={18}/> Inscribir Nuevo</button>
              </div>

              <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-slate-100">
                <table className="w-full text-left">
                  <thead><tr className="bg-slate-50 border-b border-slate-100 text-slate-400"><th className="p-8 text-[10px] font-black uppercase tracking-widest">Alumno</th><th className="p-8 text-[10px] font-black uppercase tracking-widest">Apoderado</th><th className="p-8 text-[10px] font-black uppercase tracking-widest">Saldo</th><th className="p-8 text-[10px] font-black uppercase tracking-widest text-center">Acciones</th></tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredStudents.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-8"><p className="font-black text-slate-900 uppercase text-sm">{s.firstName} {s.lastName}</p><span className="text-[9px] font-black uppercase text-blue-400">{schedules.find(sc => sc.id === s.scheduleId)?.category || s.category}</span></td>
                        <td className="p-8"><p className="font-bold text-xs text-slate-700">{s.parentName}</p><p className="text-[10px] font-bold text-emerald-500">{s.parentPhone}</p></td>
                        <td className="p-8"><p className={`font-black text-sm ${s.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-rose-600'}`}>{s.paymentStatus === 'Paid' ? 'PAGADO' : `S/ ${s.pending_balance}`}</p></td>
                        <td className="p-8 text-center"><div className="flex items-center justify-center gap-2">
                          <button onClick={() => setPaymentStudent(s)} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><Wallet size={16}/></button>
                          <button onClick={() => { setHistoryStudent(s); fetchPayments(s.id); }} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><History size={16}/></button>
                          <button onClick={() => onDelete(s.id)} className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash size={16}/></button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-12 pb-40">
               <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100 grid md:grid-cols-2 gap-8">
                  <div className="md:col-span-2"><h3 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-6">Información de Contacto</h3></div>
                  <div><label className={labelClasses}>WhatsApp Oficial</label><input value={localConfig.socialWhatsapp} onChange={e => setLocalConfig({...localConfig, socialWhatsapp: e.target.value})} className={inputClasses}/></div>
                  <div><label className={labelClasses}>Teléfono Atenc.</label><input value={localConfig.contactPhone} onChange={e => setLocalConfig({...localConfig, contactPhone: e.target.value})} className={inputClasses}/></div>
                  <div><label className={labelClasses}>Email</label><input value={localConfig.contactEmail} onChange={e => setLocalConfig({...localConfig, contactEmail: e.target.value})} className={inputClasses}/></div>
                  <div><label className={labelClasses}>Dirección</label><input value={localConfig.contactAddress} onChange={e => setLocalConfig({...localConfig, contactAddress: e.target.value})} className={inputClasses}/></div>
               </div>

               <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100 grid md:grid-cols-2 gap-8">
                  <div className="md:col-span-2"><h3 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-6">Redes Sociales</h3></div>
                  <div><label className={labelClasses}>Facebook</label><input value={localConfig.socialFacebook} onChange={e => setLocalConfig({...localConfig, socialFacebook: e.target.value})} className={inputClasses}/></div>
                  <div><label className={labelClasses}>Instagram</label><input value={localConfig.socialInstagram} onChange={e => setLocalConfig({...localConfig, socialInstagram: e.target.value})} className={inputClasses}/></div>
                  <div><label className={labelClasses}>TikTok</label><input value={localConfig.socialTiktok} onChange={e => setLocalConfig({...localConfig, socialTiktok: e.target.value})} className={inputClasses}/></div>
               </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* MODALES REUTILIZADOS */}
      <AnimatePresence>
        {paymentStudent && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPaymentStudent(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"/>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-[3rem] p-12 shadow-2xl">
               <h3 className="text-2xl font-black uppercase mb-8 italic">Registrar Cobro: <span className="text-blue-600">{paymentStudent.firstName}</span></h3>
               <form onSubmit={handleRegisterPayment} className="space-y-6">
                  <div><label className={labelClasses}>Monto Recibido S/</label><input required name="amount" type="number" defaultValue={paymentStudent.pending_balance} className={inputClasses}/></div>
                  <div><label className={labelClasses}>Método</label><select name="method" className={inputClasses}><option value="Yape">Yape</option><option value="Plin">Plin</option><option value="BCP">BCP</option><option value="Efectivo">Efectivo</option></select></div>
                  <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">Confirmar</button>
               </form>
               <button onClick={() => setPaymentStudent(null)} className="absolute top-8 right-8 text-slate-400"><X/></button>
            </motion.div>
          </div>
        )}

        {showRegisterModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRegisterModal(false)} className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"/>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-5xl bg-white rounded-[4rem] shadow-2xl p-16 overflow-y-auto max-h-[90vh]">
              <button onClick={() => setShowRegisterModal(false)} className="absolute top-8 right-8 p-4 text-slate-400"><X/></button>
              <RegistrationForm config={config} isAdminView={true} onRegister={(student) => { onRegister(student); setShowRegisterModal(false); }} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
