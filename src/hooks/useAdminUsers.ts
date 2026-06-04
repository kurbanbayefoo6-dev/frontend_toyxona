import { useQuery } from '@tanstack/react-query'

import { getAdminUsers } from '@/services/admin.service'
import type { AdminListParams } from '@/types/admin'

export function useAdminUsers(params: AdminListParams) {
	return useQuery({
		queryKey: ['admin', 'users', params],
		queryFn: () => getAdminUsers(params),
	})
}
