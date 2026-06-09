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
			kicker='Boshqaruv markazi'
			title='Bozor operatsiyalari uchun asosiy ko‘rsatkichlar'
			subtitle='Foydalanuvchilar, egalar, To‘yxonalar, bandlovlar, kutilayotgan tasdiqlar va daromadning umumiy ko‘rinishi.'
			actions={
				<Link to='/admin/venues'>
					<Button className='sm:w-auto'>
						<ShieldCheck className='size-4' />
						To‘yxonalarni ko‘rib chiqish
					</Button>
				</Link>
			}
		>
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
				<MetricCard
					label='Foydalanuvchilar'
					value={data.totalUsers}
					helper='Ro‘yxatdan o‘tgan foydalanuvchilar'
				/>
				<MetricCard
					label='Egalar'
					value={data.totalOwners}
					helper='To‘yxona hamkorlari'
					tone='accent'
				/>
				<MetricCard
					label='To‘yxonalar'
					value={data.totalVenues}
					helper={`${data.pendingVenues} ta ko‘rib chiqish kutilmoqda`}
					tone='warning'
				/>
				<MetricCard
					label='Daromad'
					value={formatCurrency(data.totalRevenue)}
					helper='Bozorda qayd etilgan daromad'
					tone='success'
				/>
			</div>

			<div className='grid gap-5 xl:grid-cols-[1fr_0.9fr]'>
				<BarList
					title='Bozor hajmi'
					items={[
						{ label: 'Foydalanuvchilar', value: data.totalUsers, max: maxOps },
						{ label: 'Egalar', value: data.totalOwners, max: maxOps },
						{ label: 'To‘yxonalar', value: data.totalVenues, max: maxOps },
						{ label: 'Bandlovlar', value: data.totalBookings, max: maxOps },
					]}
				/>

				<section className='product-card p-5'>
					<h2 className='text-xl font-black'>Operatsion navbat</h2>
					<div className='mt-5 grid gap-3'>
						<QueueRow
							label='Kutilayotgan To‘yxonalar'
							value={data.pendingVenues}
							href='/admin/venues'
							tone='warning'
						/>
						<QueueRow
							label='Yaqinlashayotgan bandlovlar'
							value={data.upcomingBookings}
							href='/admin/bookings'
							tone='success'
						/>
						<QueueRow
							label='Jami to‘lovlar'
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
