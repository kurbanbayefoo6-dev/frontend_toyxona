import { useQuery } from '@tanstack/react-query'
import { ArrowRight, CalendarCheck, MapPin, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

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
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { DISTRICTS } from '@/constants/districts'
import { useDebounce } from '@/hooks/useDebounce'
import { useVenues } from '@/hooks/useVenues'
import { getBookings } from '@/services/booking.service'
import { useAuthStore } from '@/stores/authStore'
import { useDistrictStore } from '@/stores/districtStore'
import type { VenueListParams } from '@/types/venue'
import { getApiErrorMessage } from '@/utils/authErrors'

const VENUES_PER_PAGE = 9
const SEARCH_DEBOUNCE_MS = 300

const TESTIMONIALS = [
	{
		name: 'Madina & Aziz',
		text: 'We compared halls, services, and prices in one place. The booking flow felt calm on a very busy week.',
	},
	{
		name: 'Dilshod, venue owner',
		text: 'The owner cabinet makes bookings and venue status easy to follow without calling every customer manually.',
	},
	{
		name: 'Zarina',
		text: 'Photos, capacity, and price were clear. It finally felt like choosing a real product, not chasing screenshots.',
	},
]

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
	const featuredVenues = venues.slice(0, 3)

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

			<section className='mx-auto grid w-full max-w-7xl gap-4 px-4 py-8 sm:grid-cols-3 lg:-mt-8 lg:py-12'>
				<ValueCard
					icon={<ShieldCheck className='size-5' />}
					title='Verified venues'
					text='Clear status, photos, capacity, and contact details before you book.'
				/>
				<ValueCard
					icon={<CalendarCheck className='size-5' />}
					title='Availability first'
					text='See open and booked dates with a booking flow built around decisions.'
				/>
				<ValueCard
					icon={<Sparkles className='size-5' />}
					title='Services in context'
					text='Compare singers, cars, menu items, and event add-ons around the hall.'
				/>
			</section>

			<section className='mx-auto w-full max-w-7xl px-4 py-8'>
				<SectionHeader
					kicker='Featured'
					title='Venues worth opening first'
					text='Image-first cards surface location, capacity, pricing, and booking intent without making people hunt.'
				/>
				<div className='mt-6 grid grid-cols-1 gap-5 md:grid-cols-3'>
					{showInitialLoading
						? Array.from({ length: 3 }).map((_, i) => (
								<VenueCardSkeleton key={i} />
							))
						: featuredVenues.map(venue => (
								<VenueCard key={venue.id} venue={venue} featured />
							))}
				</div>
			</section>

			<section
				ref={resultsRef}
				id='venue-results'
				className='mx-auto grid w-full max-w-7xl scroll-mt-24 grid-cols-1 gap-6 px-4 py-10 lg:grid-cols-[320px_1fr]'
			>
				<aside className='lg:sticky lg:top-24 lg:self-start'>
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
					/>
				</aside>

				<div className='min-w-0'>
					<header className='mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
						<div>
							<p className='section-kicker'>Marketplace</p>
							<h2 className='section-title'>Explore venues</h2>
						</div>
						{!showInitialLoading && !isError && total > 0 && (
							<p className='text-sm tabular-nums text-[var(--color-text-secondary)]'>
								<span className='font-black text-[var(--color-brand)]'>
									{total.toLocaleString('uz-UZ')}
								</span>{' '}
								results
								{isFetching ? (
									<span className='text-[var(--color-text-hint)]'>
										{' '}
										- refreshing
									</span>
								) : null}
							</p>
						)}
					</header>

					{isError && (
						<VenueListError
							message={getApiErrorMessage(
								error,
								'Maskanlar yuklanmadi. Qayta urinib koring.',
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
						<div className='pt-6'>
							<Pagination
								page={page}
								totalPages={totalPages}
								onPageChange={setPage}
								disabled={isFetching}
							/>
						</div>
					)}
				</div>
			</section>

			<section className='mx-auto w-full max-w-7xl px-4 py-10'>
				<SectionHeader
					kicker='Districts'
					title='Browse by neighborhood'
					text='Fast district chips make the marketplace feel local and mobile-friendly.'
				/>
				<div className='mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6'>
					{DISTRICTS.map(item => (
						<button
							key={item}
							type='button'
							onClick={() => {
								setDistrict(item)
								scrollToResults()
							}}
							className='product-card flex min-h-24 flex-col justify-between p-4 text-left transition hover:-translate-y-1 hover:shadow-[var(--shadow-md)]'
						>
							<MapPin className='size-5 text-[var(--color-brand)]' />
							<span className='text-sm font-bold'>{item}</span>
						</button>
					))}
				</div>
			</section>

			<section className='mx-auto w-full max-w-7xl px-4 py-10'>
				<div className='grid gap-5 lg:grid-cols-3'>
					{TESTIMONIALS.map(item => (
						<article key={item.name} className='product-card p-6'>
							<p className='text-lg leading-relaxed text-[var(--color-text-primary)]'>
								"{item.text}"
							</p>
							<p className='mt-5 text-sm font-black text-[var(--color-brand)]'>
								{item.name}
							</p>
						</article>
					))}
				</div>
			</section>

			<section className='mx-auto w-full max-w-7xl px-4 py-10'>
				<div className='overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-accent)] p-8 text-white shadow-[var(--shadow-lg)] sm:p-10 lg:p-12'>
					<div className='grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center'>
						<div>
							<p className='text-sm font-bold uppercase tracking-wide text-white/70'>
								Ready when you are
							</p>
							<h2 className='mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-5xl'>
								Build a shortlist today, book with confidence tomorrow.
							</h2>
						</div>
						<Link to='/register'>
							<Button className='bg-white text-[var(--color-accent)] sm:w-auto'>
								Create account <ArrowRight className='size-4' />
							</Button>
						</Link>
					</div>
				</div>
			</section>

			<footer className='mt-8 border-t border-[var(--color-border)] bg-[var(--color-ink)] px-4 py-10 text-white'>
				<div className='mx-auto grid max-w-7xl gap-8 sm:grid-cols-[1fr_auto_auto]'>
					<div>
						<p className='text-2xl font-black'>Toyxona</p>
						<p className='mt-2 max-w-md text-sm leading-relaxed text-white/65'>
							A modern marketplace for venues, bookings, owners, and admins.
						</p>
					</div>
					<div className='text-sm text-white/70'>
						<p className='font-bold text-white'>Marketplace</p>
						<a href='#venue-results' className='mt-3 block'>Venues</a>
						<Link to='/register/owner' className='mt-2 block'>List venue</Link>
					</div>
					<div className='text-sm text-white/70'>
						<p className='font-bold text-white'>Account</p>
						<Link to='/login' className='mt-3 block'>Login</Link>
						<Link to='/register' className='mt-2 block'>Register</Link>
					</div>
				</div>
			</footer>
		</div>
	)
}

function ValueCard({
	icon,
	title,
	text,
}: {
	icon: ReactNode
	title: string
	text: string
}) {
	return (
		<div className='product-card p-5'>
			<div className='flex size-10 items-center justify-center rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)]'>
				{icon}
			</div>
			<h3 className='mt-4 text-lg font-black'>{title}</h3>
			<p className='mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]'>
				{text}
			</p>
		</div>
	)
}

function SectionHeader({
	kicker,
	title,
	text,
}: {
	kicker: string
	title: string
	text: string
}) {
	return (
		<div className='max-w-3xl'>
			<p className='section-kicker'>{kicker}</p>
			<h2 className='section-title mt-2'>{title}</h2>
			<p className='mt-3 text-base leading-relaxed text-[var(--color-text-secondary)]'>
				{text}
			</p>
		</div>
	)
}
