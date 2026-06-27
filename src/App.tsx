import React, { useState, useEffect, useCallback } from 'react';
import { TabType, AppDatabase, TaskItem, TransactionItem, MealSlot, Category, UserSettings, ShoppingItem } from './types';
import { getDatabase, saveDatabase, triggerHaptic, triggerSound, ROUTINE_TEMPLATES } from './lib/storage';
import { Onboarding } from './components/Onboarding';
import { AndroidContainer } from './components/AndroidContainer';
import { DashboardTab } from './components/DashboardTab';
import { RoutineTab } from './components/RoutineTab';
import { FinanceTab } from './components/FinanceTab';
import { MealsTab } from './components/MealsTab';
import { SettingsTab } from './components/SettingsTab';
import { UndoSnackbar } from './components/UndoSnackbar';
import { CelebrationModal } from './components/CelebrationModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';

export default function App() {
  const [db, setDb] = useState<AppDatabase>(getDatabase);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const [undoState, setUndoState] = useState<{ show: boolean; message: string; prevDb: AppDatabase | null }>({
    show: false,
    message: '',
    prevDb: null
  });

  const [showCelebration, setShowCelebration] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Auto save to localStorage when db changes
  useEffect(() => {
    saveDatabase(db);
  }, [db]);

  // Check streak and last active date on boot
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (db.lastActiveDate !== today) {
      const lastDate = new Date(db.lastActiveDate);
      const nowDate = new Date(today);
      const diffDays = Math.round((nowDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      let newStreak = db.streakDays;
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1; // broken streak
      }

      setDb(prev => ({
        ...prev,
        lastActiveDate: today,
        streakDays: newStreak,
        hasCelebrated100Today: false
      }));
    }
  }, []);

  const triggerUndoableAction = useCallback((newDb: AppDatabase, message: string) => {
    setUndoState({
      show: true,
      message,
      prevDb: db
    });
    setDb(newDb);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setUndoState(prev => (prev.message === message ? { ...prev, show: false } : prev));
    }, 5000);
  }, [db]);

  const handleUndo = () => {
    triggerHaptic(true);
    triggerSound('check', true);
    if (undoState.prevDb) {
      setDb(undoState.prevDb);
    }
    setUndoState({ show: false, message: '', prevDb: null });
  };

  // --- Task Operations ---
  const handleSaveTask = (taskData: Omit<TaskItem, 'id' | 'dateCreated' | 'completed'>, editId?: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (editId) {
      setDb(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => (t.id === editId ? { ...t, ...taskData } : t))
      }));
    } else {
      const newTask: TaskItem = {
        ...taskData,
        id: `t_${Date.now()}`,
        completed: false,
        dateCreated: today
      };
      setDb(prev => ({
        ...prev,
        tasks: [newTask, ...prev.tasks]
      }));
    }
  };

  const handleToggleTask = (taskId: string) => {
    const target = db.tasks.find(t => t.id === taskId);
    if (!target) return;

    const newCompleted = !target.completed;
    triggerSound(newCompleted ? 'check' : 'uncheck', db.settings.soundEnabled);

    const updatedTasks = db.tasks.map(t => (t.id === taskId ? { ...t, completed: newCompleted } : t));
    
    // Check if 100% daily tasks are done now
    const todayDaily = updatedTasks.filter(t => t.period === 'diario');
    const allDone = todayDaily.length > 0 && todayDaily.every(t => t.completed);

    let newCelebrated = db.hasCelebrated100Today;
    if (allDone && !db.hasCelebrated100Today && newCompleted) {
      setShowCelebration(true);
      newCelebrated = true;
    }

    setDb(prev => ({
      ...prev,
      tasks: updatedTasks,
      hasCelebrated100Today: newCelebrated
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    const target = db.tasks.find(t => t.id === taskId);
    if (!target) return;
    triggerSound('delete', db.settings.soundEnabled);
    triggerUndoableAction(
      { ...db, tasks: db.tasks.filter(t => t.id !== taskId) },
      `Tarefa "${target.title.slice(0, 20)}..." excluída.`
    );
  };

  const handleToggleFrog = () => {
    setDb(prev => ({
      ...prev,
      eatTheFrog: { ...prev.eatTheFrog, completed: !prev.eatTheFrog.completed }
    }));
  };

  // --- Category Operations ---
  const handleSaveRoutineCategory = (cat: Omit<Category, 'id'>) => {
    const newCat: Category = { ...cat, id: `cat_r_${Date.now()}` };
    setDb(prev => ({ ...prev, routineCategories: [...prev.routineCategories, newCat] }));
  };

  const handleSaveFinanceCategory = (cat: Omit<Category, 'id'>) => {
    const newCat: Category = { ...cat, id: `cat_f_${Date.now()}` };
    setDb(prev => ({ ...prev, financeCategories: [...prev.financeCategories, newCat] }));
  };

  // --- Templates Import ---
  const handleImportTemplate = (tplKey: keyof typeof ROUTINE_TEMPLATES) => {
    const today = new Date().toISOString().split('T')[0];
    const items = ROUTINE_TEMPLATES[tplKey];
    const newTasks: TaskItem[] = items.map((item, idx) => ({
      id: `tpl_${tplKey}_${Date.now()}_${idx}`,
      title: item.title,
      completed: false,
      period: (tplKey === 'semanal_casa' ? 'semanal' : tplKey === 'mensal_casa' ? 'mensal' : 'diario') as 'diario' | 'semanal' | 'mensal',
      categoryId: item.categoryId || 'cat_r_casa',
      priority: item.priority,
      repeat: (tplKey === 'semanal_casa' ? 'semanal' : tplKey === 'mensal_casa' ? 'mensal' : 'diaria') as 'diaria' | 'semanal' | 'mensal' | 'unica',
      dateCreated: today
    }));

    setDb(prev => ({
      ...prev,
      tasks: [...newTasks, ...prev.tasks]
    }));
  };

  // --- Finance Operations ---
  const handleSaveTransaction = (txData: Omit<TransactionItem, 'id'>) => {
    triggerSound('check', db.settings.soundEnabled);
    const newTx: TransactionItem = {
      ...txData,
      id: `tx_${Date.now()}`
    };
    setDb(prev => ({ ...prev, transactions: [newTx, ...prev.transactions] }));
  };

  const handleDeleteTransaction = (txId: string) => {
    const target = db.transactions.find(t => t.id === txId);
    if (!target) return;
    triggerSound('delete', db.settings.soundEnabled);
    triggerUndoableAction(
      { ...db, transactions: db.transactions.filter(t => t.id !== txId) },
      `Transação de R$ ${target.amount} removida.`
    );
  };

  const handleAddGoalAporte = (goalId: string, amount: number) => {
    triggerSound('celebrate', db.settings.soundEnabled);
    setDb(prev => ({
      ...prev,
      financialGoals: prev.financialGoals.map(g => (g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g))
    }));
  };

  // --- Shopping List ---
  const handleToggleShoppingItem = (itemId: string) => {
    triggerSound('check', db.settings.soundEnabled);
    setDb(prev => ({
      ...prev,
      shoppingList: prev.shoppingList.map(s => (s.id === itemId ? { ...s, checked: !s.checked } : s))
    }));
  };

  const handleAddShoppingItem = (name: string, price?: number) => {
    triggerSound('check', db.settings.soundEnabled);
    const newItem: ShoppingItem = {
      id: `shop_${Date.now()}`,
      name,
      quantity: '1 un',
      checked: false,
      estimatedPrice: price
    };
    setDb(prev => ({ ...prev, shoppingList: [newItem, ...prev.shoppingList] }));
  };

  const handleDeleteShoppingItem = (itemId: string) => {
    setDb(prev => ({ ...prev, shoppingList: prev.shoppingList.filter(s => s.id !== itemId) }));
  };

  // --- Meals ---
  const handleLogMeal = (mealData: Omit<MealSlot, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    triggerSound('check', db.settings.soundEnabled);

    setDb(prev => {
      const filtered = prev.meals.filter(m => !(m.date === today && m.slot === mealData.slot));
      const newMeal: MealSlot = {
        ...mealData,
        id: `m_${Date.now()}`,
        date: today
      };
      return { ...prev, meals: [newMeal, ...filtered] };
    });
  };

  const handleToggleMealGoal = (goalId: string) => {
    setDb(prev => ({
      ...prev,
      mealGoals: prev.mealGoals.map(mg => (mg.id === goalId ? { ...mg, completedToday: !mg.completedToday } : mg))
    }));
  };

  // --- Settings & Backup ---
  const handleUpdateSettings = (partial: Partial<UserSettings>) => {
    setDb(prev => ({ ...prev, settings: { ...prev.settings, ...partial } }));
  };

  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `modo_interno_room_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleClearSection = (section: 'routine' | 'finance' | 'meals' | 'all') => {
    if (!confirm(`Tem certeza que deseja apagar os dados da seção "${section.toUpperCase()}"? Esta ação não poderá ser desfeita.`)) return;
    triggerSound('delete', true);
    
    setDb(prev => {
      if (section === 'routine') return { ...prev, tasks: [] };
      if (section === 'finance') return { ...prev, transactions: [] };
      if (section === 'meals') return { ...prev, meals: [] };
      // All
      return {
        ...prev,
        tasks: [],
        transactions: [],
        meals: [],
        shoppingList: [],
        financialGoals: []
      };
    });
  };

  // Onboarding screen if first boot
  if (!db.onboardingCompleted) {
    return (
      <Onboarding
        onComplete={(initialSet) => {
          setDb(prev => ({
            ...prev,
            settings: { ...prev.settings, ...initialSet },
            onboardingCompleted: true
          }));
        }}
      />
    );
  }

  return (
    <AndroidContainer
      activeTab={activeTab}
      db={db}
      onTabChange={setActiveTab}
      onOpenSearch={() => setShowSearch(true)}
    >
      {activeTab === 'dashboard' && (
        <DashboardTab
          db={db}
          onNavigateTab={setActiveTab}
          onToggleTask={handleToggleTask}
          onToggleFrog={handleToggleFrog}
        />
      )}

      {activeTab === 'routine' && (
        <RoutineTab
          db={db}
          onSaveTask={handleSaveTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onSaveCategory={handleSaveRoutineCategory}
          onImportTemplate={handleImportTemplate}
          onSaveFrogTitle={(title) => setDb(prev => ({ ...prev, eatTheFrog: { ...prev.eatTheFrog, title } }))}
          onCompletePomodoroCycle={() => setDb(prev => ({ ...prev, pomodoro: { ...prev.pomodoro, cyclesCompletedToday: prev.pomodoro.cyclesCompletedToday + 1 } }))}
        />
      )}

      {activeTab === 'finance' && (
        <FinanceTab
          db={db}
          onSaveTransaction={handleSaveTransaction}
          onDeleteTransaction={handleDeleteTransaction}
          onSaveFinanceCategory={handleSaveFinanceCategory}
          onAddGoalAporte={handleAddGoalAporte}
          onToggleShoppingItem={handleToggleShoppingItem}
          onAddShoppingItem={handleAddShoppingItem}
          onDeleteShoppingItem={handleDeleteShoppingItem}
        />
      )}

      {activeTab === 'meals' && (
        <MealsTab
          db={db}
          onLogMeal={handleLogMeal}
          onAddWaterCup={() => setDb(prev => ({ ...prev, waterLoggedToday: prev.waterLoggedToday + 1 }))}
          onToggleMealGoal={handleToggleMealGoal}
          onIncrementDelivery={() => setDb(prev => ({ ...prev, deliveryCountThisWeek: prev.deliveryCountThisWeek + 1 }))}
          onResetDelivery={() => setDb(prev => ({ ...prev, deliveryCountThisWeek: 0 }))}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsTab
          db={db}
          onUpdateSettings={handleUpdateSettings}
          onExportBackup={handleExportBackup}
          onImportBackup={(restoredDb) => setDb({ ...restoredDb, onboardingCompleted: true })}
          onClearSection={handleClearSection}
          onResetOnboarding={() => setDb(prev => ({ ...prev, onboardingCompleted: false }))}
        />
      )}

      {/* Undo Snackbar Overlay */}
      <UndoSnackbar
        show={undoState.show}
        message={undoState.message}
        onUndo={handleUndo}
      />

      {/* Celebration Confetti Modal */}
      <CelebrationModal
        show={showCelebration}
        userName={db.settings.name}
        onClose={() => setShowCelebration(false)}
      />

      {/* Global Search Room DB */}
      <GlobalSearchModal
        show={showSearch}
        db={db}
        onClose={() => setShowSearch(false)}
        onNavigateTab={setActiveTab}
      />
    </AndroidContainer>
  );
}
