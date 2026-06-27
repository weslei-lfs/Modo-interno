import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Check, Circle, Trash2, Edit3, Sparkles, FolderPlus, Layers, Calendar, ChevronRight, Trophy } from 'lucide-react';
import { AppDatabase, TaskItem, Category } from '../types';
import { triggerHaptic, triggerSound, ROUTINE_TEMPLATES } from '../lib/storage';
import { TaskModal } from './TaskModal';
import { CategoryModal, renderCategoryIcon } from './CategoryModal';
import { TemplatesModal } from './TemplatesModal';
import { PomodoroWidget } from './PomodoroWidget';

interface RoutineTabProps {
  db: AppDatabase;
  onSaveTask: (task: Omit<TaskItem, 'id' | 'dateCreated' | 'completed'>, editId?: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onSaveCategory: (cat: Omit<Category, 'id'>) => void;
  onImportTemplate: (k: keyof typeof ROUTINE_TEMPLATES) => void;
  onSaveFrogTitle: (title: string) => void;
  onCompletePomodoroCycle: () => void;
}

export const RoutineTab: React.FC<RoutineTabProps> = ({
  db,
  onSaveTask,
  onToggleTask,
  onDeleteTask,
  onSaveCategory,
  onImportTemplate,
  onSaveFrogTitle,
  onCompletePomodoroCycle,
}) => {
  const [periodTab, setPeriodTab] = useState<'diario' | 'semanal' | 'mensal'>('diario');
  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  
  const [showCatModal, setShowCatModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  
  const [isEditingFrog, setIsEditingFrog] = useState(false);
  const [tempFrog, setTempFrog] = useState(db.eatTheFrog.title || '');

  const filteredTasks = db.tasks.filter(t => {
    if (t.period !== periodTab) return false;
    if (selectedCatId !== 'all' && t.categoryId !== selectedCatId) return false;
    return true;
  });

  const completedCount = filteredTasks.filter(t => t.completed).length;
  const progressPercent = filteredTasks.length > 0 ? Math.round((completedCount / filteredTasks.length) * 100) : 0;

  const handleOpenNewTask = () => {
    triggerHaptic(true);
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (t: TaskItem) => {
    triggerHaptic(true);
    setEditingTask(t);
    setShowTaskModal(true);
  };

  const handleFrogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(true);
    onSaveFrogTitle(tempFrog);
    setIsEditingFrog(false);
  };

  return (
    <div className="p-5 space-y-6 pb-28 relative min-h-full">
      {/* Top Banner & Eat The Frog Configurator */}
      <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl relative overflow-hidden shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-display font-extrabold text-[#C8FF00] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Comer o Sapo (Tarefa Mais Difícil)
          </span>
          <button
            onClick={() => { setTempFrog(db.eatTheFrog.title); setIsEditingFrog(!isEditingFrog); }}
            className="text-[11px] font-bold text-gray-400 hover:text-white flex items-center gap-1 bg-[#222222] px-2 py-1 rounded-lg"
          >
            <Edit3 className="w-3 h-3" /> {isEditingFrog ? 'Cancelar' : 'Definir'}
          </button>
        </div>

        {isEditingFrog ? (
          <form onSubmit={handleFrogSubmit} className="mt-2 space-y-2">
            <input
              type="text"
              autoFocus
              value={tempFrog}
              onChange={e => setTempFrog(e.target.value)}
              placeholder="Digite a tarefa mais crítica de hoje..."
              className="w-full p-2.5 bg-[#222222] border border-[#C8FF00] rounded-xl text-white text-xs focus:outline-none"
            />
            <button
              type="submit"
              className="w-full py-2 bg-[#C8FF00] text-[#0D0D0D] font-extrabold text-xs rounded-xl"
            >
              SALVAR SAPO
            </button>
          </form>
        ) : (
          <p className="text-sm font-medium text-gray-200 mt-1">
            {db.eatTheFrog.title || 'Nenhum sapo definido hoje. Toque em Definir acima!'}
          </p>
        )}
      </div>

      {/* Pomodoro Timer Circular Integrated */}
      <PomodoroWidget
        initialFocusMinutes={db.pomodoro.focusMinutes}
        initialBreakMinutes={db.pomodoro.breakMinutes}
        cyclesCompletedToday={db.pomodoro.cyclesCompletedToday}
        onCycleComplete={onCompletePomodoroCycle}
      />

      {/* Tabs Periodo (DIÁRIO / SEMANAL / MENSAL) */}
      <div className="flex items-center justify-between gap-1 bg-[#1A1A1A] p-1.5 rounded-2xl border border-[#2A2A2A]">
        {(['diario', 'semanal', 'mensal'] as const).map(p => {
          const isActive = periodTab === p;
          return (
            <button
              key={p}
              onClick={() => { triggerHaptic(true); setPeriodTab(p); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize transition-all relative ${
                isActive ? 'bg-[#C8FF00] text-[#0D0D0D] shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              {p === 'diario' ? 'Diário' : p === 'semanal' ? 'Semanal' : 'Mensal'}
            </button>
          );
        })}
      </div>

      {/* Categories Horizontal Filter & Quick Actions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-none">
        <button
          onClick={() => setSelectedCatId('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${selectedCatId === 'all' ? 'bg-white text-black' : 'bg-[#1A1A1A] text-gray-400 border border-[#2A2A2A]'}`}
        >
          Todas
        </button>

        {db.routineCategories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCatId(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 border`}
            style={{
              backgroundColor: selectedCatId === c.id ? c.color : '#1A1A1A',
              borderColor: selectedCatId === c.id ? c.color : '#2A2A2A',
              color: selectedCatId === c.id ? '#0D0D0D' : '#AAAAAA'
            }}
          >
            <span className="w-3.5 h-3.5 shrink-0">{renderCategoryIcon(c.icon)}</span>
            {c.name}
          </button>
        ))}

        <button
          onClick={() => setShowCatModal(true)}
          className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#222222] text-[#C8FF00] border border-[#C8FF00]/40 flex items-center gap-1 shrink-0 hover:bg-[#2a2a2a]"
        >
          <FolderPlus className="w-3.5 h-3.5" /> +Cat
        </button>

        <button
          onClick={() => setShowTemplatesModal(true)}
          className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#222222] text-[#4DA6FF] border border-[#4DA6FF]/40 flex items-center gap-1 shrink-0 hover:bg-[#2a2a2a]"
        >
          <Layers className="w-3.5 h-3.5" /> Templates
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-mono text-gray-400 px-1">
          <span>{filteredTasks.length} TAREFAS NA ABA</span>
          <span>{progressPercent}% CONCLUÍDO</span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="py-12 px-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl text-center flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#222222] flex items-center justify-center text-[#C8FF00]">
              <Trophy className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">Nenhuma tarefa aqui!</h4>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
              Você não tem tarefas registradas para o período <strong className="text-white capitalize">{periodTab}</strong>. Toque no botão <span className="text-[#C8FF00] font-bold">+</span> abaixo ou importe um template pré-pronto!
            </p>
            <button
              onClick={() => setShowTemplatesModal(true)}
              className="mt-2 px-4 py-2 bg-[#222222] hover:bg-[#2a2a2a] text-[#C8FF00] border border-[#C8FF00]/50 text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4" /> Importar Rotina Mínima
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            <AnimatePresence>
              {filteredTasks.map(t => {
                const cat = db.routineCategories.find(c => c.id === t.categoryId);
                const priorityColor = t.priority === 'URGENTE' ? '#FF4D4D' : t.priority === 'IMPORTANTE' ? '#FFB84D' : t.priority === 'NORMAL' ? '#C8FF00' : '#AAAAAA';
                
                return (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, x: -50 }}
                    transition={{ duration: 0.2 }}
                    className={`p-4 bg-[#1A1A1A] hover:bg-[#1e1e1e] border rounded-2xl flex items-start gap-3.5 transition-colors group relative ${
                      t.completed ? 'border-[#2A2A2A]/50 opacity-65' : 'border-[#2A2A2A]'
                    }`}
                  >
                    {/* Priority Indicator Stripe */}
                    <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full" style={{ backgroundColor: priorityColor }} />

                    {/* Animated Checkbox */}
                    <button
                      onClick={() => onToggleTask(t.id)}
                      className="mt-0.5 ml-1 shrink-0 focus:outline-none active:scale-90 transition-transform"
                    >
                      {t.completed ? (
                        <motion.div
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-lg bg-[#C8FF00] text-[#0D0D0D] flex items-center justify-center shadow-[0_0_10px_#C8FF00]"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </motion.div>
                      ) : (
                        <div className="w-6 h-6 rounded-lg border-2 border-gray-500 hover:border-[#C8FF00] flex items-center justify-center transition-colors" />
                      )}
                    </button>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0" onClick={() => handleEditTask(t)}>
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-semibold truncate ${t.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                          {t.title}
                        </p>
                        {t.time && (
                          <span className="px-2 py-0.5 bg-[#222222] text-[#C8FF00] font-mono font-bold text-[10px] rounded shrink-0">
                            {t.time}
                          </span>
                        )}
                      </div>

                      {t.notes && (
                        <p className="text-xs text-gray-400 line-clamp-1 mt-1 font-normal">{t.notes}</p>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 bg-[#222222]" style={{ color: cat?.color || '#AAAAAA' }}>
                          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: cat?.color || '#AAAAAA' }} />
                          {cat?.name || 'Geral'}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500 uppercase">
                          {t.priority}
                        </span>
                      </div>
                    </div>

                    {/* Quick Delete Swipe Simulator */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteTask(t.id); }}
                      className="p-2 text-gray-500 hover:text-[#FF4D4D] opacity-0 group-hover:opacity-100 transition-opacity bg-[#222222] rounded-xl shrink-0"
                      title="Excluír Tarefa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Histórico Calendar Streak Preview */}
      <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#222222] rounded-xl text-[#C8FF00]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Histórico de Conclusão</h4>
            <p className="text-[11px] text-gray-400">🔥 Maior sequência: <strong className="text-[#FFB84D]">{db.streakDays} dias consecutivos</strong></p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={handleOpenNewTask}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#C8FF00] hover:bg-[#b3e600] text-[#0D0D0D] rounded-2xl shadow-[0_4px_25px_rgba(200,255,0,0.4)] flex items-center justify-center active:scale-90 transition-all z-40 group border-2 border-[#0D0D0D]"
        aria-label="Nova Tarefa"
      >
        <Plus className="w-7 h-7 stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Modals */}
      <TaskModal
        show={showTaskModal}
        taskToEdit={editingTask}
        categories={db.routineCategories}
        defaultPeriod={periodTab}
        onSave={(data) => {
          if (editingTask) {
            onSaveTask(data, editingTask.id);
          } else {
            onSaveTask(data);
          }
        }}
        onClose={() => setShowTaskModal(false)}
      />

      <CategoryModal
        show={showCatModal}
        type="routine"
        onSave={onSaveCategory}
        onClose={() => setShowCatModal(false)}
      />

      <TemplatesModal
        show={showTemplatesModal}
        onImport={onImportTemplate}
        onClose={() => setShowTemplatesModal(false)}
      />
    </div>
  );
};
