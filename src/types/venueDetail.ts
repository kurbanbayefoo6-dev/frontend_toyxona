import type { Venue } from '@/types/venue'

export type VenueImage = {
	id: number
	imageUrl: string
}

export type VenueSinger = {
	id: number
	name: string
	price: number
	imageUrl: string | null
}

export type VenueMenuItem = {
	id: number
	name: string
	imageUrl: string | null
}

export type VenueCar = {
	id: number
	brand: string
	price: number
	imageUrl: string | null
}

export type VenueKarnaySurnay = {
	id: number
	isAvailable: boolean
	price: number
}

export type VenueAvailability = {
	availableDates: string[]
	bookedDates: string[]
	pastDates: string[]
}

export type VenueFullData = {
	venue: Venue
	images: VenueImage[]
	singers: VenueSinger[]
	menuItems: VenueMenuItem[]
	cars: VenueCar[]
	karnaySurnay: VenueKarnaySurnay[]
	availability: VenueAvailability
}

export type BookingCalendarEntry = {
	bookingId: number
	bookingDate: string
	customerName: string
	customerPhone: string
	guestCount: number
	status: 'upcoming' | 'completed' | 'cancelled'
}

export type CalendarDayStatus = 'past' | 'booked' | 'available'
