import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Droplets, BookOpen, Sparkles, CheckCircle2, Circle, ChevronDown, ChevronUp, AlertTriangle, ShieldAlert, Plus, Check } from 'lucide-react';
import { AppDatabase, MealSlot, MealGoal } from '../types';
import { triggerHaptic, triggerSound, BASE_COOKING_GUIDE } from '../lib/storage';
import { MealModal } from './MealModal';

interface MealsTabProps {
  db: AppDatabase;
  onLogMeal: (meal: Omit<MealSlot, 'id' | 'date'>) => void;
  onAddWaterCup: () => void;
  onToggleMealGoal: (id: string) => void;
  onIncrementDelivery: () => void;
  onResetDelivery: () => void;
}

const MEAL_SLOTS_LIST: MealSlot['slot'][] = [
  'Café da manhã',
  'Lanche manhã',
  'Almoço',
  'Lanche tarde',
  'Jantar'
];

const LIFE_EASIER_TIPS = [
  { title: '🧄 Alho Triturado Congelado', desc: 'Bata 500g de alho no processador com um fio de azeite e congele em pote. Salva 5 minutos por refeição.' },
  { title: '🥦 Legumes Congelados', desc: 'Brócolis, couve-flor e seleta congelados não estragam na gaveta e vão direto para a frigideira quente.' },
  { title: '🥘 Batch Cooking Semanal', desc: 'Cozinhe feijão e carne moída/frango desfiado em grande quantidade no domingo. Congele em potes individuais.' },
  { title: '🔁 Comer Repetido Sem Culpa', desc: 'Não tente inventar 14 pratos gourmet diferentes por semana. Ter 2 ou 3 refeições padrão é o segredo da elite.' }
];

