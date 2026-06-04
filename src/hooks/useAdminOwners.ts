import { useQuery } from '@tanstack/react-query'

import { getAdminOwners } from '@/services/admin.service'
import type { AdminListParams } from '@/types/admin'

export function useAdminOwners(params: AdminListParams) {
	return useQuery({
		queryKey: ['admin', 'owners', params],
		queryFn: () => getAdminOwners(params),
	})
}
