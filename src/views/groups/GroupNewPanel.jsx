'use client'
import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import { DUMMY } from '../../data/dummy';

export default function GroupNewPanel() {
  const { closePanel } = usePanel();
  const toast = useToastCtx();
  const [schoolId, setSchoolId] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [policyId, setPolicyId] = useState('');
  const [errors, setErrors] = useState({});

  const selectedSchool = DUMMY.schools.find(s => s.schoolId === schoolId);
  const activePolicies = DUMMY.policies.filter(p => p.active);

  function onSave() {
    const errs = {};
    if (!schoolId) errs.school = true;
    if (!name.trim()) errs.name = true;
    if (Object.keys(errs).length) { setErrors(errs); toast('필수 항목을 입력해주세요.', 'err'); return; }
    toast('그룹이 생성되었습니다.');
    closePanel();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mod-h">
        <button className="cx" onClick={closePanel}>✕</button>
        <h2>그룹 생성</h2>
      </div>
      <div className="mod-b" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="fg">
          <label>학교 <span className="req">*</span></label>
          <select className={`inp${errors.school ? ' error' : ''}`} value={schoolId} onChange={e => setSchoolId(e.target.value)}>
            <option value="">학교 선택</option>
            {DUMMY.schools.map(s => <option key={s.schoolId} value={s.schoolId}>{s.name} ({s.type})</option>)}
          </select>
        </div>
        <div className="fg">
          <label>학교유형</label>
          <div style={{ padding: '6px 0', fontSize: 14, color: '#64748b' }}>{selectedSchool ? selectedSchool.type : '—'}</div>
        </div>
        <div className="fg">
          <label>그룹 이름 <span className="req">*</span></label>
          <input className={`inp${errors.name ? ' error' : ''}`} type="text" placeholder="그룹 이름"
            value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="fg">
          <label>그룹 설명</label>
          <textarea className="inp" placeholder="그룹 설명 (선택)" style={{ minHeight: 80 }}
            value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <div className="fg">
          <label>기본 적용 정책</label>
          <select className="inp" value={policyId} onChange={e => setPolicyId(e.target.value)}>
            <option value="">정책 선택 (선택)</option>
            {activePolicies.map(p => <option key={p.policyId} value={p.policyId}>{p.name}</option>)}
          </select>
        </div>
      </div>
      <div className="mod-f">
        <div><button className="btn btn-outline" onClick={closePanel}>닫기</button></div>
        <div className="mod-f-right">
          <button className="btn btn-p" onClick={onSave}>그룹 생성</button>
        </div>
      </div>
    </div>
  );
}
