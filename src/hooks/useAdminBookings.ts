import { useQuery } from '@tanstack/react-query'

import { getAdminBookings } from '@/services/admin.service'
import type { AdminListParams } from '@/types/admin'

export function useAdminBookings(params: AdminListParams) {
	return useQuery({
		queryKey: ['admin', 'bookings', params],
		queryFn: () => getAdminBookings(params),
	})
}
