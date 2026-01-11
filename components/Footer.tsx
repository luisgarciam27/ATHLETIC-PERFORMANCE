
import React from 'react';
import { Facebook, Instagram, MapPin, Phone, Mail, Zap, ArrowUp, Lock, Youtube, Music2 } from 'lucide-react';
import { AcademyConfig } from '../types';

interface FooterProps {
  config: AcademyConfig;
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onAdminClick }) => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-20 pb-10 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 mb-16">
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              {config.logoUrl ? (
                <img src={config.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
              ) : (
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Zap className="text-white fill-white" size={22} />
                </div>
              )}
              <div>
                <span className="font-black text-xl tracking-tighter leading-none text-slate-900 uppercase">ATHLETIC</span>
                <p className="text-[8px] tracking-[0.3em] font-bold text-emerald-600 uppercase">Élite Academy</p>
              </div>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">
              {config.welcomeMessage || "Formando el futuro del fútbol peruano con valores y profesionalismo."}
            </p>
            <div className="flex gap-3">
              {config.socialFacebook && (
                <a href={config.socialFacebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-slate-100 shadow-sm">
                  <Facebook size={22} />
                </a>
              )}
              {config.socialInstagram && (
                <a href={config.socialInstagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition-all border border-slate-100 shadow-sm">
                  <Instagram size={22} />
                </a>
              )}
              {config.socialTiktok && (
                <a href={config.socialTiktok} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all border border-slate-100 shadow-sm">
                  <Music2 size={22} />
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-black text-slate-900 mb-6 uppercase text-xs tracking-widest">Navegación</h4>
            <ul className="space-y-4 text-slate-500 font-bold text-sm">
              <li><a href="#home" className="hover:text-blue-600 transition-colors">Inicio</a></li>
              <li><a href="#about" className="hover:text-blue-600 transition-colors">Metodología</a></li>
              <li><a href="#schedules" className="hover:text-blue-600 transition-colors">Horarios</a></li>
              <li><a href="#register" className="hover:text-blue-600 transition-colors">Matrícula Online</a></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="font-black text-slate-900 mb-6 uppercase text-xs tracking-widest">Sede Central</h4>
            <ul className="space-y-4 text-slate-500">
              <li className="flex items-start gap-3 text-sm font-bold">
                <MapPin size={20} className="text-blue-600 shrink-0" /> {config.contactAddress}
              </li>
              <li className="flex items-center gap-3 text-sm font-bold">
                <Phone size={20} className="text-emerald-600 shrink-0" /> {config.contactPhone}
              </li>
              <li className="flex items-center gap-3 text-sm font-bold">
                <Mail size={20} className="text-blue-600 shrink-0" /> {config.contactEmail}
              </li>
              <li className="pt-8">
                <button 
                  onClick={onAdminClick}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                >
                  <Lock size={14} /> Acceso Personal
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
            © 2024 Athletic Élite Academy. Forjando Campeones.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-slate-200 shadow-sm"
          >
            <ArrowUp size={24} />
          </button>
        </div>
      </div>
    </footer>
  );
};
