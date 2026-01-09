
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { SchedulesSection } from './components/SchedulesSection';
import { RegistrationForm } from './components/RegistrationForm';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginModal } from './components/LoginModal';
import { Footer } from './components/Footer';
import { Student, AcademyConfig } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseFetch } from './lib/supabase';

const DEFAULT_CONFIG: AcademyConfig = {
  heroImages: [
    "https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2070&auto=format&fit=crop"
  ],
  aboutImages: [
    "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800",
    "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800",
    "https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?q=80&w=800",
    "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800"
  ],
  welcomeMessage: "Inscripciones abiertas para el ciclo 2024. Únete a la familia Athletic Performance y vive el fútbol con excelencia."
};

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [config, setConfig] = useState<AcademyConfig>(DEFAULT_CONFIG);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Cargar Alumnos de LocalStorage (temporalmente hasta tener tabla de alumnos)
      const savedStudents = localStorage.getItem('athletic_students');
      if (savedStudents) setStudents(JSON.parse(savedStudents));
      
      // Cargar Configuración desde Supabase
      const cloudConfig = await supabaseFetch('GET', 'academy_config');
      if (cloudConfig) {
        setConfig({
          heroImages: cloudConfig.hero_images,
          aboutImages: cloudConfig.about_images,
          welcomeMessage: cloudConfig.welcome_message
        });
      }
      
      const auth = sessionStorage.getItem('athletic_auth');
      if (auth === 'true') setIsAdminLoggedIn(true);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleRegister = (newStudent: Student) => {
    const updated = [...students, newStudent];
    setStudents(updated);
    localStorage.setItem('athletic_students', JSON.stringify(updated));
  };

  const handleUpdateConfig = async (newConfig: AcademyConfig) => {
    setConfig(newConfig);
    // Persistir en Supabase
    await supabaseFetch('PATCH', 'academy_config', {
      hero_images: newConfig.heroImages,
      about_images: newConfig.aboutImages,
      welcome_message: newConfig.welcomeMessage
    });
  };

  const handleDeleteStudent = (id: string) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    localStorage.setItem('athletic_students', JSON.stringify(updated));
  };

  const handleAdminLogin = (password: string) => {
    if (password === 'admin123') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('athletic_auth', 'true');
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
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 bg-blue-600 rounded-2xl"></div>
          <span className="text-white font-black tracking-widest text-[10px] uppercase">Cargando Academia...</span>
        </motion.div>
      </div>
    );
  }

  if (isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <AdminDashboard 
          students={students} 
          config={config}
          onUpdateConfig={handleUpdateConfig}
          onRegister={handleRegister}
          onDelete={handleDeleteStudent}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/30">
      <Navbar onTabChange={() => {}} />
      <main>
        <section id="home">
          <Hero images={config.heroImages} />
        </section>
        <section id="about" className="py-24 relative">
          <About images={config.aboutImages} />
        </section>
        <section id="schedules" className="py-24 relative overflow-hidden bg-white/40 border-y border-slate-200">
          <SchedulesSection />
        </section>
        <section id="register" className="py-24 bg-slate-100/50 relative">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center mb-16"
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter text-slate-900">
                INICIA TU <span className="text-gradient">CAMINO</span>
              </h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                {config.welcomeMessage}
              </p>
            </motion.div>
            <RegistrationForm onRegister={handleRegister} />
          </div>
        </section>
      </main>
      <Footer onAdminClick={() => setShowLoginModal(true)} />
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLogin={handleAdminLogin}
      />
    </div>
  );
};

export default App;
