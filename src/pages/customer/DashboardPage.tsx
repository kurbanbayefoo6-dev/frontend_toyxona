import { useMemo } from 'react'

import {
	CustomerListSkeleton,
	DashboardCard,
} from '@/components/features/customer'
import { VenueListError } from '@/components/features/venues'
import { useCustomerBookings } from '@/hooks/useCustomerBookings'
import { useCustomerFavorites } from '@/hooks/useCustomerFavorites'
import { useCustomerPayments } from '@/hooks/useCustomerPayments'
import { getApiErrorMessage } from '@/utils/authErrors'
import { isUpcomingBooking } from '@/utils/customerStatus'

export default function CustomerDashboardPage() {
	const bookingsQuery = useCustomerBookings()
	const paymentsQuery = useCustomerPayments()
	const favoritesQuery = useCustomerFavorites()

	const isLoading =
		bookingsQuery.isLoading ||
		paymentsQuery.isLoading ||
		favoritesQuery.isLoading

	const isError =
		bookingsQuery.isError ||
		paymentsQuery.isError ||
		favoritesQuery.isError

	const errorMessage = getApiErrorMessage(
		bookingsQuery.error ?? paymentsQuery.error ?? favoritesQuery.error,
		'Ma’lumotlar yuklanmadi',
	)

	const stats = useMemo(() => {
		const bookings = bookingsQuery.data?.items ?? []
		const upcoming = bookings.filter(isUpcomingBooking).length
		return {
			totalBookings: bookingsQuery.data?.total ?? bookings.length,
			upcomingBookings: upcoming,
			totalPayments: paymentsQuery.data?.total ?? 0,
			totalFavorites: favoritesQuery.data?.length ?? 0,
		}
	}, [bookingsQuery.data, paymentsQuery.data, favoritesQuery.data])

	function handleRetry() {
		void bookingsQuery.refetch()
		void paymentsQuery.refetch()
		void favoritesQuery.refetch()
	}

	if (isLoading) {
		return (
			<div>
				<h1
					className='mb-6 text-2xl font-semibold'
					style={{ color: 'var(--color-text-primary)' }}
				>
					Bosh sahifa
				</h1>
				<CustomerListSkeleton rows={4} />
			</div>
		)
	}

	if (isError) {
		return (
			<div>
				<h1
					className='mb-6 text-2xl font-semibold'
					style={{ color: 'var(--color-text-primary)' }}
				>
					Bosh sahifa
				</h1>
				<VenueListError
					message={errorMessage}
					onRetry={handleRetry}
					isRetrying={
						bookingsQuery.isFetching ||
						paymentsQuery.isFetching ||
						favoritesQuery.isFetching
					}
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
				Bronlar, to‘lovlar va sevimlilar bo‘yicha qisqa ko‘rinish
			</p>

			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
				<DashboardCard
					label='Jami bronlar'
					value={stats.totalBookings}
					href='/customer/bookings'
				/>
				<DashboardCard
					label='Kelajakdagi bronlar'
					value={stats.upcomingBookings}
					href='/customer/bookings'
				/>
				<DashboardCard
					label='To‘lovlar soni'
					value={stats.totalPayments}
					href='/customer/payments'
				/>
				<DashboardCard
					label='Sevimlilar soni'
					value={stats.totalFavorites}
					href='/customer/favorites'
				/>
			</div>
		</div>
	)
}
