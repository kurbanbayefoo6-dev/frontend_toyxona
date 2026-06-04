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

type RawAdminVenue = Omit<AdminVenue, 'capacity' | 'pricePerSeat'> & {
	capacity: number | string
	pricePerSeat: number | string
}

type RawAdminBooking = Omit<AdminBooking, 'totalPrice' | 'advanceAmount'> & {
	totalPrice: number | string
	advanceAmount: number | string
}

function normalizeVenue(raw: RawAdminVenue): AdminVenue {
	return {
		...raw,
		capacity: parseApiNumber(raw.capacity),
		pricePerSeat: parseApiNumber(raw.pricePerSeat),
	}
}

function normalizeBooking(raw: RawAdminBooking): AdminBooking {
	return {
		...raw,
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
	const res = await apiClient.get<ApiSuccessResponse<AdminPaginated<AdminUser>>>(
		'/api/admin/owners',
		{ params },
	)
	return res.data.data
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
