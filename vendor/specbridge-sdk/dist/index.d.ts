import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

type SessionStatus = 'active' | 'done' | 'pending';
type SessionViewport = 'desktop' | 'tablet' | 'mobile';
/** 검토 회차 — 화면 버전별 어노테이션 그룹 */
interface AnnotSession {
    id: string;
    name: string;
    createdAt: string;
    status?: SessionStatus;
    viewport?: SessionViewport | null;
    note?: string | null;
}
interface LabelDef {
    id: string;
    name: string;
    color: string;
}
interface Comment {
    id: string;
    author: string;
    text: string;
    createdAt: string;
    updatedAt?: string;
}
type PinStatus = 'open' | 'resolved';
interface Pin {
    id: string;
    /** 프로젝트 내 영구 번호 — 삭제해도 재사용하지 않음 */
    num: number;
    x: number;
    y: number;
    labelId: string | null;
    note: string;
    author: string;
    createdAt: string;
    status: PinStatus;
    resolvedBy?: string;
    resolvedAt?: string;
    comments: Comment[];
    /** 속한 검토 회차 ID. null/undefined = 세션 미배정 (전체 보기에서만 노출) */
    sessionId?: string | null;
}
type PagePins = Record<string, Pin[]>;
interface CreatePinInput {
    pageId: string;
    x: number;
    y: number;
    labelId: string | null;
    author: string;
    sessionId?: string | null;
}
interface CreateLabelInput {
    name: string;
    color: string;
}
/**
 * 저장소 어댑터 — entity-level CRUD (비동기).
 *
 * - HTTP 백엔드, localStorage, IndexedDB 등 어떤 스토리지도 구현 가능
 * - 모든 메서드는 Promise 반환. SDK 훅이 로드/변경 시 호출
 */
interface StorageAdapter {
    loadAnnotations(): Promise<PagePins>;
    loadLabels(): Promise<LabelDef[]>;
    loadAuthor(): Promise<string>;
    loadLastLabelId(): Promise<string | null>;
    saveAuthor(name: string): Promise<void>;
    saveLastLabelId(id: string | null): Promise<void>;
    /** 작성자의 기본 레이블 ID (선택적 — 미구현 시 lastLabelId 폴백) */
    loadAuthorDefaultLabelId?: () => Promise<string | null>;
    saveAuthorDefaultLabelId?: (id: string | null) => Promise<void>;
    createLabel(input: CreateLabelInput): Promise<LabelDef>;
    updateLabel(id: string, patch: Partial<Omit<LabelDef, 'id'>>): Promise<LabelDef>;
    deleteLabel(id: string): Promise<void>;
    createPin(input: CreatePinInput): Promise<Pin>;
    updatePin(id: string, patch: Partial<Omit<Pin, 'id' | 'comments'>>): Promise<Pin>;
    deletePin(id: string): Promise<void>;
    resolvePin(id: string, by: string): Promise<Pin>;
    reopenPin(id: string): Promise<Pin>;
    addComment(pinId: string, author: string, text: string): Promise<Comment>;
    updateComment(commentId: string, text: string): Promise<Comment>;
    deleteComment(commentId: string): Promise<void>;
    loadSessions(): Promise<AnnotSession[]>;
    createSession(name: string, options?: {
        viewport?: SessionViewport | null;
        note?: string | null;
    }): Promise<AnnotSession>;
    updateSession(id: string, patch: Partial<Pick<AnnotSession, 'name' | 'status' | 'viewport' | 'note'>>): Promise<AnnotSession>;
    deleteSession(id: string): Promise<void>;
    loadCurrentSessionId(): Promise<string | null>;
    saveCurrentSessionId(id: string | null): Promise<void>;
    /** 서버에서 최신/최소 SDK 버전 정보를 가져옵니다. httpAdapter 에서만 구현됩니다. */
    checkSdkVersion?: () => Promise<{
        latest: string | null;
        minimum: string | null;
    }>;
}
interface ExportPayload {
    exportedAt: string;
    annotations: PagePins;
    labels: LabelDef[];
}

interface Props$6 {
    pageId: string;
    enabled?: boolean;
    storage?: StorageAdapter;
    onExport?: (payload: ExportPayload) => void;
    children?: ReactNode;
}
declare function SpecBridgeAnnotation({ pageId, enabled: initialEnabled, storage, onExport, children, }: Props$6): react_jsx_runtime.JSX.Element;

