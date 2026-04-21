import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { NotificationSettings } from '@/types';

export const notificationKeys = {
  all: ['notifications'] as const,
  settings: () => [...notificationKeys.all, 'settings'] as const,
};

export function useNotificationSettings(options?: Omit<UseQueryOptions<NotificationSettings>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: notificationKeys.settings(),
    queryFn: async (): Promise<NotificationSettings> => {
      const { data } = await apiClient.get(ENDPOINTS.NOTIFICATIONS.SETTINGS);
      return data;
    },
    ...options,
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<NotificationSettings>): Promise<{ success: boolean }> => {
      const { data } = await apiClient.put(ENDPOINTS.NOTIFICATIONS.UPDATE_SETTINGS, settings);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.settings() });
    },
  });
}

export function useSendTestNotification() {
  return useMutation({
    mutationFn: async (type: 'email' | 'sms'): Promise<{ success: boolean }> => {
      const { data } = await apiClient.post(ENDPOINTS.NOTIFICATIONS.TEST, { type });
      return data;
    },
  });
}
