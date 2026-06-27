import React from 'react';
import { RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UndoSnackbarProps {
  show: boolean;
  message: string;
  onUndo: () => void;
  onDismiss?: () => void;
}

export const UndoSnackbar: React.FC<UndoSnackbarProps> = ({ show, message, onUndo }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 bg-[#222222] border border-[#C8FF00]/40 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between"
        >
          <span className="text-sm font-medium text-gray-200 truncate pr-2">{message}</span>
          <button
            onClick={onUndo}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C8FF00] text-[#0D0D0D] text-xs font-bold rounded-xl active:scale-95 transition-transform shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Desfazer
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
