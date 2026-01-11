
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { SchedulesSection } from './components/SchedulesSection';
import { RegistrationForm } from './components/RegistrationForm';
import { AdminDashboard } from './components/AdminDashboard';
import { IntroPortal } from './components/IntroPortal';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { Student, AcademyConfig, ClassSchedule } from './types';
import { supabaseFetch } from './lib/supabase';
import { SCHEDULES as STATIC_SCHEDULES } from './constants';

const DEFAULT_CONFIG: AcademyConfig = {
  logoUrl: "https://raw.githubusercontent.com/frapastor/assets/main/athletic_logo.png",
  heroImages: ["https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?q=80&w=2070"],
  aboutImages: [
    "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800",
    "https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?q=80&w=800",
    "https://images.unsplash.com/photo-1526232386154-75127e4dd0a8?q=80&w=800",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800"
  ],
  welcomeMessage: "Inscripciones abiertas 2026. Únete a la familia Athletic Performance.",
  introSlides: [
    { id: '1', type: 'image', url: 'https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?q=80&w=2070', title: 'ATHLETIC', subtitle: 'PERFORMANCE', duration: 4000 },
    { id: '2', type: 'image', url: 'https://images.unsplash.com/photo-1526232386154-75127e4dd0a8?q=80&w=2070', title: 'FORMACIÓN', subtitle: 'DE ÉLITE', duration: 4000 }
  ],
  staffStories: [],
  contactPhone: "+51 900 000 000",
  contactEmail: "hola@athletic.pe",
  contactAddress: "Sede Principal, Lima",
  socialFacebook: "https://facebook.com",
  socialInstagram: "https://instagram.com",
  socialTiktok: "https://tiktok.com",
  socialWhatsapp: "51900000000"
};

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [schedules, setSchedules] = useState<ClassSchedule[]>(STATIC_SCHEDULES);
  const [config, setConfig] = useState<AcademyConfig>(DEFAULT_CONFIG);
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const studentsRes: any = await supabaseFetch('GET', 'students');
      if (studentsRes && Array.isArray(studentsRes)) {
        setStudents(studentsRes.map(s => ({
          ...s,
          firstName: s.first_name, lastName: s.last_name, birthDate: s.birth_date,
          parentName: s.parent_name, parentPhone: s.parent_phone,
          paymentStatus: s.payment_status, qrCode: s.qr_code,
          pending_balance: s.pending_balance || 0, total_paid: s.total_paid || 0,
          comments: s.comments, scheduleId: s.schedule_id, modality: s.modality || 'Mensual Regular',
          registrationDate: s.registration_date || s.created_at || new Date().toISOString()
        })));
      }

      const schedulesRes: any = await supabaseFetch('GET', 'schedules');
      if (schedulesRes && Array.isArray(schedulesRes) && schedulesRes.length > 0) {
        setSchedules(schedulesRes.map(s => ({ ...s, days: Array.isArray(s.days) ? s.days : [] })));
      }

      const cloudConfig: any = await supabaseFetch('GET', 'academy_config');
      if (cloudConfig && !cloudConfig.error) {
        setConfig({
          ...DEFAULT_CONFIG,
          ...cloudConfig,
          logoUrl: cloudConfig.logo_url || DEFAULT_CONFIG.logoUrl,
          heroImages: cloudConfig.hero_images || DEFAULT_CONFIG.heroImages,
          aboutImages: cloudConfig.about_images || DEFAULT_CONFIG.aboutImages,
          socialWhatsapp: cloudConfig.social_whatsapp || DEFAULT_CONFIG.socialWhatsapp,
          introSlides: cloudConfig.intro_slides || DEFAULT_CONFIG.introSlides,
          socialFacebook: cloudConfig.social_facebook || DEFAULT_CONFIG.socialFacebook,
          socialInstagram: cloudConfig.social_instagram || DEFAULT_CONFIG.socialInstagram,
          socialTiktok: cloudConfig.social_tiktok || DEFAULT_CONFIG.socialTiktok
        });
      }
    } catch (e) {
      console.error("Error loading data", e);
    }
  };

  useEffect(() => {
    const handleHash = () => {
      const isDashboard = window.location.hash === '#dashboard';
      setIsAdminRoute(isDashboard);
      
      const auth = localStorage.getItem('athletic_admin_auth');
      if (auth === 'true' && isDashboard) {
        setIsAdminLoggedIn(true);
      }
    };

    fetchData().finally(() => {
      handleHash();
      setIsLoading(false);
    });

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
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
      address: newStudent.address, schedule_id: newStudent.scheduleId,
      registration_date: new Date().toISOString()
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
      modality: student.modality, address: student.address,
      schedule_id: student.scheduleId
    });
    if (result && !result.error) { await fetchData(); return true; }
    return false;
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm('¿ELIMINAR ALUMNO?')) return;
    await supabaseFetch('DELETE', 'payments', null, `student_id=eq.${id}`);
    const result = await supabaseFetch('DELETE', 'students', { id });
    if (result !== null && !result?.error) {
      setStudents(prev => prev.filter(s => s.id !== id));
      return true;
    }
    return false;
  };

  const handleUpdateConfig = async (newConfig: AcademyConfig) => {
    const result = await supabaseFetch('PATCH', 'academy_config', {
      id: 1, logo_url: newConfig.logoUrl, hero_images: newConfig.heroImages,
      about_images: newConfig.aboutImages, welcome_message: newConfig.welcomeMessage,
      contact_phone: newConfig.contactPhone, contact_email: newConfig.contactEmail,
      contact_address: newConfig.contactAddress, social_facebook: newConfig.socialFacebook,
      social_instagram: newConfig.socialInstagram, social_tiktok: newConfig.socialTiktok,
      social_whatsapp: newConfig.socialWhatsapp
    });
    if (result && !result.error) { setConfig(newConfig); return true; }
    return false;
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-white text-slate-900 font-bold uppercase text-[10px] tracking-widest animate-pulse">Cargando Academia...</div>;

  // RUTA SECRETA DE ADMIN (Solo si hay #dashboard en la URL)
  if (isAdminRoute) {
    if (!isAdminLoggedIn) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
          <LoginModal 
            isOpen={true} 
            onClose={() => { window.location.hash = ''; setIsAdminRoute(false); }} 
            onLogin={(p) => { if(p === 'admin123') { setIsAdminLoggedIn(true); localStorage.setItem('athletic_admin_auth', 'true'); return true; } return false; }} 
          />
        </div>
      );
    }
    return (
      <AdminDashboard 
        students={students} schedules={schedules} config={config} 
        onUpdateConfig={handleUpdateConfig} onUpdateSchedules={handleUpdateSchedules}
        onRegister={handleRegister} onUpdateStudent={handleUpdateStudent} 
        onDelete={handleDeleteStudent} onLogout={() => { setIsAdminLoggedIn(false); localStorage.removeItem('athletic_admin_auth'); window.location.hash = ''; }} 
      />
    );
  }

  // INTRO ANIMADA (Lo primero que ve el cliente siempre)
  if (showIntro) {
    return <IntroPortal slides={config.introSlides} onComplete={() => setShowIntro(false)} />;
  }

  // LANDING PAGE PRINCIPAL
  return (
    <div className="font-ubuntu">
      <Navbar logoUrl={config.logoUrl} onTabChange={() => {}} />
      <Hero images={config.heroImages} />
      <About images={config.aboutImages} />
      <SchedulesSection schedules={schedules} />
      <section id="register" className="py-24 bg-slate-100">
        <RegistrationForm config={config} onRegister={handleRegister} />
      </section>
      <Footer config={config} onAdminClick={() => { window.location.hash = '#dashboard'; }} />
    </div>
  );
};

export default App;
