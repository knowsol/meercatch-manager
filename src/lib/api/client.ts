import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const TOKEN_KEY = "meercatch_jwt";
const AUTH_STORAGE_KEY = "meercatch_auth";
const MENU_STORAGE_KEY = "meercatch_menus";
const SESSION_EXPIRED_KEY = "meercatch_session_expired";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// localStorage에서 accessToken 가져오기
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const jwt = JSON.parse(raw);
    return jwt?.accessToken ?? null;
  } catch {
    return null;
  }
}

// 세션 만료 처리: 모든 인증 정보 삭제 후 로그인 페이지로 리다이렉트
function handleSessionExpired(): void {
  if (typeof window === "undefined") return;

  // 중복 처리 방지
  if (sessionStorage.getItem(SESSION_EXPIRED_KEY)) return;
  sessionStorage.setItem(SESSION_EXPIRED_KEY, "true");

  // 모든 인증 관련 데이터 삭제
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(MENU_STORAGE_KEY);

  // 세션 만료 메시지 저장 (로그인 페이지에서 표시)
  sessionStorage.setItem(
    "login_message",
    "세션이 만료되었습니다. 다시 로그인해주세요.",
  );

  // 페이지 새로고침으로 로그인 화면 표시 (AppShell이 자동으로 Login 렌더링)
  window.location.reload();
}

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // AUTH_01: 유효하지 않은 토큰, AUTH_02: 만료된 토큰 - 세션 만료 처리
    const errorCode = error.response?.data?.code;
    if (error.response?.status === 401 && (errorCode === "AUTH_01" || errorCode === "AUTH_02")) {
      handleSessionExpired();
    }
    return Promise.reject(error);
  },
);

export default apiClient;
