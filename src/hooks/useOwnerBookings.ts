import { useQuery } from '@tanstack/react-query'

import { getBookings } from '@/services/booking.service'

export function useOwnerBookings() {
	return useQuery({
		queryKey: ['owner', 'bookings'],
		queryFn: () => getBookings({ limit: 200 }),
	})
}
