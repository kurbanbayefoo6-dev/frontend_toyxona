import { useQuery } from '@tanstack/react-query'

import { getFavoritesWithVenues } from '@/services/favorite.service'

export function useCustomerFavorites() {
	return useQuery({
		queryKey: ['customer', 'favorites'],
		queryFn: () => getFavoritesWithVenues(),
	})
}
