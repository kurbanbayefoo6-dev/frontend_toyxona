import { useMemo } from 'react'

import { DashboardCard } from '@/components/features/customer'
import { CustomerListSkeleton } from '@/components/features/customer'
import { VenueListError } from '@/components/features/venues'
import { useOwnerBookings } from '@/hooks/useOwnerBookings'
import { useOwnerVenues } from '@/hooks/useOwnerVenues'
import { getApiErrorMessage } from '@/utils/authErrors'

export default function OwnerDashboardPage() {
	const venuesQuery = useOwnerVenues()
	const bookingsQuery = useOwnerBookings()

	const isLoading = venuesQuery.isLoading || bookingsQuery.isLoading
	const isError = venuesQuery.isError || bookingsQuery.isError

	const stats = useMemo(() => {
		const venues = venuesQuery.data ?? []
		return {
			totalVenues: venues.length,
			approved: venues.filter(v => v.status === 'approved').length,
			pending: venues.filter(v => v.status === 'pending').length,
			totalBookings: bookingsQuery.data?.total ?? 0,
		}
	}, [venuesQuery.data, bookingsQuery.data])

	function handleRetry() {
		void venuesQuery.refetch()
		void bookingsQuery.refetch()
	}

	if (isLoading) {
		return (
			<div>
				<h1 className='mb-6 text-2xl font-semibold'>Bosh sahifa</h1>
				<CustomerListSkeleton rows={4} />
			</div>
		)
	}

	if (isError) {
		return (
			<div>
				<h1 className='mb-6 text-2xl font-semibold'>Bosh sahifa</h1>
				<VenueListError
					message={getApiErrorMessage(
						venuesQuery.error ?? bookingsQuery.error,
						'Ma’lumotlar yuklanmadi',
					)}
					onRetry={handleRetry}
					isRetrying={venuesQuery.isFetching || bookingsQuery.isFetching}
				/>
			</div>
		)
	}

	return (
		<div>
			<h1
				className='mb-2 text-2xl font-semibold'
				style={{ color: 'var(--color-text-primary)' }}
			>
				Bosh sahifa
			</h1>
			<p
				className='mb-6 text-sm'
				style={{ color: 'var(--color-text-secondary)' }}
			>
				Maskanlar va bandlovlar statistikasi
			</p>
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
				<DashboardCard
					label='Mening to‘yxonalarim'
					value={stats.totalVenues}
					href='/owner/venues'
				/>
				<DashboardCard
					label='Tasdiqlangan'
					value={stats.approved}
					href='/owner/venues'
				/>
				<DashboardCard
					label='Tasdiqlanmagan'
					value={stats.pending}
					href='/owner/venues'
				/>
				<DashboardCard
					label='Jami bronlar'
					value={stats.totalBookings}
					href='/owner/bookings'
				/>
			</div>
		</div>
	)
}
