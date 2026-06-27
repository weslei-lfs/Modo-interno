import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Bell, Sliders, HardDrive, Shield, HelpCircle, Download, Upload, Trash2, Sun, Moon, Volume2, Vibrate, Check, RefreshCw, Smartphone, Sparkles, DollarSign, Droplets } from 'lucide-react';
import { AppDatabase, UserSettings } from '../types';
import { triggerHaptic, triggerSound, AVATAR_LIST } from '../lib/storage';

interface SettingsTabProps {
  db: AppDatabase;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  onExportBackup: () => void;
  onImportBackup: (importedDb: AppDatabase) => void;
  onClearSection: (section: 'routine' | 'finance' | 'meals' | 'all') => void;
  onResetOnboarding: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  db,
  onUpdateSettings,
  onExportBackup,
  onImportBackup,
  onClearSection,
  onResetOnboarding,
}) => {
  const [activeSection, setActiveSection] = useState<'perfil' | 'notif' | 'org' | 'backup' | 'sobre'>('perfil');

  const [name, setName] = useState(db.settings.name);
  const [avatar, setAvatar] = useState(db.settings.avatar);
  const [wakeTime, setWakeTime] = useState(db.settings.wakeTime);
  const [sleepTime, setSleepTime] = useState(db.settings.sleepTime);

  const [notifEnabled, setNotifEnabled] = useState(db.settings.notificationsEnabled);
  const [morningTime, setMorningTime] = useState(db.settings.morningReminderTime);
  const [nightTime, setNightTime] = useState(db.settings.nightReminderTime);
  const [sound, setSound] = useState(db.settings.soundEnabled);
  const [haptic, setHaptic] = useState(db.settings.hapticEnabled);

  const [weekStart, setWeekStart] = useState(db.settings.weekStart);
  const [currency, setCurrency] = useState(db.settings.currency);
  const [waterGoal, setWaterGoal] = useState(db.settings.waterGoal.toString());
  const [deliveryLimit, setDeliveryLimit] = useState(db.settings.deliveryLimit.toString());

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(true);
    triggerSound('check', true);
    onUpdateSettings({
      name: name.trim() || 'Guerreiro',
      avatar,
      wakeTime,
      sleepTime
    });
    alert('Perfil atualizado com sucesso no Room DB!');
  };

  const handleNotifSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(true);
    triggerSound('check', true);
    onUpdateSettings({
      notificationsEnabled: notifEnabled,
      morningReminderTime: morningTime,
      nightReminderTime: nightTime,
      soundEnabled: sound,
      hapticEnabled: haptic
    });
    alert('Preferências de notificação e feedback sonoro atualizadas!');
  };

  const handleOrgSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(true);
    triggerSound('check', true);
    onUpdateSettings({
      weekStart,
      currency,
      waterGoal: parseInt(waterGoal) || 8,
      deliveryLimit: parseInt(deliveryLimit) || 2
    });
    alert('Configurações de organização salvas!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          triggerSound('celebrate', true);
          onImportBackup(parsed as AppDatabase);
          alert('Backup restaurado com sucesso!');
        } else {
          alert('Arquivo JSON de backup inválido.');
        }
      } catch {
        alert('Falha ao ler o arquivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Estimate localStorage usage bytes
  const rawJson = JSON.stringify(db);
  const bytes = new Blob([rawJson]).size;
  const kb = (bytes / 1024).toFixed(1);

  return (
    <div className="p-5 space-y-6 pb-28 min-h-full">
      {/* Sub tabs config */}
      <div className="grid grid-cols-5 gap-1 bg-[#1A1A1A] p-1 rounded-2xl border border-[#2A2A2A]">
        {[
          { id: 'perfil', label: 'Perfil', icon: <User className="w-3.5 h-3.5 mx-auto mb-0.5" /> },
          { id: 'notif', label: 'Notif', icon: <Bell className="w-3.5 h-3.5 mx-auto mb-0.5" /> },
          { id: 'org', label: 'Geral', icon: <Sliders className="w-3.5 h-3.5 mx-auto mb-0.5" /> },
          { id: 'backup', label: 'Dados', icon: <HardDrive className="w-3.5 h-3.5 mx-auto mb-0.5" /> },
          { id: 'sobre', label: 'Sobre', icon: <Smartphone className="w-3.5 h-3.5 mx-auto mb-0.5" /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { triggerHaptic(true); setActiveSection(t.id as typeof activeSection); }}
            className={`py-2 text-[10px] font-bold rounded-xl transition-all flex flex-col items-center ${activeSection === t.id ? 'bg-[#C8FF00] text-[#0D0D0D] shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {activeSection === 'perfil' && (
        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleProfileSave} className="p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl space-y-5 shadow-xl">
          <h3 className="font-display font-bold text-base text-white border-b border-[#2A2A2A] pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-[#C8FF00]" /> Perfil e Horários Biológicos
          </h3>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Avatar Selecionável (Sem Foto Real)</label>
            <div className="grid grid-cols-6 gap-2 max-h-36 overflow-y-auto p-2 bg-[#222222] rounded-2xl border border-[#2A2A2A]">
              {AVATAR_LIST.map(av => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`p-2.5 text-2xl rounded-xl transition-all flex items-center justify-center ${avatar === av ? 'bg-[#C8FF00] scale-110 shadow-lg' : 'hover:bg-[#1A1A1A]'}`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nome / Apelido no App</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-3.5 bg-[#222222] border border-[#2A2A2A] rounded-xl text-white text-sm font-medium focus:border-[#C8FF00] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-[#C8FF00]" /> Hora de Acordar
              </label>
              <input
                type="time"
                required
                value={wakeTime}
                onChange={e => setWakeTime(e.target.value)}
                className="w-full p-3.5 bg-[#222222] border border-[#2A2A2A] rounded-xl text-white text-sm font-mono focus:border-[#C8FF00] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Moon className="w-3.5 h-3.5 text-[#4DA6FF]" /> Hora de Dormir
              </label>
              <input
                type="time"
                required
                value={sleepTime}
                onChange={e => setSleepTime(e.target.value)}
                className="w-full p-3.5 bg-[#222222] border border-[#2A2A2A] rounded-xl text-white text-sm font-mono focus:border-[#4DA6FF] focus:outline-none"
              />
            </div>
          </div>

          <button type="submit" className="w-full py-3.5 bg-[#C8FF00] text-[#0D0D0D] font-extrabold text-xs rounded-xl uppercase tracking-widest shadow-md">
            SALVAR PERFIL
          </button>
        </motion.form>
      )}

      {activeSection === 'notif' && (
        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleNotifSave} className="p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl space-y-5 shadow-xl">
          <h3 className="font-display font-bold text-base text-white border-b border-[#2A2A2A] pb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#FF4D4D]" /> Lembretes e Feedback Sensorial
          </h3>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-3.5 bg-[#222222] rounded-2xl cursor-pointer">
              <span className="text-xs font-bold text-white">Ativar Lembretes Matinal/Noturno</span>
              <input type="checkbox" checked={notifEnabled} onChange={e => setNotifEnabled(e.target.checked)} className="w-5 h-5 accent-[#C8FF00]" />
            </label>

            {notifEnabled && (
              <div className="grid grid-cols-2 gap-3 pl-2">
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-1">Lembrete Matinal</label>
                  <input type="time" value={morningTime} onChange={e => setMorningTime(e.target.value)} className="w-full p-3 bg-[#222222] border rounded-xl text-white text-xs font-mono" />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-1">Revisão Noturna</label>
                  <input type="time" value={nightTime} onChange={e => setNightTime(e.target.value)} className="w-full p-3 bg-[#222222] border rounded-xl text-white text-xs font-mono" />
                </div>
              </div>
            )}

            <div className="border-t border-[#2A2A2A] pt-4 space-y-3">
              <label className="flex items-center justify-between p-3.5 bg-[#222222] rounded-2xl cursor-pointer">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#4DA6FF]" /> Efeitos Sonoros (Check haptic synth)
                </span>
                <input type="checkbox" checked={sound} onChange={e => setSound(e.target.checked)} className="w-5 h-5 accent-[#4DA6FF]" />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-[#222222] rounded-2xl cursor-pointer">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Vibrate className="w-4 h-4 text-[#C8FF00]" /> Vibração Haptic Feedback
                </span>
                <input type="checkbox" checked={haptic} onChange={e => setHaptic(e.target.checked)} className="w-5 h-5 accent-[#C8FF00]" />
              </label>
            </div>
          </div>

          <button type="submit" className="w-full py-3.5 bg-[#FF4D4D] text-white font-extrabold text-xs rounded-xl uppercase tracking-widest shadow-md">
            SALVAR PREFERÊNCIAS
          </button>
        </motion.form>
      )}

      {activeSection === 'org' && (
        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleOrgSave} className="p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl space-y-5 shadow-xl">
          <h3 className="font-display font-bold text-base text-white border-b border-[#2A2A2A] pb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#4DA6FF]" /> Organização e Moeda
          </h3>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Início da Semana</label>
            <select value={weekStart} onChange={e => setWeekStart(e.target.value as typeof weekStart)} className="w-full p-3.5 bg-[#222222] border border-[#2A2A2A] rounded-xl text-white text-xs">
              <option value="segunda">Segunda-feira</option>
              <option value="domingo">Domingo</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3 text-[#C8FF00]" /> Moeda</label>
              <input type="text" value={currency} onChange={e => setCurrency(e.target.value)} className="w-full p-3.5 bg-[#222222] border rounded-xl text-white text-xs font-mono font-bold" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Droplets className="w-3 h-3 text-[#4DA6FF]" /> Água Copos</label>
              <input type="number" value={waterGoal} onChange={e => setWaterGoal(e.target.value)} className="w-full p-3.5 bg-[#222222] border rounded-xl text-white text-xs font-mono font-bold" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Max Delivery</label>
              <input type="number" value={deliveryLimit} onChange={e => setDeliveryLimit(e.target.value)} className="w-full p-3.5 bg-[#222222] border rounded-xl text-white text-xs font-mono font-bold" />
            </div>
          </div>

          <button type="submit" className="w-full py-3.5 bg-[#4DA6FF] text-white font-extrabold text-xs rounded-xl uppercase tracking-widest shadow-md">
            SALVAR ORGANIZAÇÃO
          </button>
        </motion.form>
      )}

      {activeSection === 'backup' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl space-y-5 shadow-xl">
          <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#FFB84D]" /> Banco Room Offline & Backup
            </h3>
            <span className="text-xs font-mono bg-[#222222] text-[#C8FF00] px-2 py-1 rounded font-bold">
              {kb} KB Usados
            </span>
          </div>

          <div className="space-y-3">
            <button
              onClick={onExportBackup}
              className="w-full py-3.5 px-4 bg-[#222222] hover:bg-[#2a2a2a] text-[#C8FF00] border border-[#C8FF00]/40 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" /> EXPORTAR BACKUP JSON (Baixar Arquivo)
            </button>

            <label className="w-full py-3.5 px-4 bg-[#222222] hover:bg-[#2a2a2a] text-[#4DA6FF] border border-[#4DA6FF]/40 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md">
              <Upload className="w-4 h-4" /> IMPORTAR BACKUP JSON
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="border-t border-[#2A2A2A] pt-4 space-y-2">
            <span className="text-xs font-bold text-[#FF4D4D] uppercase tracking-wider block mb-1">Zona de Exclusão Local</span>
            
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => onClearSection('routine')} className="p-2.5 bg-[#221212] hover:bg-[#331818] text-[#FF4D4D] border border-[#FF4D4D]/40 text-xs font-bold rounded-xl flex items-center justify-center gap-1">
                <Trash2 className="w-3.5 h-3.5" /> Zerar Rotina
              </button>
              <button onClick={() => onClearSection('finance')} className="p-2.5 bg-[#221212] hover:bg-[#331818] text-[#FF4D4D] border border-[#FF4D4D]/40 text-xs font-bold rounded-xl flex items-center justify-center gap-1">
                <Trash2 className="w-3.5 h-3.5" /> Zerar Financeiro
              </button>
            </div>

            <button onClick={() => onClearSection('all')} className="w-full p-3 bg-[#FF4D4D] hover:bg-[#e60000] text-white font-black text-xs rounded-xl uppercase tracking-widest mt-2 shadow-lg">
              💥 RESETAR TODO O BANCO ROOM DATABASE
            </button>
          </div>
        </motion.div>
      )}

      {activeSection === 'sobre' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl space-y-4 shadow-xl text-xs leading-relaxed text-gray-300">
          <div className="text-center pb-3 border-b border-[#2A2A2A]">
            <div className="w-12 h-12 mx-auto mb-2 bg-[#C8FF00] text-[#0D0D0D] rounded-2xl flex items-center justify-center font-display font-black text-xl shadow-[0_0_20px_rgba(200,255,0,0.3)]">
              MI
            </div>
            <h3 className="font-display font-extrabold text-lg text-white">MODO INTERNO</h3>
            <p className="text-[11px] text-gray-400 font-mono">com.modointerno.app • Build Nativo 35</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-[#222222] rounded-xl space-y-1">
              <h4 className="font-bold text-white flex items-center gap-1.5"><Shield className="w-4 h-4 text-[#C8FF00]" /> Privacidade Absoluta</h4>
              <p className="text-[11px] text-gray-400">Este app funciona 100% offline com banco local embutido (Room DB). Nenhuma telemetria, cookies ou dados são enviados a servidores externos.</p>
            </div>

            <div className="p-3 bg-[#222222] rounded-xl space-y-1">
              <h4 className="font-bold text-white flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-[#4DA6FF]" /> Arquitetura Jetpack Compose Sim</h4>
              <p className="text-[11px] text-gray-400">Construído seguindo especificações estritas do Material Design 3 com dark mode permanente #0D0D0D e destaques neon.</p>
            </div>

            <button
              onClick={onResetOnboarding}
              className="w-full p-3 bg-[#222222] hover:bg-[#2a2a2a] text-[#C8FF00] border border-[#C8FF00]/50 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Reexibir Tour de Boas-Vindas
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