interface Props$5 {
    enabled: boolean;
    onToggleEnabled: () => void;
    author: string;
    onEditAuthor: () => void;
    adding: boolean;
    onToggleAdd: () => void;
    pinCount: number;
    showList: boolean;
    onToggleList: () => void;
    onExport: () => void;
    /** 레이블 필터 */
    labels?: LabelDef[];
    filterLabelIds?: Set<string>;
    onToggleLabelFilter?: (id: string) => void;
    onClearLabelFilter?: () => void;
    /** 서버에서 가져온 최신 버전 (null = 체크 전/실패) */
    latestSdkVersion?: string | null;
    /** 온보딩 가이드 열기 */
    onShowGuide?: () => void;
    /** 로고 클릭 툴팁 (첫 가이드 닫을 때 1회 노출) */
    showLogoTip?: boolean;
    /** 검토 회차 */
    sessions?: AnnotSession[];
    currentSessionId?: string | null;
    sessionProgress?: Record<string, {
        total: number;
        resolved: number;
    }>;
    onSelectSession?: (id: string | null) => void;
    onCreateSession?: (name: string, options?: {
        viewport?: SessionViewport | null;
    }) => Promise<string | null>;
    onDeleteSession?: (id: string) => Promise<void>;
    onUpdateSession?: (id: string, patch: Partial<Pick<AnnotSession, 'name' | 'status' | 'viewport' | 'note'>>) => Promise<void>;
    onSetSessionStatus?: (id: string, status: SessionStatus) => Promise<void>;
    onSetSessionViewport?: (id: string, viewport: SessionViewport | null) => Promise<void>;
}
declare function AnnotationToolbar({ enabled, onToggleEnabled, author, onEditAuthor, adding, onToggleAdd, pinCount, showList, onToggleList, onExport, labels, filterLabelIds, onToggleLabelFilter, onClearLabelFilter, latestSdkVersion, onShowGuide, showLogoTip, sessions, currentSessionId, sessionProgress, onSelectSession, onCreateSession, onDeleteSession, onSetSessionStatus, onUpdateSession, }: Props$5): react_jsx_runtime.JSX.Element;

interface Props$4 {
    pin: Pin;
    num: number;
    label?: LabelDef;
    layerId: string;
    isSelected: boolean;
    isHovered?: boolean;
    onSelect: () => void;
    onMove: (pos: {
        x: number;
        y: number;
    }) => void;
    onHoverEnter: (id: string) => void;
    onHoverLeave: (id: string) => void;
}
declare function AnnotPin({ pin, num, label, layerId, isSelected, isHovered, onSelect, onMove, onHoverEnter, onHoverLeave, }: Props$4): react_jsx_runtime.JSX.Element;

interface Props$3 {
    pins: Pin[];
    selectedId: string;
    anchor: {
        x: number;
        y: number;
    };
    labels: LabelDef[];
    currentAuthor: string;
    leftBound?: number;
    onClose: () => void;
    onUpdate: (id: string, patch: Partial<Omit<Pin, 'id' | 'comments'>>) => void | Promise<void>;
    onDelete: (id: string) => void | Promise<void>;
    onManageLabels: () => void;
    onAddComment: (pinId: string, text: string) => void | Promise<unknown>;
    onUpdateComment: (pinId: string, commentId: string, text: string) => void | Promise<void>;
    onDeleteComment: (pinId: string, commentId: string) => void | Promise<void>;
    onResolve: (pinId: string) => void;
    onReopen: (pinId: string) => void | Promise<void>;
}
declare function AnnotPanel({ pins, selectedId, anchor, labels, currentAuthor, leftBound, onClose, onUpdate, onDelete, onManageLabels, onAddComment, onUpdateComment, onDeleteComment, onResolve, onReopen, }: Props$3): react_jsx_runtime.JSX.Element | null;

interface Props$2 {
    pins: Pin[];
    labels: LabelDef[];
    pageId: string;
    selectedId: string | null;
    hoveredId?: string | null;
    showResolved: boolean;
    resolvedCount: number;
    onSelect: (id: string) => void;
    onHover?: (id: string | null) => void;
    onToggleShowResolved: () => void;
    onClose: () => void;
}
declare function AnnotList({ pins, labels, pageId, selectedId, hoveredId, showResolved, resolvedCount, onSelect, onHover, onToggleShowResolved, onClose, }: Props$2): react_jsx_runtime.JSX.Element;

interface Props$1 {
    currentAuthor: string;
    currentDefaultLabelId: string | null;
    labels: LabelDef[];
    onSave: (name: string, defaultLabelId: string | null) => void;
    onCancel: () => void;
}
declare function AuthorModal({ currentAuthor, currentDefaultLabelId, labels, onSave, onCancel, }: Props$1): react_jsx_runtime.JSX.Element;

interface Props {
    labels: LabelDef[];
    pinUsage: Record<string, number>;
    onAdd: (name: string, color: string) => void | Promise<unknown>;
    onUpdate: (id: string, patch: Partial<Omit<LabelDef, 'id'>>) => void | Promise<void>;
    onDelete: (id: string) => void | Promise<void>;
    onClose: () => void;
}
declare function LabelManagerModal({ labels, pinUsage, onAdd, onUpdate, onDelete, onClose }: Props): react_jsx_runtime.JSX.Element;

