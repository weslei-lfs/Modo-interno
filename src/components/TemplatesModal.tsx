import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Home, Calendar, ShieldCheck, Download } from 'lucide-react';
import { ROUTINE_TEMPLATES } from '../lib/storage';
import { triggerHaptic, triggerSound } from '../lib/storage';

interface TemplatesModalProps {
  show: boolean;
  onImport: (templateKey: keyof typeof ROUTINE_TEMPLATES) => void;
  onClose: () => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({ show, onImport, onClose }) => {
  const list: { key: keyof typeof ROUTINE_TEMPLATES; title: string; icon: React.ReactNode; desc: string; count: number }[] = [
    {
      key: 'casa_minima',
      title: 'Rotina Mínima da Casa',
      icon: <Home className="w-5 h-5 text-[#C8FF00]" />,
      desc: 'Cama arrumada, janelas abertas, louça lavada, lixo trocado e cozinha pronta para o dia seguinte.',
      count: ROUTINE_TEMPLATES.casa_minima.length
    },
    {
      key: 'semanal_casa',
      title: 'Rotina Semanal',
      icon: <Calendar className="w-5 h-5 text-[#4DA6FF]" />,
      desc: 'Lavar roupas, trocar roupa de cama, limpar banheiro, varrer chão e organizar superfícies.',
      count: ROUTINE_TEMPLATES.semanal_casa.length
    },
    {
      key: 'mensal_casa',
      title: 'Rotina Mensal',
      icon: <Calendar className="w-5 h-5 text-[#FFB84D]" />,
      desc: 'Limpar armários por dentro, gavetas, forno, lavar lixeira e descartar/doar o que não usa.',
      count: ROUTINE_TEMPLATES.mensal_casa.length
    },
    {
      key: 'antiburnout',
      title: 'Sistema Anti-Burnout',
      icon: <ShieldCheck className="w-5 h-5 text-[#FF4D4D]" />,
      desc: 'Regra dos 2 minutos, 5 segundos, Técnica Pomodoro 25/5 e Matriz 1-3-5 diária.',
      count: ROUTINE_TEMPLATES.antiburnout.length
    }
  ];

  const handleImportClick = (k: keyof typeof ROUTINE_TEMPLATES) => {
    triggerHaptic(true);
    triggerSound('celebrate', true);
    onImport(k);
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
          >
            <div className="p-4 bg-[#222222] border-b border-[#2A2A2A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C8FF00]" />
                <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">Templates Pré-Prontos</h3>
              </div>
              <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto">
              <p className="text-xs text-gray-400 mb-2">Importe rotinas testadas e estruturadas direto no seu Room Database com 1 toque:</p>

              {list.map(t => (
                <div
                  key={t.key}
                  onClick={() => handleImportClick(t.key)}
                  className="p-4 bg-[#222222] hover:bg-[#2a2a2a] border border-[#2A2A2A] hover:border-[#C8FF00]/50 rounded-2xl cursor-pointer transition-all flex items-start gap-3.5 group"
                >
                  <div className="p-2.5 bg-[#1A1A1A] rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                    {t.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white truncate">{t.title}</h4>
                      <span className="text-[10px] font-mono bg-[#1A1A1A] text-gray-400 px-2 py-0.5 rounded-full font-bold">
                        +{t.count} tarefas
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{t.desc}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C8FF00] mt-2 group-hover:underline">
                      <Download className="w-3 h-3" /> Importar com 1 toque
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
