import { useQuery } from '@tanstack/react-query'

import { getVenueFull } from '@/services/venue.service'

export function useOwnerVenueFull(venueId: number) {
	return useQuery({
		queryKey: ['owner', 'venue', venueId, 'full'],
		queryFn: () => getVenueFull(venueId),
		enabled: venueId > 0 && !Number.isNaN(venueId),
	})
}
