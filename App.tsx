
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { SchedulesSection } from './components/SchedulesSection';
import { RegistrationForm } from './components/RegistrationForm';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginModal } from './components/LoginModal';
import { Footer } from './components/Footer';
import { IntroPortal } from './components/IntroPortal';
import { Student, AcademyConfig } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseFetch } from './lib/supabase';

const DEFAULT_CONFIG: AcademyConfig = {
  heroImages: [
    "https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526232386154-75127e4dd0a8?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2070&auto=format&fit=crop"
  ],
  aboutImages: [
    "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800",
    "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800",
    "https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?q=80&w=800",
    "https://images.unsplash.com/photo-1526232386154-75127e4dd0a8?q=80&w=800"
  ],
  welcomeMessage: "Inscripciones abiertas para el ciclo 2024. Únete a la familia Athletic Performance y vive el fútbol con excelencia."
};

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [config, setConfig] = useState<AcademyConfig>(DEFAULT_CONFIG);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      // Check if intro was already seen in this session
      const introSeen = sessionStorage.getItem('athletic_intro_seen');
      if (!introSeen) {
        setShowIntro(true);
      }

      const savedStudents = localStorage.getItem('athletic_students');
      if (savedStudents) setStudents(JSON.parse(savedStudents));
      
      const cloudData = await supabaseFetch('GET', 'academy_config');
      if (cloudData && cloudData.hero_images) {
        setConfig({
          heroImages: cloudData.hero_images,
          aboutImages: cloudData.about_images,
          welcomeMessage: cloudData.welcome_message
        });
      }
      
      const auth = sessionStorage.getItem('athletic_auth');
      if (auth === 'true') setIsAdminLoggedIn(true);
      setIsLoading(false);
    };

    initApp();
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('athletic_intro_seen', 'true');
  };

  const handleRegister = (newStudent: Student) => {
    const updated = [...students, newStudent];
    setStudents(updated);
    localStorage.setItem('athletic_students', JSON.stringify(updated));
  };

  const handleUpdateConfig = async (newConfig: AcademyConfig) => {
    const result = await supabaseFetch('PATCH', 'academy_config', {
      hero_images: newConfig.heroImages,
      about_images: newConfig.aboutImages,
      welcome_message: newConfig.welcomeMessage,
      updated_at: new Date().toISOString()
    });

    if (result) {
      setConfig(newConfig);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('athletic_auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-12 h-12 bg-blue-600 rounded-xl"
        />
      </div>
    );
  }

  if (isAdminLoggedIn) {
    return (
      <AdminDashboard 
        students={students} 
        config={config}
        onUpdateConfig={handleUpdateConfig}
        onRegister={handleRegister}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && <IntroPortal key="intro" onComplete={handleIntroComplete} />}
      </AnimatePresence>

      <motion.div 
        className="min-h-screen bg-slate-50 text-slate-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.8 }}
      >
        <Navbar onTabChange={() => {}} />
        <main>
          <section id="home">
            <Hero images={config.heroImages} />
          </section>
          <section id="about" className="py-24">
            <About images={config.aboutImages} />
          </section>
          <section id="schedules" className="py-24 bg-white/40 border-y">
            <SchedulesSection />
          </section>
          <section id="register" className="py-24 bg-slate-100/50">
            <div className="container mx-auto px-4 text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black mb-6 uppercase tracking-tighter">
                INICIA TU <span className="text-gradient">CAMINO</span>
              </h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                {config.welcomeMessage}
              </p>
            </div>
            <RegistrationForm onRegister={handleRegister} />
          </section>
        </main>
        <Footer onAdminClick={() => setShowLoginModal(true)} />
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
          onLogin={(pass) => {
            if (pass === 'admin123') {
              setIsAdminLoggedIn(true);
              sessionStorage.setItem('athletic_auth', 'true');
              return true;
            }
            return false;
          }}
        />
      </motion.div>
    </>
  );
};

// Fix: Add missing default export for index.tsx to resolve "Module has no default export" error.
export default App;
