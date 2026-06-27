import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, DollarSign, Utensils, ArrowRight, Sparkles, Moon, Sun } from 'lucide-react';
import { UserSettings } from '../types';
import { triggerHaptic, triggerSound } from '../lib/storage';

interface OnboardingProps {
  onComplete: (initialSettings: Partial<UserSettings>) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0);
  const [name, setName] = useState('Guerreiro');
  const [wakeTime, setWakeTime] = useState('06:00');
  const [sleepTime, setSleepTime] = useState('22:00');

  const slides = [
    {
      icon: <CheckCircle2 className="w-16 h-16 text-[#C8FF00]" />,
      title: "Seu modo interno começa aqui",
      subtitle: "Organize sua rotina diária, semanal e mensal offline com foco implacável e disciplina blindada.",
      accent: "#C8FF00"
    },
    {
      icon: <DollarSign className="w-16 h-16 text-[#4DA6FF]" />,
      title: "Controle o que entra e sai",
      subtitle: "Dashboard financeiro nativo com limite de gastos por categoria, listas inteligentes e metas futuras.",
      accent: "#4DA6FF"
    },
    {
      icon: <Utensils className="w-16 h-16 text-[#FF4D4D]" />,
      title: "Nutra o seu dia",
      subtitle: "5 refeições diárias, guia de culinária base e sistema anti-delivery para proteger seu corpo e seu bolso.",
      accent: "#FF4D4D"
    }
  ];

  const handleNext = () => {
    triggerHaptic(true);
    triggerSound('check', true);
    if (step < 2) {
      setStep(step + 1);
    } else {
      setStep(3); // Setup form
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(true);
    triggerSound('celebrate', true);
    onComplete({
      name: name.trim() || 'Usuário',
      wakeTime,
      sleepTime,
    });
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col justify-between p-6 max-w-md mx-auto relative overflow-hidden select-none">
      {/* Subtle ambient light */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8FF00]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4DA6FF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Indicator */}
      <div className="flex justify-between items-center pt-8">
        <span className="font-display font-extrabold text-sm tracking-widest text-gray-400">MODO INTERNO</span>
        <span className="text-xs font-mono text-gray-500">v1.0 Nativo</span>
      </div>

      <div className="flex-1 flex items-center justify-center py-6">
        <AnimatePresence mode="wait">
          {step < 3 ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="text-center flex flex-col items-center max-w-xs"
            >
              <div className="w-32 h-32 mb-8 bg-[#1A1A1A] rounded-3xl border border-[#2A2A2A] flex items-center justify-center shadow-2xl relative">
                {slides[step].icon}
                <Sparkles className="w-5 h-5 text-white absolute top-3 right-3 opacity-60" />
              </div>

              <h1 className="text-2xl font-display font-bold text-white mb-3 tracking-tight">
                {slides[step].title}
              </h1>
              <p className="text-sm text-gray-400 font-normal leading-relaxed">
                {slides[step].subtitle}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleFinish}
              className="w-full space-y-6 bg-[#1A1A1A] p-6 rounded-3xl border border-[#2A2A2A] shadow-2xl"
            >
              <div className="text-center mb-2">
                <h2 className="text-xl font-display font-bold text-white">Configuração Inicial</h2>
                <p className="text-xs text-gray-400 mt-1">Nenhum dado é enviado à internet. Tudo fica no seu aparelho.</p>
              </div>

              <div>
                <label htmlFor="user-name-input" className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Seu Nome / Apelido</label>
                <input
                  id="user-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Weslei, Guerreiro..."
                  className="w-full p-3.5 bg-[#222222] border border-[#2A2A2A] rounded-2xl text-white text-sm focus:border-[#C8FF00] focus:outline-none transition-colors font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="wake-time-input" className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-[#C8FF00]" /> Acordar
                  </label>
                  <input
                    id="wake-time-input"
                    type="time"
                    required
                    value={wakeTime}
                    onChange={e => setWakeTime(e.target.value)}
                    className="w-full p-3.5 bg-[#222222] border border-[#2A2A2A] rounded-2xl text-white text-sm font-mono focus:border-[#C8FF00] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="sleep-time-input" className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-[#4DA6FF]" /> Dormir
                  </label>
                  <input
                    id="sleep-time-input"
                    type="time"
                    required
                    value={sleepTime}
                    onChange={e => setSleepTime(e.target.value)}
                    className="w-full p-3.5 bg-[#222222] border border-[#2A2A2A] rounded-2xl text-white text-sm font-mono focus:border-[#4DA6FF] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#C8FF00] hover:bg-[#b3e600] text-[#0D0D0D] font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(200,255,0,0.3)] active:scale-98 transition-all pt-3.5"
              >
                COMEÇAR AGORA <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination & Footer Action */}
      <div className="pb-8">
        {step < 3 ? (
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[#C8FF00]' : 'w-2 bg-[#2A2A2A]'}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 bg-[#C8FF00] hover:bg-[#b3e600] text-[#0D0D0D] font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition-all shadow-[0_4px_25px_rgba(200,255,0,0.25)]"
            >
              {step === 2 ? 'CONFIGURAR MEU MODO' : 'CONTINUAR'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center text-[11px] text-gray-500">
            Armazenamento 100% offline via Room Database
          </div>
        )}
      </div>
    </div>
  );
};
