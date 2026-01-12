
import React from 'react';
import { Facebook, Instagram, MapPin, Phone, Mail, Zap, ArrowUp, MessageCircle, Music2, ShieldCheck } from 'lucide-react';
import { AcademyConfig } from '../types';

interface FooterProps {
  config: AcademyConfig;
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onAdminClick }) => {
  const handleWhatsAppRedirect = () => {
    const num = (config.socialWhatsapp || '51900000000').replace(/\D/g, '');
    window.open(`https://wa.me/${num}?text=Hola!%20Deseo%20información%20sobre%20la%20academia%20Athletic.`, '_blank');
  };

  return (
    <footer className="bg-white border-t border-slate-200 pt-24 pb-12 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 mb-20">
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-4">
              {config.logoUrl ? (
                <img src={config.logoUrl} alt="Logo" className="h-14 w-auto object-contain" />
              ) : (
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="text-white fill-white" size={32} />
                </div>
              )}
              <div>
                <span className="font-black text-3xl tracking-tighter leading-none text-slate-900 uppercase">ATHLETIC</span>
                <p className="text-[11px] tracking-[0.4em] font-black text-emerald-600 uppercase">Performance Academy</p>
              </div>
            </div>
            <p className="text-slate-500 text-xl leading-relaxed font-medium max-w-md">
              {config.welcomeMessage || "Formando a las próximas leyendas del fútbol con metodología profesional en Lima."}
            </p>
            <div className="flex gap-5">
              <a href={config.socialFacebook || "https://facebook.com"} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-blue-100 shadow-sm hover:scale-110">
                <Facebook size={26} />
              </a>
              <a href={config.socialInstagram || "https://instagram.com"} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-all border border-pink-100 shadow-sm hover:scale-110">
                <Instagram size={26} />
              </a>
              <a href={config.socialTiktok || "https://tiktok.com"} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all border border-slate-200 shadow-sm hover:scale-110">
                <Music2 size={26} />
              </a>
              <button 
                onClick={handleWhatsAppRedirect} 
                className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 shadow-sm hover:scale-110"
              >
                <MessageCircle size={26} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-black text-slate-900 mb-10 uppercase text-xs tracking-[0.3em] italic">Explorar</h4>
            <ul className="space-y-5">
              <li><a href="#about" className="text-slate-500 hover:text-blue-600 font-bold text-base transition-colors">La Academia</a></li>
              <li><a href="#schedules" className="text-slate-500 hover:text-blue-600 font-bold text-base transition-colors">Nuestros Horarios</a></li>
              <li><a href="#register" className="text-slate-500 hover:text-blue-600 font-bold text-base transition-colors">Admisión 2026</a></li>
              <li className="pt-6 border-t border-slate-50">
                <button 
                  onClick={onAdminClick}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all hover:bg-blue-600 hover:shadow-xl active:scale-95 group"
                >
                  <ShieldCheck size={20} className="group-hover:rotate-12 transition-transform" />
                  ACCESO STAFF
                </button>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="font-black text-slate-900 mb-10 uppercase text-xs tracking-[0.3em] italic">Sede Central</h4>
            <ul className="space-y-6 text-slate-500">
              <li className="flex items-start gap-4 text-base font-bold">
                <MapPin size={24} className="text-blue-600 shrink-0" /> {config.contactAddress}
              </li>
              <li className="flex items-center gap-4 text-base font-bold">
                <Phone size={24} className="text-emerald-600 shrink-0" /> {config.contactPhone}
              </li>
              <li className="flex items-center gap-4 text-base font-bold">
                <Mail size={24} className="text-blue-600 shrink-0" /> {config.contactEmail}
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] mb-1">
              © 2026 Athletic Performance Academy.
            </p>
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 border border-slate-200 shadow-sm transition-all hover:scale-110 active:scale-90"
          >
            <ArrowUp size={32} />
          </button>
        </div>
      </div>
    </footer>
  );
};
