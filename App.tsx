
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
  bcpName: "ATHLETIC PERFORMANCE",
  interbankAccount: "",
  interbankCCI: "",
  interbankName: ""
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
      // 1. Alumnos
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
          attendance_history: Array.isArray(s.attendance_history) ? s.attendance_history : [],
          registrationDate: s.created_at || new Date().toISOString()
        })));
      }

      // 2. Horarios
      const schedulesRes: any = await supabaseFetch('GET', 'schedules');
      if (schedulesRes && Array.isArray(schedulesRes) && schedulesRes.length > 0) {
        setSchedules(schedulesRes.map(s => ({
          id: s.id,
          category: s.category || 'Sin Categoría',
          age: s.age || '',
          days: Array.isArray(s.days) ? s.days : [],
          time: s.time || '',
          duration: s.duration || '60 min',
          price: Number(s.price) || 0,
          objective: s.objective || '',
          color: s.color || '#3b82f6',
          startDate: s.start_date || '',
          endDate: s.end_date || ''
        })));
      }

      // 3. Configuración
      const db: any = await supabaseFetch('GET', 'academy_config');
      if (db && !db.error) {
        setConfig({
          logoUrl: db.logo_url || DEFAULT_CONFIG.logoUrl,
          heroImages: db.hero_images || DEFAULT_CONFIG.heroImages,
          aboutImages: db.about_images || DEFAULT_CONFIG.aboutImages,
          welcomeMessage: db.welcome_message || DEFAULT_CONFIG.welcomeMessage,
          introSlides: db.intro_slides || DEFAULT_CONFIG.introSlides,
          staffStories: db.staff_stories || DEFAULT_CONFIG.staffStories,
          contactPhone: db.contact_phone || DEFAULT_CONFIG.contactPhone,
          contactEmail: db.contact_email || DEFAULT_CONFIG.contactEmail,
          contactAddress: db.contact_address || DEFAULT_CONFIG.contactAddress,
          socialFacebook: db.social_facebook || DEFAULT_CONFIG.socialFacebook,
          socialInstagram: db.social_instagram || DEFAULT_CONFIG.socialInstagram,
          socialTiktok: db.social_tiktok || DEFAULT_CONFIG.socialTiktok,
          socialWhatsapp: db.social_whatsapp || DEFAULT_CONFIG.socialWhatsapp,
          yapeNumber: db.yape_number || DEFAULT_CONFIG.yapeNumber,
          yapeName: db.yape_name || DEFAULT_CONFIG.yapeName,
          plinNumber: db.plin_number || DEFAULT_CONFIG.plinNumber,
          plinName: db.plin_name || DEFAULT_CONFIG.plinName,
          bcpAccount: db.bcp_account || DEFAULT_CONFIG.bcpAccount,
          bcpCCI: db.bcp_cci || DEFAULT_CONFIG.bcpCCI,
          bcpName: db.bcp_name || DEFAULT_CONFIG.bcpName,
          interbankAccount: db.interbank_account || DEFAULT_CONFIG.interbankAccount,
          interbankCCI: db.interbank_cci || DEFAULT_CONFIG.interbankCCI,
          interbankName: db.interbank_name || DEFAULT_CONFIG.interbankName
        });
      }
    } catch (e) {
      console.error("Critical error loading data:", e);
    }
  };

  useEffect(() => {
    fetchData().finally(() => {
      const auth = localStorage.getItem('athletic_admin_auth');
      if (auth === 'true') setIsAdminLoggedIn(true);
      setIsLoading(false);
    });
  }, []);

  const handleUpdateConfig = async (newConfig: AcademyConfig) => {
    // Mapear estrictamente los nombres de campos de React a snake_case de SQL
    const payload = {
      id: 1,
      logo_url: newConfig.logoUrl || "",
      hero_images: newConfig.heroImages || [],
      about_images: newConfig.aboutImages || [],
      welcome_message: newConfig.welcomeMessage || "",
      intro_slides: newConfig.introSlides || [],
      staff_stories: newConfig.staffStories || [],
      contact_phone: newConfig.contactPhone || "",
      contact_email: newConfig.contactEmail || "",
      contact_address: newConfig.contactAddress || "",
      social_facebook: newConfig.socialFacebook || "",
      social_instagram: newConfig.socialInstagram || "",
      social_tiktok: newConfig.socialTiktok || "",
      social_whatsapp: newConfig.socialWhatsapp || "",
      yape_number: newConfig.yapeNumber || "",
      yape_name: newConfig.yapeName || "",
      plin_number: newConfig.plinNumber || "",
      plin_name: newConfig.plinName || "",
      bcp_account: newConfig.bcpAccount || "",
      bcp_cci: newConfig.bcpCCI || "",
      bcp_name: newConfig.bcpName || "",
      interbank_account: newConfig.interbankAccount || "",
      interbank_cci: newConfig.interbankCCI || "",
      interbank_name: newConfig.interbankName || ""
    };
    
    console.log("Saving configuration payload:", payload);
    const result = await supabaseFetch('PATCH', 'academy_config', payload);
    
    if (!result?.error) {
      setConfig(newConfig);
      return true;
    } else {
      const errorMsg = result.error.message || JSON.stringify(result.error);
      console.error("Supabase Save Error Details:", result.error);
      
      // Si el error indica que faltan columnas, avisar al usuario
      if (errorMsg.includes('column') || errorMsg.includes('404')) {
        alert("ERROR: La base de datos no tiene las nuevas columnas de Interbank.\n\nPor favor, ejecuta el script SQL en Supabase para agregar 'interbank_account', 'interbank_cci' e 'interbank_name'.");
      } else {
        alert(`Error al guardar: ${errorMsg}`);
      }
      return false;
    }
  };

  const handleUpdateSchedules = async (newSchedules: ClassSchedule[]) => {
    for (const schedule of newSchedules) {
      const payload = {
        id: schedule.id,
        category: schedule.category,
        age: schedule.age,
        price: schedule.price,
        time: schedule.time,
        days: schedule.days,
        color: schedule.color,
        start_date: schedule.startDate || null,
        end_date: schedule.endDate || null
      };
      await supabaseFetch('PATCH', 'schedules', payload);
    }
    setSchedules(newSchedules);
    return true;
  };

  const handleRegister = async (newStudent: Student) => {
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
      schedule_id: newStudent.scheduleId,
      attendance_history: []
    };
    const result = await supabaseFetch('POST', 'students', payload);
    if (result && !result.error) { await fetchData(); return true; }
    return false;
  };

  const handleUpdateStudent = async (student: Student) => {
    const payload: any = {
      id: student.id,
      payment_status: student.paymentStatus,
      pending_balance: student.pending_balance,
      total_paid: student.total_paid,
      attendance_history: student.attendance_history
    };
    const result = await supabaseFetch('PATCH', 'students', payload);
    if (!result?.error) {
      setStudents(prev => prev.map(s => s.id === student.id ? student : s));
      return true;
    }
    return false;
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest">Iniciando Athletic OS...</div>;

  return (
    <div className="font-ubuntu">
      {showIntro ? (
        <IntroPortal slides={config.introSlides} onComplete={() => setShowIntro(false)} />
      ) : (
        isAdminLoggedIn ? (
          <AdminDashboard 
            students={students} 
            schedules={schedules} 
            config={config} 
            onUpdateConfig={handleUpdateConfig} 
            onUpdateSchedules={handleUpdateSchedules}
            onRegister={handleRegister} 
            onUpdateStudent={handleUpdateStudent} 
            onDelete={async (id) => { 
              const ok = await supabaseFetch('DELETE', 'students', { id });
              if(!ok.error) setStudents(prev => prev.filter(s => s.id !== id));
              return !ok.error;
            }} 
            onLogout={() => { setIsAdminLoggedIn(false); localStorage.removeItem('athletic_admin_auth'); }} 
          />
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
        )
      )}
    </div>
  );
};

export default App;
