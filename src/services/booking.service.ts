import { apiClient } from '@/services/apiClient'
import type { ApiSuccessResponse } from '@/types/api'
import type {
	CreateBookingPayload,
	CreatePaymentPayload,
	PaymentResult,
	SafeBooking,
} from '@/types/booking'
import type { BookingListItem, PaginatedResult } from '@/types/customer'
import { parseApiNumber } from '@/utils/parseApiNumber'

type RawBooking = Omit<SafeBooking, 'totalPrice' | 'advanceAmount'> & {
	totalPrice: number | string
	advanceAmount: number | string
}

function normalizeBooking(raw: RawBooking): SafeBooking {
	return {
		...raw,
		totalPrice: parseApiNumber(raw.totalPrice),
		advanceAmount: parseApiNumber(raw.advanceAmount),
	}
}

export async function createBooking(
	payload: CreateBookingPayload,
): Promise<SafeBooking> {
	const res = await apiClient.post<ApiSuccessResponse<RawBooking>>(
		'/api/bookings',
		payload,
	)
	return normalizeBooking(res.data.data)
}

type RawBookingListItem = Omit<BookingListItem, 'totalPrice' | 'advanceAmount'> & {
	totalPrice: number | string
	advanceAmount: number | string
}

function normalizeBookingListItem(raw: RawBookingListItem): BookingListItem {
	return {
		...raw,
		totalPrice: parseApiNumber(raw.totalPrice),
		advanceAmount: parseApiNumber(raw.advanceAmount),
	}
}

export async function getBookings(params?: {
	page?: number
	limit?: number
}): Promise<PaginatedResult<BookingListItem>> {
	const res = await apiClient.get<
		ApiSuccessResponse<PaginatedResult<RawBookingListItem>>
	>('/api/bookings', { params: { page: 1, limit: 100, ...params } })
	return {
		total: res.data.data.total,
		items: res.data.data.items.map(normalizeBookingListItem),
	}
}

export async function createPayment(
	payload: CreatePaymentPayload,
): Promise<PaymentResult> {
	const res = await apiClient.post<
		ApiSuccessResponse<PaymentResult>
	>('/api/payments', payload)
	return res.data.data
}
