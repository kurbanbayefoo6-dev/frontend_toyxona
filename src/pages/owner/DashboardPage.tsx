import { Link } from 'react-router-dom'
import { Building2, CalendarClock, Plus } from 'lucide-react'
import { useMemo } from 'react'
import type { ReactNode } from 'react'

import {
	BarList,
	DashboardShell,
	MetricCard,
	Timeline,
} from '@/components/features/dashboard/DashboardShell'
import { CustomerListSkeleton } from '@/components/features/customer'
import { VenueListError } from '@/components/features/venues'
import { Button } from '@/components/ui/Button'
import { useOwnerBookings } from '@/hooks/useOwnerBookings'
import { useOwnerVenues } from '@/hooks/useOwnerVenues'
import { getApiErrorMessage } from '@/utils/authErrors'
import { getApiBookingStatusLabel } from '@/utils/customerStatus'
import { formatCurrency } from '@/utils/formatCurrency'

export default function OwnerDashboardPage() {
	const venuesQuery = useOwnerVenues()
	const bookingsQuery = useOwnerBookings()

	const isLoading = venuesQuery.isLoading || bookingsQuery.isLoading
	const isError = venuesQuery.isError || bookingsQuery.isError

	const stats = useMemo(() => {
		const venues = venuesQuery.data ?? []
		const bookings = bookingsQuery.data?.items ?? []
		const revenue = bookings.reduce((sum, item) => sum + item.advanceAmount, 0)
		return {
			totalVenues: venues.length,
			approved: venues.filter(v => v.status === 'approved').length,
			pending: venues.filter(v => v.status === 'pending').length,
			totalBookings: bookingsQuery.data?.total ?? 0,
			revenue,
			activity: bookings.slice(0, 5).map(item => ({
				id: item.id,
				title: `Bron #${item.id}`,
				meta: `${item.bookingDate.split('T')[0]} — ${item.guestCount} mehmon — oldindan ${formatCurrency(item.advanceAmount)}`,
				status: getApiBookingStatusLabel(item.status),
			})),
		}
	}, [venuesQuery.data, bookingsQuery.data])

	function handleRetry() {
		void venuesQuery.refetch()
		void bookingsQuery.refetch()
	}

	if (isLoading) {
		return <CustomerListSkeleton rows={4} />
	}

	if (isError) {
		return (
			<VenueListError
				message={getApiErrorMessage(
					venuesQuery.error ?? bookingsQuery.error,
					'Ma’lumotlar yuklanmadi',
				)}
				onRetry={handleRetry}
				isRetrying={venuesQuery.isFetching || bookingsQuery.isFetching}
			/>
		)
	}

	const maxVenueMetric = Math.max(stats.approved, stats.pending, 1)

	return (
		<DashboardShell
			kicker='Egasi ish maydoni'
			title='Maskanlarni boshqarish markazi'
			subtitle='Tasdiqlar, bandlovlar va daromad signallarini bitta paneldan kuzating.'
			actions={
				<Link to='/owner/venues/new'>
					<Button className='sm:w-auto'>
						<Plus className='size-4' />
						Maskan qo‘shish
					</Button>
				</Link>
			}
		>
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
				<MetricCard
					label='Maskanlar'
					value={stats.totalVenues}
					helper='Barcha egalik maskanlar'
					tone='accent'
				/>
				<MetricCard
					label='Tasdiqlangan'
					value={stats.approved}
					helper='Bozorda faol'
					tone='success'
				/>
				<MetricCard
					label='Kutilmoqda'
					value={stats.pending}
					helper='Boshqaruv tasdiqini kutmoqda'
					tone='warning'
				/>
				<MetricCard
					label='Bandlovlar'
					value={stats.totalBookings}
					helper={`Oldindan to‘lov daromadi ${formatCurrency(stats.revenue)}`}
				/>
			</div>

			<div className='grid gap-5 xl:grid-cols-[0.9fr_1.1fr]'>
				<BarList
					title='Maskan holati'
					items={[
						{ label: 'Tasdiqlangan', value: stats.approved, max: maxVenueMetric },
						{ label: 'Kutilmoqda', value: stats.pending, max: maxVenueMetric },
					]}
				/>
				<Timeline
					title='Faollik lentasi'
					items={stats.activity}
					empty='Hali bandlov yo‘q. Mijozlar band qilgach, nashr qilingan maskanlar shu yerda ko‘rinadi.'
				/>
			</div>

			<div className='grid gap-4 md:grid-cols-2'>
				<OwnerAction
					icon={<Building2 className='size-5' />}
					title='Maskanlarni boshqarish'
					text='E’lonlar, rasmlar, katalog va nashr holatini tahrirlang.'
					href='/owner/venues'
				/>
				<OwnerAction
					icon={<CalendarClock className='size-5' />}
					title='Bandlovlarni ko‘rish'
					text='Mijoz bronlari va holatini kuzating.'
					href='/owner/bookings'
				/>
			</div>
		</DashboardShell>
	)
}

function OwnerAction({
	icon,
	title,
	text,
	href,
}: {
	icon: ReactNode
	title: string
	text: string
	href: string
}) {
	return (
		<Link to={href} className='product-card flex gap-4 p-5 transition hover:-translate-y-1 hover:shadow-[var(--shadow-md)]'>
			<span className='flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)]'>
				{icon}
			</span>
			<span>
				<span className='block text-lg font-black'>{title}</span>
				<span className='mt-1 block text-sm leading-relaxed text-[var(--color-text-secondary)]'>
					{text}
				</span>
			</span>
		</Link>
	)
}
