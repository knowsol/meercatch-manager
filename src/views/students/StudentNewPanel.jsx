'use client'
import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import { DUMMY } from '../../data/dummy';
import SearchableSelect from '../../components/common/SearchableSelect';

export default function StudentNewPanel() {
  const { closePanel } = usePanel();
  const toast = useToastCtx();
  const [name,     setName]     = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [grade,    setGrade]    = useState('');
  const [classNum, setClassNum] = useState('');
  const [num,      setNum]      = useState('');
  const [errors,   setErrors]   = useState({});

  const schools = (DUMMY.schools || []).sort((a, b) => a.name.localeCompare(b.name));

  const onSave = () => {
    const errs = {};
    if (!name.trim()) errs.name = true;
    if (!schoolId)    errs.schoolId = true;
    if (!grade)       errs.grade = true;
    if (!classNum)    errs.classNum = true;
    setErrors(errs);
    if (Object.keys(errs).length > 0) { toast('필수 항목을 입력해주세요.', 'err'); return; }
    toast('학생이 등록되었습니다.');
    closePanel();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mod-h">
        <button className="cx" onClick={closePanel}>✕</button>
        <h2>학생 추가</h2>
      </div>
      <div className="mod-b" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="fg">
          <label>이름<span className="req"> *</span></label>
          <input
            className={`inp${errors.name ? ' error' : ''}`}
            placeholder="홍길동" type="text"
            value={name} onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="fg" style={{ marginTop: 16 }}>
          <label>학교<span className="req"> *</span></label>
          <SearchableSelect
            value={schoolId}
            onChange={setSchoolId}
            options={schools.map(s => ({ value: s.schoolId, label: s.name }))}
            placeholder="학교 선택"
            style={{ width: '100%', ...(errors.schoolId ? { border: '1px solid #ef4444', borderRadius: 4 } : {}) }}
          />
        </div>
        <div className="form-row" style={{ marginTop: 16 }}>
          <div className="fg">
            <label>학년<span className="req"> *</span></label>
            <select
              className={`inp${errors.grade ? ' error' : ''}`}
              value={grade} onChange={e => setGrade(e.target.value)}
            >
              <option value="">선택</option>
              {[1,2,3,4,5,6].map(g => <option key={g} value={`${g}학년`}>{g}학년</option>)}
            </select>
          </div>
          <div className="fg">
            <label>반<span className="req"> *</span></label>
            <select
              className={`inp${errors.classNum ? ' error' : ''}`}
              value={classNum} onChange={e => setClassNum(e.target.value)}
            >
              <option value="">선택</option>
              {[1,2,3,4,5,6,7,8,9,10].map(c => <option key={c} value={`${c}반`}>{c}반</option>)}
            </select>
          </div>
          <div className="fg" style={{ maxWidth: 90 }}>
            <label>번호</label>
            <input className="inp" type="number" min={1} placeholder="1"
              value={num} onChange={e => setNum(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="mod-f">
        <div />
        <div className="mod-f-right">
          <button className="btn btn-outline" onClick={closePanel}>취소</button>
          <button className="btn btn-p" onClick={onSave}>등록</button>
        </div>
      </div>
    </div>
  );
}
