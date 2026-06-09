import { isBefore, parseISO, startOfDay } from 'date-fns'

import type { VenueAvailability } from '@/types/venueDetail'
import { buildDateSet } from '@/utils/calendar'

export type BookingValidationInput = {
	selectedDate: string | null
	guestCount: number
	capacity: number
	availability: VenueAvailability
}

export function validateBookingForm(
	input: BookingValidationInput,
): string | null {
	const { selectedDate, guestCount, capacity, availability } = input

	if (!selectedDate) {
		return 'Sana tanlanmagan'
	}

	if (!Number.isFinite(guestCount) || guestCount < 1) {
		return 'Mehmonlar soni noto‘g‘ri'
	}

	if (guestCount > capacity) {
		return `Mehmonlar soni ${capacity} dan oshmasligi kerak`
	}

	const day = parseISO(selectedDate)
	const today = startOfDay(new Date())
	if (isBefore(day, today)) {
		return 'O‘tgan sanani tanlab bo‘lmaydi'
	}

	const past = buildDateSet(availability.pastDates)
	const booked = buildDateSet(availability.bookedDates)
	const key = selectedDate.split('T')[0]

	if (past.has(key) || isBefore(day, today)) {
		return 'O‘tgan sanani tanlab bo‘lmaydi'
	}

	if (booked.has(key)) {
		return 'Bu kun band'
	}

	return null
}
