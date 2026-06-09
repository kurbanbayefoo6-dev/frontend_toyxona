import { apiClient } from '@/services/apiClient'
import type { ApiSuccessResponse } from '@/types/api'
import type {
	AdminBooking,
	AdminDashboardSummary,
	AdminListParams,
	AdminPaginated,
	AdminUser,
	AdminVenue,
} from '@/types/admin'
import type { VenueStatus } from '@/types/venue'
import { parseApiNumber } from '@/utils/parseApiNumber'
import { pickVenueImageSource } from '@/utils/imageUrl'

type RawAdminVenue = Omit<AdminVenue, 'capacity' | 'pricePerSeat' | 'imageUrl'> & {
	capacity: number | string
	pricePerSeat: number | string
	imageUrl?: string | null
	coverImage?: string | null
	image?: string | null
	images?: AdminVenue['images']
}

type RawAdminBooking = Omit<AdminBooking, 'totalPrice' | 'advanceAmount'> & {
	totalPrice: number | string
	advanceAmount: number | string
}

function normalizeVenue(raw: RawAdminVenue): AdminVenue {
	const imageUrl = pickVenueImageSource(raw)

	return {
		...raw,
		id: parseApiNumber(raw.id),
		ownerId: parseApiNumber(raw.ownerId),
		capacity: parseApiNumber(raw.capacity),
		pricePerSeat: parseApiNumber(raw.pricePerSeat),
		imageUrl,
		coverImage: imageUrl,
		image: imageUrl,
	}
}

function normalizeBooking(raw: RawAdminBooking): AdminBooking {
	return {
		...raw,
		id: parseApiNumber(raw.id),
		venueId: parseApiNumber(raw.venueId),
		customerId: parseApiNumber(raw.customerId),
		totalPrice: parseApiNumber(raw.totalPrice),
		advanceAmount: parseApiNumber(raw.advanceAmount),
	}
}

export async function getAdminDashboard(): Promise<AdminDashboardSummary> {
	const res = await apiClient.get<ApiSuccessResponse<AdminDashboardSummary>>(
		'/api/admin/dashboard',
	)
	return res.data.data
}

export async function getAdminUsers(
	params: AdminListParams,
): Promise<AdminPaginated<AdminUser>> {
	const res = await apiClient.get<ApiSuccessResponse<AdminPaginated<AdminUser>>>(
		'/api/admin/users',
		{ params },
	)
	return res.data.data
}

export async function getAdminOwners(
	params: AdminListParams,
): Promise<AdminPaginated<AdminUser>> {
	const res = await apiClient.get<
		ApiSuccessResponse<AdminPaginated<AdminUser & { id: number | string }>>
	>('/api/admin/owners', { params })
	return {
		total: res.data.data.total,
		items: res.data.data.items.map(normalizeAdminUser),
	}
}

export async function getAdminVenues(
	params: AdminListParams,
): Promise<AdminPaginated<AdminVenue>> {
	const res = await apiClient.get<
		ApiSuccessResponse<AdminPaginated<RawAdminVenue>>
	>('/api/admin/venues', { params })
	return {
		total: res.data.data.total,
		items: res.data.data.items.map(normalizeVenue),
	}
}

export async function getAdminBookings(
	params: AdminListParams,
): Promise<AdminPaginated<AdminBooking>> {
	const res = await apiClient.get<
		ApiSuccessResponse<AdminPaginated<RawAdminBooking>>
	>('/api/admin/bookings', { params })
	return {
		total: res.data.data.total,
		items: res.data.data.items.map(normalizeBooking),
	}
}

export type CreateOwnerByAdminPayload = {
	firstName: string
	lastName: string
	email: string
	username: string
	password: string
	phone?: string
}

function normalizeAdminUser(raw: AdminUser & { id?: number | string }): AdminUser {
	return {
		...raw,
		id: parseApiNumber(raw.id),
	}
}

export async function createOwnerByAdmin(
	payload: CreateOwnerByAdminPayload,
): Promise<AdminUser> {
	const res = await apiClient.post<ApiSuccessResponse<AdminUser>>(
		'/api/admin/owners',
		{
			...payload,
			isVerified: true,
		},
	)
	return normalizeAdminUser(res.data.data)
}

export async function updateVenueStatus(
	venueId: number,
	status: Exclude<VenueStatus, 'pending'>,
): Promise<AdminVenue> {
	const res = await apiClient.patch<ApiSuccessResponse<RawAdminVenue>>(
		`/api/venues/${venueId}/status`,
		{ status },
	)
	return normalizeVenue(res.data.data)
}
