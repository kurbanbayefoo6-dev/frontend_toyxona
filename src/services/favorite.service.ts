import { apiClient } from '@/services/apiClient'
import type { ApiSuccessResponse } from '@/types/api'
import type { FavoriteItem } from '@/types/customer'
import type { Venue } from '@/types/venue'
import { pickVenueImageSource } from '@/utils/imageUrl'

export type FavoriteWithVenue = FavoriteItem & {
	venue: Venue | null
}

type RawFavorite = FavoriteItem & {
	venue?: Venue | null
}

function normalizeFavoriteVenue(venue: Venue | null | undefined): Venue | null {
	if (!venue) return null
	const imageUrl = pickVenueImageSource(venue)
	return { ...venue, imageUrl, coverImage: imageUrl, image: imageUrl }
}

export async function getFavorites(): Promise<FavoriteItem[]> {
	const res = await apiClient.get<ApiSuccessResponse<FavoriteItem[]>>(
		'/api/favorites',
	)
	return res.data.data
}

export async function getFavoritesWithVenues(): Promise<FavoriteWithVenue[]> {
	const res = await apiClient.get<ApiSuccessResponse<RawFavorite[]>>(
		'/api/favorites',
	)

	return res.data.data.map(favorite => ({
		...favorite,
		venue: normalizeFavoriteVenue(favorite.venue),
	}))
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
