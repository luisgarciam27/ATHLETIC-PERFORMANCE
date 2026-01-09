
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Trophy, ArrowRight, Activity, Users, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface HeroProps {
  images: string[];
}

const sliderContent = [
  {
    tag: "ESTÁNDAR DE ALTO RENDIMIENTO - LIMA",
    title: "FORJANDO LOS LÍDERES DEL MAÑANA",
    desc: "Nuestra metodología integra el talento natural con disciplina táctica y apoyo emocional. Únete a la academia donde el éxito es una consecuencia de la formación integral.",
  },
  {
    tag: "INSCRIPCIONES ABIERTAS 2024",
    title: "MÁS QUE FÚTBOL, UNA PASIÓN",
    desc: "Desarrolla habilidades competitivas en un ambiente profesional con los mejores entrenadores licenciados. Cupos limitados por categoría.",
  },
  {
    tag: "ELITE TRAINING CENTER",
    title: "ENTRENA COMO UN PROFESIONAL",
    desc: "Tecnología y metodología aplicada al fútbol base. Seguimiento individualizado del progreso de cada atleta mediante nuestro sistema digital.",
  }
];

export const Hero: React.FC<HeroProps> = ({ images }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  const nextSlide = () => setIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  const currentContent = sliderContent[index % sliderContent.length];

  return (
    <div className="relative min-h-[95vh] flex items-center bg-slate-50 overflow-hidden pt-20">
      {/* Background elements - Static */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 right-[10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[5%] w-[400px] h-[400px] bg-emerald-300/15 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      </div>

      <div className="container mx-auto px-4 z-10 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Stable text content */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-bold tracking-widest mb-8 text-blue-600 uppercase">
                <Activity size={14} />
                {currentContent.tag}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-8 tracking-tighter text-slate-900">
                {currentContent.title.split(' ').map((word, i) => (
                  word === 'LÍDERES' || word === 'PASIÓN' || word === 'PROFESIONAL' ? 
                  <span key={i} className="text-gradient block md:inline">{word} </span> : word + ' '
                ))}
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 max-w-xl mb-12 font-medium leading-relaxed">
                {currentContent.desc}
              </p>
            </motion.div>
          </AnimatePresence>
          
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
        </div>

        {/* Right Column: Dynamic Image Slider */}
        <div className="lg:col-span-6 relative h-[600px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.1, rotate: 2 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="relative w-full h-full p-4"
            >
              {/* Decorative glows */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-emerald-500/20 rounded-[3rem] blur-2xl"></div>
              
              <div className="relative bg-white p-4 rounded-[3rem] shadow-2xl border border-white h-full overflow-hidden">
                 <img 
                   src={images[index] || images[0]} 
                   alt="Academy Action"
                   className="w-full h-full rounded-[2.5rem] object-cover shadow-inner"
                 />
                 
                 {/* Slide Indicator Overlay */}
                 <div className="absolute inset-x-8 bottom-8 flex justify-between items-center bg-white/20 backdrop-blur-xl p-6 rounded-[2rem] border border-white/30 shadow-2xl">
                    <div>
                      <p className="text-white font-black text-[10px] uppercase tracking-widest mb-1 opacity-80">PROXIMA CATEGORIA</p>
                      <p className="text-white font-bold text-xl leading-none">SUB-10 ÉLITE</p>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={prevSlide} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-blue-600 flex items-center justify-center transition-all backdrop-blur-md">
                         <ChevronLeft size={20} />
                       </button>
                       <button onClick={nextSlide} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-blue-600 flex items-center justify-center transition-all backdrop-blur-md">
                         <ChevronRight size={20} />
                       </button>
                    </div>
                 </div>
              </div>

              {/* Float Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-2xl z-20 flex items-center gap-4 hidden md:flex"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <Trophy className="text-emerald-600" size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-1">Cuna de Campeones</p>
                  <p className="text-xl font-black text-slate-900">Nivel Pro</p>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {images.map((_, i) => (
          <button 
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${index === i ? 'w-10 bg-blue-600 shadow-lg shadow-blue-500/50' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
          />
        ))}
      </div>
    </div>
  );
};
