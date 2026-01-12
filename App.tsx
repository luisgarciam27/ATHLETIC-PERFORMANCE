
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
    "https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?q=80&w=800"
  ],
  welcomeMessage: "Inscripciones abiertas 2026. Únete a la familia Athletic Performance.",
  introSlides: [
    { id: '1', type: 'image', url: 'https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?q=80&w=2070', title: 'ATHLETIC', subtitle: 'PERFORMANCE', duration: 5000 }
  ],
  staffStories: [],
  contactPhone: "+51 900 000 000",
  contactEmail: "hola@athletic.pe",
  contactAddress: "Sede Principal, Lima",
  socialFacebook: "",
  socialInstagram: "",
  socialTiktok: "",
  socialWhatsapp: "900000000",
  yapeNumber: "900000000",
  yapeName: "ACADEMIA ATHLETIC",
  plinNumber: "900000000",
  plinName: "ACADEMIA ATHLETIC",
  bcpAccount: "191-XXXXXXXX-0-XX",
  bcpCCI: "002-191-XXXXXXXXXXXX-XX",
  bcpName: "ATHLETIC PERFORMANCE"
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
      // 1. Alumnos - Mapeo fiel al esquema de tablas del usuario
      const studentsRes: any = await supabaseFetch('GET', 'students');
      if (studentsRes && Array.isArray(studentsRes)) {
        setStudents(studentsRes.map(s => ({
          id: s.id,
          firstName: s.first_name || '',
          lastName: s.last_name || '',
          birthDate: s.birth_date || '',
          parentName: s.parent_name || '',
          parentPhone: s.parent_phone || '',
          address: s.address || '',
          category: s.category || '',
          scheduleId: s.schedule_id || '',
          paymentStatus: (s.payment_status as any) || 'Pending',
          pending_balance: Number(s.pending_balance) || 0,
          total_paid: Number(s.total_paid) || 0,
          modality: s.modality || 'Mensual Regular',
          qrCode: s.qr_code || '',
          nextPaymentDate: s.next_payment_date || '',
          enrollmentPayment: Number(s.enrollment_fee) || 0,
          comments: s.comments || '',
          registrationDate: s.created_at || new Date().toISOString()
        })));
      }

      // 2. Horarios
      const schedulesRes: any = await supabaseFetch('GET', 'schedules');
      if (schedulesRes && Array.isArray(schedulesRes) && schedulesRes.length > 0) {
        setSchedules(schedulesRes.map(s => ({
          id: s.id,
          category: s.category,
          age: s.age || '',
          days: s.days || [],
          time: s.time || '',
          duration: '60 min', // Default ya que no está en la tabla
          price: Number(s.price) || 0,
          objective: '', // Default ya que no está en la tabla
          color: s.color || '#3b82f6'
        })));
      }

      // 3. Configuración
      const cloudConfig: any = await supabaseFetch('GET', 'academy_config');
      if (cloudConfig && !cloudConfig.error) {
        setConfig(prev => ({
          ...prev,
          logoUrl: cloudConfig.logo_url || prev.logoUrl,
          heroImages: Array.isArray(cloudConfig.hero_images) ? cloudConfig.hero_images : prev.heroImages,
          aboutImages: Array.isArray(cloudConfig.about_images) ? cloudConfig.about_images : prev.aboutImages,
          welcomeMessage: cloudConfig.welcome_message || prev.welcomeMessage,
          contactPhone: cloudConfig.contact_phone || prev.contactPhone,
          contactEmail: cloudConfig.contact_email || prev.contactEmail,
          contactAddress: cloudConfig.contact_address || prev.contactAddress,
          socialFacebook: cloudConfig.social_facebook || prev.socialFacebook,
          socialInstagram: cloudConfig.social_instagram || prev.socialInstagram,
          socialTiktok: cloudConfig.social_tiktok || prev.socialTiktok,
          socialWhatsapp: cloudConfig.social_whatsapp || prev.socialWhatsapp,
          yapeNumber: cloudConfig.yape_number || prev.yapeNumber,
          yapeName: cloudConfig.yape_name || prev.yapeName,
          plinNumber: cloudConfig.plin_number || prev.plinNumber,
          plinName: cloudConfig.plin_name || prev.plinName,
          bcpAccount: cloudConfig.bcp_account || prev.bcpAccount,
          bcpCCI: cloudConfig.bcp_cci || prev.bcpCCI,
          bcpName: cloudConfig.bcp_name || prev.bcpName,
          introSlides: Array.isArray(cloudConfig.intro_slides) ? cloudConfig.intro_slides : prev.introSlides,
          staffStories: Array.isArray(cloudConfig.staff_stories) ? cloudConfig.staff_stories : prev.staffStories
        }));
      }
    } catch (e) {
      console.error("Error cargando datos:", e);
    }
  };

  useEffect(() => {
    fetchData().finally(() => {
      const auth = localStorage.getItem('athletic_admin_auth');
      if (auth === 'true') setIsAdminLoggedIn(true);
      setIsLoading(false);
    });
  }, []);

  const handleRegister = async (newStudent: Student) => {
    // MAPEAMOS EXACTAMENTE A LOS NOMBRES DE TUS TABLAS (SNAKE_CASE)
    const payload: any = {
      first_name: newStudent.firstName,
      last_name: newStudent.lastName,
      birth_date: newStudent.birthDate || null,
      category: newStudent.category,
      modality: newStudent.modality || 'Mensual Regular',
      parent_name: newStudent.parentName,
      parent_phone: newStudent.parentPhone,
      address: newStudent.address,
      payment_status: newStudent.paymentStatus,
      next_payment_date: newStudent.nextPaymentDate || null,
      qr_code: newStudent.qrCode,
      comments: newStudent.comments || '',
      enrollment_fee: newStudent.enrollmentPayment || 0,
      pending_balance: newStudent.pending_balance || 0,
      total_paid: newStudent.total_paid || 0,
      schedule_id: newStudent.scheduleId
    };

    // ELIMINAMOS registration_date PORQUE NO EXISTE EN TU TABLA
    // Supabase llenará automáticamente created_at

    const result = await supabaseFetch('POST', 'students', payload);
    
    if (result && !result.error) {
      await fetchData();
      return true;
    }
    
    const errorMessage = result?.error?.message || result?.error?.details || 'Error de conexión con la base de datos';
    console.error("Error detectado en Supabase:", result?.error);
    
    throw new Error(errorMessage);
  };

  const handleUpdateConfig = async (newConfig: AcademyConfig) => {
    const payload = {
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
      yape_number: newConfig.yapeNumber,
      yape_name: newConfig.yapeName,
      plin_number: newConfig.plinNumber,
      plin_name: newConfig.plinName,
      bcp_account: newConfig.bcpAccount,
      bcp_cci: newConfig.bcpCCI,
      bcp_name: newConfig.bcpName,
      intro_slides: newConfig.introSlides,
      staff_stories: newConfig.staffStories
    };

    const result = await supabaseFetch('PATCH', 'academy_config', payload);
    if (result && !result.error) {
      setConfig(newConfig);
      return true;
    }
    return false;
  };

  const handleUpdateSchedules = async (newSchedules: ClassSchedule[]) => {
    setSchedules(newSchedules);
    return true;
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm('¿ELIMINAR ALUMNO DEFINITIVAMENTE?')) return false;
    const result = await supabaseFetch('DELETE', 'students', { id });
    if (!result?.error) {
      setStudents(prev => prev.filter(s => s.id !== id));
      return true;
    }
    return false;
  };

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white font-black uppercase text-[10px] tracking-widest">Cargando Sistema Athletic...</p>
      </div>
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
        onUpdateStudent={async (s) => { await fetchData(); return true; }} 
        onDelete={handleDeleteStudent} 
        onLogout={() => { setIsAdminLoggedIn(false); localStorage.removeItem('athletic_admin_auth'); }} 
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
          <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={(p) => { 
            if(p === 'admin123') { setIsAdminLoggedIn(true); localStorage.setItem('athletic_admin_auth', 'true'); return true; } 
            return false; 
          }} />
        </>
      )}
    </div>
  );
};

export default App;
