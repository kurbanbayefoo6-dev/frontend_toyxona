import type { VenueCar, VenueKarnaySurnay, VenueSinger } from '@/types/venueDetail'

export type BookingAddonsSelection = {
	selectedSingerIds: number[]
	selectedCarIds: number[]
	selectedKarnayIds: number[]
}

export type BookingPriceInput = {
	pricePerSeat: number
	guestCount: number
	singers: VenueSinger[]
	cars: VenueCar[]
	karnaySurnay: VenueKarnaySurnay[]
	selection: BookingAddonsSelection
}

export type BookingPriceBreakdown = {
	baseTotal: number
	singersTotal: number
	carsTotal: number
	karnayTotal: number
	grandTotal: number
}

export function calculateBookingPrice(
	input: BookingPriceInput,
): BookingPriceBreakdown {
	const { pricePerSeat, guestCount, singers, cars, karnaySurnay, selection } =
		input

	const baseTotal = pricePerSeat * Math.max(0, guestCount)

	const singersTotal = singers
		.filter(s => selection.selectedSingerIds.includes(s.id))
		.reduce((sum, s) => sum + s.price, 0)

	const carsTotal = cars
		.filter(c => selection.selectedCarIds.includes(c.id))
		.reduce((sum, c) => sum + c.price, 0)

	const karnayTotal = karnaySurnay
		.filter(
			k =>
				k.isAvailable && selection.selectedKarnayIds.includes(k.id),
		)
		.reduce((sum, k) => sum + k.price, 0)

	const grandTotal = baseTotal + singersTotal + carsTotal + karnayTotal

	return {
		baseTotal,
		singersTotal,
		carsTotal,
		karnayTotal,
		grandTotal,
	}
}
