
import React from 'react';
import { ClassSchedule } from '../types';
import { Clock, Calendar, Users, CalendarDays, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SchedulesSectionProps {
  schedules: ClassSchedule[];
}

export const SchedulesSection: React.FC<SchedulesSectionProps> = ({ schedules }) => {
  // Función para abreviar días: "Lunes" -> "Lun"
  const formatDays = (days: string[]) => {
    if (!days || days.length === 0) return "Días por confirmar";
    return days.map(d => d.substring(0, 3)).join(', ');
  };

  return (
    <div id="schedules" className="container mx-auto px-4 py-24">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-blue-600 font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">Entrenamiento Élite</span>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase leading-none">HORARIOS & CICLOS 2026</h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            Nuestros grupos están divididos por niveles y edades para garantizar una formación personalizada y efectiva.
          </p>
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
            whileHover={{ y: -10 }} 
            style={{ borderTop: `12px solid ${s.color}` }} 
            className="bg-white rounded-[3.5rem] p-10 shadow-xl flex flex-col h-full border border-slate-100 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-slate-100 transition-colors"></div>
            
            <div className="mb-8 relative z-10">
               <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: s.color }}></div>
                    <span className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black uppercase text-slate-400 tracking-widest">VACANTES DISPONIBLES</span>
                 </div>
                 <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-2xl" style={{ backgroundColor: s.color }}>
                   <Users size={24}/>
                 </div>
               </div>
               <h3 className="text-3xl font-black text-slate-900 leading-tight mb-2 tracking-tighter uppercase">{s.category}</h3>
               <p className="font-black text-xs uppercase tracking-[0.2em]" style={{ color: s.color }}>Categoría: {s.age}</p>
            </div>

            <div className="space-y-6 mb-12 flex-grow relative z-10">
               <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 space-y-5">
                 <div className="flex items-center gap-4 text-slate-700">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-slate-400">
                      <CalendarDays size={20}/>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Días de Clase</span>
                      <span className="text-sm font-black uppercase">{formatDays(s.days)}</span>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-4 text-slate-700">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-slate-400">
                      <Clock size={20}/>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Horario Estricto</span>
                      <span className="text-sm font-black uppercase">{s.time}</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-4 text-slate-700">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-slate-400">
                      <CheckCircle2 size={20}/>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Estado</span>
                      <span className="text-sm font-black uppercase text-emerald-600">Ciclo Activo 2026</span>
                    </div>
                 </div>
               </div>
            </div>

            <div className="mt-auto relative z-10">
               <div className="mb-8 flex items-end gap-2 px-4">
                 <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none">S/ {s.price}</span>
                 <div className="flex flex-col">
                    <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest leading-none">PEN</span>
                    <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">/ Mes</span>
                 </div>
               </div>
               <a 
                 href="#register" 
                 style={{ backgroundColor: s.color }} 
                 className="block w-full py-6 rounded-3xl font-black text-center text-white text-xs uppercase tracking-[0.3em] shadow-2xl hover:brightness-110 active:scale-95 transition-all"
               >
                 MATRICULAR ALUMNO
               </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
