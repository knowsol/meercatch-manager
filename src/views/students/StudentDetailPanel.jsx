'use client'
import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import { StatusBadge } from '../../components/common/Badge';
import { DUMMY } from '../../data/dummy';

export default function StudentDetailPanel({ studentId }) {
  const { closePanel } = usePanel();
  const toast = useToastCtx();
  const student = DUMMY.students.find(s => s.studentId === studentId) || DUMMY.students[0];
  const school = DUMMY.schools?.find(sc => sc.schoolId === student.schoolId);
  const device = DUMMY.devices?.find(d => d.deviceId === student.deviceId);

  const [isEditing, setIsEditing] = useState(false);
  const [name,     setName]     = useState(student.name);
  const [grade,    setGrade]    = useState(student.grade);
  const [classNum, setClassNum] = useState(student.classNum);
  const [num,      setNum]      = useState(student.num);

  function renderInfo() {
    if (!isEditing) {
      return (
        <dl className="info-row">
          <dt>이름</dt>    <dd>{student.name}</dd>
          <dt>학교</dt>    <dd>{school?.name || '—'}</dd>
          <dt>학년</dt>    <dd>{student.grade}</dd>
          <dt>반</dt>      <dd>{student.classNum}</dd>
          <dt>번호</dt>    <dd>{student.num}번</dd>
          <dt>단말기</dt>  <dd>{device?.name || '미배정'}</dd>
          <dt>상태</dt>    <dd><StatusBadge status={student.status} /></dd>
        </dl>
      );
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="fg">
          <label>이름<span className="req"> *</span></label>
          <input className="inp" type="text" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="form-row">
          <div className="fg">
            <label>학년</label>
            <select className="inp" value={grade} onChange={e => setGrade(e.target.value)}>
              {[1,2,3,4,5,6].map(g => <option key={g} value={`${g}학년`}>{g}학년</option>)}
            </select>
          </div>
          <div className="fg">
            <label>반</label>
            <select className="inp" value={classNum} onChange={e => setClassNum(e.target.value)}>
              {[1,2,3,4,5,6,7,8,9,10].map(c => <option key={c} value={`${c}반`}>{c}반</option>)}
            </select>
          </div>
          <div className="fg" style={{ maxWidth: 90 }}>
            <label>번호</label>
            <input className="inp" type="number" min={1} value={num} onChange={e => setNum(Number(e.target.value))} />
          </div>
        </div>
        <dl className="info-row mt-16">
          <dt>학교</dt>   <dd>{school?.name || '—'}</dd>
          <dt>단말기</dt> <dd>{device?.name || '미배정'}</dd>
          <dt>상태</dt>   <dd><StatusBadge status={student.status} /></dd>
        </dl>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mod-h">
        <button className="cx" onClick={closePanel}>✕</button>
        <h2>{student.name}</h2>
      </div>
      <div className="mod-b" style={{ flex: 1, overflowY: 'auto' }}>
        {renderInfo()}
      </div>
      {isEditing ? (
        <div className="mod-f">
          <div />
          <div className="mod-f-right">
            <button className="btn btn-outline" onClick={() => setIsEditing(false)}>취소</button>
            <button className="btn btn-p" onClick={() => { toast('저장되었습니다.'); setIsEditing(false); }}>저장</button>
          </div>
        </div>
      ) : (
        <div className="mod-f">
          <div />
          <div className="mod-f-right">
            <button className="btn btn-outline" onClick={() => setIsEditing(true)}>수정</button>
            <button className="btn btn-d" onClick={() => { toast('학생이 삭제되었습니다.', 'warn'); closePanel(); }}>삭제</button>
          </div>
        </div>
      )}
    </div>
  );
}
