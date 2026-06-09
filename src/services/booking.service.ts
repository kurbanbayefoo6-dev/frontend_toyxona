import { apiClient } from '@/services/apiClient'
import type { ApiSuccessResponse } from '@/types/api'
import type {
	BookingStatus,
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
		id: parseApiNumber(raw.id),
		venueId: parseApiNumber(raw.venueId),
		customerId: parseApiNumber(raw.customerId),
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
		id: parseApiNumber(raw.id),
		venueId: parseApiNumber(raw.venueId),
		customerId: parseApiNumber(raw.customerId),
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
	>('/api/payments', {
		bookingId: parseApiNumber(payload.bookingId),
		paymentType: payload.paymentType,
	})
	return res.data.data
}

export async function updateBookingStatus(
	bookingId: number,
	status: BookingStatus,
): Promise<SafeBooking> {
	const res = await apiClient.patch<ApiSuccessResponse<RawBooking>>(
		'/api/bookings',
		{
			bookingId: parseApiNumber(bookingId),
			status,
		},
	)
	return normalizeBooking(res.data.data)
}

export async function cancelBooking(bookingId: number): Promise<SafeBooking> {
	return updateBookingStatus(bookingId, 'cancelled')
}
