import { useQuery } from '@tanstack/react-query'

import { getOwnerVenues } from '@/services/venue.service'

export function useOwnerVenues() {
	return useQuery({
		queryKey: ['owner', 'venues'],
		queryFn: () => getOwnerVenues(),
	})
}
