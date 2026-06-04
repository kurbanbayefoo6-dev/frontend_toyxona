import { isBefore, parseISO, startOfDay } from 'date-fns'

import type { BookingListItem, PaymentListItem } from '@/types/customer'

export type BookingDisplayStatus =
	| 'pending'
	| 'confirmed'
	| 'cancelled'
	| 'completed'

const BOOKING_STATUS_LABELS: Record<BookingDisplayStatus, string> = {
	pending: 'Kutilmoqda',
	confirmed: 'Tasdiqlangan',
	cancelled: 'Bekor qilingan',
	completed: 'Bo‘lib o‘tgan',
}

const PAYMENT_STATUS_LABELS: Record<
	PaymentListItem['paymentStatus'],
	string
> = {
	paid: 'To‘langan',
	pending: 'Kutilmoqda',
	failed: 'Muvaffaqiyatsiz',
}

export function getBookingDisplayStatus(
	booking: BookingListItem,
	paidBookingIds: Set<number>,
): BookingDisplayStatus {
	if (booking.status === 'cancelled') return 'cancelled'
	if (booking.status === 'completed') return 'completed'
	if (paidBookingIds.has(booking.id)) return 'confirmed'
	return 'pending'
}

export function getBookingStatusLabel(status: BookingDisplayStatus): string {
	return BOOKING_STATUS_LABELS[status]
}

export function getPaymentStatusLabel(
	status: PaymentListItem['paymentStatus'],
): string {
	return PAYMENT_STATUS_LABELS[status]
}

export function getBookingStatusStyle(status: BookingDisplayStatus): {
	bg: string
	color: string
} {
	switch (status) {
		case 'confirmed':
			return {
				bg: 'var(--color-available-light)',
				color: 'var(--color-available)',
			}
		case 'cancelled':
			return {
				bg: 'var(--color-booked-light)',
				color: 'var(--color-booked)',
			}
		case 'completed':
			return {
				bg: 'var(--color-surface-secondary)',
				color: 'var(--color-text-secondary)',
			}
		default:
			return {
				bg: 'var(--color-pending-light)',
				color: 'var(--color-pending)',
			}
	}
}

export function getPaymentStatusStyle(
	status: PaymentListItem['paymentStatus'],
): { bg: string; color: string } {
	switch (status) {
		case 'paid':
			return {
				bg: 'var(--color-available-light)',
				color: 'var(--color-available)',
			}
		case 'failed':
			return {
				bg: 'var(--color-booked-light)',
				color: 'var(--color-booked)',
			}
		default:
			return {
				bg: 'var(--color-pending-light)',
				color: 'var(--color-pending)',
			}
	}
}

export function isUpcomingBooking(booking: BookingListItem): boolean {
	if (booking.status !== 'upcoming') return false
	const day = parseISO(booking.bookingDate.split('T')[0])
	return !isBefore(day, startOfDay(new Date()))
}

export function buildPaidBookingIds(
	payments: PaymentListItem[],
): Set<number> {
	const ids = new Set<number>()
	payments.forEach(p => {
		if (p.paymentStatus === 'paid') ids.add(p.bookingId)
	})
	return ids
}

export function normalizeDateKey(date: string): string {
	return date.split('T')[0]
}
