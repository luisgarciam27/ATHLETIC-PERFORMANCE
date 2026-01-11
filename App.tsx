
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
import { Student, AcademyConfig, IntroSlide } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseFetch } from './lib/supabase';
import { Database, Copy, Check, RefreshCw } from 'lucide-react';

const DEFAULT_INTRO: IntroSlide[] = [
  {
    id: 'intro-1',
    type: 'video',
    url: 'https://cdn.pixabay.com/video/2021/04/12/70860-537442186_large.mp4',
    title: 'EL COMIENZO',
    subtitle: 'DE UNA LEYENDA',
    duration: 6000
  }
];

const DEFAULT_CONFIG: AcademyConfig = {
  logoUrl: "https://raw.githubusercontent.com/frapastor/assets/main/athletic_logo.png",
  heroImages: [
    "https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=2070&auto=format&fit=crop"
  ],
  aboutImages: [
    "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800",
    "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800"
  ],
  welcomeMessage: "Inscripciones abiertas 2024. Únete a la familia Athletic Performance.",
  introSlides: DEFAULT_INTRO
};

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [config, setConfig] = useState<AcademyConfig>(DEFAULT_CONFIG);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  const fetchStudents = async () => {
    const data: any = await supabaseFetch('GET', 'students');
    if (data && Array.isArray(data)) {
      setStudents(data.map(s => ({
        ...s,
        firstName: s.first_name || '',
        lastName: s.last_name || '',
        birthDate: s.birth_date || '',
        parentName: s.parent_name || '',
        parentPhone: s.parent_phone || '',
        paymentStatus: s.payment_status || 'Pending',
        nextPaymentDate: s.next_payment_date || '',
        qrCode: s.qr_code || '',
        enrollmentPayment: 50 // Fixed value as the column is missing in DB
      })));
    }
  };

  const fetchConfig = async () => {
    const cloudConfig: any = await supabaseFetch('GET', 'academy_config');
    if (cloudConfig && !cloudConfig.error) {
      setConfig({
        logoUrl: cloudConfig.logo_url || DEFAULT_CONFIG.logoUrl,
        heroImages: cloudConfig.hero_images || DEFAULT_CONFIG.heroImages,
        aboutImages: cloudConfig.about_images || DEFAULT_CONFIG.aboutImages,
        welcomeMessage: cloudConfig.welcome_message || DEFAULT_CONFIG.welcomeMessage,
        introSlides: cloudConfig.intro_slides || DEFAULT_CONFIG.introSlides
      });
    }
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        await Promise.all([fetchStudents(), fetchConfig()]);
      } catch (err) {
        console.error("Initialization failed:", err);
      } finally {
        const auth = sessionStorage.getItem('athletic_auth');
        if (auth === 'true') {
          setIsAdminLoggedIn(true);
          setShowIntro(false);
        }
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  async function handleRegister(newStudent: Student) {
    const payload = {
      first_name: newStudent.firstName,
      last_name: newStudent.lastName,
      birth_date: newStudent.birthDate,
      category: newStudent.category,
      modality: newStudent.modality,
      parent_name: newStudent.parentName,
      parent_phone: newStudent.parentPhone,
      address: newStudent.address,
      payment_status: 'Pending',
      next_payment_date: newStudent.nextPaymentDate,
      qr_code: newStudent.qrCode
      // Removed enrollment_payment to fix PGRST204
    };

    const result = await supabaseFetch('POST', 'students', payload);
    if (result && !result.error) {
      await fetchStudents();
      return true;
    }
    return false;
  }

  async function handleUpdateStudent(student: Student) {
    const payload = {
      id: student.id,
      first_name: student.firstName,
      last_name: student.lastName,
      birth_date: student.birthDate,
      category: student.category,
      parent_name: student.parentName,
      parent_phone: student.parentPhone,
      payment_status: student.paymentStatus,
      next_payment_date: student.nextPaymentDate,
      address: student.address
    };

    const result = await supabaseFetch('PATCH', 'students', payload);
    if (result && !result.error) {
      await fetchStudents();
      return true;
    }
    return false;
  }

  async function handleDeleteStudent(id: string) {
    if (window.confirm('¿Eliminar alumno permanentemente?')) {
      const result = await supabaseFetch('DELETE', 'students', { id });
      if (result !== null && !result.error) await fetchStudents();
    }
  }

  async function handleUpdateConfig(newConfig: AcademyConfig) {
    const result = await supabaseFetch('PATCH', 'academy_config', {
      id: 1,
      logo_url: newConfig.logoUrl,
      hero_images: newConfig.heroImages,
      about_images: newConfig.aboutImages,
      welcome_message: newConfig.welcomeMessage,
      intro_slides: newConfig.introSlides
    });
    if (result && !result.error) {
      setConfig(newConfig);
      return true;
    }
    return false;
  }

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-900"><div className="w-12 h-12 bg-blue-600 rounded-xl animate-spin" /></div>;

  return (
    <>
      <AnimatePresence>{showIntro && <IntroPortal key="intro" onComplete={() => setShowIntro(false)} slides={config.introSlides} />}</AnimatePresence>
      <motion.div className="min-h-screen bg-slate-50" animate={{ opacity: showIntro ? 0 : 1 }}>
        {isAdminLoggedIn ? (
          <AdminDashboard 
            students={students} 
            config={config} 
            onUpdateConfig={handleUpdateConfig} 
            onRegister={handleRegister} 
            onUpdateStudent={handleUpdateStudent} 
            onDelete={handleDeleteStudent} 
            onLogout={() => { setIsAdminLoggedIn(false); sessionStorage.removeItem('athletic_auth'); }} 
          />
        ) : (
          <>
            <Navbar logoUrl={config.logoUrl} onTabChange={() => {}} />
            <Hero images={config.heroImages} />
            <About images={config.aboutImages} />
            <SchedulesSection />
            <section id="register" className="py-24 bg-slate-100"><RegistrationForm onRegister={handleRegister} /></section>
            <Footer logoUrl={config.logoUrl} onAdminClick={() => setShowLoginModal(true)} />
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={(p) => { if(p==='admin123'){ setIsAdminLoggedIn(true); sessionStorage.setItem('athletic_auth','true'); return true; } return false; }} />
          </>
        )}
      </motion.div>
    </>
  );
};

export default App;
