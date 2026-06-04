import { DashboardCard } from '@/components/features/customer'
import { AdminTableSkeleton } from '@/components/features/admin'
import { VenueListError } from '@/components/features/venues'
import { useAdminDashboard } from '@/hooks/useAdminDashboard'
import { getApiErrorMessage } from '@/utils/authErrors'
import { formatCurrency } from '@/utils/formatCurrency'

export default function AdminDashboardPage() {
	const { data, isLoading, isError, error, refetch, isFetching } =
		useAdminDashboard()

	if (isLoading) {
		return (
			<div>
				<h1 className='mb-6 text-2xl font-semibold'>Bosh sahifa</h1>
				<AdminTableSkeleton rows={4} />
			</div>
		)
	}

	if (isError || !data) {
		return (
			<div>
				<h1 className='mb-6 text-2xl font-semibold'>Bosh sahifa</h1>
				<VenueListError
					message={getApiErrorMessage(error, 'Statistika yuklanmadi')}
					onRetry={() => void refetch()}
					isRetrying={isFetching}
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
				Tizim bo‘yicha umumiy ko‘rsatkichlar
			</p>

			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
				<DashboardCard
					label='Jami foydalanuvchilar'
					value={data.totalUsers}
					href='/admin/users'
				/>
				<DashboardCard
					label='Jami ownerlar'
					value={data.totalOwners}
					href='/admin/owners'
				/>
				<DashboardCard
					label='Jami to‘yxonalar'
					value={data.totalVenues}
					href='/admin/venues'
				/>
				<DashboardCard
					label='Tasdiqlanmagan to‘yxonalar'
					value={data.pendingVenues}
					href='/admin/venues'
				/>
				<DashboardCard
					label='Jami bronlar'
					value={data.totalBookings}
					href='/admin/bookings'
				/>
				<DashboardCard
					label='Kelajakdagi bronlar'
					value={data.upcomingBookings}
					href='/admin/bookings'
				/>
				<DashboardCard
					label='Jami daromad'
					value={formatCurrency(data.totalRevenue)}
				/>
			</div>
		</div>
	)
}
