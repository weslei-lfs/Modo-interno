import React, { useState, useEffect } from 'react';
import { Home, CheckSquare, DollarSign, Utensils, Settings, Search, Wifi, BatteryCharging } from 'lucide-react';
import { TabType, AppDatabase } from '../types';
import { triggerHaptic } from '../lib/storage';

interface AndroidContainerProps {
  activeTab: TabType;
  db: AppDatabase;
  onTabChange: (tab: TabType) => void;
  onOpenSearch: () => void;
  children: React.ReactNode;
}

export const AndroidContainer: React.FC<AndroidContainerProps> = ({
  activeTab,
  db,
  onTabChange,
  onOpenSearch,
  children,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Início', icon: <Home className="w-5 h-5" /> },
    { id: 'routine', label: 'Rotina', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'finance', label: 'Financeiro', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'meals', label: 'Alimentação', icon: <Utensils className="w-5 h-5" /> },
    { id: 'settings', label: 'Config', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans select-none pb-16 md:pb-0">
      {/* Smartphone Device Frame Simulator for Desktop / Full mobile viewport */}
      <div className="flex-1 flex flex-col max-w-md w-full mx-auto bg-[#0D0D0D] min-h-screen relative shadow-2xl border-x border-[#1A1A1A]">
        {/* Simulated Native Android Status Bar */}
        <div className="h-9 px-5 bg-[#0D0D0D] flex items-center justify-between text-[11px] font-mono text-gray-400 border-b border-[#1A1A1A]/50 shrink-0 select-none">
          <span className="font-bold text-white">{currentTime || '09:41'}</span>
          <div className="flex items-center gap-2">
            <span className="text-[9px] px-1 bg-[#1A1A1A] text-[#C8FF00] rounded font-bold">OFFLINE ROOM</span>
            <Wifi className="w-3 h-3 text-gray-300" />
            <BatteryCharging className="w-3.5 h-3.5 text-[#C8FF00]" />
          </div>
        </div>

        {/* Top App Bar */}
        <header className="px-5 py-3.5 bg-[#0D0D0D] flex items-center justify-between border-b border-[#1A1A1A] sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#C8FF00] text-[#0D0D0D] flex items-center justify-center font-display font-black text-sm shadow-[0_0_15px_rgba(200,255,0,0.3)]">
              MI
            </div>
            <div>
              <h1 className="font-display font-extrabold text-base tracking-tight text-white leading-none">
                MODO INTERNO
              </h1>
              <span className="text-[10px] font-mono text-[#AAAAAA]">Room DB • {db.settings.name}</span>
            </div>
          </div>

          <button
            onClick={() => { triggerHaptic(true); onOpenSearch(); }}
            className="p-2 text-gray-300 hover:text-white bg-[#1A1A1A] hover:bg-[#222222] rounded-xl border border-[#2A2A2A] transition-colors flex items-center justify-center"
            aria-label="Busca Global"
          >
            <Search className="w-4 h-4 text-[#C8FF00]" />
          </button>
        </header>

        {/* Main View Area */}
        <main className="flex-1 overflow-y-auto relative pb-24">
          {children}
        </main>

        {/* Material 3 Bottom Navigation Bar */}
        <nav className="fixed md:absolute bottom-0 left-0 right-0 max-w-md mx-auto h-20 bg-[#1A1A1A] border-t border-[#2A2A2A] px-2 flex items-center justify-around z-40">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { triggerHaptic(true); onTabChange(item.id); }}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all relative ${
                  isActive ? 'text-[#C8FF00]' : 'text-[#AAAAAA] hover:text-gray-200'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#C8FF00]/15' : ''}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-medium tracking-tight mt-1 ${isActive ? 'font-bold text-white' : ''}`}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 bg-[#C8FF00] rounded-full shadow-[0_0_8px_#C8FF00]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
