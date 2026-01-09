
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

interface Story {
  id: string;
  type: 'image' | 'video';
  url: string;
  name: string;
  role: string;
  duration: number; // en ms
}

interface StoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ isOpen, onClose, stories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const requestRef = useRef<number>(0);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (!isOpen) return;

    const updateProgress = () => {
      if (!isPaused) {
        const elapsed = Date.now() - startTimeRef.current;
        const newProgress = (elapsed / currentStory.duration) * 100;
        
        if (newProgress >= 100) {
          handleNext();
        } else {
          setProgress(newProgress);
          requestRef.current = requestAnimationFrame(updateProgress);
        }
      }
    };

    if (!isPaused) {
      startTimeRef.current = Date.now() - (progress / 100) * currentStory.duration;
      requestRef.current = requestAnimationFrame(updateProgress);
    }

    return () => cancelAnimationFrame(requestRef.current);
  }, [isOpen, currentIndex, isPaused, currentStory.duration]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
      startTimeRef.current = Date.now();
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
      startTimeRef.current = Date.now();
    } else {
      setProgress(0);
      startTimeRef.current = Date.now();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center backdrop-blur-xl"
      >
        <div className="relative w-full max-w-[450px] aspect-[9/16] bg-slate-900 shadow-2xl overflow-hidden md:rounded-[2.5rem] flex flex-col">
          
          {/* Progress Bars */}
          <div className="absolute top-4 inset-x-4 flex gap-1.5 z-30">
            {stories.map((story, idx) => (
              <div key={story.id} className="h-1 flex-grow bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{ 
                    width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%' 
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-10 inset-x-4 flex justify-between items-center z-30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 p-0.5">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center font-black text-white text-xs">
                  {currentStory.name[0]}
                </div>
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">{currentStory.name}</p>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{currentStory.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 text-white/80 hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <button 
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div 
            className="flex-grow relative cursor-pointer"
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Click zones */}
            <div className="absolute inset-y-0 left-0 w-1/4 z-20" onClick={handlePrev} />
            <div className="absolute inset-y-0 right-0 w-1/4 z-20" onClick={handleNext} />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full"
              >
                {currentStory.type === 'video' ? (
                  <video
                    ref={videoRef}
                    src={currentStory.url}
                    autoPlay
                    playsInline
                    muted={isMuted}
                    className="w-full h-full object-cover"
                    onEnded={handleNext}
                  />
                ) : (
                  <img 
                    src={currentStory.url} 
                    className="w-full h-full object-cover" 
                    alt={currentStory.name}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
              </motion.div>
            </AnimatePresence>

            {/* Bottom Info Overlay */}
            <div className="absolute bottom-10 inset-x-8 z-30 pointer-events-none">
               <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={`info-${currentIndex}`}
               >
                 <span className="px-3 py-1 bg-blue-600 rounded-lg text-[9px] font-black text-white uppercase tracking-widest mb-3 inline-block">Pro Staff</span>
                 <h3 className="text-3xl font-black text-white mb-2 leading-none uppercase">CONOCE A NUESTROS <br/> <span className="text-blue-400">CRACKS</span></h3>
                 <p className="text-white/70 text-sm font-medium">Entrenadores con licencia Pro y especialistas en psicología deportiva.</p>
               </motion.div>
            </div>
          </div>

          {/* Navigation buttons for desktop */}
          <div className="hidden md:block">
             <button onClick={handlePrev} className="absolute left-[-80px] top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all">
                <ChevronLeft size={32} />
             </button>
             <button onClick={handleNext} className="absolute right-[-80px] top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all">
                <ChevronRight size={32} />
             </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
