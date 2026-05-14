import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import { getToken } from './useAuth';

export interface MyPageInfo {
  accountId: number;
  username: string;
  name: string;
  email: string;
  phoneNo: string;
  lastLoginAt: string;
  role: string;
  myPermission: {
    permissionId: number;
    permissionCode: string;
    permissionName: string;
  };
}

export interface MyPageResponse {
  meta: {
    createAt: string;
  };
  data: MyPageInfo;
}

export interface MyPageInfoRequest {
  accountId: number;
  username: string;
}

export interface MyPageUpdateRequest {
  accountId: number;
  name: string;
  email: string;
  phoneNo: string;
}

export interface MyPageUpdateResponse {
  meta: {
    createAt: string;
  };
  data: {
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
  };
}

export interface ChangePasswordRequest {
  accountId: number;
  newPassword: string;
}

export interface ChangePasswordResponse {
  meta: {
    createAt: string;
  };
  data: boolean;
}

export const myPageKeys = {
  all: ['myPage'] as const,
  info: (accountId: number) => [...myPageKeys.all, 'info', accountId] as const,
};

export function useMyPageInfo(
  accountId: number | null,
  options?: Omit<UseQueryOptions<MyPageInfo>, 'queryKey' | 'queryFn'>
) {
  const token = getToken();
  const username = token?.username || '';
  
  return useQuery({
    queryKey: myPageKeys.info(accountId ?? 0),
    queryFn: async (): Promise<MyPageInfo> => {
      const { data } = await apiClient.post<MyPageResponse>(ENDPOINTS.MY_PAGE.INFO, {
        accountId,
        username,
      });
      return data.data;
    },
    enabled: !!accountId && !!token,
    ...options,
  });
}

export function useMyPageUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: MyPageUpdateRequest): Promise<MyPageUpdateResponse> => {
      const { data } = await apiClient.put<MyPageUpdateResponse>(ENDPOINTS.MY_PAGE.UPDATE, updateData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myPageKeys.info() });
    },
  });
}

export function useMyPageChangePassword() {
  return useMutation({
    mutationFn: async (passwordData: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
      const { data } = await apiClient.post<ChangePasswordResponse>(ENDPOINTS.MY_PAGE.CHANGE_PASSWORD, passwordData);
      return data;
    },
  });
}
