import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { User, ChangePasswordRequest } from '@/types';

export const accountKeys = {
  all: ['account'] as const,
  profile: () => [...accountKeys.all, 'profile'] as const,
};

export function useProfile(options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: accountKeys.profile(),
    queryFn: async (): Promise<User> => {
      const { data } = await apiClient.get(ENDPOINTS.ACCOUNT.PROFILE);
      return data;
    },
    ...options,
  });
}

interface UpdateProfileData {
  name: string;
  contact: string;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: UpdateProfileData): Promise<{ success: boolean }> => {
      const { data } = await apiClient.put(ENDPOINTS.ACCOUNT.UPDATE_PROFILE, profileData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.profile() });
    },
  });
}

export function useChangeAccountPassword() {
  return useMutation({
    mutationFn: async (payload: ChangePasswordRequest): Promise<{ success: boolean }> => {
      const { data } = await apiClient.post(ENDPOINTS.ACCOUNT.CHANGE_PASSWORD, payload);
      return data;
    },
  });
}
