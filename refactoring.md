# Meercatch Manager 리팩토링 기록

> **목표**: 기능·UI 변경 없이 Tailwind CSS 통합, 코드 가독성 개선, 불필요한 주석 제거  
> **작업일**: 2026-05-19  
> **대상 프로젝트**: `meercatch-manager/`

---

## 1. 요약

| 항목 | 변경 내용 |
|------|-----------|
| 스타일링 | Tailwind CSS v3 도입, CSS 변수 기반 테마 유지 |
| 컴포넌트 | `src/components/ui/` 공통 UI 라이브러리 신설 |
| 레이아웃 | `Layout`, `Sidebar` → Tailwind 유틸리티 클래스로 전환 |
| 공통 컴포넌트 | `DataTable`, `Pagination`, `Panel`, `Toast` Tailwind화 |
| 뷰(views) | `@/components/ui` 기반으로 단계적 마이그레이션 |
| 호환성 | `legacy-compat.css`로 미전환 클래스 UI 보존 |

---

## 2. 신규 의존성

```json
{
  "dependencies": {
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.6.0"
  },
  "devDependencies": {
    "tailwindcss": "^3",
    "postcss": "^8",
    "autoprefixer": "^10"
  }
}
```

---

## 3. 신규/변경 파일

### 설정

| 파일 | 설명 |
|------|------|
| `tailwind.config.ts` | CSS 변수(`--bg1`, `--t1` 등)를 Tailwind 색상 토큰으로 매핑 |
| `postcss.config.js` | PostCSS + Tailwind 파이프라인 |
| `src/lib/cn.ts` | `clsx` + `tailwind-merge` 클래스 병합 유틸 |

### 스타일

| 파일 | 설명 |
|------|------|
| `src/styles/global.css` | `@tailwind` 지시어, CSS 변수(라이트/다크), base 리셋 |
| `src/styles/legacy-compat.css` | 기존 `.btn`, `.ph`, `.card` 등 레거시 클래스 → `@apply` 매핑 |

### UI 컴포넌트 (`src/components/ui/`)

| 컴포넌트 | 대체 대상 |
|----------|-----------|
| `Button` | `.btn`, `.btn-p`, `.btn-outline` 등 |
| `Badge`, `StatusBadge`, `DetTypeBadge` | `.bdg`, `.bdg-ok` 등 |
| `Input`, `Select`, `Textarea` | `.inp` |
| `Card`, `CardTitle` | `.card`, `.card-title` |
| `PageHeader` | `.ph`, `.ph-title`, `.ph-sub` |
| `FormGroup`, `FormRow`, `CheckboxRow`, `DetailSection`, `Divider` | `.fg`, `.form-row` 등 |
| `FilterBar`, `Grid2/3/4`, `Tabs`, `EmptyState`, `Alert` | `.fb`, `.grid-*`, `.tabs` 등 |
| `KPI` | `.kpi` |

`src/components/ui/index.ts`에서 일괄 export.

---

## 4. 수정된 주요 파일

### 레이아웃

- **`src/components/layout/Layout.tsx`**
  - `.app`, `.mh`, `.mb` 등 → Tailwind flex/overflow/padding 클래스
  - 인라인 `style` 드롭다운 → Tailwind + 시맨틱 버튼
  - 만료 배너 → Tailwind + `Button` 컴포넌트
  - 불필요한 `handleHover` 인라인 이벤트 제거

- **`src/components/layout/Sidebar.tsx`**
  - `.sb`, `.ni`, `.ns` 등 → Tailwind (접힘/모바일 반응형 포함)
  - `nav` 항목을 `<button type="button">`으로 시맨틱 개선

### 공통 컴포넌트

- **`src/components/common/DataTable.tsx`**
  - 테이블/스켈레톤/빈 상태 Tailwind화
  - 섹션 구분 주석 제거

- **`src/components/common/Pagination.tsx`**
  - `.pagination-*` → Tailwind + `cn()`

- **`src/components/common/Panel.tsx`**
  - 오버레이/슬라이드 패널 Tailwind화
  - `PanelLayout` 헬퍼 정리 (뷰 내 `mod-*` 클래스는 유지)

- **`src/components/common/Toast.tsx`**
  - 토스트 스타일 Tailwind + `animate-slideIn`

- **`src/components/common/Badge.tsx`**, **`KPI.tsx`**
  - `@/components/ui` re-export

