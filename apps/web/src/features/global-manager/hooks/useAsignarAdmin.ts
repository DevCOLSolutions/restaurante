import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse, AdministradorSucursal } from "@/types/api"

export function useAsignarAdmin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ sucursalId, usuarioId }: { sucursalId: string; usuarioId: string }) => {
      const res = await apiFetch<ApiResponse<AdministradorSucursal>>(
        ENDPOINTS.SUCURSALES.ASIGNAR_ADMIN(sucursalId),
        {
          method: "POST",
          body: JSON.stringify({ sucursalId, usuarioId }),
        },
      )
      return res.data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sucursal", variables.sucursalId] })
    },
  })
}
