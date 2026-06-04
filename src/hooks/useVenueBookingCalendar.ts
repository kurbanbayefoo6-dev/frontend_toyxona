import { useQuery } from '@tanstack/react-query'

import { getVenueBookingCalendar } from '@/services/venue.service'

export function useVenueBookingCalendar(
	venueId: number,
	enabled: boolean,
) {
	return useQuery({
		queryKey: ['venue', venueId, 'bookings-calendar'],
		queryFn: () => getVenueBookingCalendar(venueId),
		enabled: enabled && venueId > 0 && !Number.isNaN(venueId),
	})
}
