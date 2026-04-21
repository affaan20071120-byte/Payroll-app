import React from 'react';
import { motion } from 'motion/react';

interface DeleteModalProps {
  mode: 'selected' | 'all';
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({ mode, count, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-gradient-to-br from-[#2a0815] to-[#1a050e] border-2 border-[#ff3366] rounded-3xl p-8 max-w-[400px] w-full shadow-[0_0_50px_rgba(255,51,102,0.3)]"
      >
        <div className="text-5xl text-center mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-center mb-4 text-[#ff3366]">Confirm Deletion</h2>
        
        <p className="text-center text-white/80 mb-8">
          {mode === 'selected' 
            ? `Are you sure you want to delete ${count} selected employee${count > 1 ? 's' : ''}?` 
            : 'Are you sure you want to delete ALL employees in this tab?'}
        </p>

        <div className="flex gap-4">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#ff003c] hover:shadow-[0_0_20px_#ff3366] text-white font-semibold transition-all"
          >
            Yes, Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
