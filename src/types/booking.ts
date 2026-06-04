export type BookingStatus = 'upcoming' | 'completed' | 'cancelled'

export type SafeBooking = {
	id: number
	venueId: number
	customerId: number
	bookingDate: string
	guestCount: number
	totalPrice: number
	advanceAmount: number
	status: BookingStatus
	createdAt: string
}

export type CreateBookingPayload = {
	venueId: number
	bookingDate: string
	guestCount: number
	singerIds?: number[]
	carIds?: number[]
	karnaySurnayIds?: number[]
}

export type PaymentType = 'advance' | 'full'

export type CreatePaymentPayload = {
	bookingId: number
	paymentType: PaymentType
}

export type PaymentResult = {
	transactionId: string
	amount: number
	success: boolean
}
