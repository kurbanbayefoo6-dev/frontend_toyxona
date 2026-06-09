import type { BookingStatus } from '@/types/booking'

export type PaginatedResult<T> = {
	items: T[]
	total: number
}

export type BookingListItem = {
	id: number
	venueId: number
	venueName: string
	customerId: number
	customerName: string
	bookingDate: string
	guestCount: number
	totalPrice: number
	advanceAmount: number
	status: BookingStatus
	createdAt: string
}

export type PaymentStatus = 'pending' | 'paid' | 'failed'
export type PaymentType = 'advance' | 'full'

export type PaymentListItem = {
	id: number
	bookingId: number
	transactionId: string
	amount: number
	paymentType: PaymentType
	paymentStatus: PaymentStatus
	paidAt: string | null
	createdAt: string
	bookingDate: string
	venueName: string
	customerName: string
}

export type FavoriteItem = {
	id: number
	userId: number
	venueId: number
	createdAt: string
}

export type ReviewItem = {
	id: number
	userId: number
	venueId: number
	rating: number
	comment: string
	createdAt: string
}

export type UserProfile = {
	id: number
	firstName: string
	lastName: string
	username: string
	email: string
	phone: string
	role: 'customer'
	isVerified: boolean
	createdAt: string
}

export type UpdateProfilePayload = {
	firstName?: string
	lastName?: string
	phone?: string
}

export type ChangePasswordPayload = {
	currentPassword: string
	newPassword: string
}

export type CreateReviewPayload = {
	venueId: number
	rating: number
	comment: string
}

export type UpdateReviewPayload = {
	rating?: number
	comment?: string
}
