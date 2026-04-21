'use client';
import { useState, MouseEvent } from 'react';

interface SelectModalItem {
  id?: string;
  groupId?: string;
  policyId?: string;
  userId?: string;
  [key: string]: unknown;
}

interface LabelResult {
  name: string;
  sub?: string;
}

interface SelectModalProps<T extends SelectModalItem> {
  title: string;
  items: T[];
  getLabel: (item: T) => LabelResult;
  onConfirm: (selected: T[]) => void;
  onClose: () => void;
}

export default function SelectModal<T extends SelectModalItem>({ 
  title, 
  items, 
  getLabel, 
  onConfirm, 
  onClose 
}: SelectModalProps<T>) {
  const [selected, setSelected] = useState<Set<string | number>>(new Set());

  const getItemId = (item: T, index: number): string | number => {
    return item.id || item.groupId || item.policyId || item.userId || index;
  };

  const toggle = (id: string | number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay open" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-hd">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-bd">
          {items.length === 0
            ? <div className="empty"><div className="empty-title">추가할 항목이 없습니다</div></div>
            : items.map((item, i) => {
                const id = getItemId(item, i);
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
          <button 
            className="btn btn-p" 
            onClick={() => { 
              onConfirm(items.filter((item, i) => selected.has(getItemId(item, i)))); 
              onClose(); 
            }}
          >
            추가 ({selected.size})
          </button>
        </div>
      </div>
    </div>
  );
}
