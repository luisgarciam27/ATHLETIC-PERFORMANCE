
import React, { useState } from 'react';
import { Student } from '../types';
import { StudentCard } from './StudentCard';
import { 
  Search, Printer, QrCode, UserPlus, X, CreditCard, 
  Calendar, Trash2, Bell, CheckCircle, LogOut, 
  Users, LayoutDashboard, Settings, DollarSign 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SCHEDULES } from '../constants';

interface AdminDashboardProps {
  students: Student[];
  onRegister: (student: Student) => void;
  onDelete?: (id: string) => void;
  onLogout: () => void;
}

type AdminTab = 'students' | 'payments' | 'schedules';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ students, onRegister, onDelete, onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

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

  const filtered = students.filter(s => 
    (s.firstName + ' ' + s.lastName).toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.parentPhone.includes(searchTerm)
  );

  const handleInternalRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSchedule = SCHEDULES.find(s => s.id === newStudentForm.scheduleId);
    
    const newStudent: Student = {
      ...newStudentForm,
      id: Math.random().toString(36).substr(2, 9),
      registrationDate: new Date().toISOString(),
      category: selectedSchedule?.category || 'General',
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      qrCode: `ATH-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      paymentStatus: newStudentForm.paymentStatus as any
    };

    onRegister(newStudent);
    setShowAddModal(false);
    setNewStudentForm({
      firstName: '',
      lastName: '',
      birthDate: '',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      address: '',
      scheduleId: SCHEDULES[0].id,
      paymentStatus: 'Paid'
    });
  };

  const sendPaymentReminder = (student: Student) => {
    const message = `Hola ${student.parentName}! 👋 Le saludamos de Athletic Performance Academy. Le recordamos que la mensualidad de su hijo/a *${student.firstName} ${student.lastName}* está próxima a vencer (${new Date(student.nextPaymentDate).toLocaleDateString()}). Por favor, confirmar el pago para asegurar su cupo en la categoría ${student.category}. ¡Gracias! ⚽`;
    window.open(`https://wa.me/${student.parentPhone.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const inputClasses = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm";
  const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5";

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-6 shadow-2xl z-30">
        <div className="mb-12 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard size={18} className="text-white" />
          </div>
          <span className="font-black text-lg tracking-tight uppercase">Control Élite</span>
        </div>

        <nav className="space-y-2 flex-grow">
          <button 
            onClick={() => setActiveTab('students')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'students' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Users size={18} /> Alumnos
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'payments' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <DollarSign size={18} /> Pagos
          </button>
          <button 
            onClick={() => setActiveTab('schedules')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'schedules' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Calendar size={18} /> Horarios
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto p-8 relative">
        <header className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              {activeTab === 'students' && 'Gestión de Alumnos'}
              {activeTab === 'payments' && 'Control de Mensualidades'}
              {activeTab === 'schedules' && 'Gestión de Horarios'}
            </h1>
            <p className="text-slate-500 font-medium">Panel administrativo de Athletic Performance Academy.</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {activeTab === 'students' && (
              <div className="relative flex-grow md:flex-grow-0 md:min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-10 py-3 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm shadow-sm"
                />
              </div>
            )}
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 whitespace-nowrap"
            >
              <UserPlus size={18} /> {activeTab === 'students' ? 'NUEVO ALUMNO' : 'ACCION'}
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <div className="max-w-[1400px] mx-auto">
          {activeTab === 'students' && (
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                          <th className="px-8 py-5">Atleta</th>
                          <th className="px-8 py-5">Categoría</th>
                          <th className="px-8 py-5">Estado</th>
                          <th className="px-8 py-5 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filtered.map((s) => (
                          <tr 
                            key={s.id} 
                            onClick={() => setSelectedStudent(s)} 
                            className={`hover:bg-blue-50/30 transition-colors cursor-pointer ${selectedStudent?.id === s.id ? 'bg-blue-50/50' : ''}`}
                          >
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400">
                                  {s.firstName[0]}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900">{s.firstName} {s.lastName}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">{s.qrCode}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">{s.category}</span>
                            </td>
                            <td className="px-8 py-5">
                              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                s.paymentStatus === 'Paid' 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                : 'bg-amber-50 text-amber-600 border-amber-100'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${s.paymentStatus === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                {s.paymentStatus === 'Paid' ? 'Al día' : 'Pendiente'}
                              </div>
                            </td>
                            <td className="px-8 py-5 text-right space-x-2">
                              <button onClick={(e) => { e.stopPropagation(); sendPaymentReminder(s); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Recordatorio"><Bell size={16} /></button>
                              <button onClick={(e) => { e.stopPropagation(); onDelete?.(s.id); }} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all" title="Eliminar"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))}
                        {filtered.length === 0 && (
                          <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium italic">No se encontraron registros.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4">
                {selectedStudent ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-2xl sticky top-0">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Información del Alumno</h3>
                        <button onClick={() => setSelectedStudent(null)} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"><X size={14} /></button>
                      </div>
                      <StudentCard student={selectedStudent} />
                      <div className="mt-8 space-y-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-bold uppercase text-[9px]">Apoderado</span>
                            <span className="font-bold text-slate-900">{selectedStudent.parentName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-bold uppercase text-[9px]">Teléfono</span>
                            <span className="font-bold text-blue-600">{selectedStudent.parentPhone}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => window.print()} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2"><Printer size={14} /> IMPRIMIR</button>
                          <button onClick={() => sendPaymentReminder(selectedStudent)} className="flex-1 py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl font-bold text-xs flex items-center justify-center gap-2"><Bell size={14} /> WHATSAPP</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center bg-white/40">
                    <QrCode size={40} className="text-slate-300 mb-4" />
                    <p className="text-slate-400 font-bold text-sm">Selecciona un alumno para ver su carnet virtual y detalles.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl">
               <div className="grid md:grid-cols-3 gap-6 mb-12">
                  <div className="p-6 bg-emerald-50 rounded-[1.5rem] border border-emerald-100">
                     <p className="text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-2">Ingresos Estimados</p>
                     <p className="text-3xl font-black text-emerald-900">S/ {students.filter(s => s.paymentStatus === 'Paid').length * 200}</p>
                  </div>
                  <div className="p-6 bg-amber-50 rounded-[1.5rem] border border-amber-100">
                     <p className="text-amber-600 font-black text-[10px] uppercase tracking-widest mb-2">Pagos Pendientes</p>
                     <p className="text-3xl font-black text-amber-900">{students.filter(s => s.paymentStatus === 'Pending').length} Alumnos</p>
                  </div>
                  <div className="p-6 bg-blue-50 rounded-[1.5rem] border border-blue-100">
                     <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-2">Total Registrados</p>
                     <p className="text-3xl font-black text-blue-900">{students.length} Atletas</p>
                  </div>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                        <th className="px-8 py-5">Alumno</th>
                        <th className="px-8 py-5">Vencimiento</th>
                        <th className="px-8 py-5">Monto</th>
                        <th className="px-8 py-5 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {students.map(s => (
                         <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-8 py-5 font-bold text-slate-900">{s.firstName} {s.lastName}</td>
                           <td className="px-8 py-5 text-sm text-slate-500">{new Date(s.nextPaymentDate).toLocaleDateString()}</td>
                           <td className="px-8 py-5 font-bold text-slate-900">S/ 200.00</td>
                           <td className="px-8 py-5 text-right">
                              <button onClick={() => sendPaymentReminder(s)} className="text-blue-600 text-xs font-black uppercase hover:underline">Recordar Pago</button>
                           </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SCHEDULES.map(s => (
                <div key={s.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg relative group">
                  <div className="absolute top-6 right-6 p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                    <Calendar size={18} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">{s.category}</h3>
                  <p className="text-blue-600 font-bold text-xs uppercase mb-4">{s.age}</p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                      <LayoutDashboard size={14} className="text-slate-400" /> {s.days.join(', ')}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                      <Settings size={14} className="text-slate-400" /> {s.time}
                    </div>
                  </div>
                  <button className="w-full py-3 bg-slate-50 text-slate-400 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all uppercase tracking-widest">Editar Grupo</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Internal Registration Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center p-8 border-b border-slate-100">
                 <h3 className="text-xl font-black text-slate-900 uppercase">MATRÍCULA DIRECTA</h3>
                 <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-900"><X size={24} /></button>
              </div>
              <form onSubmit={handleInternalRegister} className="p-8 max-h-[75vh] overflow-y-auto space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <p className="text-[10px] font-black text-blue-600 uppercase border-b border-blue-50 pb-2">Datos del Alumno</p>
                    <div>
                      <label className={labelClasses}>Nombres</label>
                      <input required value={newStudentForm.firstName} onChange={(e) => setNewStudentForm({...newStudentForm, firstName: e.target.value})} type="text" className={inputClasses} />
                    </div>
                    <div>
                      <label className={labelClasses}>Apellidos</label>
                      <input required value={newStudentForm.lastName} onChange={(e) => setNewStudentForm({...newStudentForm, lastName: e.target.value})} type="text" className={inputClasses} />
                    </div>
                    <div>
                      <label className={labelClasses}>Categoría</label>
                      <select value={newStudentForm.scheduleId} onChange={(e) => setNewStudentForm({...newStudentForm, scheduleId: e.target.value})} className={inputClasses}>
                        {SCHEDULES.map(s => <option key={s.id} value={s.id}>{s.category}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <p className="text-[10px] font-black text-emerald-600 uppercase border-b border-emerald-50 pb-2">Datos de Pago</p>
                    <div>
                      <label className={labelClasses}>Apoderado</label>
                      <input required value={newStudentForm.parentName} onChange={(e) => setNewStudentForm({...newStudentForm, parentName: e.target.value})} type="text" className={inputClasses} />
                    </div>
                    <div>
                      <label className={labelClasses}>Celular</label>
                      <input required value={newStudentForm.parentPhone} onChange={(e) => setNewStudentForm({...newStudentForm, parentPhone: e.target.value})} type="tel" className={inputClasses} />
                    </div>
                    <div>
                      <label className={labelClasses}>Estado de Pago</label>
                      <div className="flex gap-2">
                        {['Paid', 'Pending'].map(status => (
                          <button key={status} type="button" onClick={() => setNewStudentForm({...newStudentForm, paymentStatus: status as any})} className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${newStudentForm.paymentStatus === status ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                            {status === 'Paid' ? 'PAGADO' : 'PENDIENTE'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-8 flex gap-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 border border-slate-200 text-slate-400 font-bold rounded-2xl">CANCELAR</button>
                  <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20">REGISTRAR EN BASE DE DATOS</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
