
import React, { useState } from 'react';
import { SCHEDULES } from '../constants';
import { Clock, Calendar, Target, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SchedulesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'LMV' | 'MJS'>('LMV');

  const lmvSchedules = SCHEDULES.filter(s => s.days.includes('Lunes'));
  const mjsSchedules = SCHEDULES.filter(s => s.days.includes('Martes'));

  const activeSchedules = activeTab === 'LMV' ? lmvSchedules : mjsSchedules;

  return (
    <div id="schedules" className="container mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight uppercase">HORARIOS 2024</h2>
        <p className="text-slate-500 font-medium text-lg">Grupos reducidos con identidad propia para un aprendizaje enfocado.</p>
      </div>

      <div className="flex justify-center mb-16">
        <div className="bg-white p-2 rounded-[2rem] flex gap-2 shadow-xl shadow-slate-200/60 border border-slate-100">
          <button 
            onClick={() => setActiveTab('LMV')}
            className={`px-8 py-4 rounded-[1.5rem] font-bold text-sm transition-all flex items-center gap-3 ${activeTab === 'LMV' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Calendar size={18} /> Lu, Mi & Vi
          </button>
          <button 
            onClick={() => setActiveTab('MJS')}
            className={`px-8 py-4 rounded-[1.5rem] font-bold text-sm transition-all flex items-center gap-3 ${activeTab === 'MJS' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Calendar size={18} /> Ma, Ju & Sá
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {activeSchedules.map((s) => (
            <motion.div 
              key={s.id}
              whileHover={{ y: -10 }}
              style={{ borderTop: `6px solid ${s.color}` }}
              className="bg-white rounded-[2.5rem] p-8 shadow-lg hover:shadow-2xl transition-all flex flex-col h-full group"
            >
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600 uppercase">Élite</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: s.color }}>
                    <Users size={16} />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2">{s.category}</h3>
                <p className="font-black text-sm uppercase" style={{ color: s.color }}>{s.age}</p>
              </div>

              <div className="space-y-4 mb-8 flex-grow">
                <p className="text-sm text-slate-500 leading-relaxed">
                  {s.objective}
                </p>
                
                <div className="pt-4 border-t border-slate-50 space-y-3">
                  <div className="flex items-center gap-3 text-slate-600 text-sm font-bold">
                    <Clock size={16} style={{ color: s.color }} />
                    {s.time}
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="mb-6">
                  <span className="text-3xl font-black text-slate-900">S/ {s.price}</span>
                  <span className="text-slate-400 text-xs font-bold uppercase ml-1">/ Mes</span>
                </div>
                <a 
                  href="#register" 
                  style={{ backgroundColor: s.color }}
                  className="block w-full py-4 rounded-2xl font-black text-center text-white text-sm transition-all shadow-md active:scale-95 hover:opacity-90"
                >
                  RESERVAR CUPO
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
