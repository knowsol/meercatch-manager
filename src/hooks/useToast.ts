'use client';
import { useState, useCallback } from 'react';

export type ToastType = 'ok' | 'err' | 'warn' | 'info';

export interface Toast {
  id: number;
  msg: string;
  type: ToastType;
}

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((msg: string, type: ToastType = 'ok') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  return { toasts, toast };
}
