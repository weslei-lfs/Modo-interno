import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Clock, Tag, Flag, Repeat, AlignLeft } from 'lucide-react';
import { TaskItem, Category, PriorityType, RepeatType } from '../types';
import { triggerHaptic } from '../lib/storage';

interface TaskModalProps {
  show: boolean;
  taskToEdit?: TaskItem | null;
  categories: Category[];
  defaultPeriod: 'diario' | 'semanal' | 'mensal';
  onSave: (taskData: Omit<TaskItem, 'id' | 'dateCreated' | 'completed'>) => void;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  show,
  taskToEdit,
  categories,
  defaultPeriod,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState<'diario' | 'semanal' | 'mensal'>(defaultPeriod);
  const [categoryId, setCategoryId] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState<PriorityType>('NORMAL');
  const [notes, setNotes] = useState('');
  const [repeat, setRepeat] = useState<RepeatType>('diaria');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setPeriod(taskToEdit.period);
      setCategoryId(taskToEdit.categoryId);
      setTime(taskToEdit.time || '');
      setPriority(taskToEdit.priority);
      setNotes(taskToEdit.notes || '');
      setRepeat(taskToEdit.repeat);
    } else {
      setTitle('');
      setPeriod(defaultPeriod);
      setCategoryId(categories[0]?.id || '');
      setTime('');
      setPriority('NORMAL');
      setNotes('');
      setRepeat('diaria');
    }
  }, [taskToEdit, defaultPeriod, categories, show]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    triggerHaptic(true);
    onSave({
      title: title.trim(),
      period,
      categoryId: categoryId || categories[0]?.id || 'cat_r_casa',
      time: time || undefined,
      priority,
      notes: notes.trim() || undefined,
      repeat,
    });
    onClose();
  };

  const priorities: { id: PriorityType; color: string; label: string }[] = [
    { id: 'URGENTE', color: '#FF4D4D', label: '🔴 Urgente' },
    { id: 'IMPORTANTE', color: '#FFB84D', label: '🟡 Importante' },
    { id: 'NORMAL', color: '#C8FF00', label: '🟢 Normal' },
    { id: 'BAIXA', color: '#AAAAAA', label: '⚪ Baixa' },
  ];

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="bg-[#1A1A1A] border-t sm:border border-[#2A2A2A] rounded-t-[24px] sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-4 bg-[#222222] border-b border-[#2A2A2A] flex items-center justify-between">
              <h3 className="font-display font-extrabold text-base text-white">
                {taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa de Rotina'}
              </h3>
              <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-lg bg-[#1A1A1A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">O que deve ser feito?</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ex: Treino físico, Beber água, Focar no projeto..."
                  className="w-full p-3.5 bg-[#222222] border border-[#2A2A2A] rounded-xl text-white text-sm focus:border-[#C8FF00] focus:outline-none font-medium"
                />
              </div>

              {/* Tabs Periodo */}
              <div className="grid grid-cols-3 gap-2 bg-[#222222] p-1 rounded-xl">
                {(['diario', 'semanal', 'mensal'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={`py-2 text-xs font-bold rounded-lg capitalize transition-all ${period === p ? 'bg-[#C8FF00] text-[#0D0D0D]' : 'text-gray-400 hover:text-white'}`}
                  >
                    {p === 'diario' ? 'Diário' : p === 'semanal' ? 'Semanal' : 'Mensal'}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[#4DA6FF]" /> Categoria
                  </label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full p-3 bg-[#222222] border border-[#2A2A2A] rounded-xl text-white text-xs focus:border-[#C8FF00] focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#C8FF00]" /> Horário (Opcional)
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full p-3 bg-[#222222] border border-[#2A2A2A] rounded-xl text-white text-xs font-mono focus:border-[#C8FF00] focus:outline-none"
                  />
                </div>
              </div>

              {/* Prioridade */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Flag className="w-3 h-3 text-[#FF4D4D]" /> Prioridade
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {priorities.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPriority(p.id)}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border text-left flex items-center gap-1.5 transition-all ${priority === p.id ? 'border-[#C8FF00] bg-[#222222] text-white' : 'border-[#2A2A2A] bg-[#1A1A1A] text-gray-400'}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Repetição */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Repeat className="w-3 h-3 text-[#FFB84D]" /> Repetição
                </label>
                <select
                  value={repeat}
                  onChange={e => setRepeat(e.target.value as RepeatType)}
                  className="w-full p-3 bg-[#222222] border border-[#2A2A2A] rounded-xl text-white text-xs focus:border-[#C8FF00] focus:outline-none"
                >
                  <option value="diaria">Todos os dias</option>
                  <option value="semanal">Toda semana</option>
                  <option value="mensal">Todo mês</option>
                  <option value="unica">Apenas uma vez</option>
                </select>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <AlignLeft className="w-3 h-3 text-gray-300" /> Notas / Detalhes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Instruções ou links adicionais..."
                  className="w-full p-3 bg-[#222222] border border-[#2A2A2A] rounded-xl text-white text-xs focus:border-[#C8FF00] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#C8FF00] hover:bg-[#b3e600] text-[#0D0D0D] font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                {taskToEdit ? 'SALVAR ALTERAÇÕES' : 'CRIAR TAREFA'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
