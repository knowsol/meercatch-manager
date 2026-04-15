import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';

const DETECTION_ITEMS = ['배', '여성가슴', '남성가슴', '엉덩이', '여성성기', '남성성기'];
const GAMBLING_GRADES = ['상', '중', '하'];

export default function PolicyNewPanel() {
  const { closePanel } = usePanel();
  const toast = useToastCtx();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [detItems, setDetItems] = useState([...DETECTION_ITEMS]);
  const [grade, setGrade] = useState('하');
  const [active, setActive] = useState(true);
  const [nameError, setNameError] = useState(false);

  function toggleItem(item) {
    setDetItems(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  }

  function onSave() {
    if (!name.trim()) { setNameError(true); toast('정책 이름을 입력하세요.', 'err'); return; }
    if (!selectedType) { toast('탐지 유형을 선택하세요.', 'err'); return; }
    if (selectedType === '선정성' && detItems.length === 0) { toast('탐지 항목을 하나 이상 선택하세요.', 'err'); return; }
    toast('정책이 생성되었습니다.');
    closePanel();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mod-h">
        <button className="cx" onClick={closePanel}>✕</button>
        <h2>정책 생성</h2>
      </div>
      <div className="mod-b" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="fg">
          <label>정책 이름 <span className="req">*</span></label>
          <input className={'inp' + (nameError ? ' error' : '')} type="text" placeholder="정책 이름"
            value={name} onChange={e => { setName(e.target.value); setNameError(false); }} />
        </div>
        <div className="fg">
          <label>설명</label>
          <textarea className="inp" placeholder="설명" rows={3} value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <div className="fg">
          <label>탐지 유형</label>
          <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
            {['선정성', '도박'].map(type => {
              const color = type === '선정성' ? '#ef4444' : '#f59e0b';
              const isSelected = selectedType === type;
              return (
                <div key={type}
                  style={{ padding: '10px 20px', border: '2px solid ' + (isSelected ? color : 'var(--bd)'),
                    borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14,
                    color: isSelected ? color : '#64748b',
                    background: isSelected ? (type === '선정성' ? '#fef2f2' : '#fffbeb') : '' }}
                  onClick={() => setSelectedType(type)}>{type}</div>
              );
            })}
          </div>
        </div>

        {selectedType === '선정성' && (
          <div style={{ border: '1px solid var(--bd)', borderRadius: 8, padding: 14, marginTop: 4 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>탐지 항목</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#374151' }}>
                <input type="checkbox"
                  checked={detItems.length === DETECTION_ITEMS.length}
                  onChange={e => setDetItems(e.target.checked ? [...DETECTION_ITEMS] : [])} />
                전체 선택
              </label>
              {DETECTION_ITEMS.map(item => (
                <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                  <input type="checkbox" checked={detItems.includes(item)} onChange={() => toggleItem(item)} />
                  {item}
                </label>
              ))}
            </div>
          </div>
        )}

        {selectedType === '도박' && (
          <div style={{ border: '1px solid var(--bd)', borderRadius: 8, padding: 14, marginTop: 4 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>탐지 등급</div>
            <select className="inp" style={{ maxWidth: 120 }} value={grade} onChange={e => setGrade(e.target.value)}>
              {GAMBLING_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        )}

        <div className="fg" style={{ marginTop: 16 }}>
          <label>활성화</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} />
            활성
          </label>
        </div>
      </div>
      <div className="mod-f">
        <div><button className="btn btn-outline" onClick={closePanel}>닫기</button></div>
        <div className="mod-f-right">
          <button className="btn btn-p" onClick={onSave}>정책 생성</button>
        </div>
      </div>
    </div>
  );
}
