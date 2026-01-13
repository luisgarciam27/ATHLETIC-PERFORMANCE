
import React from 'react';
import { ClassSchedule } from '../types';
import { Clock, Calendar, Users, CalendarDays, CheckCircle2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface SchedulesSectionProps {
  schedules: ClassSchedule[];
}

export const SchedulesSection: React.FC<SchedulesSectionProps> = ({ schedules }) => {
  const formatDays = (days: string[]) => {
    if (!days || days.length === 0) return "POR CONFIRMAR";
    return days.map(d => d.substring(0, 3)).join(', ');
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '---';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
    } catch {
      return '---';
    }
  };

  return (
    <div id="schedules" className="container mx-auto px-4 py-24">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-blue-600 font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">Ciclo Académico 2026</span>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase leading-none italic">HORARIOS & CATEGORÍAS</h2>
          <p className="text-slate-500 font-medium text-lg">Distribución profesional por edades y niveles de competencia.</p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {schedules.map((s, idx) => (
          <motion.div 
            key={s.id} 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-[3.5rem] p-10 shadow-2xl flex flex-col h-full border border-slate-100 relative overflow-hidden group hover:scale-[1.02] transition-all"
            style={{ borderTop: `12px solid ${s.color}` }}
          >
            <div className="mb-8 relative z-10">
               <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: s.color }}></div>
                    <span className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black uppercase text-slate-400 tracking-widest">PRO-NIVEL</span>
                 </div>
                 <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl" style={{ backgroundColor: s.color }}>
                   <Users size={24}/>
                 </div>
               </div>
               <h3 className="text-3xl font-black text-slate-900 leading-tight mb-2 tracking-tighter uppercase italic">{s.category}</h3>
               <p className="font-black text-xs uppercase tracking-[0.2em]" style={{ color: s.color }}>{s.age}</p>
            </div>

            <div className="space-y-6 mb-12 flex-grow relative z-10">
               {/* NUEVA SECCIÓN DE FECHAS */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Inicia</p>
                    <p className="font-black text-slate-900 uppercase text-sm">{formatDate(s.startDate)}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Finaliza</p>
                    <p className="font-black text-slate-900 uppercase text-sm">{formatDate(s.endDate)}</p>
                  </div>
               </div>

               <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 space-y-4 shadow-sm">
                 <div className="flex items-center gap-4 text-slate-700">
                    <CalendarDays size={20} className="text-slate-300"/>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Días</span>
                      <span className="text-xs font-black uppercase">{formatDays(s.days)}</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 text-slate-700">
                    <Clock size={20} className="text-slate-300"/>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Hora</span>
                      <span className="text-xs font-black uppercase">{s.time}</span>
                    </div>
                 </div>
               </div>
            </div>

            <div className="mt-auto relative z-10">
               <div className="mb-8 flex items-end gap-2 px-4">
                 <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none">S/ {s.price}</span>
                 <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest leading-none">/ Mensual</span>
               </div>
               <a 
                 href="#register" 
                 style={{ backgroundColor: s.color }} 
                 className="block w-full py-6 rounded-[2rem] font-black text-center text-white text-xs uppercase tracking-[0.3em] shadow-xl hover:brightness-110 active:scale-95 transition-all"
               >
                 RESERVAR CUPO
               </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
