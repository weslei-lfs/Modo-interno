import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Palette, Home, Briefcase, Heart, BookOpen, Brain, Gamepad2, Utensils, Car, GraduationCap, Shirt, Package, Dumbbell, Coffee, Music, Camera, Sun, Moon, Shield, Star, Smile, Sparkles, Zap, Flame, Target, Trophy, Clock, DollarSign, ShoppingCart, Film, Gift, MapPin } from 'lucide-react';
import { Category } from '../types';
import { triggerHaptic } from '../lib/storage';

interface CategoryModalProps {
  show: boolean;
  type: 'routine' | 'finance';
  onSave: (cat: Omit<Category, 'id'>) => void;
  onClose: () => void;
}

const COLORS = [
  '#C8FF00', '#FF4D4D', '#4DA6FF', '#FFB84D', '#00E6AC', '#B366FF', '#FF80DF', '#AAAAAA', '#FFD700', '#00FFFF', '#FF007F', '#7F00FF'
];

const ICON_MAP: Record<string, React.ReactNode> = {
  Home: <Home className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
  Gamepad2: <Gamepad2 className="w-5 h-5" />,
  Utensils: <Utensils className="w-5 h-5" />,
  Car: <Car className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  Shirt: <Shirt className="w-5 h-5" />,
  Package: <Package className="w-5 h-5" />,
  Dumbbell: <Dumbbell className="w-5 h-5" />,
  Coffee: <Coffee className="w-5 h-5" />,
  Music: <Music className="w-5 h-5" />,
  Camera: <Camera className="w-5 h-5" />,
  Sun: <Sun className="w-5 h-5" />,
  Moon: <Moon className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Star: <Star className="w-5 h-5" />,
  Smile: <Smile className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  Trophy: <Trophy className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  DollarSign: <DollarSign className="w-5 h-5" />,
  ShoppingCart: <ShoppingCart className="w-5 h-5" />,
  Film: <Film className="w-5 h-5" />,
  Gift: <Gift className="w-5 h-5" />,
  MapPin: <MapPin className="w-5 h-5" />,
};

export const CategoryModal: React.FC<CategoryModalProps> = ({ show, type, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [iconName, setIconName] = useState('Home');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    triggerHaptic(true);
    onSave({
      name: name.trim(),
      color,
      icon: iconName,
      type
    });
    setName('');
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
          >
            <div className="p-4 bg-[#222222] border-b border-[#2A2A2A] flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#C8FF00]" /> Nova Categoria ({type === 'routine' ? 'Rotina' : 'Financeiro'})
              </h3>
              <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nome da Categoria</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Treinos, Hobbies, Moradia..."
                  className="w-full p-3 bg-[#222222] border border-[#2A2A2A] rounded-xl text-white text-sm focus:border-[#C8FF00] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Cor Destaque</label>
                <div className="grid grid-cols-6 gap-2">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform ${color === c ? 'scale-110 ring-2 ring-white shadow-lg' : 'opacity-70'}`}
                      style={{ backgroundColor: c }}
                    >
                      {color === c && <Check className="w-4 h-4 text-black stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Ícone Representativo</label>
                <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1 bg-[#222222] rounded-xl">
                  {Object.keys(ICON_MAP).map(k => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setIconName(k)}
                      className={`p-2 rounded-xl flex items-center justify-center transition-all ${iconName === k ? 'bg-[#C8FF00] text-[#0D0D0D] font-bold shadow-md' : 'text-gray-400 hover:text-white'}`}
                    >
                      {ICON_MAP[k]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#C8FF00] hover:bg-[#b3e600] text-[#0D0D0D] font-extrabold text-xs rounded-xl uppercase tracking-widest shadow-md"
              >
                CRIAR CATEGORIA
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export function renderCategoryIcon(iconName: string) {
  return ICON_MAP[iconName] || <Home className="w-4 h-4" />;
}
