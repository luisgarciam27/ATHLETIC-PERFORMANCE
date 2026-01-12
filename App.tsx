
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
    { id: '2', type: 'image', url: 'https://images.unsplash.com/photo-1526232386154-75127e4dd0a8?q=80&w=800', title: 'FORMACIÓN', subtitle: 'DE ÉLITE', duration: 4000 }
  ],
  staffStories: [
    { id: 's1', type: 'video', url: 'https://cdn.pixabay.com/video/2021/04/12/70860-537442186_large.mp4', name: 'Carlos Ruíz', role: 'Director Técnico', duration: 10000 }
  ],
  contactPhone: "+51 900 000 000",
  contactEmail: "hola@athletic.pe",
  contactAddress: "Sede Principal, Lima",
  socialFacebook: "https://facebook.com/athleticlima",
  socialInstagram: "https://instagram.com/athleticlima",
  socialTiktok: "https://tiktok.com/@athleticlima",
  socialWhatsapp: "900000000",
  yapeNumber: "900000000",
  yapeName: "ACADEMIA ATHLETIC",
  plinNumber: "900000000",
  plinName: "ACADEMIA ATHLETIC",
  bcpAccount: "191-XXXXXXXX-0-XX",
  bcpCCI: "002-191-XXXXXXXXXXXX-XX",
  bcpName: "ATHLETIC PERFORMANCE SAC"
};

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [schedules, setSchedules] = useState<ClassSchedule[]>(STATIC_SCHEDULES);
  const [config, setConfig] = useState<AcademyConfig>(DEFAULT_CONFIG);
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
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
        setSchedules(schedulesRes.map(s => ({ ...s, days: Array.isArray(s.days) ? s.days : [], startDate: s.start_date, endDate: s.end_date })));
      }

      const cloudConfig: any = await supabaseFetch('GET', 'academy_config');
      if (cloudConfig && !cloudConfig.error) {
        setConfig(prev => ({
          ...prev,
          ...cloudConfig,
          socialFacebook: cloudConfig.social_facebook || cloudConfig.socialFacebook || prev.socialFacebook,
          socialInstagram: cloudConfig.social_instagram || cloudConfig.socialInstagram || prev.socialInstagram,
          socialTiktok: cloudConfig.social_tiktok || cloudConfig.socialTiktok || prev.socialTiktok,
          socialWhatsapp: cloudConfig.social_whatsapp || cloudConfig.socialWhatsapp || prev.socialWhatsapp,
          logoUrl: cloudConfig.logo_url || prev.logoUrl,
          heroImages: cloudConfig.hero_images || prev.heroImages,
          aboutImages: cloudConfig.about_images || prev.aboutImages,
          introSlides: cloudConfig.intro_slides || prev.introSlides,
          staffStories: cloudConfig.staff_stories || prev.staffStories,
          yapeNumber: cloudConfig.yape_number || prev.yapeNumber,
          yapeName: cloudConfig.yape_name || prev.yapeName,
          plinNumber: cloudConfig.plin_number || prev.plinNumber,
          plinName: cloudConfig.plin_name || prev.plinName,
          bcpAccount: cloudConfig.bcp_account || prev.bcpAccount,
          bcpCCI: cloudConfig.bcp_cci || prev.bcpCCI,
          bcpName: cloudConfig.bcp_name || prev.bcpName
        }));
      }
    } catch (e) {
      console.error("Error loading data", e);
    }
  };

  useEffect(() => {
    fetchData().finally(() => {
      const auth = localStorage.getItem('athletic_admin_auth');
      if (auth === 'true') setIsAdminLoggedIn(true);
      setIsLoading(false);
    });
  }, []);

  const handleUpdateSchedules = async (newSchedules: ClassSchedule[]) => {
    setSchedules(newSchedules);
    for (const s of newSchedules) {
      await supabaseFetch('POST', 'schedules', { ...s, id: s.id, days: s.days || [], start_date: s.startDate, end_date: s.endDate });
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
    if (!window.confirm('¿ELIMINAR ALUMNO DEFINITIVAMENTE?')) return;
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
      id: 1, 
      logo_url: newConfig.logoUrl, 
      hero_images: newConfig.heroImages,
      about_images: newConfig.aboutImages, 
      welcome_message: newConfig.welcomeMessage,
      contact_phone: newConfig.contactPhone, 
      contact_email: newConfig.contactEmail,
      contact_address: newConfig.contactAddress, 
      social_facebook: newConfig.socialFacebook,
      social_instagram: newConfig.socialInstagram, 
      social_tiktok: newConfig.socialTiktok,
      social_whatsapp: newConfig.socialWhatsapp,
      intro_slides: newConfig.introSlides,
      staff_stories: newConfig.staffStories,
      yape_number: newConfig.yapeNumber,
      yape_name: newConfig.yapeName,
      plin_number: newConfig.plinNumber,
      plin_name: newConfig.plinName,
      bcp_account: newConfig.bcpAccount,
      bcp_cci: newConfig.bcpCCI,
      bcp_name: newConfig.bcpName
    });
    if (result && !result.error) { 
      setConfig(newConfig); 
      return true; 
    }
    return false;
  };

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase">Cargando...</p>
    </div>
  );

  if (isAdminLoggedIn) {
    return (
      <AdminDashboard 
        students={students} 
        schedules={schedules} 
        config={config} 
        onUpdateConfig={handleUpdateConfig} 
        onUpdateSchedules={handleUpdateSchedules}
        onRegister={handleRegister} 
        onUpdateStudent={handleUpdateStudent} 
        onDelete={handleDeleteStudent} 
        onLogout={() => { 
          setIsAdminLoggedIn(false); 
          localStorage.removeItem('athletic_admin_auth'); 
        }} 
      />
    );
  }

  return (
    <div className="font-ubuntu">
      {showIntro ? (
        <IntroPortal slides={config.introSlides} onComplete={() => setShowIntro(false)} />
      ) : (
        <>
          <Navbar logoUrl={config.logoUrl} onTabChange={() => {}} />
          <Hero images={config.heroImages} staffStories={config.staffStories} />
          <About images={config.aboutImages} />
          <SchedulesSection schedules={schedules} />
          <section id="register" className="py-24 bg-slate-100">
            <RegistrationForm config={config} onRegister={handleRegister} />
          </section>
          <Footer config={config} onAdminClick={() => setShowLoginModal(true)} />
          
          <LoginModal 
            isOpen={showLoginModal} 
            onClose={() => setShowLoginModal(false)} 
            onLogin={(pass) => {
              if (pass === 'admin123') {
                setIsAdminLoggedIn(true);
                localStorage.setItem('athletic_admin_auth', 'true');
                setShowLoginModal(false);
                return true;
              }
              return false;
            }} 
          />
        </>
      )}
    </div>
  );
};

export default App;
