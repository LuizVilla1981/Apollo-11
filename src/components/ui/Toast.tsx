import { useEffect, useState, useCallback, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error';

type Toast = {
  id: number;
  type: ToastType;
  message: string;
};

type ToastContextValue = {
  showToast: (type: ToastType, message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return { showToast: (_type: ToastType, _message: string) => {} };
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = ++nextId;
    setToasts((current) => [...current.slice(-2), { id, type, message }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 left-4 right-4 z-[100] flex flex-col items-end gap-3 pointer-events-none sm:left-auto sm:right-8 sm:bottom-8 sm:max-w-sm sm:w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div key={toast.id} layout>
              <ToastItem id={toast.id} type={toast.type} message={toast.message} onDismiss={dismiss} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

type ToastItemProps = { id: number; type: ToastType; message: string; onDismiss: (id: number) => void };

function ToastItem({ id, type, message, onDismiss }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 4500);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;
  const borderColor = type === 'success' ? 'border-emerald-500/30' : 'border-rose-400/30';
  const iconColor = type === 'success' ? 'text-emerald-400' : 'text-rose-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`pointer-events-auto flex items-start gap-3 rounded-2xl border ${borderColor} bg-surface-container/95 backdrop-blur-xl px-4 py-3 shadow-[0_16px_48px_rgba(0,0,0,0.4)]`}
    >
      <Icon size={18} className={`mt-0.5 shrink-0 ${iconColor}`} />
      <p className="flex-1 text-sm leading-6 text-on-surface">{message}</p>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        className="shrink-0 rounded-full p-1 text-on-surface-variant transition-colors hover:text-on-surface"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
