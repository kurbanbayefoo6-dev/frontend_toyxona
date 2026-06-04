import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'

import { HomeHero } from '@/components/features/home'
import {
	parseSortOption,
	VenueCard,
	VenueCardSkeleton,
	VenueFilters,
	VenueGrid,
	VenueListEmpty,
	VenueListError,
	type SortOption,
} from '@/components/features/venues'
import { Pagination } from '@/components/ui/Pagination'
import { useDebounce } from '@/hooks/useDebounce'
import { useVenues } from '@/hooks/useVenues'
import { getBookings } from '@/services/booking.service'
import { useAuthStore } from '@/stores/authStore'
import { useDistrictStore } from '@/stores/districtStore'
import type { VenueListParams } from '@/types/venue'
import { getApiErrorMessage } from '@/utils/authErrors'

const VENUES_PER_PAGE = 9
const SEARCH_DEBOUNCE_MS = 300

function parseOptionalPositiveInt(value: string): number | undefined {
	if (!value.trim()) return undefined
	const parsed = Number(value)
	if (Number.isNaN(parsed) || parsed < 0) return undefined
	return parsed
}

export default function HomePage() {
	const resultsRef = useRef<HTMLElement>(null)
	const district = useDistrictStore(s => s.district)
	const setDistrict = useDistrictStore(s => s.setDistrict)
	const isAuthenticated = useAuthStore(s => s.isAuthenticated)
	const role = useAuthStore(s => s.role)

	const [search, setSearch] = useState('')
	const [capacity, setCapacity] = useState('')
	const [minPrice, setMinPrice] = useState('')
	const [maxPrice, setMaxPrice] = useState('')
	const [sort, setSort] = useState<SortOption>('created_at:desc')
	const [page, setPage] = useState(1)

	const debouncedSearch = useDebounce(search.trim(), SEARCH_DEBOUNCE_MS)
	const { sortBy, sortOrder } = parseSortOption(sort)

	const queryParams = useMemo<VenueListParams>(() => {
		const params: VenueListParams = {
			page,
			limit: VENUES_PER_PAGE,
			sortBy,
			sortOrder,
		}

		if (debouncedSearch) params.search = debouncedSearch
		if (district) params.district = district

		const capacityValue = parseOptionalPositiveInt(capacity)
		if (capacityValue !== undefined && capacityValue > 0) {
			params.capacity = capacityValue
		}

		const min = parseOptionalPositiveInt(minPrice)
		const max = parseOptionalPositiveInt(maxPrice)
		if (min !== undefined) params.minPrice = min
		if (max !== undefined) params.maxPrice = max

		return params
	}, [
		page,
		debouncedSearch,
		district,
		capacity,
		minPrice,
		maxPrice,
		sortBy,
		sortOrder,
	])

	useEffect(() => {
		setPage(1)
	}, [debouncedSearch, district, capacity, minPrice, maxPrice, sort])

	const { data, isLoading, isError, error, isFetching, refetch } =
		useVenues(queryParams)

	const statsQuery = useVenues({ page: 1, limit: 1 })

	const bookingsStatsQuery = useQuery({
		queryKey: ['bookings', 'stats', 'total'],
		queryFn: () => getBookings({ page: 1, limit: 1 }),
		enabled: isAuthenticated && role === 'customer',
		retry: false,
	})

	const venues = data?.items ?? []
	const totalPages = data?.totalPages ?? 1
	const total = data?.total ?? 0
	const showInitialLoading = isLoading && !data
	const showEmpty = !showInitialLoading && !isError && venues.length === 0

	const venueCount = statsQuery.data?.total ?? null
	const approvedVenueCount = venueCount
	const activeBookingsCount =
		isAuthenticated && role === 'customer'
			? (bookingsStatsQuery.data?.total ?? null)
			: null
	const statsLoading =
		statsQuery.isLoading ||
		(isAuthenticated && role === 'customer' && bookingsStatsQuery.isLoading)

	function scrollToResults() {
		resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
	}

	return (
		<div className='flex flex-col'>
			<div className='-mx-4 -mt-4'>
				<HomeHero
					searchProps={{
						search,
						onSearchChange: setSearch,
						district,
						onDistrictChange: setDistrict,
						disabled: showInitialLoading,
					}}
					statsProps={{
						venueCount,
						approvedVenueCount,
						activeBookingsCount,
						isLoading: statsLoading,
					}}
					onSearchSubmit={scrollToResults}
				/>
			</div>

			<div className='mx-auto flex w-full max-w-7xl flex-col gap-8 px-0 pb-12 pt-10 sm:gap-10 sm:pt-12'>
				<section
					ref={resultsRef}
					id='venue-results'
					className='scroll-mt-6 flex flex-col gap-6 sm:gap-8'
				>
					<header
						className='flex flex-col gap-2 border-b pb-6 sm:flex-row sm:items-end sm:justify-between'
						style={{ borderColor: 'var(--color-border)' }}
					>
						<div>
							<h2
								className='text-xl font-semibold sm:text-2xl'
								style={{ color: 'var(--color-text-primary)' }}
							>
								Mos to‘yxonalar
							</h2>
							<p
								className='mt-1 text-sm'
								style={{ color: 'var(--color-text-secondary)' }}
							>
								Tuman, sig‘im va narx bo‘yicha qo‘shimcha filtrlardan foydalaning
							</p>
						</div>
						{!showInitialLoading && !isError && total > 0 && (
							<p
								className='text-sm tabular-nums'
								style={{ color: 'var(--color-text-secondary)' }}
							>
								<span
									className='font-semibold'
									style={{ color: 'var(--color-brand)' }}
								>
									{total.toLocaleString('uz-UZ')}
								</span>{' '}
								ta natija
								{isFetching ? (
									<span style={{ color: 'var(--color-text-hint)' }}>
										{' '}
										· yangilanmoqda...
									</span>
								) : null}
							</p>
						)}
					</header>

					<VenueFilters
						search={search}
						onSearchChange={setSearch}
						district={district}
						onDistrictChange={setDistrict}
						capacity={capacity}
						onCapacityChange={setCapacity}
						minPrice={minPrice}
						onMinPriceChange={setMinPrice}
						maxPrice={maxPrice}
						onMaxPriceChange={setMaxPrice}
						sort={sort}
						onSortChange={setSort}
						disabled={showInitialLoading}
						hideSearch
					/>

					{isError && (
						<VenueListError
							message={getApiErrorMessage(
								error,
								'Maskanlar yuklanmadi. Qayta urinib ko‘ring.',
							)}
							onRetry={() => void refetch()}
							isRetrying={isFetching}
						/>
					)}

					{showInitialLoading && (
						<VenueGrid>
							{Array.from({ length: VENUES_PER_PAGE }).map((_, i) => (
								<VenueCardSkeleton key={i} />
							))}
						</VenueGrid>
					)}

					{!showInitialLoading && !isError && venues.length > 0 && (
						<VenueGrid>
							{venues.map(venue => (
								<VenueCard key={venue.id} venue={venue} />
							))}
						</VenueGrid>
					)}

					{showEmpty && <VenueListEmpty />}

					{!isError && totalPages > 1 && (
						<div className='pt-2'>
							<Pagination
								page={page}
								totalPages={totalPages}
								onPageChange={setPage}
								disabled={isFetching}
							/>
						</div>
					)}
				</section>
			</div>
		</div>
	)
}
