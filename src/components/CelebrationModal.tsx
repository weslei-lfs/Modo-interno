import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Share2, X, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerSound, triggerHaptic } from '../lib/storage';

interface CelebrationModalProps {
  show: boolean;
  userName: string;
  onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({ show, userName, onClose }) => {
  useEffect(() => {
    if (show) {
      triggerSound('celebrate', true);
      triggerHaptic(true);

      // Launch confetti
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#C8FF00', '#4DA6FF', '#FF4D4D', '#FFFFFF']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#C8FF00', '#4DA6FF', '#FF4D4D', '#FFFFFF']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [show]);

  const handleShare = () => {
    const text = `🔥 MODO INTERNO ATIVADO! Hoje eu (${userName}) dominei 100% da minha rotina e minhas metas diárias. Disciplina é liberdade. #ModoInterno`;
    if (navigator.share) {
      navigator.share({
        title: 'Conquista Modo Interno',
        text: text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Texto da conquista copiado para a área de transferência! Cole no WhatsApp ou Instagram.');
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-[#1A1A1A] border-2 border-[#C8FF00] rounded-3xl p-6 max-w-sm w-full text-center relative overflow-hidden shadow-[0_0_60px_rgba(200,255,0,0.3)]"
          >
            {/* Background glowing orb */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#C8FF00]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#4DA6FF]/20 rounded-full blur-3xl" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-[#222222] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 mx-auto mt-2 mb-4 bg-[#C8FF00]/10 border border-[#C8FF00] rounded-full flex items-center justify-center relative">
              <Trophy className="w-10 h-10 text-[#C8FF00] animate-bounce" />
              <Sparkles className="w-5 h-5 text-[#4DA6FF] absolute -top-1 -right-1 animate-pulse" />
            </div>

            <span className="px-3 py-1 bg-[#C8FF00] text-[#0D0D0D] text-xs font-extrabold rounded-full tracking-widest uppercase inline-block mb-3">
              100% Concluído
            </span>

            <h2 className="text-2xl font-display font-extrabold text-white tracking-tight mb-2">
              MODO INTERNO ATIVADO.
            </h2>

            <p className="text-sm text-gray-300 font-medium mb-6">
              Parabéns, <span className="text-[#C8FF00] font-bold">{userName}</span>! Você dominou o dia e bateu todas as metas da sua rotina diária.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleShare}
                className="w-full py-3.5 px-4 bg-[#C8FF00] hover:bg-[#b3e600] text-[#0D0D0D] font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
              >
                <Share2 className="w-4 h-4" />
                Compartilhar Conquista
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-[#222222] hover:bg-[#2a2a2a] text-gray-300 font-medium text-sm rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-[#C8FF00]" />
                Continuar Dominando
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
