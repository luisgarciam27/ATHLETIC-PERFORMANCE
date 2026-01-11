
export type ClassSchedule = {
  id: string;
  category: string;
  age: string;
  days: string[];
  time: string;
  duration: string;
  price: number;
  objective: string;
  color: string;
  startDate?: string;
  endDate?: string;
};

export type Student = {
  id: string;
  registrationDate: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  category: string;
  modality: string;
  parentName: string;
  parentPhone: string;
  address: string;
  scheduleId: string;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  nextPaymentDate: string;
  qrCode: string;
  enrollmentPayment?: number;
};

export type IntroSlide = {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  subtitle: string;
  duration: number;
};

export type StaffStory = {
  id: string;
  name: string;
  role: string;
  url: string;
  type: 'image' | 'video';
  duration: number;
};

export type AcademyConfig = {
  logoUrl: string;
  heroImages: string[];
  aboutImages: string[];
  welcomeMessage: string;
  introSlides: IntroSlide[];
  staffStories: StaffStory[];
  // Contact & Social
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  socialFacebook: string;
  socialInstagram: string;
  socialTiktok: string;
  socialWhatsapp: string;
};