declare function useAnnotations(pageId: string, storage: StorageAdapter): {
    loading: boolean;
    allAnnots: PagePins;
    pins: Pin[];
    addPin: (x: number, y: number, author: string, labelId: string | null, sessionId?: string | null) => Promise<Pin | null>;
    updatePin: (id: string, patch: Partial<Omit<Pin, "id" | "comments">>) => Promise<void>;
    deletePin: (id: string) => Promise<void>;
    movePin: (id: string, pos: {
        x: number;
        y: number;
    }) => Promise<void>;
    addComment: (pinId: string, author: string, text: string) => Promise<Comment | null>;
    updateComment: (pinId: string, commentId: string, text: string) => Promise<void>;
    deleteComment: (pinId: string, commentId: string) => Promise<void>;
    resolvePin: (id: string, by: string) => Promise<void>;
    reopenPin: (id: string) => Promise<void>;
};

declare function useAuthor(storage: StorageAdapter): {
    author: string;
    setAuthor: (name: string) => Promise<void>;
    defaultLabelId: string | null;
    setDefaultLabelId: (id: string | null) => Promise<void>;
    loading: boolean;
};

declare function useLabels(storage: StorageAdapter): {
    labels: LabelDef[];
    addLabel: (name: string, color: string) => Promise<LabelDef | null>;
    updateLabel: (id: string, patch: Partial<Omit<LabelDef, "id">>) => Promise<void>;
    deleteLabel: (id: string) => Promise<void>;
    loading: boolean;
};

/**
 * 기본 어댑터 — 브라우저 localStorage 사용 (오프라인/로컬 데모에 적합).
 * 실제 서버 연동은 `httpAdapter` 사용 권장.
 */
declare const localStorageAdapter: StorageAdapter;

interface HttpAdapterOptions {
    /** 예: 'https://sb-api.aiatti.com' (후행 슬래시 없이) */
    baseUrl: string;
    /** API 키 — Admin 에서 발급한 프로젝트 전용 토큰 (`sk_xxx`). 필수 */
    apiKey: string;
    /** fetch 옵션 overrides (credentials, headers 등) */
    fetchInit?: (path: string) => RequestInit;
    /** 요청 실패 시 호출 (기본: console.error) */
    onError?: (error: Error, context: {
        method: string;
        path: string;
    }) => void;
}
declare function httpAdapter(options: HttpAdapterOptions): StorageAdapter;

/**
 * 이 apiKey 가 속한 프로젝트 정보를 서버에서 조회.
 *
 *   const info = await whoami({ baseUrl, apiKey })
 *   console.log(info.name, info.slug)
 */
interface WhoamiInfo {
    id: string;
    name: string;
    slug: string;
    description: string | null;
}
declare function whoami(options: {
    baseUrl: string;
    apiKey: string;
}): Promise<WhoamiInfo>;

declare const SDK_VERSION: string;

declare const STORAGE_KEYS: {
    readonly annotations: "cs_annot_v4";
    readonly author: "cs_annot_author";
    readonly labels: "cs_annot_labels_v3";
    readonly lastLabel: "cs_annot_last_label_v1";
    readonly defaultLabel: "cs_annot_author_default_label";
    readonly sessions: "cs_annot_sessions_v1";
    readonly currentSession: "cs_annot_current_session";
};
declare const COLORS: {
    readonly pri: "#3B82F6";
    readonly priL: "#EFF6FF";
    readonly priD: "#2563EB";
    readonly side: "#111827";
    readonly white: "#fff";
    readonly bg: "#f3f4f6";
    readonly brd: "#e5e7eb";
    readonly txt: "#1f2937";
    readonly txS: "#6b7280";
    readonly txL: "#9ca3af";
    readonly red: "#dc2626";
    readonly redL: "#fef2f2";
    readonly green: "#16a34a";
    readonly greenL: "#f0fdf4";
    readonly amber: "#d97706";
    readonly amberL: "#fffbeb";
    readonly indigo: "#3B82F6";
    readonly indigoL: "#EFF6FF";
    readonly slate: "#1e293b";
};
declare const DEFAULT_LABELS: LabelDef[];
declare const FALLBACK_LABEL_COLOR = "#9ca3af";
declare const LABEL_COLOR_PRESETS: string[];

export { AnnotList, AnnotPanel, AnnotPin, AnnotationToolbar, AuthorModal, COLORS, type Comment, type CreateLabelInput, type CreatePinInput, DEFAULT_LABELS, type ExportPayload, FALLBACK_LABEL_COLOR, type HttpAdapterOptions, LABEL_COLOR_PRESETS, type LabelDef, LabelManagerModal, type PagePins, type Pin, type PinStatus, SDK_VERSION, STORAGE_KEYS, SpecBridgeAnnotation, type StorageAdapter, type WhoamiInfo, httpAdapter, localStorageAdapter, useAnnotations, useAuthor, useLabels, whoami };
