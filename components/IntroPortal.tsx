
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ChevronRight, Zap, Play, Trophy, Star } from 'lucide-react';
import { IntroSlide } from '../types';

interface IntroPortalProps {
  onComplete: () => void;
  slides: IntroSlide[];
}

export const IntroPortal: React.FC<IntroPortalProps> = ({ onComplete, slides }) => {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const requestRef = useRef<number>(0);

  // Fallback si no hay slides
  const activeSlides = slides && slides.length > 0 ? slides : [{
    id: 'def',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?q=80&w=2070&auto=format&fit=crop',
    title: 'ATHLETIC',
    subtitle: 'ACADEMY',
    duration: 5000
  }];

  const currentSlide = activeSlides[index];

  useEffect(() => {
    if (!hasStarted) return;

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      // Capamos la duración a máximo 30 segundos por slide por seguridad visual
      const slideDuration = Math.min(currentSlide.duration, 30000);
      const newProgress = (elapsed / slideDuration) * 100;

      if (newProgress >= 100) {
        if (index < activeSlides.length - 1) {
          setIndex(prev => prev + 1);
          setProgress(0);
          startTimeRef.current = Date.now();
        } else {
          onComplete();
        }
      } else {
        setProgress(newProgress);
        requestRef.current = requestAnimationFrame(updateProgress);
      }
    };

    requestRef.current = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(requestRef.current);
  }, [index, hasStarted, currentSlide.duration, onComplete, activeSlides.length]);

  if (!hasStarted) {
    return (
      <div className="fixed inset-0 z-[300] bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-12 relative"
        >
          <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full"></div>
          
          <div className="relative">
            <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-[0_20px_50px_rgba(37,99,235,0.4)]">
              <Zap className="text-white fill-white" size={56} />
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-4 uppercase">ATHLETIC PERFORMANCE</h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-8 bg-blue-500"></div>
              <p className="text-blue-400 font-bold tracking-[0.5em] text-[10px] uppercase">Donde nacen las leyendas</p>
              <div className="h-[1px] w-8 bg-blue-500"></div>
            </div>
          </div>
        </motion.div>
        
        <button 
          onClick={() => {
            setHasStarted(true);
            startTimeRef.current = Date.now();
          }}
          className="group relative px-16 py-7 bg-white rounded-[2rem] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.5)] transition-all hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <span className="relative flex items-center gap-4 font-black text-slate-900 group-hover:text-white tracking-widest text-sm uppercase transition-colors duration-500">
            INICIAR EXPERIENCIA <Trophy size={20} className="group-hover:rotate-12 transition-transform" />
          </span>
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-[300] bg-slate-950 flex items-center justify-center overflow-hidden font-ubuntu"
    >
      {/* Background Blur for Desktop */}
      <div className="absolute inset-0 hidden lg:block opacity-40">
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentSlide.url}
            src={currentSlide.type === 'image' ? currentSlide.url : ''} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full object-cover blur-[100px] scale-110"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-slate-950/60" />
      </div>

      {/* Main "Story" Container */}
      <div className="relative w-full h-full lg:h-[90vh] lg:max-w-[480px] lg:aspect-[9/16] bg-black shadow-2xl lg:rounded-[3rem] overflow-hidden border border-white/5">
        
        {/* Progress Bars - Centered inside the story container */}
        <div className="absolute top-6 inset-x-6 flex gap-1.5 z-50">
          {activeSlides.map((slide, idx) => (
            <div key={slide.id} className="h-1 flex-grow bg-white/10 rounded-full overflow-hidden backdrop-blur-md">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400" 
                style={{ width: idx === index ? `${progress}%` : idx < index ? '100%' : '0%' }} 
              />
            </div>
          ))}
        </div>

        {/* Media Content */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={index} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.8 }} 
            className="absolute inset-0"
          >
            {currentSlide.type === 'video' ? (
              <video 
                src={currentSlide.url} 
                autoPlay 
                muted={isMuted} 
                playsInline 
                className="w-full h-full object-cover" 
              />
            ) : (
              <img src={currentSlide.url} className="w-full h-full object-cover" alt="Slide" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
          </motion.div>
        </AnimatePresence>

        {/* Top Floating UI */}
        <div className="absolute top-12 left-6 z-50 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/10">
            <Zap size={20} className="text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black text-[10px] tracking-widest uppercase leading-none">Athletic Performance</span>
            <span className="text-blue-400 font-bold text-[7px] tracking-widest uppercase mt-1">Élite Academy</span>
          </div>
        </div>

        <div className="absolute top-12 right-6 z-50 flex gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          
          <button 
            onClick={onComplete} 
            className="group h-10 px-4 rounded-xl bg-white text-slate-900 font-black text-[9px] tracking-widest uppercase flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all shadow-xl"
          >
            DESCUBRIR <Star size={12} className="group-hover:fill-white" />
          </button>
        </div>

        {/* Story Text Content */}
        <div className="absolute inset-x-6 bottom-16 z-50">
          <motion.div 
            key={`text-${index}`} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }} 
            className="max-w-xs"
          >
            <h4 className="text-blue-400 font-black text-[10px] tracking-[0.4em] uppercase mb-2">{currentSlide.title}</h4>
            <h2 className="text-4xl font-black text-white leading-[0.9] tracking-tighter uppercase mb-6">
              {currentSlide.subtitle}
            </h2>
            
            <div className="flex items-center gap-6">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border border-slate-900 overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?u=${i + index}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-white/60 text-[8px] font-bold uppercase tracking-widest leading-tight">Únete a los <br/> mejores</p>
            </div>
          </motion.div>
        </div>

        {/* Navigation Regions - Centered inside the story container */}
        <div className="absolute inset-y-0 left-0 w-1/3 z-40 cursor-pointer" onClick={() => index > 0 && setIndex(index - 1)} />
        <div className="absolute inset-y-0 right-0 w-1/3 z-40 cursor-pointer" onClick={() => index < activeSlides.length - 1 ? setIndex(index + 1) : onComplete()} />
        
        {/* Navigation Indicator Hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 text-white/20 text-[7px] font-black tracking-widest uppercase">
          Toca para navegar
        </div>
      </div>
    </motion.div>
  );
};
