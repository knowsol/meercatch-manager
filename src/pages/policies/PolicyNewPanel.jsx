import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import { PanelLayout } from '../../components/common/Panel';

const ALL_TYPES = ['선정성', '도박', '폭력', '기타'];

export default function PolicyNewPanel() {
  const { closePanel } = usePanel();
  const toast = useToastCtx();

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedTypes, setSelectedTypes] = useState(new Set());
  const [active, setActive] = useState(true);

  const toggleType = (type) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast('정책 이름을 입력해주세요.', 'error');
      return;
    }
    if (selectedTypes.size === 0) {
      toast('탐지 유형을 하나 이상 선택해주세요.', 'error');
      return;
    }
    toast('정책이 생성되었습니다.', 'success');
    closePanel();
  };

  const body = (
    <div>
      <div className="fg">
        <label>정책이름</label>
        <input className="inp" value={name} onChange={e => setName(e.target.value)} placeholder="정책 이름을 입력하세요" />
      </div>
      <div className="fg">
        <label>설명</label>
        <textarea className="inp" rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder="정책 설명을 입력하세요" />
      </div>
      <div className="fg">
        <label>탐지유형</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {ALL_TYPES.map(type => (
            <button
              key={type}
              type="button"
              className={`btn btn-sm ${selectedTypes.has(type) ? 'btn-p' : 'btn-outline'}`}
              onClick={() => toggleType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      <div className="fg">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} />
          활성화
        </label>
      </div>
    </div>
  );

  const footer = (
    <div className="mod-f-row">
      <div><button className="btn btn-outline" onClick={closePanel}>닫기</button></div>
      <div><button className="btn btn-p" onClick={handleSubmit}>정책 생성</button></div>
    </div>
  );

  return <PanelLayout title="정책 생성" body={body} footer={footer} />;
}
