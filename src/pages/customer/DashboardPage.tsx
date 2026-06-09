import { Link } from 'react-router-dom'
import { CalendarDays, Heart, ReceiptText, Search } from 'lucide-react'
import { useMemo } from 'react'
import type { ReactNode } from 'react'

import {
	DashboardShell,
	MetricCard,
	Timeline,
} from '@/components/features/dashboard/DashboardShell'
import { CustomerListSkeleton } from '@/components/features/customer'
import { VenueListError } from '@/components/features/venues'
import { Button } from '@/components/ui/Button'
import { useCustomerBookings } from '@/hooks/useCustomerBookings'
import { useCustomerFavorites } from '@/hooks/useCustomerFavorites'
import { useCustomerPayments } from '@/hooks/useCustomerPayments'
import { getApiErrorMessage } from '@/utils/authErrors'
import {
	getApiBookingStatusLabel,
	isUpcomingBooking,
} from '@/utils/customerStatus'
import { formatCurrency } from '@/utils/formatCurrency'

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
		const upcoming = bookings.filter(isUpcomingBooking)
		const paidTotal = bookings.reduce((sum, item) => sum + item.advanceAmount, 0)
		return {
			totalBookings: bookingsQuery.data?.total ?? bookings.length,
			upcomingBookings: upcoming.length,
			totalPayments: paymentsQuery.data?.total ?? 0,
			totalFavorites: favoritesQuery.data?.length ?? 0,
			paidTotal,
			timeline: bookings.slice(0, 5).map(item => ({
				id: item.id,
				title: `Bron #${item.id}`,
				meta: `${item.bookingDate.split('T')[0]} — ${item.guestCount} mehmon — ${formatCurrency(item.totalPrice)}`,
				status: getApiBookingStatusLabel(item.status),
			})),
		}
	}, [bookingsQuery.data, paymentsQuery.data, favoritesQuery.data])

	function handleRetry() {
		void bookingsQuery.refetch()
		void paymentsQuery.refetch()
		void favoritesQuery.refetch()
	}

	if (isLoading) {
		return <CustomerListSkeleton rows={4} />
	}

	if (isError) {
		return (
			<VenueListError
				message={errorMessage}
				onRetry={handleRetry}
				isRetrying={
					bookingsQuery.isFetching ||
					paymentsQuery.isFetching ||
					favoritesQuery.isFetching
				}
			/>
		)
	}

	return (
		<DashboardShell
			kicker='Mijoz boshqaruv paneli'
			title='Rejalashtiring, kuzating va bitta joydan to‘lang'
			subtitle='Bandlovlar, to‘lovlar, sevimlilar va keyingi qadamlarning umumiy ko‘rinishi.'
			actions={
				<Link to='/'>
					<Button className='sm:w-auto'>
						<Search className='size-4' />
						To‘yxona qidirish
					</Button>
				</Link>
			}
		>
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
				<MetricCard
					label='Jami bandlovlar'
					value={stats.totalBookings}
					helper='Yaratilgan barcha bronlar'
				/>
				<MetricCard
					label='Yaqinlashayotgan'
					value={stats.upcomingBookings}
					helper='Oldinda turgan bandlovlar'
					tone='success'
				/>
				<MetricCard
					label='To‘lovlar'
					value={stats.totalPayments}
					helper={`Oldindan to‘langan: ${formatCurrency(stats.paidTotal)}`}
					tone='accent'
				/>
				<MetricCard
					label='Sevimlilar'
					value={stats.totalFavorites}
					helper='Solishtirish uchun saqlangan To‘yxonalar'
					tone='warning'
				/>
			</div>

			<div className='grid gap-5 xl:grid-cols-[1.2fr_0.8fr]'>
				<Timeline
					title='Bandlovlar vaqti'
					items={stats.timeline}
					empty='Hali bandlov yo‘q. To‘yxona qidiruvidan boshlang.'
				/>

				<section className='product-card p-5'>
					<h2 className='text-xl font-black'>Tezkor havolalar</h2>
					<div className='mt-5 grid gap-3'>
						<Shortcut
							icon={<CalendarDays className='size-5' />}
							title='Bandlovlarni ko‘rish'
							href='/customer/bookings'
						/>
						<Shortcut
							icon={<ReceiptText className='size-5' />}
							title='To‘lovlarni tekshirish'
							href='/customer/payments'
						/>
						<Shortcut
							icon={<Heart className='size-5' />}
							title='Sevimlilarni solishtirish'
							href='/customer/favorites'
						/>
					</div>
				</section>
			</div>
		</DashboardShell>
	)
}

function Shortcut({
	icon,
	title,
	href,
}: {
	icon: ReactNode
	title: string
	href: string
}) {
	return (
		<Link
			to={href}
			className='flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]'
		>
			<span className='flex size-10 items-center justify-center rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand)]'>
				{icon}
			</span>
			<span className='font-black'>{title}</span>
		</Link>
	)
}
