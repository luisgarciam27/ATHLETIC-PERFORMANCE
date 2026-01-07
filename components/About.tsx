
import React from 'react';
import { Heart, Activity, Brain, CheckCircle2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Brain,
    title: "Enfoque Emocional",
    desc: "Fortalecemos la confianza y el manejo de emociones en el campo.",
    color: "blue"
  },
  {
    icon: Activity,
    title: "Desarrollo Motor",
    desc: "Optimización de la coordinación y habilidades motrices.",
    color: "emerald"
  },
  {
    icon: Heart,
    title: "Salud Integral",
    desc: "Promovemos hábitos saludables y bienestar físico constante.",
    color: "rose"
  },
  {
    icon: Zap,
    title: "Visión Holística",
    desc: "Entrenamos al niño como un todo: mente, cuerpo y técnica.",
    color: "amber"
  }
];

export const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h4 className="text-emerald-600 font-bold mb-4 tracking-[0.2em] uppercase text-sm">NUESTRA FILOSOFÍA</h4>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">FORMACIÓN <span className="text-gradient">360°</span></h2>
          <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium">
            En Athletic Performance, creemos que el fútbol es una herramienta de crecimiento personal. Nuestra metodología integra el aspecto emocional con la excelencia física.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -5 }}
                className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className={`w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="text-blue-600" size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4 mt-8">
               <div className="overflow-hidden rounded-[2rem] shadow-lg">
                 <img src="https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?auto=format&fit=crop&q=80&w=800" className="w-full h-48 object-cover" alt="Soccer" />
               </div>
               <div className="overflow-hidden rounded-[2rem] shadow-lg">
                 <img src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=800" className="w-full h-64 object-cover" alt="Training" />
               </div>
            </div>
            <div className="space-y-4">
               <div className="overflow-hidden rounded-[2rem] shadow-lg">
                 <img src="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&q=80&w=800" className="w-full h-64 object-cover" alt="Kids" />
               </div>
               <div className="overflow-hidden rounded-[2rem] shadow-lg">
                 <img src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=800" className="w-full h-48 object-cover" alt="Team" />
               </div>
            </div>
          </motion.div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-600 rounded-full flex flex-col items-center justify-center text-white border-[10px] border-slate-50 shadow-2xl z-20">
             <span className="text-4xl font-black">10+</span>
             <span className="text-[10px] uppercase font-bold tracking-widest text-blue-100">Años Élite</span>
          </div>
        </div>
      </div>
    </div>
  );
};
