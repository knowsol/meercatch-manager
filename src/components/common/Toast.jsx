'use client'
export default function ToastContainer({ toasts }) {
  const icons = { ok: '✓', err: '✕', warn: '!', info: 'i' };
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
