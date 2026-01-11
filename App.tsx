
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
import { Student, AcademyConfig, IntroSlide, ClassSchedule, StaffStory } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseFetch } from './lib/supabase';
import { SCHEDULES as STATIC_SCHEDULES } from './constants';

const DEFAULT_INTRO: IntroSlide[] = [
  { id: 'intro-1', type: 'video', url: 'https://cdn.pixabay.com/video/2021/04/12/70860-537442186_large.mp4', title: 'EL COMIENZO', subtitle: 'DE UNA LEYENDA', duration: 6000 }
];

const DEFAULT_STAFF: StaffStory[] = [
  { id: 's1', type: 'video', url: 'https://cdn.pixabay.com/video/2021/04/12/70860-537442186_large.mp4', name: 'Prof. Carlos Ruíz', role: 'Director Técnico', duration: 10000 }
];

const DEFAULT_CONFIG: AcademyConfig = {
  logoUrl: "https://raw.githubusercontent.com/frapastor/assets/main/athletic_logo.png",
  heroImages: ["https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?q=80&w=2070&auto=format&fit=crop"],
  aboutImages: ["https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800"],
  welcomeMessage: "Inscripciones abiertas 2026. Únete a la familia Athletic Performance.",
  introSlides: DEFAULT_INTRO,
  staffStories: DEFAULT_STAFF,
  contactPhone: "+51 900 000 000",
  contactEmail: "hola@athletic.pe",
  contactAddress: "Av. Javier Prado, Lima",
  socialFacebook: "", socialInstagram: "", socialTiktok: "", socialWhatsapp: "51900000000"
};

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [schedules, setSchedules] = useState<ClassSchedule[]>(STATIC_SCHEDULES);
  const [config, setConfig] = useState<AcademyConfig>(DEFAULT_CONFIG);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  const fetchData = async () => {
    // 1. Obtener Alumnos
    const studentsRes: any = await supabaseFetch('GET', 'students');
    if (studentsRes && Array.isArray(studentsRes)) {
      setStudents(studentsRes.map(s => ({
        ...s,
        firstName: s.first_name, lastName: s.last_name, birthDate: s.birth_date,
        parentName: s.parent_name, parentPhone: s.parent_phone,
        paymentStatus: s.payment_status, qrCode: s.qr_code,
        pending_balance: s.pending_balance || 0, total_paid: s.total_paid || 0,
        comments: s.comments, scheduleId: s.schedule_id, modality: s.modality
      })));
    }

    // 2. Obtener Horarios
    const schedulesRes: any = await supabaseFetch('GET', 'schedules');
    if (schedulesRes && Array.isArray(schedulesRes) && schedulesRes.length > 0) {
      setSchedules(schedulesRes.map(s => ({ ...s, days: Array.isArray(s.days) ? s.days : [] })));
    }

    // 3. Obtener Configuración
    const cloudConfig: any = await supabaseFetch('GET', 'academy_config');
    if (cloudConfig && !cloudConfig.error) {
      setConfig({
        logoUrl: cloudConfig.logo_url || DEFAULT_CONFIG.logoUrl,
        heroImages: cloudConfig.hero_images || DEFAULT_CONFIG.heroImages,
        aboutImages: cloudConfig.about_images || DEFAULT_CONFIG.aboutImages,
        welcomeMessage: cloudConfig.welcome_message || DEFAULT_CONFIG.welcomeMessage,
        introSlides: cloudConfig.intro_slides || DEFAULT_CONFIG.introSlides,
        staffStories: cloudConfig.staff_stories || DEFAULT_CONFIG.staffStories,
        contactPhone: cloudConfig.contact_phone || DEFAULT_CONFIG.contactPhone,
        contactEmail: cloudConfig.contact_email || DEFAULT_CONFIG.contactEmail,
        contactAddress: cloudConfig.contact_address || DEFAULT_CONFIG.contactAddress,
        socialFacebook: cloudConfig.social_facebook || "",
        socialInstagram: cloudConfig.social_instagram || "",
        socialTiktok: cloudConfig.social_tiktok || "",
        socialWhatsapp: cloudConfig.social_whatsapp || "51900000000"
      });
    }
  };

  useEffect(() => {
    fetchData().finally(() => {
      const auth = sessionStorage.getItem('athletic_auth');
      if (auth === 'true') { setIsAdminLoggedIn(true); setShowIntro(false); }
      setIsLoading(false);
    });
  }, []);

  const handleUpdateSchedules = async (newSchedules: ClassSchedule[]) => {
    setSchedules(newSchedules);
    for (const s of newSchedules) {
      await supabaseFetch('POST', 'schedules', { ...s, id: s.id, days: s.days || [] });
    }
    return true;
  };

  const handleRegister = async (newStudent: Student) => {
    const payload = {
      first_name: newStudent.firstName, last_name: newStudent.lastName,
      parent_name: newStudent.parentName, parent_phone: newStudent.parentPhone,
      category: newStudent.category, pending_balance: newStudent.pending_balance || 0,
      total_paid: newStudent.total_paid || 0, comments: newStudent.comments || "",
      payment_status: newStudent.paymentStatus, qr_code: newStudent.qrCode,
      modality: newStudent.modality, birth_date: newStudent.birthDate,
      address: newStudent.address, schedule_id: newStudent.scheduleId
    };
    const result = await supabaseFetch('POST', 'students', payload);
    if (result && !result.error) { await fetchData(); return true; }
    return false;
  };

  const handleUpdateStudent = async (student: Student) => {
    const result = await supabaseFetch('PATCH', 'students', {
      id: student.id, first_name: student.firstName, last_name: student.lastName,
      payment_status: student.paymentStatus, pending_balance: student.pending_balance,
      total_paid: student.total_paid, parent_phone: student.parentPhone,
      parent_name: student.parentName, comments: student.comments,
      modality: student.modality
    });
    if (result && !result.error) { await fetchData(); return true; }
    return false;
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm('¿Deseas eliminar permanentemente a este alumno? Se borrará todo su historial de pagos.')) return;
    
    try {
      // 1. Limpiar pagos asociados usando queryParams para filtro directo
      await supabaseFetch('DELETE', 'payments', null, `student_id=eq.${id}`);
      
      // 2. Eliminar al alumno
      const result = await supabaseFetch('DELETE', 'students', { id });
      
      if (result !== null && !result.error) {
        setStudents(prev => prev.filter(s => s.id !== id));
        alert('Alumno y pagos eliminados con éxito.');
      } else {
        alert('Error al intentar eliminar de la base de datos.');
      }
    } catch (err) {
      console.error("Error en eliminación:", err);
      alert('Ocurrió un error inesperado al eliminar.');
    }
  };

  const handleUpdateConfig = async (newConfig: AcademyConfig) => {
    const result = await supabaseFetch('PATCH', 'academy_config', {
      id: 1, logo_url: newConfig.logoUrl, hero_images: newConfig.heroImages,
      about_images: newConfig.aboutImages, welcome_message: newConfig.welcomeMessage,
      intro_slides: newConfig.introSlides, staff_stories: newConfig.staffStories,
      contact_phone: newConfig.contactPhone, contact_email: newConfig.contactEmail,
      contact_address: newConfig.contactAddress, social_facebook: newConfig.socialFacebook,
      social_instagram: newConfig.socialInstagram, social_tiktok: newConfig.socialTiktok,
      social_whatsapp: newConfig.socialWhatsapp
    });
    if (result && !result.error) { setConfig(newConfig); return true; }
    return false;
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white font-black text-xs tracking-widest uppercase animate-pulse">Cargando Athletic Performance...</div>;

  return (
    <>
      <AnimatePresence>{showIntro && <IntroPortal key="intro" onComplete={() => setShowIntro(false)} slides={config.introSlides} />}</AnimatePresence>
      <motion.div className="min-h-screen" animate={{ opacity: showIntro ? 0 : 1 }}>
        {isAdminLoggedIn ? (
          <AdminDashboard 
            students={students} schedules={schedules} config={config} 
            onUpdateConfig={handleUpdateConfig} onUpdateSchedules={handleUpdateSchedules}
            onRegister={handleRegister} onUpdateStudent={handleUpdateStudent} 
            onDelete={handleDeleteStudent} onLogout={() => { setIsAdminLoggedIn(false); sessionStorage.removeItem('athletic_auth'); }} 
          />
        ) : (
          <>
            <Navbar logoUrl={config.logoUrl} onTabChange={() => {}} />
            <Hero images={config.heroImages} />
            <About images={config.aboutImages} />
            <SchedulesSection schedules={schedules} />
            <section id="register" className="py-24 bg-slate-100"><RegistrationForm config={config} onRegister={handleRegister} /></section>
            <Footer config={config} onAdminClick={() => setShowLoginModal(true)} />
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={(p) => { if(p==='admin123'){ setIsAdminLoggedIn(true); sessionStorage.setItem('athletic_auth','true'); return true; } return false; }} />
          </>
        )}
      </motion.div>
    </>
  );
};

export default App;
