
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ChevronRight, Zap, Play } from 'lucide-react';

interface IntroPortalProps {
  onComplete: () => void;
}

const introSlides = [
  {
    id: 'intro-1',
    type: 'video',
    url: 'https://cdn.pixabay.com/video/2021/04/12/70860-537442186_large.mp4',
    title: 'EL COMIENZO',
    subtitle: 'DE UNA LEYENDA',
    duration: 6000
  },
  {
    id: 'intro-2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1526232386154-75127e4dd0a8?q=80&w=1200',
    title: 'NUESTRO STAFF',
    subtitle: 'PROFESIONALES ÉLITE',
    duration: 4000
  },
  {
    id: 'intro-3',
    type: 'video',
    url: 'https://cdn.pixabay.com/video/2020/07/21/45089-441617300_large.mp4',
    title: 'TU FUTURO',
    subtitle: 'EMPIEZA AQUÍ',
    duration: 5000
  }
];

export const IntroPortal: React.FC<IntroPortalProps> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const requestRef = useRef<number>(0);

  const currentSlide = introSlides[index];

  useEffect(() => {
    if (!hasStarted) return;

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = (elapsed / currentSlide.duration) * 100;

      if (newProgress >= 100) {
        if (index < introSlides.length - 1) {
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
  }, [index, hasStarted, currentSlide.duration, onComplete]);

  if (!hasStarted) {
    return (
      <div className="fixed inset-0 z-[300] bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/40">
            <Zap className="text-white fill-white" size={48} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-4 uppercase">ATHLETIC PERFORMANCE</h1>
          <p className="text-blue-400 font-bold tracking-[0.3em] text-xs uppercase">Élite Football Academy</p>
        </motion.div>
        
        <button 
          onClick={() => {
            setHasStarted(true);
            startTimeRef.current = Date.now();
          }}
          className="group relative px-12 py-6 bg-white rounded-3xl overflow-hidden shadow-2xl transition-all hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <span className="relative flex items-center gap-4 font-black text-slate-900 tracking-widest text-sm uppercase">
            VIVIR LA EXPERIENCIA <Play size={20} className="fill-slate-900" />
          </span>
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="fixed inset-0 z-[300] bg-black overflow-hidden"
    >
      {/* Progress Bars */}
      <div className="absolute top-8 inset-x-8 flex gap-2 z-50">
        {introSlides.map((slide, idx) => (
          <div key={slide.id} className="h-1 flex-grow bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white"
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
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {currentSlide.type === 'video' ? (
            <video 
              src={currentSlide.url} 
              autoPlay 
              muted={isMuted} 
              playsInline 
              className="w-full h-full object-cover scale-105"
            />
          ) : (
            <img src={currentSlide.url} className="w-full h-full object-cover" alt="Staff" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        </motion.div>
      </AnimatePresence>

      {/* Floating UI */}
      <div className="absolute top-12 left-8 z-50 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
          <Zap size={20} className="text-white" />
        </div>
        <span className="text-white font-black text-xs tracking-widest uppercase">Athletic Academy</span>
      </div>

      <div className="absolute top-12 right-8 z-50 flex gap-4">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <button 
          onClick={onComplete}
          className="px-6 h-12 rounded-full bg-white text-slate-900 font-black text-[10px] tracking-widest uppercase flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all shadow-xl"
        >
          Entrar <ChevronRight size={16} />
        </button>
      </div>

      {/* Central Content */}
      <div className="absolute inset-x-8 bottom-24 z-50">
        <motion.div
          key={`text-${index}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl"
        >
          <h4 className="text-blue-400 font-black text-xs tracking-[0.4em] uppercase mb-4">{currentSlide.title}</h4>
          <h2 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter uppercase mb-6">
            {currentSlide.subtitle}
          </h2>
          <div className="w-24 h-2 bg-blue-600 rounded-full"></div>
        </motion.div>
      </div>

      {/* Click Areas */}
      <div className="absolute inset-y-0 left-0 w-1/4 z-40" onClick={() => {
        if (index > 0) {
          setIndex(prev => prev - 1);
          setProgress(0);
          startTimeRef.current = Date.now();
        }
      }} />
      <div className="absolute inset-y-0 right-0 w-1/4 z-40" onClick={() => {
        if (index < introSlides.length - 1) {
          setIndex(prev => prev + 1);
          setProgress(0);
          startTimeRef.current = Date.now();
        } else {
          onComplete();
        }
      }} />
    </motion.div>
  );
};
