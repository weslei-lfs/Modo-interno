import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, DollarSign, Tag, Calendar, AlignLeft, ArrowDownRight, ArrowUpRight, ArrowLeftRight } from 'lucide-react';
import { Category, TransactionItem } from '../types';
import { triggerHaptic } from '../lib/storage';

interface TransactionModalProps {
  show: boolean;
  categories: Category[];
  currency: string;
  onSave: (tx: Omit<TransactionItem, 'id'>) => void;
  onClose: () => void;
}

const TODAY_STR = new Date().toISOString().split('T')[0];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  show,
  categories,
  currency,
  onSave,
  onClose,
}) => {
  const [type, setType] = useState<'entrada' | 'saida' | 'transferencia'>('saida');
  const [amountStr, setAmountStr] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(TODAY_STR);
  const [description, setDescription] = useState('');
  const [repeat, setRepeat] = useState<'unica' | 'mensal' | 'semanal'>('unica');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amountStr.replace(',', '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    if (!description.trim()) return;

    triggerHaptic(true);
    onSave({
      type,
      amount: parsedAmount,
      categoryId: categoryId || categories[0]?.id || 'cat_f_outros',
      date,
      description: description.trim(),
      repeat,
    });
    setAmountStr('');
    setDescription('');
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
              <h3 className="font-display font-extrabold text-base text-white">
                Novo Lançamento
              </h3>
              <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-lg bg-[#1A1A1A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
              {/* Type Tabs */}
              <div className="grid grid-cols-3 gap-2 bg-[#222222] p-1 rounded-xl">
                {[
                  { id: 'saida', label: 'Saída', icon: <ArrowUpRight className="w-3.5 h-3.5" />, color: '#FF4D4D' },
                  { id: 'entrada', label: 'Entrada', icon: <ArrowDownRight className="w-3.5 h-3.5" />, color: '#C8FF00' },
                  { id: 'transferencia', label: 'Transf.', icon: <ArrowLeftRight className="w-3.5 h-3.5" />, color: '#4DA6FF' },
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id as typeof type)}
                    className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${type === t.id ? 'bg-[#1A1A1A] text-white shadow-md ring-1 ring-white/20' : 'text-gray-400 hover:text-white'}`}
                  >
                    <span style={{ color: type === t.id ? t.color : undefined }}>{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Valor</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-lg font-mono font-bold text-gray-400">{currency}</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    autoFocus
                    value={amountStr}
                    onChange={e => setAmountStr(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-3.5 bg-[#222222] border border-[#2A2A2A] rounded-2xl text-white text-2xl font-mono font-bold focus:border-[#4DA6FF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Descrição</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ex: Almoço no mercado, Salário, Uber..."
                  className="w-full p-3 bg-[#222222] border border-[#2A2A2A] rounded-xl text-white text-sm focus:border-[#4DA6FF] focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[#FF4D4D]" /> Categoria
                  </label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full p-3 bg-[#222222] border border-[#2A2A2A] rounded-xl text-white text-xs focus:border-[#4DA6FF] focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#4DA6FF]" /> Data
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full p-3 bg-[#222222] border border-[#2A2A2A] rounded-xl text-white text-xs font-mono focus:border-[#4DA6FF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Repetição</label>
                <select
                  value={repeat}
                  onChange={e => setRepeat(e.target.value as typeof repeat)}
                  className="w-full p-3 bg-[#222222] border border-[#2A2A2A] rounded-xl text-white text-xs focus:border-[#4DA6FF] focus:outline-none"
                >
                  <option value="unica">Lançamento Único</option>
                  <option value="mensal">Fixo Mensal</option>
                  <option value="semanal">Fixo Semanal</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#4DA6FF] hover:bg-[#3399ff] text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all uppercase tracking-wider"
              >
                <Check className="w-4 h-4 stroke-[3]" /> Registrar Transação
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
