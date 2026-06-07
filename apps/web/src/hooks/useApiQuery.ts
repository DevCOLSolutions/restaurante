import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
} from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"

export function useApiQuery<T>(
  queryKey: QueryKey,
  endpoint: string,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">,
) {
  return useQuery<T>({
    queryKey,
    queryFn: () => apiFetch<T>(endpoint),
    ...options,
  })
}

export function useApiMutation<TData, TBody = unknown>(
  endpoint: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
  options?: UseMutationOptions<TData, Error, TBody> & {
    invalidateKeys?: QueryKey[]
  },
) {
  const queryClient = useQueryClient()

  return useMutation<TData, Error, TBody>({
    mutationFn: (body: TBody) =>
      apiFetch<TData>(endpoint, {
        method,
        body: body ? JSON.stringify(body) : undefined,
      }),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      if (options?.invalidateKeys) {
        for (const key of options.invalidateKeys) {
          queryClient.invalidateQueries({ queryKey: key })
        }
      }
      options?.onSuccess?.(data, variables, context, mutation)
    },
  })
}
