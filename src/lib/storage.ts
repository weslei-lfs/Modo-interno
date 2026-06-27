import { AppDatabase, Category, TaskItem, TransactionItem, MealSlot, UserSettings } from '../types';

const STORAGE_KEY = 'MODO_INTERNO_ROOM_DB_V1';

export const DEFAULT_ROUTINE_CATEGORIES: Category[] = [
  { id: 'cat_r_casa', name: 'Casa', color: '#C8FF00', icon: 'Home', type: 'routine' },
  { id: 'cat_r_trab', name: 'Trabalho', color: '#4DA6FF', icon: 'Briefcase', type: 'routine' },
  { id: 'cat_r_saude', name: 'Saúde', color: '#FF4D4D', icon: 'Heart', type: 'routine' },
  { id: 'cat_r_est', name: 'Estudos', color: '#B366FF', icon: 'BookOpen', type: 'routine' },
  { id: 'cat_r_pess', name: 'Pessoal', color: '#FFB84D', icon: 'Brain', type: 'routine' },
  { id: 'cat_r_laz', name: 'Lazer', color: '#00E6AC', icon: 'Gamepad2', type: 'routine' },
];

export const DEFAULT_FINANCE_CATEGORIES: Category[] = [
  { id: 'cat_f_alim', name: 'Alimentação', color: '#FF4D4D', icon: 'Utensils', type: 'finance' },
  { id: 'cat_f_mor', name: 'Moradia', color: '#C8FF00', icon: 'Home', type: 'finance' },
  { id: 'cat_f_trans', name: 'Transporte', color: '#4DA6FF', icon: 'Car', type: 'finance' },
  { id: 'cat_f_saude', name: 'Saúde', color: '#FF80DF', icon: 'Heart', type: 'finance' },
  { id: 'cat_f_laz', name: 'Lazer', color: '#00E6AC', icon: 'Gamepad2', type: 'finance' },
  { id: 'cat_f_edu', name: 'Educação', color: '#B366FF', icon: 'GraduationCap', type: 'finance' },
  { id: 'cat_f_roupas', name: 'Roupas', color: '#FFB84D', icon: 'Shirt', type: 'finance' },
  { id: 'cat_f_outros', name: 'Outros', color: '#AAAAAA', icon: 'Package', type: 'finance' },
];

const TODAY_STR = new Date().toISOString().split('T')[0];

