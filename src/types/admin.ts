import type { UserRole } from '@/types/auth'
import type { VenueStatus } from '@/types/venue'
import type { BookingStatus } from '@/types/booking'

export type AdminDashboardSummary = {
	totalUsers: number
	totalOwners: number
	totalCustomers: number
	totalVenues: number
	approvedVenues: number
	pendingVenues: number
	totalBookings: number
	completedBookings: number
	upcomingBookings: number
	cancelledBookings: number
	totalRevenue: number
}

export type AdminListParams = {
	search?: string
	page?: number
	limit?: number
	sortBy?: string
	sortOrder?: 'asc' | 'desc'
	status?: string
}

export type AdminPaginated<T> = {
	items: T[]
	total: number
}

export type AdminUser = {
	id: number
	firstName: string
	lastName: string
	username: string
	email: string
	phone: string
	role: UserRole
	isVerified: boolean
	createdAt: string
}

export type AdminOwner = AdminUser & {
	venueCount: number
}

export type AdminVenue = {
	id: number
	ownerId: number
	name: string
	district: string
	address: string
	capacity: number
	pricePerSeat: number
	phone: string
	status: VenueStatus
	createdAt: string
	imageUrl?: string | null
}

export type AdminBooking = {
	id: number
	venueId: number
	venueName: string
	district?: string
	customerId: number
	customerName: string
	customerPhone?: string
	bookingDate: string
	guestCount: number
	totalPrice: number
	advanceAmount: number
	status: BookingStatus
	createdAt: string
}
