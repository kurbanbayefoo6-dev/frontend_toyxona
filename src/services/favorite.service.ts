import { apiClient } from '@/services/apiClient'
import { getVenueById } from '@/services/venue.service'
import type { ApiSuccessResponse } from '@/types/api'
import type { FavoriteItem } from '@/types/customer'
import type { Venue } from '@/types/venue'

export type FavoriteWithVenue = FavoriteItem & {
	venue: Venue | null
}

export async function getFavorites(): Promise<FavoriteItem[]> {
	const res = await apiClient.get<ApiSuccessResponse<FavoriteItem[]>>(
		'/api/favorites',
	)
	return res.data.data
}

export async function getFavoritesWithVenues(): Promise<FavoriteWithVenue[]> {
	const favorites = await getFavorites()
	return Promise.all(
		favorites.map(async favorite => {
			try {
				const venue = await getVenueById(favorite.venueId)
				return { ...favorite, venue }
			} catch {
				return { ...favorite, venue: null }
			}
		}),
	)
}

export async function addFavorite(venueId: number): Promise<FavoriteItem> {
	const res = await apiClient.post<ApiSuccessResponse<FavoriteItem>>(
		`/api/favorites/venues/${venueId}`,
	)
	return res.data.data
}

export async function removeFavorite(venueId: number): Promise<void> {
	await apiClient.delete(`/api/favorites/venues/${venueId}`)
}
