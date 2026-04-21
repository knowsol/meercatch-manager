import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '../client';
import type { Account, AccountSearchRequest, AccountSearchResponse } from '@/types';

export const accountKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountKeys.all, 'list'] as const,
  list: (params: AccountSearchRequest) => [...accountKeys.lists(), params] as const,
  details: () => [...accountKeys.all, 'detail'] as const,
  detail: (id: number) => [...accountKeys.details(), id] as const,
};

export function useAccountSearch(
  params: AccountSearchRequest = {},
  options?: Omit<UseQueryOptions<AccountSearchResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: accountKeys.list(params),
    queryFn: async (): Promise<AccountSearchResponse> => {
      const { data } = await apiClient.post('/accounts/search', {
        searchKeyword: params.keyword ?? '',
        page: (params.page ?? 0) + 1,
        size: params.size ?? 10,
      });
      return data;
    },
    ...options,
  });
}

export function useAccount(
  id: number,
  options?: Omit<UseQueryOptions<Account>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: accountKeys.detail(id),
    queryFn: async (): Promise<Account> => {
      const { data } = await apiClient.get(`/accounts/${id}`);
      return data;
    },
    enabled: !!id,
    ...options,
  });
}

interface CreateAccountRequest {
  username: string;
  password: string;
  name: string;
  email: string;
  phoneNo: string;
  role: string;
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accountData: CreateAccountRequest): Promise<Account> => {
      const { data } = await apiClient.post('/accounts', accountData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
    },
  });
}

interface UpdateAccountRequest extends Partial<Omit<CreateAccountRequest, 'password'>> {
  accountId: number;
  activeYn?: string;
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ accountId, ...accountData }: UpdateAccountRequest): Promise<Account> => {
      const { data } = await apiClient.put(`/accounts/${accountId}`, accountData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      queryClient.invalidateQueries({ queryKey: accountKeys.detail(variables.accountId) });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await apiClient.delete(`/accounts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
    },
  });
}