export const MealsTab: React.FC<MealsTabProps> = ({
  db,
  onLogMeal,
  onAddWaterCup,
  onToggleMealGoal,
  onIncrementDelivery,
  onResetDelivery,
}) => {
  const [subTab, setSubTab] = useState<'refeicoes' | 'guia' | 'habitos'>('refeicoes');
  const [expandedGuideIdx, setExpandedGuideIdx] = useState<number | null>(0);

  const [activeModalSlot, setActiveModalSlot] = useState<MealSlot['slot'] | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = db.meals.filter(m => m.date === todayStr);

  const waterLogged = db.waterLoggedToday || 0;
  const waterGoal = db.settings.waterGoal || 8;
  const waterPercent = Math.min(100, Math.round((waterLogged / waterGoal) * 100));

  const isDeliveryWarning = db.deliveryCountThisWeek >= db.settings.deliveryLimit;

  return (
    <div className="p-5 space-y-6 pb-28 min-h-full relative">
      {/* Sub Tabs Top */}
      <div className="grid grid-cols-3 gap-1 bg-[#1A1A1A] p-1 rounded-2xl border border-[#2A2A2A]">
        {[
          { id: 'refeicoes', label: 'Refeições Hoje' },
          { id: 'guia', label: 'Guia 5 Bases' },
          { id: 'habitos', label: 'Água e Metas' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { triggerHaptic(true); setSubTab(t.id as typeof subTab); }}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all ${subTab === t.id ? 'bg-[#FF4D4D] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === 'refeicoes' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex justify-between items-center text-xs font-mono text-gray-400">
            <span>5 SLOTS DIÁRIOS NATIVOS</span>
            <span className="text-[#C8FF00] font-bold">{todayMeals.length}/5 REGISTRADOS</span>
          </div>

          {/* Slots List */}
          <div className="space-y-3">
            {MEAL_SLOTS_LIST.map(slotName => {
              const logged = todayMeals.find(m => m.slot === slotName);
              const isLogged = !!logged;

              const ratingEmoji = logged?.rating === 'saudavel' ? '😊 Saudável' : logged?.rating === 'regular' ? '😐 Regular' : logged?.rating === 'pouco_saudavel' ? '😬 Pouco Saudável' : '';

              return (
                <div
                  key={slotName}
                  onClick={() => { triggerHaptic(true); setActiveModalSlot(slotName); }}
                  className={`p-4 bg-[#1A1A1A] hover:bg-[#222222] border rounded-2xl cursor-pointer transition-all flex items-start gap-3.5 relative overflow-hidden group ${
                    isLogged ? 'border-[#C8FF00]/50 bg-[#1e2212]' : 'border-[#2A2A2A] border-dashed'
                  }`}
                >
                  <div className="mt-0.5">
                    {isLogged ? (
                      <CheckCircle2 className="w-6 h-6 text-[#C8FF00] shrink-0" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-600 group-hover:text-gray-400 shrink-0" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-bold ${isLogged ? 'text-white' : 'text-gray-400'}`}>{slotName}</h4>
                      {logged?.timeLogged && (
                        <span className="text-[10px] font-mono text-gray-400 bg-[#1A1A1A] px-2 py-0.5 rounded">
                          {logged.timeLogged}
                        </span>
                      )}
                    </div>

                    {isLogged ? (
                      <div className="mt-1.5 space-y-1">
                        <p className="text-sm font-medium text-gray-200 leading-snug">{logged.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#C8FF00] bg-[#0D0D0D] px-2 py-0.5 rounded-md">
                            {ratingEmoji}
                          </span>
                          {logged.notes && <span className="text-xs text-gray-400 italic">• {logged.notes}</span>}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">Toque aqui para registrar o que comeu neste slot...</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Anti Delivery Shield */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 mt-6 ${isDeliveryWarning ? 'bg-[#FF4D4D]/15 border-[#FF4D4D] text-[#FF4D4D]' : 'bg-[#222222] border-[#2A2A2A] text-gray-300'}`}>
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">Proteção Anti-Delivery</h4>
                <p className="text-[11px] text-gray-400">Pedidos esta semana: <strong className="text-white">{db.deliveryCountThisWeek}/{db.settings.deliveryLimit}</strong></p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => { triggerSound('delete', true); onIncrementDelivery(); }} className="px-2.5 py-1.5 bg-[#1A1A1A] hover:bg-gray-800 text-xs font-bold rounded-xl border border-[#2A2A2A]">+ Pedir</button>
              {db.deliveryCountThisWeek > 0 && (
                <button onClick={onResetDelivery} className="px-2 py-1.5 text-xs text-gray-400 hover:text-white">Zerar</button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {subTab === 'guia' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl">
            <h3 className="text-xs font-display font-bold uppercase tracking-wider text-[#C8FF00] flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Guia Prático Offline: Como Cozinhar 5 Bases
            </h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Aprenda a cozinhar os pilares de uma alimentação digna e barata, anulando a necessidade de pedir delivery.
            </p>
          </div>

          <div className="space-y-2.5">
            {BASE_COOKING_GUIDE.map((g, idx) => {
              const isExp = expandedGuideIdx === idx;
              return (
                <div key={g.title} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden transition-all shadow-md">
                  <div
                    onClick={() => { triggerHaptic(true); setExpandedGuideIdx(isExp ? null : idx); }}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#222222] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{g.icon}</span>
                      <div>
                        <h4 className="text-sm font-display font-extrabold text-white tracking-tight">{g.title}</h4>
                        <p className="text-xs text-gray-400 leading-snug mt-0.5">{g.summary}</p>
                      </div>
                    </div>
                    {isExp ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>

                  <AnimatePresence>
                    {isExp && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-[#2A2A2A] p-4 bg-[#222222] space-y-2 text-xs text-gray-300 font-medium"
                      >
                        {g.steps.map((st, i) => (
                          <div key={i} className="flex items-start gap-2.5 leading-relaxed">
                            <span className="w-5 h-5 rounded-full bg-[#1A1A1A] text-[#C8FF00] font-mono font-bold flex items-center justify-center shrink-0 text-[10px] border border-[#2A2A2A]">
                              {i + 1}
                            </span>
                            <p className="flex-1 pt-0.5">{st}</p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Coisas que facilitam muito */}
          <div className="pt-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider px-1">Coisas que Facilitam Muito a Vida</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {LIFE_EASIER_TIPS.map(tip => (
                <div key={tip.title} className="p-3.5 bg-[#222222] border border-[#2A2A2A] rounded-xl space-y-1">
                  <h5 className="text-xs font-bold text-white">{tip.title}</h5>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {subTab === 'habitos' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Water Habit Card */}
          <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl text-center relative overflow-hidden shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-display font-bold text-[#4DA6FF] uppercase tracking-wider flex items-center gap-1.5">
                <Droplets className="w-4 h-4" /> Hidratação Diária Blindada
              </span>
              <span className="text-xs font-mono text-gray-400">Meta: {waterGoal} copos</span>
            </div>

            {/* Huge Water Counter & Button */}
            <div className="py-6 flex items-center justify-center gap-6">
              <button
                onClick={() => { triggerSound('check', true); onAddWaterCup(); }}
                className="w-24 h-24 bg-[#4DA6FF] hover:bg-[#3399ff] text-white rounded-full flex flex-col items-center justify-center shadow-[0_0_35px_rgba(77,166,255,0.4)] active:scale-90 transition-all border-4 border-[#1A1A1A]"
                title="Beber +1 copo (250ml)"
              >
                <Droplets className="w-10 h-10 animate-bounce" />
                <span className="text-[10px] font-black tracking-wider uppercase mt-1">+1 COPO</span>
              </button>

              <div className="text-left">
                <span className="text-5xl font-mono font-black text-white">{waterLogged}</span>
                <span className="text-xl font-mono text-gray-500">/{waterGoal}</span>
                <p className="text-xs text-gray-400 mt-1 font-medium">{waterLogged * 250}ml ingeridos hoje</p>
              </div>
            </div>

            {/* Wave Progress Simulator */}
            <div className="w-full h-3 bg-[#222222] rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${waterPercent}%` }}
                className="h-full bg-gradient-to-r from-[#4DA6FF] to-[#00ffff] rounded-full shadow-[0_0_12px_#4DA6FF]"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-2 font-mono">{waterPercent}% da meta diária concluída</p>
          </div>

          {/* Metas Alimentares Diárias */}
          <div className="p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl space-y-3">
            <h3 className="text-xs font-display font-bold uppercase tracking-wider text-gray-300">Metas Diárias de Nutrição</h3>
            <div className="space-y-2">
              {db.mealGoals.map(mg => (
                <div
                  key={mg.id}
                  onClick={() => { triggerSound(mg.completedToday ? 'uncheck' : 'check', true); onToggleMealGoal(mg.id); }}
                  className={`p-3.5 bg-[#222222] hover:bg-[#2a2a2a] border rounded-xl flex items-center gap-3 cursor-pointer transition-all ${mg.completedToday ? 'border-[#C8FF00]/40 opacity-70' : 'border-[#2A2A2A]'}`}
                >
                  {mg.completedToday ? <CheckCircle2 className="w-5 h-5 text-[#C8FF00] shrink-0" /> : <Circle className="w-5 h-5 text-gray-400 shrink-0" />}
                  <span className={`text-sm font-medium ${mg.completedToday ? 'line-through text-gray-400' : 'text-white'}`}>{mg.title}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Modal para registrar slot */}
      {activeModalSlot && (
        <MealModal
          show={!!activeModalSlot}
          slotName={activeModalSlot}
          existingSlot={todayMeals.find(m => m.slot === activeModalSlot)}
          onSave={onLogMeal}
          onClose={() => setActiveModalSlot(null)}
        />
      )}
    </div>
  );
};
