import { useQuery } from '@tanstack/react-query'

import { getBookings } from '@/services/booking.service'

export function useCustomerBookings() {
	return useQuery({
		queryKey: ['customer', 'bookings'],
		queryFn: () => getBookings(),
	})
}
