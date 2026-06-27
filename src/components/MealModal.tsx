import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Utensils, Smile, Meh, Frown, Clock, AlignLeft } from 'lucide-react';
import { MealSlot } from '../types';
import { triggerHaptic } from '../lib/storage';

interface MealModalProps {
  show: boolean;
  slotName: MealSlot['slot'];
  existingSlot?: MealSlot | null;
  onSave: (data: Omit<MealSlot, 'id' | 'date'>) => void;
  onClose: () => void;
}

export const MealModal: React.FC<MealModalProps> = ({
  show,
  slotName,
  existingSlot,
  onSave,
  onClose,
}) => {
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState<'saudavel' | 'regular' | 'pouco_saudavel'>('saudavel');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (existingSlot) {
      setDescription(existingSlot.description || '');
      setRating(existingSlot.rating || 'saudavel');
      setNotes(existingSlot.notes || '');
    } else {
      setDescription('');
      setRating('saudavel');
      setNotes('');
    }
  }, [existingSlot, show]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    triggerHaptic(true);
    const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    onSave({
      slot: slotName,
      description: description.trim(),
      rating,
      notes: notes.trim() || undefined,
      timeLogged: existingSlot?.timeLogged || nowTime,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="bg-[#1A1A1A] border-t sm:border border-[#2A2A2A] rounded-t-[24px] sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-4 bg-[#222222] border-b border-[#2A2A2A] flex items-center justify-between">
              <h3 className="font-display font-extrabold text-base text-white flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#FF4D4D]" /> Registrar {slotName}
              </h3>
              <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-lg bg-[#1A1A1A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">O que você comeu / bebeu?</label>
                <textarea
                  rows={3}
                  required
                  autoFocus
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ex: Arroz, feijão, frango grelhado e salada verde com azeite..."
                  className="w-full p-3.5 bg-[#222222] border border-[#2A2A2A] rounded-xl text-white text-sm focus:border-[#FF4D4D] focus:outline-none resize-none font-medium leading-relaxed"
                />
              </div>

              {/* Avaliação da refeição */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Avaliação Nutricional</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'saudavel', label: '😊 Saudável', color: '#C8FF00' },
                    { id: 'regular', label: '😐 Regular', color: '#FFB84D' },
                    { id: 'pouco_saudavel', label: '😬 Pouco Saud.', color: '#FF4D4D' },
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRating(r.id as typeof rating)}
                      className={`py-3 px-2 text-xs font-bold rounded-xl border text-center transition-all ${rating === r.id ? 'bg-[#222222] text-white shadow-md ring-1 ring-white/30' : 'bg-[#1A1A1A] text-gray-400 border-[#2A2A2A]'}`}
                      style={{ borderColor: rating === r.id ? r.color : undefined }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <AlignLeft className="w-3 h-3 text-gray-300" /> Notas ou Receita
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Ex: Fiz em 15 minutos, estava ótimo..."
                  className="w-full p-3 bg-[#222222] border border-[#2A2A2A] rounded-xl text-white text-xs focus:border-[#FF4D4D] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#FF4D4D] hover:bg-[#e60000] text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all uppercase tracking-wider"
              >
                <Check className="w-4 h-4 stroke-[3]" /> Registrar Refeição
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
