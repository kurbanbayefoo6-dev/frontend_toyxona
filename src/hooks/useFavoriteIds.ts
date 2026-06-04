import { useQuery } from '@tanstack/react-query'

import { getFavorites } from '@/services/favorite.service'
import { useAuthStore } from '@/stores/authStore'

export function useFavoriteIds() {
	const isAuthenticated = useAuthStore(s => s.isAuthenticated)
	const role = useAuthStore(s => s.role)

	return useQuery({
		queryKey: ['customer', 'favorite-ids'],
		queryFn: async () => {
			const favorites = await getFavorites()
			return new Set(favorites.map(f => f.venueId))
		},
		enabled: isAuthenticated && role === 'customer',
	})
}
