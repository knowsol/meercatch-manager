import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface KwsSha256Item {
  id: number;
  hash_code: string;
  replace_w: string;
  protocol: string;
  port: number;
  file_path: string;
  nude_rating: number;
  sex_rating: number;
  violence_rating: number;
  language_rating: number;
  illegal_rating: number;
  harmful_rating: number;
  coverage: string;
  status: string;
  db_type: string;
  created_at: string;
}

export interface KwsUrlItem {
  id: number;
  url: string;
  event_type: number;
  created_at: string;
}

export interface KwsSha256Response {
  result: string;
  count: number;
  data: KwsSha256Item[];
}

export interface KwsUrlResponse {
  result: string;
  count: number;
  data: KwsUrlItem[];
}

export interface KwsSha256Params {
  limit?: number;
}

export interface KwsUrlParams {
  limit?: number;
  eventType?: number;
}

export const validUrlKeys = {
  all: ['validUrl'] as const,
  sha256: (params: KwsSha256Params) => [...validUrlKeys.all, 'sha256', params] as const,
  urls: (params: KwsUrlParams) => [...validUrlKeys.all, 'urls', params] as const,
};

export function useKwsSha256(params: KwsSha256Params = {}) {
  const { limit = 100 } = params;

  return useQuery({
    queryKey: validUrlKeys.sha256(params),
    queryFn: async (): Promise<KwsSha256Response> => {
      const response = await fetch(`/api/kws-sha256?limit=${limit}`);
      return response.json();
    },
  });
}

export function useKwsUrls(params: KwsUrlParams = {}) {
  const { limit = 100, eventType } = params;

  return useQuery({
    queryKey: validUrlKeys.urls(params),
    queryFn: async (): Promise<KwsUrlResponse> => {
      const queryParams = new URLSearchParams({ limit: String(limit) });
      if (eventType !== undefined) {
        queryParams.append('eventType', String(eventType));
      }
      const response = await fetch(`/api/kws-urls?${queryParams.toString()}`);
      return response.json();
    },
  });
}

export function useDeleteKwsUrl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<unknown> => {
      const response = await fetch(`/api/kws-urls/${id}`, { method: 'DELETE' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const msg =
          typeof data === 'object' && data !== null && 'message' in data
            ? String((data as { message?: string }).message)
            : `삭제 실패 (${response.status})`;
        throw new Error(msg);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: validUrlKeys.all });
    },
  });
}
