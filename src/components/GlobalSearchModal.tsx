import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, CheckCircle2, Circle, ArrowDownRight, ArrowUpRight, Utensils, Calendar } from 'lucide-react';
import { AppDatabase, TabType } from '../types';

interface GlobalSearchModalProps {
  show: boolean;
  db: AppDatabase;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ show, db, onClose, onNavigateTab }) => {
  const [query, setQuery] = useState('');

  const q = query.toLowerCase().trim();

  const matchedTasks = q ? db.tasks.filter(t => t.title.toLowerCase().includes(q) || t.notes?.toLowerCase().includes(q)) : [];
  const matchedTx = q ? db.transactions.filter(tx => tx.description.toLowerCase().includes(q)) : [];
  const matchedMeals = q ? db.meals.filter(m => m.description?.toLowerCase().includes(q) || m.slot.toLowerCase().includes(q)) : [];

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
          >
            {/* Search Bar */}
            <div className="p-4 border-b border-[#2A2A2A] flex items-center gap-3 bg-[#222222]">
              <Search className="w-5 h-5 text-[#C8FF00]" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar tarefas, gastos, refeições..."
                autoFocus
                className="bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none flex-1 font-medium"
              />
              {query && (
                <button onClick={() => setQuery('')} className="p-1 text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button onClick={onClose} className="text-xs font-bold text-gray-400 hover:text-white px-2 py-1 bg-[#1A1A1A] rounded-lg">
                ESC
              </button>
            </div>

            {/* Results */}
            <div className="overflow-y-auto p-4 flex-1 space-y-4">
              {!q && (
                <div className="text-center py-10 text-gray-500 text-xs">
                  Digite algo para buscar no banco local Room Database...
                </div>
              )}

              {q && matchedTasks.length === 0 && matchedTx.length === 0 && matchedMeals.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">
                  Nenhum resultado encontrado para "<span className="text-white font-bold">{query}</span>".
                </div>
              )}

              {matchedTasks.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#C8FF00] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Tarefas ({matchedTasks.length})
                  </h4>
                  <div className="space-y-2">
                    {matchedTasks.map(t => (
                      <div
                        key={t.id}
                        onClick={() => { onNavigateTab('routine'); onClose(); }}
                        className="p-3 bg-[#222222] hover:bg-[#2a2a2a] rounded-xl flex items-center gap-3 cursor-pointer transition-colors"
                      >
                        {t.completed ? <CheckCircle2 className="w-4 h-4 text-[#C8FF00] shrink-0" /> : <Circle className="w-4 h-4 text-gray-400 shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${t.completed ? 'line-through text-gray-400' : 'text-white'}`}>{t.title}</p>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wide bg-[#1A1A1A] px-1.5 py-0.5 rounded">{t.priority}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedTx.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#4DA6FF] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    Gastos e Entradas ({matchedTx.length})
                  </h4>
                  <div className="space-y-2">
                    {matchedTx.map(tx => (
                      <div
                        key={tx.id}
                        onClick={() => { onNavigateTab('finance'); onClose(); }}
                        className="p-3 bg-[#222222] hover:bg-[#2a2a2a] rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {tx.type === 'entrada' ? <ArrowDownRight className="w-4 h-4 text-[#C8FF00] shrink-0" /> : <ArrowUpRight className="w-4 h-4 text-[#FF4D4D] shrink-0" />}
                          <p className="text-sm font-medium text-white truncate">{tx.description}</p>
                        </div>
                        <span className={`text-sm font-mono font-bold shrink-0 ${tx.type === 'entrada' ? 'text-[#C8FF00]' : 'text-[#FF4D4D]'}`}>
                          {tx.type === 'entrada' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedMeals.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#FF4D4D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5" />
                    Refeições ({matchedMeals.length})
                  </h4>
                  <div className="space-y-2">
                    {matchedMeals.map(m => (
                      <div
                        key={m.id}
                        onClick={() => { onNavigateTab('meals'); onClose(); }}
                        className="p-3 bg-[#222222] hover:bg-[#2a2a2a] rounded-xl flex flex-col gap-1 cursor-pointer transition-colors"
                      >
                        <span className="text-xs font-bold text-[#C8FF00]">{m.slot}</span>
                        <p className="text-sm text-gray-200">{m.description || 'Registrado'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
