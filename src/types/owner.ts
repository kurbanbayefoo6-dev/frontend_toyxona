export type VenueFormPayload = {
	name: string
	district: string
	address: string
	capacity: number
	pricePerSeat: number
	phone: string
}

export type SingerPayload = {
	venueId: number
	name: string
	price: number
	imageUrl?: string | null
}

export type CarPayload = {
	venueId: number
	brand: string
	price: number
	imageUrl?: string | null
}

export type MenuItemPayload = {
	venueId: number
	name: string
	imageUrl?: string | null
}

export type KarnayPayload = {
	venueId: number
	isAvailable: boolean
	price: number
}
