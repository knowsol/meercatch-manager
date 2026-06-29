import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

type SessionStatus = 'active' | 'done' | 'pending';
type MarkerAlign = 'left' | 'center' | 'right';
type SessionViewport = 'desktop' | 'tablet' | 'mobile';
type PanelMode = 'overlay' | 'push';
type SpecStatus = 'planned' | 'draft' | 'review' | 'confirmed' | 'changed' | 'deprecated';
type RuleType = 'policy' | 'logic' | 'data' | 'permission' | 'chart' | 'api';
/** 화면(pageId) 단위 메타 정보 */
interface ScreenSpec {
    id: string | null;
    pageId: string;
    title: string;
    description: string;
    status: SpecStatus;
    /** 핀 좌표 기준 정렬 방식 (미설정 시 전역 설정 기준) */
    markerAlign?: MarkerAlign | null;
    /** 비율 기반 화면의 기준 가로 해상도 (px). 설정 시 핀 좌표가 이 너비 기준으로 스케일됨 */
    baseWidth?: number | null;
    folderId?: string | null;
    sortOrder?: number;
    createdBy?: string | null;
    updatedBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
}
/** 화면 목록 폴더 */
interface ScreenFolder {
    id: string;
    name: string;
    sortOrder: number;
    createdAt?: string | null;
}
/** 화면 요소(data-spec-id)에 연결된 Page Spec */
interface PageSpec {
    id: string;
    pageId: string;
    elementId: string;
    elementLabel?: string | null;
    title: string;
    content: string;
    status: SpecStatus;
    relatedRules: string[];
    pinX?: number | null;
    pinY?: number | null;
    num?: number | null;
    createdBy?: string | null;
    updatedBy?: string | null;
    createdAt: string;
    updatedAt: string;
}
/** 전역 Rule Spec (페이지 비종속) */
interface RuleSpec {
    id: string;
    title: string;
    type: RuleType;
    content: string;
    status: SpecStatus;
    tags: string[];
    createdBy?: string | null;
    updatedBy?: string | null;
    createdAt: string;
    updatedAt: string;
}
/** 프로젝트 변경 이력 엔트리 */
interface ChangelogEntry {
    id: string;
    seq: number;
    version: string | null;
    content: string;
    author: string | null;
    createdAt: string;
}
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
    loadPageSpecs?: (pageId: string) => Promise<PageSpec[]>;
    /** pageId 없이 프로젝트 전체 스펙 조회 */
    loadAllPageSpecs?: () => Promise<PageSpec[]>;
    loadScreenSpecs?: () => Promise<ScreenSpec[]>;
    loadScreenSpec?: (pageId: string) => Promise<ScreenSpec>;
    saveScreenSpec?: (pageId: string, data: {
        title?: string;
        description?: string;
        status?: SpecStatus;
        markerAlign?: MarkerAlign | null;
        updatedBy?: string | null;
    }) => Promise<ScreenSpec>;
    deleteScreenSpec?: (pageId: string) => Promise<void>;
    loadFolders?: () => Promise<ScreenFolder[]>;
    createFolder?: (name: string) => Promise<ScreenFolder>;
    updateFolder?: (id: string, patch: {
        name: string;
    }) => Promise<ScreenFolder>;
    deleteFolder?: (id: string) => Promise<void>;
    reorderFolders?: (ids: string[]) => Promise<void>;
    reorderScreens?: (items: Array<{
        pageId: string;
        folderId: string | null;
        sortOrder: number;
    }>) => Promise<void>;
    savePageSpec?: (pageId: string, elementId: string, data: {
        elementLabel?: string | null;
        title?: string;
        content?: string;
        status?: SpecStatus;
        relatedRules?: string[];
        pinX?: number | null;
        pinY?: number | null;
        updatedBy?: string | null;
    }) => Promise<PageSpec>;
    deletePageSpec?: (id: string) => Promise<void>;
    loadRuleSpecs?: () => Promise<RuleSpec[]>;
    /** 프로젝트 레벨 key/value 설정 조회 (meta API) */
    loadSetting?: (key: string) => Promise<string | null>;
    /** 프로젝트 레벨 key/value 설정 저장 (meta API) */
    saveSetting?: (key: string, value: string | null) => Promise<void>;
    /** 프로젝트 변경 이력 전체 조회 (최신순) */
    loadChangelog?: () => Promise<ChangelogEntry[]>;
    /** 변경 이력 항목 추가 (date: YYYY-MM-DD 형식, 미지정 시 오늘) */
    addChangelogEntry?: (content: string, author: string | null, date?: string | null, version?: string | null) => Promise<ChangelogEntry>;
    /** 변경 이력 항목 삭제 */
    deleteChangelogEntry?: (id: string) => Promise<void>;
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

