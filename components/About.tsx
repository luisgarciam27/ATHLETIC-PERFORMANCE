
import React from 'react';
import { Heart, Activity, Brain, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: Brain, title: "Enfoque Emocional", desc: "Fortalecemos la confianza y el manejo de emociones en el campo." },
  { icon: Activity, title: "Desarrollo Motor", desc: "Optimización de la coordinación y habilidades motrices." },
  { icon: Heart, title: "Salud Integral", desc: "Promovemos hábitos saludables y bienestar físico constante." },
  { icon: Zap, title: "Visión Holística", desc: "Entrenamos al niño como un todo: mente, cuerpo y técnica." }
];

interface AboutProps {
  images: string[];
}

export const About: React.FC<AboutProps> = ({ images }) => {
  // Aseguramos fallback si no hay imágenes configuradas
  const displayImages = images && images.length >= 4 ? images : [
    "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800",
    "https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?q=80&w=800",
    "https://images.unsplash.com/photo-1526232386154-75127e4dd0a8?q=80&w=800",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800"
  ];

  return (
    <div id="about" className="container mx-auto px-4 py-24">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h4 className="text-emerald-600 font-bold mb-4 tracking-[0.2em] uppercase text-sm italic">NUESTRA FILOSOFÍA</h4>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight uppercase">FORMACIÓN <span className="text-gradient">360°</span></h2>
          <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium">
            En Athletic Performance, creemos que el fútbol es una herramienta de crecimiento personal. Nuestra metodología integra el aspecto emocional con la excelencia física para formar atletas completos.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><f.icon className="text-blue-600" size={24} /></div>
                <h3 className="font-black text-slate-900 mb-2 uppercase text-xs tracking-widest">{f.title}</h3>
                <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="relative">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
            <div className="space-y-4 mt-8">
               <div className="overflow-hidden rounded-[2.5rem] shadow-lg aspect-square border-4 border-white"><img src={displayImages[0]} className="w-full h-full object-cover" alt="Method 1" /></div>
               <div className="overflow-hidden rounded-[2.5rem] shadow-lg aspect-[3/4] border-4 border-white"><img src={displayImages[1]} className="w-full h-full object-cover" alt="Method 2" /></div>
            </div>
            <div className="space-y-4">
               <div className="overflow-hidden rounded-[2.5rem] shadow-lg aspect-[3/4] border-4 border-white"><img src={displayImages[2]} className="w-full h-full object-cover" alt="Method 3" /></div>
               <div className="overflow-hidden rounded-[2.5rem] shadow-lg aspect-square border-4 border-white"><img src={displayImages[3]} className="w-full h-full object-cover" alt="Method 4" /></div>
            </div>
          </motion.div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-slate-900 rounded-full flex flex-col items-center justify-center text-white border-[10px] border-slate-50 shadow-2xl z-20">
             <span className="text-5xl font-black italic">10+</span>
             <span className="text-[9px] uppercase font-bold tracking-widest text-blue-400">Años Élite</span>
          </div>
        </div>
      </div>
    </div>
  );
};
