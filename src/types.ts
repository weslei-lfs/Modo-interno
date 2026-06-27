export type TabType = 'dashboard' | 'routine' | 'finance' | 'meals' | 'settings';

export type PriorityType = 'URGENTE' | 'IMPORTANTE' | 'NORMAL' | 'BAIXA';

export type RepeatType = 'diaria' | 'semanal' | 'mensal' | 'unica';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string; // lucide icon name
  type: 'routine' | 'finance';
}

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  period: 'diario' | 'semanal' | 'mensal';
  categoryId: string;
  time?: string; // e.g. "08:30"
  priority: PriorityType;
  notes?: string;
  repeat: RepeatType;
  dateCreated: string; // YYYY-MM-DD
  dateCompleted?: string; // YYYY-MM-DD
}

export interface TransactionItem {
  id: string;
  type: 'entrada' | 'saida' | 'transferencia';
  amount: number;
  categoryId: string;
  date: string; // YYYY-MM-DD
  description: string;
  repeat: 'unica' | 'mensal' | 'semanal';
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // e.g. "Dezembro"
}

export interface CategoryBudget {
  categoryId: string;
  limitAmount: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  checked: boolean;
  estimatedPrice?: number;
}

export interface MealSlot {
  id: string;
  slot: 'Café da manhã' | 'Lanche manhã' | 'Almoço' | 'Lanche tarde' | 'Jantar';
  description?: string;
  rating?: 'saudavel' | 'regular' | 'pouco_saudavel';
  notes?: string;
  timeLogged?: string;
  date: string; // YYYY-MM-DD
}

export interface MealGoal {
  id: string;
  title: string;
  completedToday: boolean;
}

export interface UserSettings {
  name: string;
  avatar: string; // emoji or identifier
  wakeTime: string; // "06:00"
  sleepTime: string; // "22:00"
  notificationsEnabled: boolean;
  morningReminderTime: string;
  nightReminderTime: string;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  weekStart: 'segunda' | 'domingo';
  currency: string;
  waterGoal: number; // default 8
  deliveryLimit: number; // default 2
}

export interface AppDatabase {
  settings: UserSettings;
  tasks: TaskItem[];
  transactions: TransactionItem[];
  financialGoals: FinancialGoal[];
  budgets: CategoryBudget[];
  shoppingList: ShoppingItem[];
  meals: MealSlot[];
  mealGoals: MealGoal[];
  routineCategories: Category[];
  financeCategories: Category[];
  eatTheFrog: { title: string; completed: boolean; date: string };
  pomodoro: { focusMinutes: number; breakMinutes: number; cyclesCompletedToday: number };
  waterLoggedToday: number; // number of cups
  deliveryCountThisWeek: number;
  onboardingCompleted: boolean;
  streakDays: number;
  lastActiveDate: string;
  hasCelebrated100Today: boolean;
}
