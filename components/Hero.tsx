
import { motion } from 'framer-motion';
import { Play, Trophy, ArrowRight, Activity, Users, ShieldCheck } from 'lucide-react';
import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center bg-slate-50 overflow-hidden pt-20">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-[10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[5%] w-[400px] h-[400px] bg-emerald-300/15 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      </div>

      <div className="container mx-auto px-4 z-10 grid lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-bold tracking-widest mb-8 text-blue-600 uppercase">
            <Activity size={14} />
            ESTÁNDAR DE ALTO RENDIMIENTO - LIMA
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-8 tracking-tighter text-slate-900">
            FORJANDO LOS <br />
            <span className="text-gradient">LÍDERES</span> DEL MAÑANA
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-xl mb-12 font-medium leading-relaxed">
            Nuestra metodología integra el talento natural con disciplina táctica y apoyo emocional. Únete a la academia donde el éxito es una consecuencia de la formación integral.
          </p>
          
          <div className="flex flex-wrap gap-6 items-center">
            <a 
              href="#register" 
              className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 active:scale-95 group"
            >
              MATRÍCULA ABIERTA
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <button className="flex items-center gap-4 text-slate-700 font-bold hover:text-blue-600 transition-colors group">
              <span className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center bg-white group-hover:border-blue-500 transition-all shadow-sm">
                <Play className="fill-slate-700 ml-1 group-hover:fill-blue-600" size={22} />
              </span>
              NUESTRO STAFF
            </button>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-200 flex items-center gap-10">
            <div className="flex items-center gap-3">
              <Users className="text-blue-500" size={24} />
              <div>
                <p className="text-2xl font-black text-slate-900 leading-none">200+</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Atletas</p>
              </div>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-500" size={24} />
              <div>
                <p className="text-2xl font-black text-slate-900 leading-none">100%</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Seguridad</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-6 relative"
        >
          {/* Contenedor Premium de la Foto */}
          <div className="relative group">
            {/* Brillo de fondo dinámico */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            
            <div className="relative bg-white p-4 rounded-[2.5rem] shadow-2xl border border-white overflow-hidden">
               {/* Imagen de alta calidad de niños en equipo de fútbol */}
               <img 
                 src="https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?q=80&w=2070&auto=format&fit=crop" 
                 alt="Equipo Athletic Performance"
                 className="w-full h-[450px] rounded-[2rem] object-cover shadow-inner transition-transform duration-700 group-hover:scale-[1.05]"
               />
               
               {/* Overlay sutil de marca */}
               <div className="absolute inset-x-4 bottom-4 bg-white/90 backdrop-blur-md p-6 rounded-[1.5rem] border border-white/20 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 font-black text-xs uppercase tracking-[0.2em] mb-1">Entrenamiento 2024</p>
                      <p className="text-slate-900 font-bold text-lg">Categoría Formativa Élite</p>
                    </div>
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                           <img src={`https://i.pravatar.cc/100?u=${i}`} alt="player" />
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>

            {/* Badge de Éxito Flotante */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-6 -right-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-2xl z-20 flex items-center gap-4 hidden md:flex"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <Trophy className="text-emerald-600" size={24} />
              </div>
              <div>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest leading-none mb-1">Cuna de Campeones</p>
                <p className="text-xl font-black text-slate-900">Élite Lima</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
