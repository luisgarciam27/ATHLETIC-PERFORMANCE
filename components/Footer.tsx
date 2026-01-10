
import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Zap, ArrowUp, Lock } from 'lucide-react';

interface FooterProps {
  logoUrl?: string;
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ logoUrl, onAdminClick }) => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-20 pb-10 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 mb-16">
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
              ) : (
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Zap className="text-white fill-white" size={22} />
                </div>
              )}
              <div>
                <span className="font-black text-xl tracking-tighter leading-none text-slate-900 uppercase">ATHLETIC</span>
                <p className="text-[8px] tracking-[0.3em] font-bold text-emerald-600 uppercase">Performance Academy</p>
              </div>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">
              Formando el futuro del fútbol peruano con valores y profesionalismo.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-black text-slate-900 mb-6 uppercase text-xs tracking-widest">Explorar</h4>
            <ul className="space-y-3 text-slate-500 font-bold text-sm">
              <li><a href="#home" className="hover:text-blue-600 transition-colors">Inicio</a></li>
              <li><a href="#about" className="hover:text-blue-600 transition-colors">Metodología</a></li>
              <li><a href="#schedules" className="hover:text-blue-600 transition-colors">Horarios</a></li>
              <li><a href="#register" className="hover:text-blue-600 transition-colors">Inscripción</a></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="font-black text-slate-900 mb-6 uppercase text-xs tracking-widest">Contacto</h4>
            <ul className="space-y-4 text-slate-500">
              <li className="flex items-center gap-3 text-sm font-bold">
                <MapPin size={18} className="text-blue-600" /> Av. Javier Prado, Lima
              </li>
              <li className="flex items-center gap-3 text-sm font-bold">
                <Phone size={18} className="text-emerald-600" /> +51 900 000 000
              </li>
              <li className="flex items-center gap-3 text-sm font-bold">
                <Mail size={18} className="text-blue-600" /> hola@athletic.pe
              </li>
              <li className="pt-4">
                <button 
                  onClick={onAdminClick}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10"
                >
                  <Lock size={12} /> Acceso Personal
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
            © 2024 Athletic Performance. Todos los derechos reservados.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all border border-slate-200"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
};
