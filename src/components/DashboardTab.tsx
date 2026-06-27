import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Flame, DollarSign, Utensils, AlertTriangle, ArrowRight, Sparkles, RefreshCw, Circle } from 'lucide-react';
import { AppDatabase, TabType } from '../types';
import { triggerHaptic, triggerSound } from '../lib/storage';

interface DashboardTabProps {
  db: AppDatabase;
  onNavigateTab: (tab: TabType) => void;
  onToggleTask: (taskId: string) => void;
  onToggleFrog: () => void;
}

const QUOTES = [
  "A disciplina é a ponte entre metas e realizações.",
  "Foco não é dizer sim para a coisa em que você foca, é dizer não às centenas de boas ideias.",
  "O que você faz no escuro é o que te coloca na luz.",
  "Se você não programar seu dia, o caos o programará por você.",
  "A vitória ama a preparação e despreza as desculpas.",
  "Pequenas vitórias diárias constroem o império da sua vida."
];

export const DashboardTab: React.FC<DashboardTabProps> = ({
  db,
  onNavigateTab,
  onToggleTask,
  onToggleFrog,
}) => {
  const [quoteIdx, setQuoteIdx] = useState(0);

  const now = new Date();
  const hour = now.getHours();

  let greeting = 'Bom dia';
  if (hour >= 12 && hour < 18) greeting = 'Boa tarde';
  if (hour >= 18 || hour < 5) greeting = 'Boa noite';

  const dateStr = now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  // Today's metrics
  const todayTasks = db.tasks.filter(t => t.period === 'diario');
  const completedTodayTasks = todayTasks.filter(t => t.completed);
  const percentTasks = todayTasks.length > 0 ? Math.round((completedTodayTasks.length / todayTasks.length) * 100) : 0;

  const todayStr = now.toISOString().split('T')[0];
  const todayExpenses = db.transactions
    .filter(tx => tx.date === todayStr && tx.type === 'saida')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const todayMealsLogged = db.meals.filter(m => m.date === todayStr).length;

  const urgentTasksCount = todayTasks.filter(t => t.priority === 'URGENTE' && !t.completed).length;
  const isBurnoutWarning = urgentTasksCount >= 3 || db.tasks.filter(t => t.priority === 'URGENTE').length >= 8;

  const pendingTasksWithTime = db.tasks
    .filter(t => !t.completed && t.time)
    .sort((a, b) => (a.time! > b.time! ? 1 : -1))
    .slice(0, 3);

  const rotateQuote = () => {
    triggerHaptic(true);
    setQuoteIdx((quoteIdx + 1) % QUOTES.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-5 space-y-6"
    >
      {/* Header Greeting */}
      <div>
        <h2 className="text-2xl font-display font-extrabold text-white tracking-tight">
          {greeting}, <span className="text-[#C8FF00]">{db.settings.name}</span>
        </h2>
        <p className="text-xs font-medium text-[#AAAAAA] capitalize mt-0.5">{formattedDate}</p>
      </div>

      {/* Burnout Warning Alert */}
      {isBurnoutWarning && (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="p-4 bg-[#FF4D4D]/15 border border-[#FF4D4D] rounded-2xl flex items-start gap-3 text-[#FF4D4D]"
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 animate-pulse" />
          <div className="text-xs leading-relaxed">
            <p className="font-bold uppercase tracking-wider mb-1">Alerta de Burnout Iminente</p>
            <p className="text-gray-200">
              Você acumulou muitas tarefas marcadas como <strong className="text-white">URGENTE</strong> hoje. Aplique a regra 1-3-5 ou delegue/elimine itens menos críticos.
            </p>
          </div>
        </motion.div>
      )}

      {/* Daily Progress Card */}
      <div
        onClick={() => onNavigateTab('routine')}
        className="p-5 bg-[#1A1A1A] hover:bg-[#1e1e1e] border border-[#2A2A2A] rounded-2xl cursor-pointer transition-all shadow-lg relative overflow-hidden group"
      >
        <div className="flex justify-between items-end mb-3">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#AAAAAA] uppercase tracking-wider">Progresso do Dia</span>
            <h3 className="text-lg font-display font-bold text-white mt-0.5">Rotina Diária</h3>
          </div>
          <span className="text-2xl font-display font-black text-[#C8FF00]">
            {percentTasks}%
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-3 bg-[#222222] rounded-full overflow-hidden p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentTasks}%` }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="h-full bg-gradient-to-r from-[#C8FF00] to-[#99cc00] rounded-full shadow-[0_0_12px_#C8FF00]"
          />
        </div>

        <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
          <span>{completedTodayTasks.length} de {todayTasks.length} concluídas</span>
          <span className="text-[#C8FF00] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Ver lista <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Focus / Eat The Frog Card */}
      <div className="p-5 bg-gradient-to-br from-[#1A1A1A] to-[#222222] border-2 border-[#C8FF00]/60 rounded-2xl relative shadow-[0_4px_30px_rgba(200,255,0,0.1)]">
        <div className="flex justify-between items-center mb-2">
          <span className="px-2.5 py-1 bg-[#C8FF00] text-[#0D0D0D] text-[10px] font-black rounded-lg tracking-wider uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Foco do Dia (Comer o Sapo)
          </span>
          <span className="text-[10px] font-mono text-gray-400">Tarefa Crítica</span>
        </div>

        <div
          onClick={() => { triggerSound(db.eatTheFrog.completed ? 'uncheck' : 'celebrate', true); onToggleFrog(); }}
          className="flex items-start gap-3 mt-3 p-2 hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
        >
          <div className="mt-0.5">
            {db.eatTheFrog.completed ? (
              <CheckCircle2 className="w-6 h-6 text-[#C8FF00] shrink-0" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400 hover:text-[#C8FF00] shrink-0" />
            )}
          </div>
          <p className={`text-base font-semibold leading-snug flex-1 ${db.eatTheFrog.completed ? 'line-through text-gray-400' : 'text-white'}`}>
            {db.eatTheFrog.title || 'Nenhum sapo definido hoje. Toque na aba Rotina para configurar!'}
          </p>
        </div>
      </div>

      {/* 2x2 Grid Summary */}
      <div className="grid grid-cols-2 gap-3">
        {/* Tarefas Hoje */}
        <div onClick={() => onNavigateTab('routine')} className="p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl flex flex-col justify-between cursor-pointer hover:border-gray-500 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-medium text-gray-400">Concluídas Hoje</span>
            <CheckCircle2 className="w-4 h-4 text-[#C8FF00]" />
          </div>
          <p className="text-xl font-display font-extrabold text-white mt-2">
            {completedTodayTasks.length}<span className="text-sm font-normal text-gray-500">/{todayTasks.length}</span>
          </p>
        </div>

        {/* Gastos hoje */}
        <div onClick={() => onNavigateTab('finance')} className="p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl flex flex-col justify-between cursor-pointer hover:border-gray-500 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-medium text-gray-400">Gastos Hoje</span>
            <DollarSign className="w-4 h-4 text-[#4DA6FF]" />
          </div>
          <p className="text-xl font-mono font-bold text-[#4DA6FF] mt-2">
            {db.settings.currency} {todayExpenses.toFixed(2)}
          </p>
        </div>

        {/* Refeições */}
        <div onClick={() => onNavigateTab('meals')} className="p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl flex flex-col justify-between cursor-pointer hover:border-gray-500 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-medium text-gray-400">Refeições</span>
            <Utensils className="w-4 h-4 text-[#FF4D4D]" />
          </div>
          <p className="text-xl font-display font-extrabold text-white mt-2">
            {todayMealsLogged}<span className="text-sm font-normal text-gray-500">/5</span>
          </p>
        </div>

        {/* Streak */}
        <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-medium text-gray-400">Sequência Ativa</span>
            <Flame className="w-4 h-4 text-[#FFB84D] fill-[#FFB84D]" />
          </div>
          <p className="text-xl font-display font-extrabold text-[#FFB84D] mt-2">
            {db.streakDays} <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">dias</span>
          </p>
        </div>
      </div>

      {/* Próximas Tarefas */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-display font-bold text-gray-300 uppercase tracking-wider">Próximos Horários</h3>
          <button onClick={() => onNavigateTab('routine')} className="text-xs text-[#C8FF00] font-bold hover:underline">
            Ver tudo
          </button>
        </div>

        {pendingTasksWithTime.length === 0 ? (
          <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl text-center text-xs text-gray-500">
            Todas as tarefas com horário marcado já foram concluídas por hoje!
          </div>
        ) : (
          <div className="space-y-2">
            {pendingTasksWithTime.map(t => {
              const cat = db.routineCategories.find(c => c.id === t.categoryId);
              return (
                <div
                  key={t.id}
                  onClick={() => onToggleTask(t.id)}
                  className="p-3.5 bg-[#1A1A1A] hover:bg-[#222222] border border-[#2A2A2A] rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Circle className="w-4 h-4 text-gray-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{t.title}</p>
                      <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: cat?.color || '#C8FF00' }} />
                        {cat?.name || 'Rotina'} • <strong className="text-gray-200">{t.priority}</strong>
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-[#222222] text-[#C8FF00] font-mono font-bold text-xs rounded-lg shrink-0">
                    {t.time}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Motivational Quote Offline Box */}
      <div className="p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl relative overflow-hidden flex items-center justify-between gap-4">
        <div className="flex-1">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block mb-1">Citação Blindada</span>
          <p className="text-sm font-medium text-gray-200 italic leading-relaxed">
            "{QUOTES[quoteIdx]}"
          </p>
        </div>
        <button
          onClick={rotateQuote}
          className="p-2.5 bg-[#222222] hover:bg-gray-700 rounded-xl text-gray-400 hover:text-white transition-colors shrink-0 active:rotate-180 duration-300"
          title="Próxima citação"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
