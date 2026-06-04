import { useQuery } from '@tanstack/react-query'

import { getVenueBookingCalendar } from '@/services/venue.service'

export function useOwnerBookingPhones(venueIds: number[]) {
	return useQuery({
		queryKey: ['owner', 'booking-phones', venueIds.sort().join(',')],
		queryFn: async () => {
			const map = new Map<number, string>()
			await Promise.all(
				venueIds.map(async venueId => {
					const entries = await getVenueBookingCalendar(venueId)
					entries.forEach(e => map.set(e.bookingId, e.customerPhone))
				}),
			)
			return map
		},
		enabled: venueIds.length > 0,
		staleTime: 60_000,
	})
}
