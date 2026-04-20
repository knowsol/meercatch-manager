'use client'
import { useState } from 'react';

export default function SelectModal({ title, items, getLabel, onConfirm, onClose }) {
  const [selected, setSelected] = useState(new Set());

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-hd">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-bd">
          {items.length === 0
            ? <div className="empty"><div className="empty-title">추가할 항목이 없습니다</div></div>
            : items.map((item, i) => {
                const id = item.id || item.groupId || item.policyId || item.userId || i;
                const { name, sub } = getLabel(item);
                return (
                  <div key={id} className="modal-item" onClick={() => toggle(id)}>
                    <input type="checkbox" checked={selected.has(id)} onChange={() => toggle(id)} />
                    <div className="modal-item-info">
                      <div className="modal-item-name">{name}</div>
                      {sub && <div className="modal-item-sub">{sub}</div>}
                    </div>
                  </div>
                );
              })
          }
        </div>
        <div className="modal-ft">
          <button className="btn btn-outline" onClick={onClose}>취소</button>
          <button className="btn btn-p" onClick={() => { onConfirm(items.filter((item, i) => selected.has(item.id || item.groupId || item.policyId || item.userId || i))); onClose(); }}>
            추가 ({selected.size})
          </button>
        </div>
      </div>
    </div>
  );
}
