import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '../client';
import type { User, ChangePasswordRequest } from '@/types';

// 로그인 요청 타입
export interface LoginRequest {
  userId: string;
  password: string;
}

// JWT 응답 타입
export interface JwtResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  username: string;
}

// 계정 정보 타입
export interface AccountInfo {
  accountId: number;
  username: string;
  password?: string;
  name: string;
  email: string;
  phoneNo: string;
  role: string;
  permissionInfo: {
    permissionId: number;
    permissionCode: string;
    permissionName: string;
    description: string;
    permissionLevel: number;
    activeYn: string;
  };
  lastLoginAt: string;
  activeYn: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  meta: {
    createAt: string;
  };
  data: {
    jwtResponse: JwtResponse;
    accountInfo: AccountInfo;
  };
}

const TOKEN_KEY = 'meercatch_jwt';

// 토큰 저장
export function saveToken(jwtResponse: JwtResponse): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(jwtResponse));
  }
}

// 토큰 가져오기
export function getToken(): JwtResponse | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// 토큰 삭제
export function clearToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// accessToken만 가져오기
export function getAccessToken(): string | null {
  const jwt = getToken();
  return jwt?.accessToken ?? null;
}

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const { data } = await apiClient.post('/auth/login', credentials);
      return data;
    },
    onSuccess: (response) => {
      if (response.data?.jwtResponse) {
        saveToken(response.data.jwtResponse);
      }
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      try {
        await apiClient.post('/auth/logout');
      } catch {
        // 로그아웃 API 실패해도 로컬에서 처리
      }
    },
    onSettled: () => {
      clearToken();
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('meercatch_auth');
      }
      queryClient.clear();
    },
  });
}

export function useMe(options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async (): Promise<User> => {
      const { data } = await apiClient.get('/auth/me');
      return data;
    },
    ...options,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (passwordData: ChangePasswordRequest): Promise<void> => {
      await apiClient.put('/auth/password', passwordData);
    },
  });
}
