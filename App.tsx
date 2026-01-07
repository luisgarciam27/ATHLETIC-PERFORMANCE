
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { SchedulesSection } from './components/SchedulesSection';
import { RegistrationForm } from './components/RegistrationForm';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginModal } from './components/LoginModal';
import { Footer } from './components/Footer';
import { Student } from './types';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('athletic_students');
    if (saved) {
      setStudents(JSON.parse(saved));
    }
    
    // Check session
    const auth = sessionStorage.getItem('athletic_auth');
    if (auth === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleRegister = (newStudent: Student) => {
    const updated = [...students, newStudent];
    setStudents(updated);
    localStorage.setItem('athletic_students', JSON.stringify(updated));
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

  if (isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <AdminDashboard 
          students={students} 
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
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-blue-400/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-emerald-400/10 blur-[100px] rounded-full"></div>
      </div>

      <main>
        <section id="home">
          <Hero />
        </section>

        <section id="about" className="py-24 relative">
          <About />
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
                Inscripciones abiertas para el ciclo 2024. Únete a la familia Athletic Performance y vive el fútbol con excelencia.
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
