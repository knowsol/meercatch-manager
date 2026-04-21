'use client';
import type { Toast, ToastType } from '../../hooks/useToast';

interface ToastContainerProps {
  toasts: Toast[];
}

export default function ToastContainer({ toasts }: ToastContainerProps) {
  const icons: Record<ToastType, string> = { ok: '✓', err: '✕', warn: '!', info: 'i' };
  return (
    <div id="toast-root">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span className="toast-icon">{icons[t.type] || '✓'}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
