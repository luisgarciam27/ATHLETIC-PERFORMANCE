
import React from 'react';
import { Student } from '../types';
import { Shield, Zap, Target, MapPin } from 'lucide-react';

interface StudentCardProps {
  student: Student;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[1.586/1] bg-white rounded-[1.5rem] overflow-hidden shadow-2xl border border-slate-100 group cursor-default print:shadow-none print:border-slate-300">
      {/* Decorative Light Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-[60px] opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-100 rounded-full blur-[50px] opacity-60"></div>
      
      {/* Header Line */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600"></div>
      
      <div className="relative h-full p-6 flex flex-col justify-between z-10">
        <div className="flex justify-between items-start">
           <div className="flex items-center gap-2">
             <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="text-white fill-white" size={20} />
             </div>
             <div>
               <p className="font-black text-sm leading-none tracking-tight text-slate-900 uppercase">ATHLETIC <span className="text-blue-600">PERFORMANCE</span></p>
               <p className="text-[7px] tracking-[0.3em] font-bold text-slate-400 uppercase">Academy Player</p>
             </div>
           </div>
           <div className="text-right">
             <p className="text-[6px] text-slate-400 font-bold uppercase tracking-widest">SERIAL ID</p>
             <p className="text-[10px] font-black text-emerald-600 font-mono tracking-tighter">{student.qrCode}</p>
           </div>
        </div>

        <div className="flex gap-4 items-center">
           <div className="w-20 h-20 bg-slate-50 rounded-2xl border-2 border-slate-100 p-0.5 overflow-hidden shadow-inner">
              <img src={`https://i.pravatar.cc/150?u=${student.id}`} alt="Alumno" className="w-full h-full object-cover rounded-[1.2rem]" />
           </div>

           <div className="flex-grow">
              <h4 className="text-[7px] text-blue-600 font-black uppercase tracking-widest mb-1">ATLETA ÉLITE</h4>
              <p className="text-xl font-black tracking-tight leading-none text-slate-900 truncate">
                {student.firstName} <br />
                <span className="text-slate-400 text-sm font-bold uppercase tracking-normal">{student.lastName}</span>
              </p>
              <div className="flex gap-2 mt-2">
                <div className="px-2 py-0.5 bg-slate-100 rounded flex items-center gap-1">
                   <Target size={8} className="text-emerald-600" />
                   <p className="text-[8px] font-bold text-slate-500 uppercase">{student.category.split(' ')[0]}</p>
                </div>
                <div className="px-2 py-0.5 bg-slate-100 rounded flex items-center gap-1">
                   <MapPin size={8} className="text-blue-600" />
                   <p className="text-[8px] font-bold text-slate-500 uppercase">LIMA HQ</p>
                </div>
              </div>
           </div>
        </div>

        <div className="flex justify-between items-end border-t border-slate-100 pt-3">
           <div className="flex gap-4">
              <div>
                <p className="text-[6px] text-slate-400 font-bold uppercase mb-0.5">VIGENCIA</p>
                <p className="text-[9px] font-black text-slate-900">12 / 2024</p>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 rounded-lg">
                <Shield size={10} className="text-blue-600" />
                <span className="text-[8px] font-black text-blue-600 uppercase">ACTIVO</span>
              </div>
           </div>
           <div className="bg-white p-1 rounded-lg border border-slate-100 shadow-sm">
             <img 
               src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${student.qrCode}&bgcolor=ffffff&color=0f172a`} 
               alt="QR" 
               className="w-10 h-10"
             />
           </div>
        </div>
      </div>
    </div>
  );
};
