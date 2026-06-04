import { useQuery } from '@tanstack/react-query'

import { getVenueFull } from '@/services/venue.service'

export function useVenueDetail(venueId: number) {
	return useQuery({
		queryKey: ['venue', venueId, 'full'],
		queryFn: () => getVenueFull(venueId),
		enabled: venueId > 0 && !Number.isNaN(venueId),
	})
}
