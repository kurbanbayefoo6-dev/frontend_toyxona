export type VenueStatus = 'pending' | 'approved' | 'rejected'

export type VenueImageRef = {
	id?: number
	venueId?: number
	imageUrl: string
}

export type Venue = {
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
	coverImage?: string | null
	image?: string | null
	images?: VenueImageRef[]
}

export type VenueSortField =
	| 'created_at'
	| 'name'
	| 'district'
	| 'capacity'
	| 'price_per_seat'

export type VenueListParams = {
	district?: string
	capacity?: number
	minPrice?: number
	maxPrice?: number
	search?: string
	page?: number
	limit?: number
	sortBy?: VenueSortField
	sortOrder?: 'asc' | 'desc'
}

export type PaginatedVenues = {
	items: Venue[]
	total: number
	page: number
	limit: number
	totalPages: number
}
