import { apiClient } from '@/services/apiClient'
import type { ApiSuccessResponse } from '@/types/api'
import type {
	BookingCalendarEntry,
	VenueAvailability,
	VenueFullData,
} from '@/types/venueDetail'
import type { PaginatedVenues, Venue, VenueListParams } from '@/types/venue'
import { parseApiNumber } from '@/utils/parseApiNumber'

type RawVenue = Omit<Venue, 'capacity' | 'pricePerSeat' | 'imageUrl'> & {
	capacity: number | string
	pricePerSeat: number | string
	imageUrl?: string | null
}

type VenueImage = { id: number; imageUrl: string }

function normalizeVenue(raw: RawVenue, imageUrl?: string | null): Venue {
	return {
		...raw,
		capacity: parseApiNumber(raw.capacity),
		pricePerSeat: parseApiNumber(raw.pricePerSeat),
		imageUrl: imageUrl ?? raw.imageUrl ?? null,
	}
}

async function fetchVenueCoverImage(venueId: number): Promise<string | null> {
	try {
		const res = await apiClient.get<ApiSuccessResponse<VenueImage[]>>(
			`/api/venues/${venueId}/images`,
		)
		return res.data.data?.[0]?.imageUrl ?? null
	} catch {
		return null
	}
}

async function enrichVenuesWithImages(venues: Venue[]): Promise<Venue[]> {
	return Promise.all(
		venues.map(async venue => {
			if (venue.imageUrl) return venue
			const imageUrl = await fetchVenueCoverImage(venue.id)
			return { ...venue, imageUrl }
		}),
	)
}

type RawVenueResponse = RawVenue

export async function getVenueById(venueId: number): Promise<Venue> {
	const res = await apiClient.get<ApiSuccessResponse<RawVenueResponse>>(
		`/api/venues/${venueId}`,
	)
	const venue = normalizeVenue(res.data.data)
	const imageUrl = venue.imageUrl ?? (await fetchVenueCoverImage(venueId))
	return { ...venue, imageUrl }
}

export async function getVenues(
	params: VenueListParams,
): Promise<PaginatedVenues> {
	const res = await apiClient.get<ApiSuccessResponse<PaginatedVenues>>(
		'/api/venues',
		{ params },
	)

	const data = res.data.data
	const items = data.items.map(item =>
		normalizeVenue(item as RawVenue),
	)
	const itemsWithImages = await enrichVenuesWithImages(items)

	return {
		...data,
		items: itemsWithImages,
	}
}

type RawVenueFull = {
	venue: RawVenue
	images: VenueFullData['images']
	singers: Array<Omit<VenueFullData['singers'][0], 'price'> & { price: number | string }>
	menuItems: VenueFullData['menuItems']
	cars: Array<Omit<VenueFullData['cars'][0], 'price'> & { price: number | string }>
	karnaySurnay: Array<
		Omit<VenueFullData['karnaySurnay'][0], 'price'> & { price: number | string }
	>
	availability: VenueAvailability
}

function normalizeVenueFull(raw: RawVenueFull): VenueFullData {
	return {
		...raw,
		venue: normalizeVenue(raw.venue),
		singers: raw.singers.map(s => ({
			...s,
			price: parseApiNumber(s.price),
		})),
		cars: raw.cars.map(c => ({
			...c,
			price: parseApiNumber(c.price),
		})),
		karnaySurnay: raw.karnaySurnay.map(k => ({
			...k,
			price: parseApiNumber(k.price),
		})),
	}
}

export async function getVenueFull(venueId: number): Promise<VenueFullData> {
	const res = await apiClient.get<ApiSuccessResponse<RawVenueFull>>(
		`/api/venues/${venueId}/full`,
	)
	return normalizeVenueFull(res.data.data)
}

export async function getVenueAvailability(
	venueId: number,
): Promise<VenueAvailability> {
	const res = await apiClient.get<ApiSuccessResponse<VenueAvailability>>(
		`/api/venues/${venueId}/availability`,
	)
	return res.data.data
}

export async function getVenueBookingCalendar(
	venueId: number,
): Promise<BookingCalendarEntry[]> {
	const res = await apiClient.get<ApiSuccessResponse<BookingCalendarEntry[]>>(
		`/api/venues/${venueId}/bookings-calendar`,
	)
	return res.data.data
}

export async function createVenue(
	payload: import('@/types/owner').VenueFormPayload,
): Promise<Venue> {
	const res = await apiClient.post<ApiSuccessResponse<RawVenueResponse>>(
		'/api/venues',
		payload,
	)
	return normalizeVenue(res.data.data)
}

export async function updateVenue(
	venueId: number,
	payload: Partial<import('@/types/owner').VenueFormPayload>,
): Promise<Venue> {
	const res = await apiClient.patch<ApiSuccessResponse<RawVenueResponse>>(
		`/api/venues/${venueId}`,
		payload,
	)
	return normalizeVenue(res.data.data)
}

export async function deleteVenue(venueId: number): Promise<void> {
	await apiClient.delete(`/api/venues/${venueId}`)
}

export async function getOwnerVenues(): Promise<Venue[]> {
	const data = await getVenues({ page: 1, limit: 100 })
	return data.items
}
