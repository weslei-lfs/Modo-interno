import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Tag, Calendar, RefreshCw, AlertTriangle, ArrowUpRight, ArrowDownRight, Target, ShoppingCart, CheckCircle2, Circle, DollarSign, PieChart, TrendingUp, Sparkles, FolderPlus } from 'lucide-react';
import { AppDatabase, TransactionItem, Category, FinancialGoal, ShoppingItem } from '../types';
import { triggerHaptic, triggerSound, SPENDING_TRAPS, SMART_GROCERY_SUGGESTIONS } from '../lib/storage';
import { TransactionModal } from './TransactionModal';
import { CategoryModal, renderCategoryIcon } from './CategoryModal';

interface FinanceTabProps {
  db: AppDatabase;
  onSaveTransaction: (tx: Omit<TransactionItem, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
  onSaveFinanceCategory: (cat: Omit<Category, 'id'>) => void;
  onAddGoalAporte: (goalId: string, amount: number) => void;
  onToggleShoppingItem: (itemId: string) => void;
  onAddShoppingItem: (name: string, price?: number) => void;
  onDeleteShoppingItem: (itemId: string) => void;
}

export const FinanceTab: React.FC<FinanceTabProps> = ({
  db,
  onSaveTransaction,
  onDeleteTransaction,
  onSaveFinanceCategory,
  onAddGoalAporte,
  onToggleShoppingItem,
  onAddShoppingItem,
  onDeleteShoppingItem,
}) => {
  const [subTab, setSubTab] = useState<'geral' | 'lancamentos' | 'metas' | 'compras'>('geral');
  const [trapIdx, setTrapIdx] = useState(0);
  
  const [showTxModal, setShowTxModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);

  const [newShopName, setNewShopName] = useState('');
  const [newShopPrice, setNewShopPrice] = useState('');

  const [aporteGoalId, setAporteGoalId] = useState<string | null>(null);
  const [aporteValue, setAporteValue] = useState('');

  const now = new Date();
  const currentMonthPrefix = now.toISOString().slice(0, 7); // YYYY-MM

  const monthTx = db.transactions.filter(tx => tx.date.startsWith(currentMonthPrefix));
  const totalEntradas = monthTx.filter(tx => tx.type === 'entrada').reduce((a, b) => a + b.amount, 0);
  const totalSaidas = monthTx.filter(tx => tx.type === 'saida').reduce((a, b) => a + b.amount, 0);
  const saldoMes = totalEntradas - totalSaidas;

  const totalBudgetLimit = db.budgets.reduce((a, b) => a + b.limitAmount, 0) || 1600;
  const budgetSpentPercent = Math.round((totalSaidas / totalBudgetLimit) * 100);

  const rotateTrap = () => {
    triggerHaptic(true);
    setTrapIdx((trapIdx + 1) % SPENDING_TRAPS.length);
  };

  const handleShopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopName.trim()) return;
    const p = parseFloat(newShopPrice.replace(',', '.'));
    onAddShoppingItem(newShopName.trim(), isNaN(p) ? undefined : p);
    setNewShopName('');
    setNewShopPrice('');
  };

  const handleAporteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aporteGoalId) return;
    const val = parseFloat(aporteValue.replace(',', '.'));
    if (isNaN(val) || val <= 0) return;
    onAddGoalAporte(aporteGoalId, val);
    setAporteGoalId(null);
    setAporteValue('');
  };

  const totalShopEst = db.shoppingList.reduce((acc, item) => acc + (item.estimatedPrice || 0), 0);

  return (
    <div className="p-5 space-y-6 pb-28 min-h-full relative">
      {/* Sub Tabs Top */}
      <div className="grid grid-cols-4 gap-1 bg-[#1A1A1A] p-1 rounded-2xl border border-[#2A2A2A]">
        {[
          { id: 'geral', label: 'Visão' },
          { id: 'lancamentos', label: 'Extrato' },
          { id: 'metas', label: 'Metas' },
          { id: 'compras', label: 'Lista' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { triggerHaptic(true); setSubTab(t.id as typeof subTab); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${subTab === t.id ? 'bg-[#4DA6FF] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === 'geral' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Big Balance Box Centralized */}
          <div className="p-6 bg-gradient-to-b from-[#1A1A1A] to-[#222222] border border-[#2A2A2A] rounded-3xl text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4DA6FF]/10 rounded-full blur-3xl pointer-events-none" />
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Saldo do Mês</span>
            <h2 className="text-4xl font-mono font-black text-white mt-1 tracking-tight">
              {db.settings.currency} {saldoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>

            {/* Monthly Budget Progress Bar */}
            <div className="mt-6 text-left">
              <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                <span className="text-gray-400">Orçamento Mensal</span>
                <span className={`font-bold ${budgetSpentPercent >= 100 ? 'text-[#FF4D4D]' : budgetSpentPercent >= 80 ? 'text-[#FFB84D]' : 'text-[#4DA6FF]'}`}>
                  {budgetSpentPercent}% ({db.settings.currency} {totalSaidas.toFixed(0)}/{totalBudgetLimit})
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#121212] rounded-full overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, budgetSpentPercent)}%` }}
                  className={`h-full rounded-full ${budgetSpentPercent >= 100 ? 'bg-[#FF4D4D]' : budgetSpentPercent >= 80 ? 'bg-[#FFB84D]' : 'bg-[#4DA6FF]'}`}
                />
              </div>
            </div>

            {/* Resumo Cards Grid */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-[#2A2A2A]/60">
              <div className="text-left">
                <span className="text-[10px] text-gray-400 block flex items-center gap-1">
                  <ArrowDownRight className="w-3 h-3 text-[#C8FF00]" /> Entradas
                </span>
                <p className="text-sm font-mono font-bold text-[#C8FF00] mt-0.5">+{totalEntradas.toFixed(0)}</p>
              </div>
              <div className="text-left">
                <span className="text-[10px] text-gray-400 block flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3 text-[#FF4D4D]" /> Saídas
                </span>
                <p className="text-sm font-mono font-bold text-[#FF4D4D] mt-0.5">-{totalSaidas.toFixed(0)}</p>
              </div>
              <div className="text-left">
                <span className="text-[10px] text-gray-400 block">Previsto</span>
                <p className="text-sm font-mono font-bold text-gray-300 mt-0.5">{saldoMes.toFixed(0)}</p>
              </div>
            </div>
          </div>

          {/* Budget By Category */}
          <div className="p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-display font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#4DA6FF]" /> Gastos por Categoria
              </h3>
              <button onClick={() => setShowCatModal(true)} className="text-[10px] text-[#4DA6FF] font-bold hover:underline">
                +Categoria
              </button>
            </div>

            <div className="space-y-3">
              {db.financeCategories.slice(0, 5).map(cat => {
                const spent = monthTx.filter(tx => tx.categoryId === cat.id && tx.type === 'saida').reduce((a, b) => a + b.amount, 0);
                const limit = db.budgets.find(b => b.categoryId === cat.id)?.limitAmount || 300;
                const pct = Math.round((spent / limit) * 100);

                return (
                  <div key={cat.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="flex items-center gap-1.5 text-gray-200">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: cat.color }} />
                        {cat.name}
                      </span>
                      <span className="font-mono text-gray-400">R$ {spent.toFixed(0)} / {limit}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#222222] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, pct)}%`, backgroundColor: pct >= 100 ? '#FF4D4D' : pct >= 80 ? '#FFB84D' : cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Armadilha de Gastos Educational */}
          <div className="p-5 bg-[#222222] border-l-4 border-[#FF4D4D] rounded-2xl relative overflow-hidden flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#FF4D4D] uppercase tracking-widest block mb-1">Armadilha de Gastos</span>
              <p className="text-xs font-medium text-gray-200 italic leading-relaxed">
                "{SPENDING_TRAPS[trapIdx]}"
              </p>
            </div>
            <button onClick={rotateTrap} className="p-2 bg-[#1A1A1A] hover:bg-gray-700 rounded-xl text-gray-400 hover:text-white shrink-0">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {subTab === 'lancamentos' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex justify-between items-center text-xs font-mono text-gray-400">
            <span>{db.transactions.length} LANÇAMENTOS REGISTRADOS</span>
            <button onClick={() => setShowTxModal(true)} className="text-[#4DA6FF] font-bold">+ NOVO LANÇAMENTO</button>
          </div>

          {db.transactions.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-xs bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A]">
              Nenhuma transação registrada ainda no Room DB! Toque no <strong className="text-white">+</strong> para registrar.
            </div>
          ) : (
            <div className="space-y-2">
              {db.transactions.map(tx => {
                const cat = db.financeCategories.find(c => c.id === tx.categoryId);
                return (
                  <div
                    key={tx.id}
                    className="p-3.5 bg-[#1A1A1A] hover:bg-[#222222] border border-[#2A2A2A] rounded-2xl flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl ${tx.type === 'entrada' ? 'bg-[#C8FF00]/15 text-[#C8FF00]' : 'bg-[#FF4D4D]/15 text-[#FF4D4D]'}`}>
                        {tx.type === 'entrada' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{tx.description}</p>
                        <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1 mt-0.5">
                          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: cat?.color || '#AAAAAA' }} />
                          {cat?.name || 'Outros'} • {tx.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-sm font-mono font-extrabold ${tx.type === 'entrada' ? 'text-[#C8FF00]' : 'text-[#FF4D4D]'}`}>
                        {tx.type === 'entrada' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="p-1.5 text-gray-500 hover:text-[#FF4D4D] opacity-0 group-hover:opacity-100 transition-opacity bg-[#222222] rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {subTab === 'metas' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-display font-bold uppercase tracking-wider text-gray-300">Metas Futuras</h3>
            <span className="text-[10px] font-mono text-gray-500">Aportes Manuais</span>
          </div>

          {db.financialGoals.map(g => {
            const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
            const remaining = g.targetAmount - g.currentAmount;
            const avgMonthlySaved = 400; // estimated rhythm
            const estMonths = Math.ceil(remaining / avgMonthlySaved);

            return (
              <div key={g.id} className="p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl space-y-3 shadow-lg relative">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono bg-[#222222] text-[#C8FF00] px-2 py-0.5 rounded uppercase">Prazo: {g.deadline}</span>
                    <h4 className="text-base font-display font-bold text-white mt-1">{g.name}</h4>
                  </div>
                  <span className="text-xl font-mono font-black text-[#C8FF00]">{pct}%</span>
                </div>

                <div className="w-full h-3 bg-[#222222] rounded-full overflow-hidden p-0.5">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-full bg-[#C8FF00] rounded-full shadow-[0_0_10px_#C8FF00]" />
                </div>

                <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
                  <span>R$ {g.currentAmount.toFixed(2)} de {g.targetAmount.toFixed(2)}</span>
                  <button
                    onClick={() => setAporteGoalId(g.id)}
                    className="px-3 py-1 bg-[#4DA6FF] hover:bg-[#3399ff] text-white font-bold rounded-xl text-xs active:scale-95 transition-transform"
                  >
                    + Aportar
                  </button>
                </div>

                <p className="text-[11px] text-gray-400 italic bg-[#222222] p-2 rounded-xl flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#4DA6FF]" />
                  Com o ritmo atual de economia, você atingirá a meta em aproximadamente <strong className="text-white">{estMonths} meses</strong>.
                </p>
              </div>
            );
          })}

          {/* Modal Aporte */}
          <AnimatePresence>
            {aporteGoalId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#4DA6FF] max-w-sm w-full space-y-4">
                  <h4 className="font-display font-bold text-white text-base">Registrar Aporte na Meta</h4>
                  <form onSubmit={handleAporteSubmit} className="space-y-4">
                    <input
                      type="number"
                      step="0.01"
                      required
                      autoFocus
                      value={aporteValue}
                      onChange={e => setAporteValue(e.target.value)}
                      placeholder="Valor em R$..."
                      className="w-full p-3.5 bg-[#222222] border rounded-xl text-white font-mono text-lg focus:border-[#4DA6FF] focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 py-3 bg-[#4DA6FF] text-white font-bold rounded-xl text-xs uppercase">Confirmar Aporte</button>
                      <button type="button" onClick={() => setAporteGoalId(null)} className="px-4 py-3 bg-[#222222] text-gray-400 rounded-xl text-xs font-bold">Cancelar</button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {subTab === 'compras' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingCart className="w-4 h-4 text-[#C8FF00]" /> Lista Inteligente no Mercado
              </h3>
              <p className="text-[11px] text-gray-400 font-mono mt-0.5">Estimativa Total: <strong className="text-[#C8FF00]">R$ {totalShopEst.toFixed(2)}</strong></p>
            </div>
          </div>

          {/* Add Item Form */}
          <form onSubmit={handleShopSubmit} className="flex gap-2">
            <input
              type="text"
              value={newShopName}
              onChange={e => setNewShopName(e.target.value)}
              placeholder="Adicionar item (ex: Aveia, Azeite)..."
              className="flex-1 p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-white text-xs focus:border-[#C8FF00] focus:outline-none"
            />
            <input
              type="number"
              step="0.1"
              value={newShopPrice}
              onChange={e => setNewShopPrice(e.target.value)}
              placeholder="R$ est."
              className="w-20 p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-white text-xs font-mono focus:border-[#C8FF00] focus:outline-none"
            />
            <button type="submit" className="px-4 py-3 bg-[#C8FF00] text-[#0D0D0D] font-bold rounded-xl text-xs uppercase">+Add</button>
          </form>

          {/* Sugestões Automáticas Inteligentes */}
          <div>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-2">Sugestões Econômicas Base 1 toque:</span>
            <div className="flex flex-wrap gap-1.5">
              {SMART_GROCERY_SUGGESTIONS.map(sg => (
                <button
                  key={sg.name}
                  type="button"
                  onClick={() => { triggerHaptic(true); onAddShoppingItem(sg.name, 12.00); }}
                  className="px-2.5 py-1 bg-[#222222] hover:bg-[#2a2a2a] border border-[#2A2A2A] text-gray-300 text-[11px] font-medium rounded-lg flex items-center gap-1 active:scale-95 transition-all"
                >
                  + {sg.name}
                </button>
              ))}
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-2 pt-2">
            {db.shoppingList.map(item => (
              <div
                key={item.id}
                onClick={() => onToggleShoppingItem(item.id)}
                className={`p-3.5 bg-[#1A1A1A] hover:bg-[#222222] border rounded-xl flex items-center justify-between cursor-pointer transition-colors group ${item.checked ? 'border-gray-800 opacity-60 line-through' : 'border-[#2A2A2A]'}`}
              >
                <div className="flex items-center gap-3">
                  {item.checked ? <CheckCircle2 className="w-5 h-5 text-[#C8FF00]" /> : <Circle className="w-5 h-5 text-gray-400" />}
                  <span className="text-sm font-medium text-white">{item.name} <span className="text-xs text-gray-500 font-normal font-mono">({item.quantity})</span></span>
                </div>
                <div className="flex items-center gap-3">
                  {item.estimatedPrice && <span className="text-xs font-mono text-gray-400">R$ {item.estimatedPrice.toFixed(2)}</span>}
                  <button onClick={(e) => { e.stopPropagation(); onDeleteShoppingItem(item.id); }} className="text-gray-500 hover:text-[#FF4D4D] p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* FAB Floating Action Button to Add Tx */}
      <button
        onClick={() => setShowTxModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#4DA6FF] hover:bg-[#3399ff] text-white rounded-2xl shadow-[0_4px_25px_rgba(77,166,255,0.4)] flex items-center justify-center active:scale-90 transition-all z-40 border-2 border-[#0D0D0D]"
        aria-label="Nova Transação"
      >
        <Plus className="w-7 h-7 stroke-[3]" />
      </button>

      <TransactionModal
        show={showTxModal}
        categories={db.financeCategories}
        currency={db.settings.currency}
        onSave={onSaveTransaction}
        onClose={() => setShowTxModal(false)}
      />

      <CategoryModal
        show={showCatModal}
        type="finance"
        onSave={onSaveFinanceCategory}
        onClose={() => setShowCatModal(false)}
      />
    </div>
  );
};
