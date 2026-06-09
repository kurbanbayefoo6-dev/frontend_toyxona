import {
	addMonths,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	isBefore,
	isSameDay,
	isSameMonth,
	parseISO,
	startOfDay,
	startOfMonth,
	startOfWeek,
} from 'date-fns'

import type { CalendarDayStatus, VenueAvailability } from '@/types/venueDetail'

export function toDateKey(date: Date): string {
	return format(date, 'yyyy-MM-dd')
}

export function buildDateSet(dates: string[]): Set<string> {
	return new Set(dates.map(d => d.split('T')[0]))
}

export function getDayStatus(
	day: Date,
	availability: VenueAvailability,
): CalendarDayStatus {
	const key = toDateKey(day)
	const today = startOfDay(new Date())
	const booked = buildDateSet(availability.bookedDates)
	const past = buildDateSet(availability.pastDates)
	const available = buildDateSet(availability.availableDates)

	if (isBefore(day, today) || past.has(key)) {
		return 'past'
	}
	if (booked.has(key)) {
		return 'booked'
	}
	if (available.has(key)) {
		return 'available'
	}
	// Backend often returns empty availableDates — treat future non-booked as available
	return 'available'
}

export function getCalendarDays(month: Date): Date[] {
	const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
	const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
	return eachDayOfInterval({ start, end })
}

export { addMonths, format, isSameDay, isSameMonth, parseISO, startOfMonth }
