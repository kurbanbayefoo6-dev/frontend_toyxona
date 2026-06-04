import { useQuery } from '@tanstack/react-query'

import { getAdminVenues } from '@/services/admin.service'
import type { AdminListParams } from '@/types/admin'

export function useAdminVenues(params: AdminListParams) {
	return useQuery({
		queryKey: ['admin', 'venues', params],
		queryFn: () => getAdminVenues(params),
	})
}