### 뷰 (마이그레이션 완료)

다음 파일은 `PageHeader`, `Button`, `Card`, `Input` 등 UI 컴포넌트 사용으로 전환:

- `src/views/notifications/Notifications.tsx`
- `src/views/account/Account.tsx`
- `src/views/Dashboard.tsx` (일부)
- `src/views/auth/Login.tsx` (인라인 스타일 유지 — 로그인 전용)
- `src/views/policies/*`, `src/views/pauses/*`, `src/views/users/*` (대부분)
- `src/views/groups/GroupNewPanel.tsx`, `src/views/devices/DeviceList.tsx` 등

### 뷰 (레거시 클래스 + compat 레이어)

아래 파일은 아직 `.ph`, `.btn` 등 클래스를 일부 사용합니다.  
`legacy-compat.css`가 동일 UI를 보장합니다. 추후 UI 컴포넌트로 교체 권장:

- `src/views/menu-admin/MenuAdmin.tsx`
- `src/views/licenses/Licenses.tsx`, `License2Mock.tsx`
- `src/views/validurl/ValidUrlList.tsx`, `ValidUrlListV2.tsx`
- `src/views/users/UserList.tsx`
- `src/views/groups/GroupList.tsx`, `GroupDetailPanel.tsx`
- `src/views/devices/DeviceDetailPanel.tsx`
- `src/views/detections/DetectionList.tsx`, `DetectionDetailPanel.tsx`
- `src/views/pauses/PauseList.tsx`
- `src/views/components/Components.tsx` (UI 카탈로그 — 의도적 레거시 예시 포함)

---

## 5. 테마 / 다크모드

- **변경 없음**: `[data-theme="light"|"dark"]` CSS 변수 구조 유지
- Tailwind 색상은 `var(--bg1)`, `var(--t1)` 등을 참조하여 테마 전환 시 UI 동일

---

## 6. 패널(modal) 구조

패널 상세 화면은 기존 마크업 패턴 유지:

- `.mod-h`, `.mod-b`, `.mod-f`, `.mod-f-right`, `.cx`
- `global.css` `@layer components`에 Tailwind `@apply`로 정의
- 점진적으로 `PanelLayout` + UI 컴포넌트로 통합 가능

---

## 7. 사용 가이드 (신규 코드)

```tsx
import {
  Button,
  PageHeader,
  Card,
  Input,
  FormGroup,
  DataTable, // common
} from '@/components/ui';

<PageHeader
  title="단말기 관리"
  subtitle={`총 ${count}대`}
  actions={<Button onClick={onAdd}>등록</Button>}
/>

<Card>
  <FormGroup label="이름" required>
    <Input value={name} onChange={...} />
  </FormGroup>
  <Button variant="primary">저장</Button>
</Card>
```

클래스 병합:

```tsx
import { cn } from '@/lib/cn';

<div className={cn('flex gap-2', isActive && 'text-accent')} />
```

---

## 8. 제거·정리한 항목

- `global.css` 350+ 줄 단일 BEM 스타일 → 토큰 + Tailwind + compat로 분리
- `DataTable.tsx` 등 파일 내 `// ============` 구분 주석
- `Layout.tsx` 인라인 hover 스타일 핸들러
- 중복 `Badge`/`KPI` 구현 (ui로 일원화)

---

## 9. 후속 작업 권장

1. **레거시 뷰 마이그레이션**: `MenuAdmin`, `Licenses`, `ValidUrl*` 등 `PageHeader`/`Button` 전환
2. **`legacy-compat.css` 축소**: 마이그레이션 완료 시 클래스별 제거
3. **패널 통합**: `mod-*` → `PanelLayout` + Tailwind
4. **`Components.tsx`**: UI 카탈로그를 신규 `@/components/ui` 기준으로 업데이트
5. **Select 화살표**: `Input.tsx`의 select 배경 SVG를 공통 상수로 추출 (선택)

---

## 10. 검증

```bash
cd meercatch-manager
npm run dev    # 로컬 UI 확인
npm run build  # 프로덕션 빌드
```

- 라이트/다크 테마 전환
- 사이드바 접기·모바일 햄버거 메뉴
- 테이블, 패널, 토스트, 페이지네이션

---

## 11. Breaking Changes

**없음** (의도적).  
공개 API·라우트·비즈니스 로직·화면 레이아웃은 유지했습니다.
