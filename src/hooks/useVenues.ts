import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getVenues } from '@/services/venue.service'
import type { VenueListParams } from '@/types/venue'

export function useVenues(params: VenueListParams) {
	return useQuery({
		queryKey: ['venues', params],
		queryFn: () => getVenues(params),
		placeholderData: keepPreviousData,
	})
}
