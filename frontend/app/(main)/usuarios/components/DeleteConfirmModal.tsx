'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/types';

interface DeleteConfirmModalProps {
  user: User | null;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({ user, deleting, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <AnimatePresence>
      {user && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[#0d111d] border border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative z-[110]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight mb-2">¿Eliminar Usuario?</h3>
              <p className="text-slate-400 mb-8">
                Estás a punto de eliminar a <span className="text-white font-semibold">{user.nombre}</span>. Esta acción no se puede deshacer.
              </p>
              <div className="flex w-full gap-3">
                <Button type="button" variant="outline" onClick={onCancel} disabled={deleting}
                  className="flex-1 py-6 border-slate-800 bg-transparent hover:bg-white/5 hover:text-white text-slate-300"
                >
                  Cancelar
                </Button>
                <Button type="button" onClick={onConfirm} disabled={deleting}
                  className="flex-1 py-6 bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xl shadow-rose-600/20"
                >
                  {deleting ? <Loader2 size={18} className="animate-spin mr-2" /> : <Trash2 size={18} className="mr-2" />}
                  Eliminar
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
