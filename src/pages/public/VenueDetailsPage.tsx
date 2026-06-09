import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
	BookingDetailsModal,
	BookingPanel,
	CatalogGrid,
	KarnaySection,
	VenueDetailError,
	VenueDetailSkeleton,
	VenueGallery,
	VenueInfoSection,
} from '@/components/features/venue-detail'
import { useVenueBookingCalendar } from '@/hooks/useVenueBookingCalendar'
import { useVenueDetail } from '@/hooks/useVenueDetail'
import { useAuthStore } from '@/stores/authStore'
import type { BookingCalendarEntry } from '@/types/venueDetail'
import { getApiErrorMessage } from '@/utils/authErrors'

function normalizeBookingDate(date: string): string {
	return date.split('T')[0]
}

export default function VenueDetailsPage() {
	const { id } = useParams()
	const venueId = Number(id)
	const role = useAuthStore(s => s.role)

	const canViewBookingDetails = role === 'owner' || role === 'admin'

	const { data, isLoading, isError, error, refetch, isFetching } =
		useVenueDetail(venueId)

	const { data: calendarEntries } = useVenueBookingCalendar(
		venueId,
		canViewBookingDetails,
	)

	const [modalOpen, setModalOpen] = useState(false)
	const [modalDate, setModalDate] = useState<string | null>(null)
	const [modalBooking, setModalBooking] =
		useState<BookingCalendarEntry | null>(null)

	const bookingByDate = useMemo(() => {
		const map = new Map<string, BookingCalendarEntry>()
		calendarEntries?.forEach(entry => {
			map.set(normalizeBookingDate(entry.bookingDate), entry)
		})
		return map
	}, [calendarEntries])

	function handleBookedDateClick(date: string) {
		if (!canViewBookingDetails) return
		const booking = bookingByDate.get(date) ?? null
		setModalDate(date)
		setModalBooking(booking)
		setModalOpen(true)
	}

	if (Number.isNaN(venueId) || venueId <= 0) {
		return (
			<div className='mx-auto max-w-7xl px-4 py-12 text-center'>
				<p style={{ color: 'var(--color-text-primary)' }}>
					Noto‘g‘ri To‘yxona identifikatori
				</p>
				<Link
					to='/'
					className='mt-4 inline-block text-sm'
					style={{ color: 'var(--color-brand)' }}
				>
					Bosh sahifaga qaytish
				</Link>
			</div>
		)
	}

	if (isLoading) {
		return <VenueDetailSkeleton />
	}

	if (isError || !data) {
		return (
			<div className='mx-auto max-w-7xl px-4 py-8'>
				<VenueDetailError
					message={getApiErrorMessage(
						error,
						'To‘yxona ma’lumotlari yuklanmadi',
					)}
					onRetry={() => void refetch()}
					isRetrying={isFetching}
				/>
				<Link
					to='/'
					className='mt-6 inline-block text-sm'
					style={{ color: 'var(--color-brand)' }}
				>
					← Bosh sahifaga
				</Link>
			</div>
		)
	}

	const singerItems = data.singers.map(s => ({
		id: s.id,
		name: s.name,
		price: s.price,
		imageUrl: s.imageUrl,
	}))

	const carItems = data.cars.map(c => ({
		id: c.id,
		name: c.brand,
		price: c.price,
		imageUrl: c.imageUrl,
	}))

	const menuItems = data.menuItems.map(m => ({
		id: m.id,
		name: m.name,
		price: null,
		imageUrl: m.imageUrl,
	}))

	return (
		<div className='mx-auto w-full max-w-7xl px-4 py-8 pb-14'>
			<Link
				to='/'
				className='premium-badge mb-5'
				style={{ color: 'var(--color-brand)' }}
			>
				← Bosh sahifaga
			</Link>

			<div className='grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_390px]'>
				<div className='flex min-w-0 flex-col gap-8'>
					<VenueGallery images={data.images} venueName={data.venue.name} />
					<VenueInfoSection venue={data.venue} />
					<CatalogGrid
						title='Xonandalar'
						items={singerItems}
						emptyMessage='Xonandalar ro‘yxati bo‘sh'
					/>
					<CatalogGrid
						title='Avtomobillar'
						items={carItems}
						emptyMessage='Avtomobillar ro‘yxati bo‘sh'
					/>
					<CatalogGrid
						title='Menyu'
						items={menuItems}
						emptyMessage='Menyu ro‘yxati bo‘sh'
					/>
					<KarnaySection items={data.karnaySurnay} />
				</div>

				<div className='min-w-0'>
					<BookingPanel
						data={data}
						canViewBookingDetails={canViewBookingDetails}
						onBookedDateClick={handleBookedDateClick}
						bookedDetailsByDate={bookingByDate}
					/>
				</div>
			</div>

			<BookingDetailsModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				booking={modalBooking}
				date={modalDate}
			/>
		</div>
	)
}
