
export type ClassSchedule = {
  id: string;
  category: string;
  age: string;
  days: string[];
  time: string;
  duration: string;
  price: number;
  objective: string;
};

export type Student = {
  id: string;
  registrationDate: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  category: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  scheduleId: string;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  nextPaymentDate: string;
  qrCode: string;
};

export type Message = {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
};
