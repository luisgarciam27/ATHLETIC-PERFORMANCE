
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Trophy, ArrowRight, Activity, Users, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { StoryViewer } from './StoryViewer';

interface HeroProps {
  images: string[];
}

const staffStories = [
  {
    id: 's1',
    type: 'video' as const,
    url: 'https://cdn.pixabay.com/video/2021/04/12/70860-537442186_large.mp4',
    name: 'Prof. Carlos Ruíz',
    role: 'Director Técnico - Licencia PRO',
    duration: 10000
  },
  {
    id: 's2',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1526232386154-75127e4dd0a8?q=80&w=800',
    name: 'Coach Martha Solano',
    role: 'Especialista en Psicomotricidad',
    duration: 5000
  }
];

const sliderContent = [
  {
    tag: "ALTO RENDIMIENTO - LIMA 2026",
    title: "FORJANDO LOS LÍDERES DEL MAÑANA",
    desc: "Nuestra metodología integra el talento natural con disciplina táctica y apoyo emocional. Únete a la academia donde el éxito es una consecuencia de la formación integral.",
  },
  {
    tag: "INSCRIPCIONES ABIERTAS",
    title: "MÁS QUE FÚTBOL, UNA PASIÓN",
    desc: "Desarrolla habilidades competitivas en un ambiente profesional con los mejores entrenadores licenciados. Cupos limitados por categoría.",
  }
];

export const Hero: React.FC<HeroProps> = ({ images }) => {
  const [index, setIndex] = useState(0);
  const [showStories, setShowStories] = useState(false);

  useEffect(() => {
    if (!images || images.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images]);

  const nextSlide = () => setIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  const currentText = sliderContent[index % sliderContent.length];

  return (
    <div className="relative min-h-[95vh] flex items-center bg-slate-50 overflow-hidden pt-20">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 right-[10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[5%] w-[400px] h-[400px] bg-emerald-300/15 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 z-10 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 min-h-[450px] flex flex-col justify-center">
          <div className="relative overflow-hidden h-[300px] md:h-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className="absolute inset-0 md:relative"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-bold tracking-widest mb-8 text-blue-600 uppercase">
                  <Activity size={14} />
                  {currentText.tag}
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-8 tracking-tighter text-slate-900">
                  {currentText.title.split(' ').map((word, i) => (
                    ['LÍDERES', 'PASIÓN', 'PROFESIONAL'].includes(word.replace(/[.,]/g, '')) ? 
                    <span key={i} className="text-gradient block md:inline">{word} </span> : word + ' '
                  ))}
                </h1>
                
                <p className="text-base md:text-xl text-slate-500 max-w-xl mb-12 font-medium leading-relaxed">
                  {currentText.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex flex-wrap gap-6 items-center mt-8 md:mt-0">
            <a 
              href="#register" 
              className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 active:scale-95 group"
            >
              MATRÍCULA ABIERTA
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <button 
              onClick={() => setShowStories(true)}
              className="flex items-center gap-4 text-slate-700 font-bold hover:text-blue-600 transition-colors group"
            >
              <span className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center bg-white group-hover:border-blue-500 transition-all shadow-sm relative">
                <span className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping group-hover:bg-blue-500/20"></span>
                <Play className="fill-slate-700 ml-1 group-hover:fill-blue-600 relative z-10" size={22} />
              </span>
              NUESTRO STAFF
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 relative h-[400px] md:h-[600px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 1.1, x: -50 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full p-4"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 to-emerald-500/10 rounded-[3.5rem] blur-2xl opacity-50"></div>
              
              <div className="relative bg-white p-4 rounded-[3.5rem] shadow-2xl border border-white h-full overflow-hidden">
                 <img 
                   src={images[index] || images[0]} 
                   alt="Academy Action"
                   className="w-full h-full rounded-[3rem] object-cover"
                 />
                 
                 <div className="absolute inset-x-8 bottom-8 flex justify-between items-center bg-white/10 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/20 shadow-2xl">
                    <div className="hidden sm:block">
                      <p className="text-white font-black text-[10px] uppercase tracking-widest mb-1 opacity-80">ESTÁNDAR PROFESIONAL</p>
                      <p className="text-white font-bold text-xl leading-none uppercase">Formación Élite</p>
                    </div>
                    <div className="flex gap-3 ml-auto">
                       <button onClick={prevSlide} className="w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-blue-600 flex items-center justify-center transition-all backdrop-blur-md active:scale-90">
                         <ChevronLeft size={24} />
                       </button>
                       <button onClick={nextSlide} className="w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-blue-600 flex items-center justify-center transition-all backdrop-blur-md active:scale-90">
                         <ChevronRight size={24} />
                       </button>
                    </div>
                 </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <StoryViewer 
        isOpen={showStories} 
        onClose={() => setShowStories(false)} 
        stories={staffStories} 
      />
    </div>
  );
};