interface Props$7 {
    pageId: string;
    enabled?: boolean;
    storage?: StorageAdapter;
    onNavigate?: (pageId: string) => void;
    children?: ReactNode;
    overlayMode?: boolean;
    pageWrapper?: HTMLElement;
    serviceId?: string;
    /** SB 모드 경계를 적용할 외부 DOM 요소 (예: document.querySelector('.app')) */
    sbConstraintTarget?: HTMLElement | null;
}
declare function SpecBridgeAnnotation({ pageId, enabled: initialEnabled, storage, onNavigate, children, overlayMode, pageWrapper, serviceId, sbConstraintTarget, }: Props$7): react_jsx_runtime.JSX.Element;

/** sb = 설정의 기준 너비 적용 / pc·tablet·mobile = 현재 뷰포트 기준 (스케일 없음) */
type BaseWidthMode = 'sb' | 'pc' | 'tablet' | 'mobile';
interface SpecBridgeSettings {
    /** 패널 표시 방식: overlay = 콘텐츠 위에 떠 있음 / push = 콘텐츠를 오른쪽으로 밀어냄 */
    panelMode: PanelMode;
    /** 핀 좌표 기준 정렬 방식 (전역) */
    markerAlign: MarkerAlign;
    /** 뷰포트 모드: sb = 설정 기준 너비 스케일 적용, pc/tablet/mobile = 현재 뷰포트 기준 */
    baseWidthMode: BaseWidthMode;
}
declare function useSettings(): {
    settings: SpecBridgeSettings;
    setSetting: <K extends keyof SpecBridgeSettings>(key: K, value: SpecBridgeSettings[K]) => void;
};

interface Props$6 {
    enabled: boolean;
    onToggleEnabled: () => void;
    author: string;
    defaultLabelId?: string | null;
    onSaveAuthor?: (name: string, labelId: string | null) => void;
    adding: boolean;
    onToggleAdd: () => void;
    pinCount: number;
    showList: boolean;
    onToggleList: () => void;
    onExportJson: () => void;
    onExportMarkdown: () => void;
    /** 레이블 필터 */
    labels?: LabelDef[];
    /** 서버에서 가져온 최신 버전 (null = 체크 전/실패) */
    latestSdkVersion?: string | null;
    /** 온보딩 가이드 열기 */
    onShowGuide?: () => void;
    /** 로고 클릭 툴팁 (첫 가이드 닫을 때 1회 노출) */
    showLogoTip?: boolean;
    /** 스펙 요소 추가 */
    onAddSpec?: () => void;
    /** 스펙 요소 선택 중 (요소 클릭 대기) */
    addingSpec?: boolean;
    /** 뷰포트 전환 */
    currentViewport?: SessionViewport;
    onViewportChange?: (vp: SessionViewport) => void;
    /** 설정 (패널 모드) */
    settings?: SpecBridgeSettings;
    onChangeSetting?: <K extends keyof SpecBridgeSettings>(key: K, value: SpecBridgeSettings[K]) => void;
    /** 기준 너비 모드 */
    baseWidthMode?: BaseWidthMode;
    onBaseWidthModeChange?: (mode: BaseWidthMode) => void;
    /** SB 기준 너비 (서버 저장) */
    sbBaseWidth?: number | null;
    onSbBaseWidthChange?: (v: number | null) => void;
}
declare function AnnotationToolbar({ enabled, onToggleEnabled, author, defaultLabelId, onSaveAuthor, adding, onToggleAdd, pinCount, showList, onToggleList, onExportJson, onExportMarkdown, labels, latestSdkVersion, onShowGuide, showLogoTip, onAddSpec, addingSpec, onViewportChange, settings, onChangeSetting, baseWidthMode, onBaseWidthModeChange, sbBaseWidth, onSbBaseWidthChange, }: Props$6): react_jsx_runtime.JSX.Element;