const INITIAL_DB: AppDatabase = {
  settings: {
    name: 'Guerreiro',
    avatar: '🦁',
    wakeTime: '06:30',
    sleepTime: '22:30',
    notificationsEnabled: true,
    morningReminderTime: '07:00',
    nightReminderTime: '21:00',
    soundEnabled: true,
    hapticEnabled: true,
    weekStart: 'segunda',
    currency: 'R$',
    waterGoal: 8,
    deliveryLimit: 2,
  },
  tasks: [
    {
      id: 't_1',
      title: 'Beber 500ml de água ao acordar',
      completed: true,
      period: 'diario',
      categoryId: 'cat_r_saude',
      time: '06:35',
      priority: 'IMPORTANTE',
      repeat: 'diaria',
      dateCreated: TODAY_STR,
    },
    {
      id: 't_2',
      title: 'Revisar metas prioritárias do dia',
      completed: true,
      period: 'diario',
      categoryId: 'cat_r_pess',
      time: '07:00',
      priority: 'URGENTE',
      repeat: 'diaria',
      dateCreated: TODAY_STR,
    },
    {
      id: 't_3',
      title: 'Bloco de Foco Profundo 1 (Sem notificações)',
      completed: false,
      period: 'diario',
      categoryId: 'cat_r_trab',
      time: '08:30',
      priority: 'URGENTE',
      notes: 'Desativar WhatsApp e focar no projeto principal',
      repeat: 'diaria',
      dateCreated: TODAY_STR,
    },
    {
      id: 't_4',
      title: 'Treino físico / Alongamento',
      completed: false,
      period: 'diario',
      categoryId: 'cat_r_saude',
      time: '18:00',
      priority: 'IMPORTANTE',
      repeat: 'diaria',
      dateCreated: TODAY_STR,
    },
    {
      id: 't_5',
      title: 'Leitura de 15 páginas',
      completed: false,
      period: 'diario',
      categoryId: 'cat_r_est',
      time: '21:30',
      priority: 'NORMAL',
      repeat: 'diaria',
      dateCreated: TODAY_STR,
    },
    {
      id: 't_w1',
      title: 'Organizar ambiente de trabalho',
      completed: false,
      period: 'semanal',
      categoryId: 'cat_r_casa',
      priority: 'NORMAL',
      repeat: 'semanal',
      dateCreated: TODAY_STR,
    },
    {
      id: 't_m1',
      title: 'Balanço financeiro e investimentos do mês',
      completed: false,
      period: 'mensal',
      categoryId: 'cat_r_pess',
      priority: 'IMPORTANTE',
      repeat: 'mensal',
      dateCreated: TODAY_STR,
    }
  ],
  transactions: [
    {
      id: 'tx_1',
      type: 'entrada',
      amount: 4850.00,
      categoryId: 'cat_f_outros',
      date: TODAY_STR,
      description: 'Salário / Projeto',
      repeat: 'mensal',
    },
    {
      id: 'tx_2',
      type: 'saida',
      amount: 45.90,
      categoryId: 'cat_f_alim',
      date: TODAY_STR,
      description: 'Almoço saudável',
      repeat: 'unica',
    },
    {
      id: 'tx_3',
      type: 'saida',
      amount: 180.00,
      categoryId: 'cat_f_trans',
      date: TODAY_STR,
      description: 'Combustível / Transporte',
      repeat: 'unica',
    },
  ],
  financialGoals: [
    {
      id: 'fg_1',
      name: 'Reserva de Emergência',
      targetAmount: 10000,
      currentAmount: 6500,
      deadline: 'Dezembro',
    },
    {
      id: 'fg_2',
      name: 'Viagem de Férias',
      targetAmount: 3500,
      currentAmount: 1200,
      deadline: 'Janeiro',
    }
  ],
  budgets: [
    { categoryId: 'cat_f_alim', limitAmount: 900 },
    { categoryId: 'cat_f_trans', limitAmount: 400 },
    { categoryId: 'cat_f_laz', limitAmount: 300 },
  ],
  shoppingList: [
    { id: 'sh_1', name: 'Arroz Integral (5kg)', quantity: '1 pct', checked: true, estimatedPrice: 24.90 },
    { id: 'sh_2', name: 'Feijão Preto', quantity: '2 pcts', checked: true, estimatedPrice: 16.00 },
    { id: 'sh_3', name: 'Peito de Frango Congelado', quantity: '2 kg', checked: false, estimatedPrice: 38.00 },
    { id: 'sh_4', name: 'Ovos (Cartela com 30)', quantity: '1 cartela', checked: false, estimatedPrice: 22.00 },
    { id: 'sh_5', name: 'Aveia em flocos', quantity: '500g', checked: false, estimatedPrice: 9.50 },
    { id: 'sh_6', name: 'Legumes congelados (Brócolis)', quantity: '2 pcts', checked: false, estimatedPrice: 18.00 },
  ],
  meals: [
    {
      id: 'm_1',
      slot: 'Café da manhã',
      description: 'Ovos mexidos com aveia e café preto sem açúcar',
      rating: 'saudavel',
      timeLogged: '07:15',
      date: TODAY_STR,
    },
    {
      id: 'm_2',
      slot: 'Almoço',
      description: 'Arroz, feijão, peito de frango grelhados e salada verde',
      rating: 'saudavel',
      timeLogged: '12:30',
      date: TODAY_STR,
    }
  ],
  mealGoals: [
    { id: 'mg_1', title: 'Cozinhar em casa (Sem delivery)', completedToday: true },
    { id: 'mg_2', title: 'Comer salada / vegetais no almoço', completedToday: true },
    { id: 'mg_3', title: 'Evitar açúcar refinado à noite', completedToday: false },
  ],
  routineCategories: DEFAULT_ROUTINE_CATEGORIES,
  financeCategories: DEFAULT_FINANCE_CATEGORIES,
  eatTheFrog: {
    title: 'Finalizar relatório de arquitetura e enviar proposta',
    completed: false,
    date: TODAY_STR,
  },
  pomodoro: {
    focusMinutes: 25,
    breakMinutes: 5,
    cyclesCompletedToday: 2,
  },
  waterLoggedToday: 5,
  deliveryCountThisWeek: 1,
  onboardingCompleted: false,
  streakDays: 7,
  lastActiveDate: TODAY_STR,
  hasCelebrated100Today: false,
};

export function getDatabase(): AppDatabase {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveDatabase(INITIAL_DB);
      return INITIAL_DB;
    }
    const parsed = JSON.parse(raw);
    // Ensure merged structure if new fields added
    return { ...INITIAL_DB, ...parsed };
  } catch (e) {
    console.error('Failed to parse Room Database from storage:', e);
    return INITIAL_DB;
  }
}

