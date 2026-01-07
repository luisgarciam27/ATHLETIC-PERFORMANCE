
import React, { useState } from 'react';
import { Student } from '../types';
import { StudentCard } from './StudentCard';
import { Search, Printer, QrCode, ArrowRight, UserPlus, X, CreditCard, Calendar, Trash2, Bell, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SCHEDULES, WHATSAPP_NUMBER } from '../constants';

interface AdminDashboardProps {
  students: Student[];
  onRegister: (student: Student) => void;
  onDelete?: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ students, onRegister, onDelete }) => {
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar alumno por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl px-12 py-4 focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 shadow-sm"
          />
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
        >
          <UserPlus size={18} /> INSCRIBIR NUEVO ALUMNO
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                    <th className="px-8 py-5">Atleta</th>
                    <th className="px-8 py-5">Categoría / Horario</th>
                    <th className="px-8 py-5">Mensualidad</th>
                    <th className="px-8 py-5">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.length > 0 ? filtered.map((s) => (
                    <tr 
                      key={s.id} 
                      onClick={() => setSelectedStudent(s)} 
                      className={`hover:bg-blue-50/50 transition-colors cursor-pointer group ${selectedStudent?.id === s.id ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold shadow-sm">
                            {s.firstName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{s.firstName} {s.lastName}</p>
                            <p className="text-[10px] text-slate-400 font-mono tracking-tighter">ID: {s.qrCode}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{s.category}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          s.paymentStatus === 'Paid' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.paymentStatus === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          {s.paymentStatus === 'Paid' ? 'Al día' : 'Pendiente'}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={(e) => { e.stopPropagation(); sendPaymentReminder(s); }}
                          className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Enviar Recordatorio WhatsApp"
                        >
                          <Bell size={18} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium italic">No hay registros guardados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <AnimatePresence mode="wait">
            {selectedStudent ? (
              <motion.div 
                key={selectedStudent.id}
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="space-y-6"
              >
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-2xl relative">
                    <div className="flex justify-between items-center mb-6">
                       <h3 className="font-black text-lg text-slate-900">VISTA DEL CARNET</h3>
                       <div className="flex gap-2">
                         <button onClick={() => window.print()} className="p-2.5 bg-slate-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
                           <Printer size={16} />
                         </button>
                         <button onClick={() => setSelectedStudent(null)} className="p-2.5 bg-slate-50 rounded-xl hover:bg-slate-200 transition-colors">
                           <X size={16} />
                         </button>
                       </div>
                    </div>
                    
                    <StudentCard student={selectedStudent} />
                    
                    <div className="mt-8 space-y-4">
                       <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                          <div className="flex justify-between">
                            <span className={labelClasses}>Apoderado</span>
                            <span className="text-xs font-bold">{selectedStudent.parentName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={labelClasses}>Celular</span>
                            <span className="text-xs font-bold text-blue-600">{selectedStudent.parentPhone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={labelClasses}>Próximo Pago</span>
                            <span className="text-xs font-bold">{new Date(selectedStudent.nextPaymentDate).toLocaleDateString()}</span>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => sendPaymentReminder(selectedStudent)}
                            className="py-4 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-emerald-100 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2"
                          >
                             <Bell size={14} /> Recordatorio
                          </button>
                          <button 
                            className="py-4 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                          >
                             <CheckCircle size={14} /> Asistencia
                          </button>
                       </div>
                    </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center bg-white/30">
                 <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
                    <QrCode size={40} className="text-slate-300" />
                 </div>
                 <h4 className="text-slate-900 font-black text-xl mb-3 uppercase tracking-tight">Panel de Control</h4>
                 <p className="text-slate-400 font-medium text-sm leading-relaxed">Selecciona un alumno de la lista.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center p-8 border-b border-slate-100">
                 <h3 className="text-xl font-black text-slate-900 uppercase">FICHA DE MATRÍCULA INTERNA</h3>
                 <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-900"><X size={24} /></button>
              </div>

              <form onSubmit={handleInternalRegister} className="p-8 max-h-[75vh] overflow-y-auto space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <p className="text-[10px] font-black text-blue-600 uppercase border-b border-blue-50 pb-2">Datos del Alumno</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClasses}>Nombres</label>
                        <input required value={newStudentForm.firstName} onChange={(e) => setNewStudentForm({...newStudentForm, firstName: e.target.value})} type="text" className={inputClasses} />
                      </div>
                      <div>
                        <label className={labelClasses}>Apellidos</label>
                        <input required value={newStudentForm.lastName} onChange={(e) => setNewStudentForm({...newStudentForm, lastName: e.target.value})} type="text" className={inputClasses} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClasses}>Nacimiento</label>
                      <input required value={newStudentForm.birthDate} onChange={(e) => setNewStudentForm({...newStudentForm, birthDate: e.target.value})} type="date" className={inputClasses} />
                    </div>
                    <div>
                      <label className={labelClasses}>Categoría</label>
                      <select value={newStudentForm.scheduleId} onChange={(e) => setNewStudentForm({...newStudentForm, scheduleId: e.target.value})} className={inputClasses}>
                        {SCHEDULES.map(s => <option key={s.id} value={s.id}>{s.category} ({s.age})</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <p className="text-[10px] font-black text-emerald-600 uppercase border-b border-emerald-50 pb-2">Datos del Apoderado</p>
                    <div>
                      <label className={labelClasses}>Nombre Completo</label>
                      <input required value={newStudentForm.parentName} onChange={(e) => setNewStudentForm({...newStudentForm, parentName: e.target.value})} type="text" className={inputClasses} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClasses}>WhatsApp</label>
                        <input required value={newStudentForm.parentPhone} onChange={(e) => setNewStudentForm({...newStudentForm, parentPhone: e.target.value})} type="tel" className={inputClasses} />
                      </div>
                      <div>
                        <label className={labelClasses}>Dirección</label>
                        <input value={newStudentForm.address} onChange={(e) => setNewStudentForm({...newStudentForm, address: e.target.value})} type="text" className={inputClasses} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClasses}>Estado Inicial</label>
                      <div className="flex gap-2">
                        {['Paid', 'Pending'].map(status => (
                          <button 
                            key={status} type="button"
                            onClick={() => setNewStudentForm({...newStudentForm, paymentStatus: status as any})}
                            className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${newStudentForm.paymentStatus === status ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}
                          >
                            {status === 'Paid' ? 'PAGADO' : 'PENDIENTE'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex gap-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 border border-slate-200 text-slate-400 font-bold rounded-2xl">DESCARTAR</button>
                  <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20">REGISTRAR EN SISTEMA</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