interface Props$5 {
    pin: Pin;
    num: number;
    label?: LabelDef;
    layerId: string;
    align: MarkerAlign;
    isSelected: boolean;
    isHovered?: boolean;
    onSelect: () => void;
    onMove: (pos: {
        x: number;
        y: number;
    }) => void;
    onHoverEnter: (id: string) => void;
    onHoverLeave: (id: string) => void;
    /** 비율 기반 화면의 기준 너비. 설정 시 pin.x/y를 현재 containerWidth 기준으로 스케일 */
    baseWidth?: number | null;
    containerWidth?: number;
}
declare function AnnotPin({ pin, num, label, layerId, align, isSelected, isHovered, onSelect, onMove, onHoverEnter, onHoverLeave, baseWidth, containerWidth, }: Props$5): react_jsx_runtime.JSX.Element;

interface Props$4 {
    pins: Pin[];
    selectedId: string;
    anchor: {
        x: number;
        y: number;
    };
    labels: LabelDef[];
    currentAuthor: string;
    leftBound?: number;
    rightBound?: number;
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
declare function AnnotPanel({ pins, selectedId, anchor, labels, currentAuthor, leftBound, rightBound, onClose, onUpdate, onDelete, onManageLabels, onAddComment, onUpdateComment, onDeleteComment, onResolve, onReopen, }: Props$4): react_jsx_runtime.JSX.Element | null;

interface Props$3 {
    pins: Pin[];
    labels: LabelDef[];
    pageId: string;
    selectedId: string | null;
    hoveredId?: string | null;
    showResolved: boolean;
    resolvedCount: number;
    currentAuthor?: string;
    onSelect: (id: string) => void;
    onHover?: (id: string | null) => void;
    onToggleShowResolved: () => void;
    onClose: () => void;
}
declare function AnnotList({ pins, labels, pageId, selectedId, hoveredId, showResolved, resolvedCount, currentAuthor, onSelect, onHover, onToggleShowResolved, onClose, }: Props$3): react_jsx_runtime.JSX.Element;

interface Props$2 {
    currentAuthor: string;
    currentDefaultLabelId: string | null;
    labels: LabelDef[];
    onSave: (name: string, defaultLabelId: string | null) => void;
    onCancel: () => void;
}
declare function AuthorModal({ currentAuthor, currentDefaultLabelId, labels, onSave, onCancel, }: Props$2): react_jsx_runtime.JSX.Element;

interface Props$1 {
    labels: LabelDef[];
    pinUsage: Record<string, number>;
    onAdd: (name: string, color: string) => void | Promise<unknown>;
    onUpdate: (id: string, patch: Partial<Omit<LabelDef, 'id'>>) => void | Promise<void>;
    onDelete: (id: string) => void | Promise<void>;
    onClose: () => void;
}
declare function LabelManagerModal({ labels, pinUsage, onAdd, onUpdate, onDelete, onClose }: Props$1): react_jsx_runtime.JSX.Element;

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

interface Props {
    settings: SpecBridgeSettings;
    onChangeSetting: <K extends keyof SpecBridgeSettings>(key: K, value: SpecBridgeSettings[K]) => void;
    author: string;
    labels: LabelDef[];
    onExportJson?: () => void;
    onExportMarkdown?: () => void;
    defaultLabelId: string | null;
    onSaveAuthor: (name: string, labelId: string | null) => void;
    sbBaseWidth?: number | null;
    onSbBaseWidthChange?: (v: number | null) => void;
}
declare function SettingsPopover({ settings, onChangeSetting, author, labels, defaultLabelId, onSaveAuthor, onExportJson, onExportMarkdown, sbBaseWidth, onSbBaseWidthChange }: Props): react_jsx_runtime.JSX.Element;

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

export { AnnotList, AnnotPanel, AnnotPin, AnnotationToolbar, AuthorModal, COLORS, type Comment, type CreateLabelInput, type CreatePinInput, DEFAULT_LABELS, type ExportPayload, FALLBACK_LABEL_COLOR, type HttpAdapterOptions, LABEL_COLOR_PRESETS, type LabelDef, LabelManagerModal, type PagePins, type PageSpec, type PanelMode, type Pin, type PinStatus, type RuleSpec, type RuleType, SDK_VERSION, STORAGE_KEYS, SettingsPopover, SpecBridgeAnnotation, type SpecBridgeSettings, type SpecStatus, type StorageAdapter, type WhoamiInfo, httpAdapter, localStorageAdapter, useAnnotations, useAuthor, useLabels, useSettings, whoami };