export function saveDatabase(db: AppDatabase): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.error('Failed to save to Room Database:', e);
  }
}

// Haptic & Sound Feedback Engines
export function triggerHaptic(enabled = true) {
  if (!enabled) return;
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
  } catch {
    // Ignore if unsupported
  }
}

export function triggerSound(type: 'check' | 'uncheck' | 'delete' | 'celebrate' = 'check', enabled = true) {
  if (!enabled) return;
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'check') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'uncheck') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'celebrate') {
      // Fanfare chord
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, now + i * 0.08);
        g.gain.setValueAtTime(0.2, now + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.4);
        o.start(now + i * 0.08);
        o.stop(now + i * 0.08 + 0.4);
      });
    } else if (type === 'delete') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch {
    // Audio context prevented or unsupported
  }
}

// Templates Ready-to-import
export const ROUTINE_TEMPLATES = {
  casa_minima: [
    { title: 'Fazer a cama ao acordar', priority: 'NORMAL' as const, categoryId: 'cat_r_casa' },
    { title: 'Abrir janelas para renovar ar', priority: 'NORMAL' as const, categoryId: 'cat_r_casa' },
    { title: 'Lavar louça acumulada', priority: 'IMPORTANTE' as const, categoryId: 'cat_r_casa' },
    { title: 'Limpar fogão e pia', priority: 'NORMAL' as const, categoryId: 'cat_r_casa' },
    { title: 'Guardar objetos espalhados (5min)', priority: 'NORMAL' as const, categoryId: 'cat_r_casa' },
    { title: 'Trocar saco de lixo', priority: 'IMPORTANTE' as const, categoryId: 'cat_r_casa' },
    { title: 'Deixar cozinha organizada para amanhã', priority: 'IMPORTANTE' as const, categoryId: 'cat_r_casa' },
  ],
  semanal_casa: [
    { title: 'Lavar roupas acumuladas', priority: 'IMPORTANTE' as const, categoryId: 'cat_r_casa' },
    { title: 'Trocar roupa de cama e toalhas', priority: 'NORMAL' as const, categoryId: 'cat_r_casa' },
    { title: 'Limpar banheiro completo', priority: 'URGENTE' as const, categoryId: 'cat_r_casa' },
    { title: 'Varrer / aspirar chão da casa', priority: 'NORMAL' as const, categoryId: 'cat_r_casa' },
    { title: 'Organizar superfícies e mesas', priority: 'NORMAL' as const, categoryId: 'cat_r_casa' },
    { title: 'Limpar geladeira / descartar vencidos', priority: 'IMPORTANTE' as const, categoryId: 'cat_r_casa' },
  ],
  mensal_casa: [
    { title: 'Limpar armários por dentro', priority: 'NORMAL' as const, categoryId: 'cat_r_casa' },
    { title: 'Organizar gavetas e papéis', priority: 'NORMAL' as const, categoryId: 'cat_r_casa' },
    { title: 'Limpar forno e exaustor', priority: 'IMPORTANTE' as const, categoryId: 'cat_r_casa' },
    { title: 'Lavar lixeira principal', priority: 'NORMAL' as const, categoryId: 'cat_r_casa' },
    { title: 'Descartar ou doar roupas/itens que não usa', priority: 'IMPORTANTE' as const, categoryId: 'cat_r_casa' },
  ],
  antiburnout: [
    { title: 'Regra dos 2 Minutos (Se leva <2min, faça agora)', priority: 'URGENTE' as const, categoryId: 'cat_r_pess' },
    { title: 'Regra dos 5 Segundos (Conte 5-4-3-2-1 e levante)', priority: 'IMPORTANTE' as const, categoryId: 'cat_r_pess' },
    { title: 'Técnica Pomodoro (25min foco ininterrupto)', priority: 'URGENTE' as const, categoryId: 'cat_r_trab' },
    { title: 'Regra 1-3-5 (1 Grande, 3 Médias, 5 Pequenas no dia)', priority: 'IMPORTANTE' as const, categoryId: 'cat_r_trab' },
  ]
};

export const SPENDING_TRAPS = [
  "Pedir delivery seguido consome muito sem você perceber no fim do mês.",
  "Comprar no supermercado sem lista de compras gera gastos desnecessários.",
  "Ir ao mercado várias vezes na semana aumenta impulsos de compra.",
  "Comprar ingredientes perecíveis que você nunca usa é dinheiro direto no lixo.",
  "Assinaturas digitais esquecidas corroem o orçamento silenciosamente.",
  "A armadilha do 'eu mereço' é a maior causadora de dívidas de cartão."
];

