import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'

import {
	BarList,
	DashboardShell,
	MetricCard,
} from '@/components/features/dashboard/DashboardShell'
import { AdminTableSkeleton } from '@/components/features/admin'
import { VenueListError } from '@/components/features/venues'
import { Button } from '@/components/ui/Button'
import { useAdminDashboard } from '@/hooks/useAdminDashboard'
import { getApiErrorMessage } from '@/utils/authErrors'
import { formatCurrency } from '@/utils/formatCurrency'

export default function AdminDashboardPage() {
	const { data, isLoading, isError, error, refetch, isFetching } =
		useAdminDashboard()

	if (isLoading) {
		return <AdminTableSkeleton rows={4} />
	}

	if (isError || !data) {
		return (
			<VenueListError
				message={getApiErrorMessage(error, 'Statistika yuklanmadi')}
				onRetry={() => void refetch()}
				isRetrying={isFetching}
			/>
		)
	}

	const maxOps = Math.max(
		data.totalUsers,
		data.totalVenues,
		data.totalBookings,
		data.totalOwners,
		1,
	)

	return (
		<DashboardShell
			kicker='Admin command center'
			title='KPI clarity for marketplace operations'
			subtitle='A high-level view of users, owners, venues, bookings, pending approvals, and revenue health.'
			actions={
				<Link to='/admin/venues'>
					<Button className='sm:w-auto'>
						<ShieldCheck className='size-4' />
						Review venues
					</Button>
				</Link>
			}
		>
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
				<MetricCard
					label='Users'
					value={data.totalUsers}
					helper='Registered platform users'
				/>
				<MetricCard
					label='Owners'
					value={data.totalOwners}
					helper='Venue partners'
					tone='accent'
				/>
				<MetricCard
					label='Venues'
					value={data.totalVenues}
					helper={`${data.pendingVenues} pending review`}
					tone='warning'
				/>
				<MetricCard
					label='Revenue'
					value={formatCurrency(data.totalRevenue)}
					helper='Recorded marketplace revenue'
					tone='success'
				/>
			</div>

			<div className='grid gap-5 xl:grid-cols-[1fr_0.9fr]'>
				<BarList
					title='Marketplace scale'
					items={[
						{ label: 'Users', value: data.totalUsers, max: maxOps },
						{ label: 'Owners', value: data.totalOwners, max: maxOps },
						{ label: 'Venues', value: data.totalVenues, max: maxOps },
						{ label: 'Bookings', value: data.totalBookings, max: maxOps },
					]}
				/>

				<section className='product-card p-5'>
					<h2 className='text-xl font-black'>Operational queue</h2>
					<div className='mt-5 grid gap-3'>
						<QueueRow
							label='Pending venues'
							value={data.pendingVenues}
							href='/admin/venues'
							tone='warning'
						/>
						<QueueRow
							label='Upcoming bookings'
							value={data.upcomingBookings}
							href='/admin/bookings'
							tone='success'
						/>
						<QueueRow
							label='Total payments'
							value={formatCurrency(data.totalRevenue)}
							href='/admin/payments'
							tone='brand'
						/>
					</div>
				</section>
			</div>
		</DashboardShell>
	)
}

function QueueRow({
	label,
	value,
	href,
	tone,
}: {
	label: string
	value: string | number
	href: string
	tone: 'brand' | 'success' | 'warning'
}) {
	const toneClasses = {
		brand: 'bg-[var(--color-brand-light)] text-[var(--color-brand)]',
		success: 'bg-[var(--color-available-light)] text-[var(--color-available)]',
		warning: 'bg-[var(--color-pending-light)] text-[var(--color-pending)]',
	}

	return (
		<Link
			to={href}
			className='flex items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]'
		>
			<span className='font-black'>{label}</span>
			<span className={`rounded-full px-3 py-1 text-sm font-black ${toneClasses[tone]}`}>
				{value}
			</span>
		</Link>
	)
}
