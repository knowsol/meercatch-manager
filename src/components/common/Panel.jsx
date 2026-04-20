'use client'
import { usePanel } from '../../context/PanelContext';

export default function PanelShell() {
  const { panel, closePanel } = usePanel();
  return (
    <>
      <div className={`pnl-overlay${panel ? ' open' : ''}`} onClick={closePanel} />
      <div className={`pnl${panel ? ' open' : ''}`}>
        {panel?.component}
      </div>
    </>
  );
}

export function PanelLayout({ title, body, footer }) {
  const { closePanel } = usePanel();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mod-h">
        <button className="cx" onClick={closePanel}>✕</button>
        <h2>{title}</h2>
      </div>
      <div className="mod-b">{body}</div>
      <div className="mod-f">{footer}</div>
    </div>
  );
}