export const AVATAR_LIST = [
  '🦁', '🐺', '🦅', '🐉', '🐯', '🦊', '🐻', '🦉', '🦈', '🥷', '🤖', '👾', '🧑‍💻', '👩‍💻', '🧑‍🚀', '👨‍🚀', '🧙‍♂️', '🧝‍♀️', '🦸‍♂️', '🪐', '⚡', '🔥'
];

export const BASE_COOKING_GUIDE = [
  {
    title: 'ARROZ PERFEITO',
    icon: '🍚',
    color: '#C8FF00',
    summary: 'Aprender a medida básica e fazer quantidade suficiente',
    steps: [
      '1 copo de arroz para 2 copos de água quente.',
      'Refogue bem o alho picado em um fio de azeite antes.',
      'Quando ferver, abaixe o fogo ao mínimo e tampe metade.',
      'Quando secar, desligue e deixe tampado por 10 minutos para soltar.',
      'Batch cooking: Faça para 3-4 dias e guarde em pote hermético no frio.'
    ]
  },
  {
    title: 'FEIJÕES SUCULENTOS',
    icon: '🍲',
    color: '#FF4D4D',
    summary: 'Congelar porções e temperar de forma simples na semana',
    steps: [
      'Deixe o feijão de molho por 8h a 12h (troque a água 1 vez) para evitar gases.',
      'Cozinhe na pressão por 25 minutos apenas com água e 1 folha de louro.',
      'Congele o feijão cozido em potes individuais (sem tempero).',
      'Na hora de comer: refogue alho fresco no azeite/manteiga, jogue a porção e amasse uma concha para engrossar o caldo.'
    ]
  },
  {
    title: 'FRANGO SEM SEGREDO',
    icon: '🍗',
    color: '#FFB84D',
    summary: 'Aprender tempero básico e deixar porções prontas no congelador',
    steps: [
      'Corte peito de frango em bifes ou cubos uniformes.',
      'Tempero coringa: sal, pimenta do reino, páprica defumada, alho e um pingo de limão.',
      'Grelha quente: não mexa nos primeiros 3 minutos para criar crosta dourada.',
      'Guarde em potes já desfiado ou em tiras para sanduíches e almoços rápidos, anulando a tentação do delivery.'
    ]
  },
  {
    title: 'OVOS SALVA-VIDAS',
    icon: '🍳',
    color: '#4DA6FF',
    summary: 'Omelete, mexido ou cozido — a refeição rápida quando falta energia',
    steps: [
      'Mexido cremoso: fogo bem baixo, mexendo sempre e tirando da chama antes de ressecar.',
      'Omelete reforçada: bata 3 ovos com aveia, queijo e espinafre/tomate.',
      'Cozido perfeito: água fervendo, coloque com cuidado e marque exatamente 7 min para gema cremosa ou 10 min para firme.'
    ]
  },
  {
    title: 'MASSA DE 10 MINUTOS',
    icon: '🍝',
    color: '#B366FF',
    summary: 'Molho simples já salva muito tempo com proteína e legumes',
    steps: [
      'Ferva bastante água com sal (água salgada como o mar).',
      'Molho express: refogue alho em azeite generoso, coloque passata de tomate automática, sal, ógano e majericão.',
      'Jogue a massa cozida al dente direto na frigideira do molho com 2 colheres da água do cozimento para emulsificar.'
    ]
  }
];

export const SMART_GROCERY_SUGGESTIONS = [
  { name: 'Arroz Integral ou Branco', cat: 'Base' },
  { name: 'Feijão Preto ou Carioca', cat: 'Base' },
  { name: 'Ovos (Cartela 30 un)', cat: 'Proteína' },
  { name: 'Peito de Frango', cat: 'Proteína' },
  { name: 'Carne Moída Patinho', cat: 'Proteína' },
  { name: 'Aveia em flocos', cat: 'Carbo' },
  { name: 'Macarrão / Massa', cat: 'Carbo' },
  { name: 'Legumes Congelados', cat: 'Prático' },
  { name: 'Alho triturado congelado', cat: 'Tempero' },
  { name: 'Molho de Tomate Passata', cat: 'Base' },
  { name: 'Banana / Maçã', cat: 'Frutas' },
  { name: 'Iogurte Natural', cat: 'Lanche' },
  { name: 'Azeite de Oliva Extra Virgem', cat: 'Base' }
];
