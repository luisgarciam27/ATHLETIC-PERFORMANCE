
import React, { useState, useMemo, useEffect } from 'react';
import { Student, AcademyConfig, ClassSchedule, IntroSlide, StaffStory } from '../types';
import { 
  Search, X, LogOut, Users, 
  LayoutDashboard, DollarSign, AlertCircle, 
  Zap, Phone, Trash, Save, 
  Image as ImageIcon, Wallet, ListChecks, Plus,
  Settings, MessageCircle, PlusCircle, CreditCard, Banknote, 
  Video, Type, Clock, Facebook, Instagram, Music2, History
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
  onRegister: (student: Student) => Promise<boolean>;
  onUpdateStudent: (student: Student) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  students, schedules, config, onUpdateConfig, onUpdateSchedules, onRegister, onUpdateStudent, onDelete, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'schedules' | 'content' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStudent, setPaymentStudent] = useState<Student | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  const [localConfig, setLocalConfig] = useState<AcademyConfig>({ ...config });
  const [localSchedules, setLocalSchedules] = useState<ClassSchedule[]>([...schedules]);

  useEffect(() => { setLocalConfig({ ...config }); }, [config]);
  useEffect(() => { setLocalSchedules([...schedules]); }, [schedules]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const fullName = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase()) || (s.parentPhone && s.parentPhone.includes(searchTerm));
    });
  }, [students, searchTerm]);

  // Gestión de Listas Dinámicas para Contenido
  const updateList = (key: keyof AcademyConfig, index: number, field: string | null, value: any) => {
    const list = [...(localConfig[key] as any[])];
    if (field) {
      list[index] = { ...list[index], [field]: value };
    } else {
      list[index] = value;
    }
    setLocalConfig({ ...localConfig, [key]: list });
  };

  const addItem = (key: keyof AcademyConfig, defaultValue: any) => {
    setLocalConfig({ ...localConfig, [key]: [...(localConfig[key] as any[]), defaultValue] });
  };

  const removeItem = (key: keyof AcademyConfig, index: number) => {
    const list = [...(localConfig[key] as any[])];
    list.splice(index, 1);
    setLocalConfig({ ...localConfig, [key]: list });
  };

  const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1";
  const inputClasses = "w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-bold transition-all shadow-inner";

  return (
    <div className="flex h-screen bg-white overflow-hidden text-slate-900 font-ubuntu">
      {/* SIDEBAR */}
      <aside className="w-80 bg-slate-950 m-4 rounded-[2.5rem] text-white flex flex-col p-8 shadow-2xl z-30 overflow-hidden relative shrink-0">
        <div className="mb-12 flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg"><Zap className="text-white fill-white" size={28} /></div>
          <div><span className="font-black text-xl tracking-tighter uppercase leading-none block">ATHLETIC</span><span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Admin v3.0</span></div>
        </div>
        <nav className="space-y-2 flex-grow relative z-10">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Resumen' },
            { id: 'students', icon: Users, label: 'Alumnos & Pagos' },
            { id: 'schedules', icon: ListChecks, label: 'Horarios' },
            { id: 'content', icon: ImageIcon, label: 'Contenidos Web' },
            { id: 'settings', icon: Settings, label: 'Configuración' }
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-white text-slate-900 shadow-xl scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={20}/> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto w-full flex items-center gap-4 px-6 py-4 text-rose-400 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/10 rounded-2xl transition-all"><LogOut size={20}/> Cerrar Sesión</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow overflow-y-auto p-12 bg-slate-50 relative">
        <header className="flex justify-between items-end mb-16">
          <div><p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Administrador</p><h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">{activeTab === 'content' ? 'Contenidos' : activeTab === 'settings' ? 'Configuración' : activeTab}</h1></div>
          {(activeTab === 'content' || activeTab === 'settings' || activeTab === 'schedules') && (
            <button onClick={async () => {
              const ok = await onUpdateConfig(localConfig);
              if (ok) alert('Sitio Web actualizado y publicado.');
            }} className="flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-2xl hover:bg-blue-700 transition-all active:scale-95"><Save size={24}/> Publicar Cambios</button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col group hover:border-blue-200 transition-all">
                <Users size={32} className="text-blue-600 mb-6"/><p className={labelClasses}>Alumnos Totales</p><p className="text-7xl font-black tracking-tighter">{students.length}</p>
              </div>
              <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col group hover:border-emerald-200 transition-all">
                <DollarSign size={32} className="text-emerald-600 mb-6"/><p className={labelClasses}>Recaudado S/</p><p className="text-7xl font-black tracking-tighter">{students.reduce((acc, s) => acc + (s.total_paid || 0), 0)}</p>
              </div>
              <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col group hover:border-rose-200 transition-all">
                <AlertCircle size={32} className="text-rose-600 mb-6"/><p className={labelClasses}>Pendiente Cobro S/</p><p className="text-7xl font-black tracking-tighter">{students.reduce((acc, s) => acc + (s.pending_balance || 0), 0)}</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'students' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="relative flex-grow"><Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24}/><input type="text" placeholder="Buscar por nombre o celular..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-16 pr-8 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm"/></div>
                <button onClick={() => setShowRegisterModal(true)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase shadow-xl flex items-center gap-3 active:scale-95"><Plus size={20}/> Registro Manual</button>
              </div>
              <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-slate-100">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 border-b border-slate-100"><tr className="text-[10px] font-black uppercase tracking-widest"><th className="p-8">Alumno</th><th className="p-8">Apoderado</th><th className="p-8 text-center">Estado</th><th className="p-8 text-center">Acciones</th></tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredStudents.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-8"><p className="font-black text-slate-900 uppercase text-lg mb-1">{s.firstName} {s.lastName}</p><span className="text-[10px] font-black uppercase text-blue-500">{s.category}</span></td>
                        <td className="p-8"><p className="font-bold text-sm">{s.parentName}</p><div className="flex items-center gap-2 text-emerald-500 mt-1"><Phone size={12}/> <span className="text-[11px] font-black">{s.parentPhone}</span></div></td>
                        <td className="p-8 text-center"><div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest ${s.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{s.paymentStatus === 'Paid' ? 'CANCELADO' : `DEUDA S/ ${s.pending_balance}`}</div></td>
                        <td className="p-8 text-center"><div className="flex items-center justify-center gap-3">
                          <button title="Cobrar" onClick={() => setPaymentStudent(s)} className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all"><Wallet size={20}/></button>
                          <button title="Historial" className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><History size={20}/></button>
                          <button title="WhatsApp" onClick={() => {
                            const num = s.parentPhone.replace(/\D/g, '');
                            window.open(`https://wa.me/51${num}?text=Hola%20${s.parentName},%20Academia%20Athletic%20te%20saluda.`, '_blank');
                          }} className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all"><MessageCircle size={20}/></button>
                          <button title="Eliminar" onClick={() => onDelete(s.id)} className="p-4 bg-rose-50 text-rose-400 rounded-2xl hover:bg-rose-600 hover:text-white transition-all"><Trash size={20}/></button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'schedules' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {localSchedules.map((s, idx) => (
                <div key={s.id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-6">
                   <div className="flex justify-between items-center"><div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: s.color }}><ListChecks size={24}/></div><input type="color" value={s.color} onChange={e => {
                     const newList = [...localSchedules];
                     newList[idx].color = e.target.value;
                     setLocalSchedules(newList);
                   }} className="w-8 h-8 rounded-lg cursor-pointer"/></div>
                   <div><label className={labelClasses}>Categoría</label><input value={s.category} onChange={e => {
                     const newList = [...localSchedules];
                     newList[idx].category = e.target.value;
                     setLocalSchedules(newList);
                   }} className={inputClasses}/></div>
                   <div className="grid grid-cols-2 gap-4">
                     <div><label className={labelClasses}>Edad</label><input value={s.age} onChange={e => {
                        const newList = [...localSchedules];
                        newList[idx].age = e.target.value;
                        setLocalSchedules(newList);
                     }} className={inputClasses}/></div>
                     <div><label className={labelClasses}>Precio S/</label><input type="number" value={s.price} onChange={e => {
                        const newList = [...localSchedules];
                        newList[idx].price = Number(e.target.value);
                        setLocalSchedules(newList);
                     }} className={inputClasses}/></div>
                   </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-32">
              <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
                <div className="flex justify-between items-center"><h3 className="font-black text-slate-900 uppercase italic text-xl">Carrusel de Inicio (Hero)</h3><button onClick={() => addItem('heroImages', '')} className="text-blue-600 text-[10px] font-black uppercase flex items-center gap-2"><PlusCircle size={20}/> Añadir</button></div>
                <div className="grid gap-6">
                  {localConfig.heroImages.map((url, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <input value={url} onChange={e => updateList('heroImages', i, null, e.target.value)} className={inputClasses} placeholder="URL de imagen..."/>
                      <button onClick={() => removeItem('heroImages', i)} className="p-4 text-rose-400 hover:bg-rose-50 rounded-xl transition-all"><Trash size={20}/></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
                <div className="flex justify-between items-center"><h3 className="font-black text-slate-900 uppercase italic text-xl">Galería "Nosotros"</h3><button onClick={() => addItem('aboutImages', '')} className="text-blue-600 text-[10px] font-black uppercase flex items-center gap-2"><PlusCircle size={20}/> Añadir</button></div>
                <div className="grid md:grid-cols-2 gap-8">
                  {localConfig.aboutImages.map((url, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <input value={url} onChange={e => updateList('aboutImages', i, null, e.target.value)} className={inputClasses}/>
                      <button onClick={() => removeItem('aboutImages', i)} className="p-4 text-rose-400"><Trash size={20}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-32">
              <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 grid md:grid-cols-2 gap-8">
                <div className="md:col-span-2 flex items-center gap-4 text-blue-600"><Type/><h3 className="font-black text-slate-900 uppercase italic tracking-tighter text-xl">Información de Contacto</h3></div>
                <div><label className={labelClasses}>Celular WhatsApp</label><input value={localConfig.socialWhatsapp} onChange={e => setLocalConfig({...localConfig, socialWhatsapp: e.target.value})} className={inputClasses}/></div>
                <div><label className={labelClasses}>Correo Oficial</label><input value={localConfig.contactEmail} onChange={e => setLocalConfig({...localConfig, contactEmail: e.target.value})} className={inputClasses}/></div>
                <div className="md:col-span-2"><label className={labelClasses}>Dirección Principal</label><input value={localConfig.contactAddress} onChange={e => setLocalConfig({...localConfig, contactAddress: e.target.value})} className={inputClasses}/></div>
              </div>

              <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 grid md:grid-cols-2 gap-8">
                <div className="md:col-span-2 flex items-center gap-4 text-emerald-600"><PlusCircle/><h3 className="font-black text-slate-900 uppercase italic tracking-tighter text-xl">Redes Sociales</h3></div>
                <div className="flex items-center gap-4"><Facebook className="text-blue-600 shrink-0"/><input value={localConfig.socialFacebook} onChange={e => setLocalConfig({...localConfig, socialFacebook: e.target.value})} className={inputClasses} placeholder="URL Facebook..."/></div>
                <div className="flex items-center gap-4"><Instagram className="text-pink-600 shrink-0"/><input value={localConfig.socialInstagram} onChange={e => setLocalConfig({...localConfig, socialInstagram: e.target.value})} className={inputClasses} placeholder="URL Instagram..."/></div>
                <div className="flex items-center gap-4"><Music2 className="text-slate-900 shrink-0"/><input value={localConfig.socialTiktok} onChange={e => setLocalConfig({...localConfig, socialTiktok: e.target.value})} className={inputClasses} placeholder="URL TikTok..."/></div>
              </div>

              <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 grid md:grid-cols-2 gap-8">
                <div className="md:col-span-2 flex items-center gap-4 text-emerald-600"><CreditCard/><h3 className="font-black text-slate-900 uppercase italic tracking-tighter text-xl">Métodos de Cobro</h3></div>
                <div><label className={labelClasses}>N° Yape</label><input value={localConfig.yapeNumber} onChange={e => setLocalConfig({...localConfig, yapeNumber: e.target.value})} className={inputClasses}/></div>
                <div><label className={labelClasses}>Nombre Yape</label><input value={localConfig.yapeName} onChange={e => setLocalConfig({...localConfig, yapeName: e.target.value})} className={inputClasses}/></div>
                <div className="md:col-span-2 h-[1px] bg-slate-100"></div>
                <div><label className={labelClasses}>N° Cuenta BCP</label><input value={localConfig.bcpAccount} onChange={e => setLocalConfig({...localConfig, bcpAccount: e.target.value})} className={inputClasses}/></div>
                <div><label className={labelClasses}>CCI BCP</label><input value={localConfig.bcpCCI} onChange={e => setLocalConfig({...localConfig, bcpCCI: e.target.value})} className={inputClasses}/></div>
                <div className="md:col-span-2"><label className={labelClasses}>Titular BCP</label><input value={localConfig.bcpName} onChange={e => setLocalConfig({...localConfig, bcpName: e.target.value})} className={inputClasses}/></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* MODAL COBRO */}
      <AnimatePresence>
        {paymentStudent && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPaymentStudent(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"/>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-[3rem] p-12 shadow-2xl">
               <button onClick={() => setPaymentStudent(null)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900"><X size={28}/></button>
               <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-8">NUEVA TRANSACCIÓN</h3>
               <form className="space-y-6">
                  <div><label className={labelClasses}>Monto Recibido S/</label><input type="number" defaultValue={paymentStudent.pending_balance} className={inputClasses}/></div>
                  <div><label className={labelClasses}>Medio de Pago</label>
                    <select className={inputClasses}>
                      <option>Yape</option><option>Plin</option><option>BCP</option><option>Efectivo</option>
                    </select>
                  </div>
                  <button onClick={(e) => { e.preventDefault(); alert('Registro procesado. Saldo actualizado.'); setPaymentStudent(null); }} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Confirmar Ingreso</button>
               </form>
            </motion.div>
          </div>
        )}

        {showRegisterModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRegisterModal(false)} className="fixed inset-0 bg-slate-950/90 backdrop-blur-md"/>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl p-12 overflow-y-auto max-h-[90vh]">
              <RegistrationForm config={config} isAdminView={true} onRegister={async (s) => { const ok = await onRegister(s); if(ok) setShowRegisterModal(false); return ok; }} />
              <button onClick={() => setShowRegisterModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900"><X size={32}/></button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
