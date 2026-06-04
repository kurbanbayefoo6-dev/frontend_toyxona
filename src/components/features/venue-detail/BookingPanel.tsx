import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
	BookingSuccessView,
	PaymentModal,
	type BookingSuccessData,
} from '@/components/features/booking'
import { BookingCalendar } from '@/components/features/venue-detail/BookingCalendar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createBooking, createPayment } from '@/services/booking.service'
import { toast } from '@/stores/toastStore'
import { useAuthStore } from '@/stores/authStore'
import type { SafeBooking } from '@/types/booking'
import type { VenueFullData } from '@/types/venueDetail'
import { getApiErrorMessage } from '@/utils/authErrors'
import {
	calculateBookingPrice,
	type BookingAddonsSelection,
} from '@/utils/bookingPrice'
import {
	clearBookingDraft,
	getVenueDetailPath,
	loadBookingDraft,
	saveBookingDraft,
	setAuthRedirect,
} from '@/utils/bookingRedirect'
import { formatCurrency } from '@/utils/formatCurrency'
import { validateBookingForm } from '@/utils/validateBookingForm'
import { BOOKING_TOAST } from '@/utils/toastMessages'

type BookingPanelProps = {
	data: VenueFullData
	canViewBookingDetails: boolean
	onBookedDateClick: (date: string) => void
}

export function BookingPanel({
	data,
	canViewBookingDetails,
	onBookedDateClick,
}: BookingPanelProps) {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const isAuthenticated = useAuthStore(s => s.isAuthenticated)
	const role = useAuthStore(s => s.role)

	const { venue, singers, cars, karnaySurnay, availability } = data
	const [selectedDate, setSelectedDate] = useState<string | null>(null)
	const [guestCount, setGuestCount] = useState(1)
	const [selection, setSelection] = useState<BookingAddonsSelection>({
		selectedSingerIds: [],
		selectedCarIds: [],
		selectedKarnayIds: [],
	})

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [paymentOpen, setPaymentOpen] = useState(false)
	const [isPaying, setIsPaying] = useState(false)
	const [createdBooking, setCreatedBooking] = useState<SafeBooking | null>(
		null,
	)
	const [successData, setSuccessData] = useState<BookingSuccessData | null>(
		null,
	)

	useEffect(() => {
		const draft = loadBookingDraft(venue.id)
		if (!draft) return
		setSelectedDate(draft.selectedDate)
		setGuestCount(draft.guestCount)
		setSelection(draft.selection)
		clearBookingDraft()
	}, [venue.id])

	const availableKarnay = karnaySurnay.filter(k => k.isAvailable)

	const priceBreakdown = useMemo(
		() =>
			calculateBookingPrice({
				pricePerSeat: venue.pricePerSeat,
				guestCount,
				singers,
				cars,
				karnaySurnay,
				selection,
			}),
		[
			venue.pricePerSeat,
			guestCount,
			singers,
			cars,
			karnaySurnay,
			selection,
		],
	)

	function toggleId(key: keyof BookingAddonsSelection, id: number) {
		setSelection(prev => {
			const list = prev[key]
			const next = list.includes(id)
				? list.filter(x => x !== id)
				: [...list, id]
			return { ...prev, [key]: next }
		})
	}

	function persistDraft() {
		saveBookingDraft({
			venueId: venue.id,
			selectedDate,
			guestCount,
			selection,
		})
	}

	async function handleBronClick() {
		const validationError = validateBookingForm({
			selectedDate,
			guestCount,
			capacity: venue.capacity,
			availability,
		})

		if (validationError) {
			toast.error(validationError)
			return
		}

		if (!isAuthenticated) {
			persistDraft()
			const returnPath = getVenueDetailPath(venue.id)
			setAuthRedirect(returnPath)
			navigate(`/login?redirect=${encodeURIComponent(returnPath)}`)
			return
		}

		if (role !== 'customer') {
			toast.error(BOOKING_TOAST.customersOnly)
			return
		}

		setIsSubmitting(true)
		try {
			const booking = await createBooking({
				venueId: venue.id,
				bookingDate: selectedDate!,
				guestCount,
				singerIds: selection.selectedSingerIds,
				carIds: selection.selectedCarIds,
				karnaySurnayIds: selection.selectedKarnayIds,
			})

			toast.success(BOOKING_TOAST.bookingCreated)
			setCreatedBooking(booking)
			setPaymentOpen(true)

			await queryClient.invalidateQueries({
				queryKey: ['venue', venue.id],
			})
		} catch (error) {
			const message = getApiErrorMessage(error, BOOKING_TOAST.networkError)
			toast.error(message)
		} finally {
			setIsSubmitting(false)
		}
	}

	async function handlePayment() {
		if (!createdBooking) return

		setIsPaying(true)
		await new Promise(r => setTimeout(r, 1200))

		try {
			const result = await createPayment({
				bookingId: createdBooking.id,
				paymentType: 'advance',
			})

			toast.success(BOOKING_TOAST.paymentSuccess)
			setPaymentOpen(false)
			setSuccessData({
				venueName: venue.name,
				bookingDate: createdBooking.bookingDate.split('T')[0],
				guestCount: createdBooking.guestCount,
				totalAmount: createdBooking.totalPrice,
				transactionId: result.transactionId,
			})
		} catch (error) {
			toast.error(getApiErrorMessage(error, BOOKING_TOAST.networkError))
		} finally {
			setIsPaying(false)
		}
	}

	return (
		<>
			<div className='product-panel p-4 lg:sticky lg:top-24'>
				<div className='mb-4 flex items-start justify-between gap-3'>
					<div>
						<p className='section-kicker'>Booking</p>
						<h2 className='mt-1 text-2xl font-black'>Reserve this venue</h2>
					</div>
					<div className='rounded-[var(--radius-lg)] bg-[var(--color-brand-light)] px-3 py-2 text-right'>
						<p className='text-xs font-bold uppercase tracking-wide text-[var(--color-text-secondary)]'>
							Seat
						</p>
						<p className='text-sm font-black text-[var(--color-brand)]'>
							{formatCurrency(venue.pricePerSeat)}
						</p>
					</div>
				</div>

				<BookingCalendar
					availability={availability}
					selectedDate={selectedDate}
					onSelectDate={setSelectedDate}
					onBookedDateClick={onBookedDateClick}
					canViewBookingDetails={canViewBookingDetails}
				/>

				<div className='mt-5 flex flex-col gap-1.5'>
					<label className='text-sm font-black text-[var(--color-text-primary)]'>
						Guest count
					</label>
					<Input
						type='number'
						min={1}
						max={venue.capacity}
						value={guestCount}
						onChange={e =>
							setGuestCount(
								Math.min(
									venue.capacity,
									Math.max(1, Number(e.target.value) || 1),
								),
							)
						}
					/>
					<p className='text-xs text-[var(--color-text-hint)]'>
						Maximum: {venue.capacity} guests
					</p>
				</div>

				{selectedDate && (
					<p className='mt-3 rounded-[var(--radius-md)] bg-[var(--color-available-light)] px-3 py-2 text-sm font-bold text-[var(--color-available)]'>
						Selected date: {selectedDate}
					</p>
				)}

				<div className='mt-5 grid gap-3'>
					<AddonCheckboxes
						title='Singers'
						emptyText='No singers available'
						items={singers.map(s => ({
							id: s.id,
							label: `${s.name} - ${formatCurrency(s.price)}`,
						}))}
						selectedIds={selection.selectedSingerIds}
						onToggle={id => toggleId('selectedSingerIds', id)}
					/>

					<AddonCheckboxes
						title='Cars'
						emptyText='No cars available'
						items={cars.map(c => ({
							id: c.id,
							label: `${c.brand} - ${formatCurrency(c.price)}`,
						}))}
						selectedIds={selection.selectedCarIds}
						onToggle={id => toggleId('selectedCarIds', id)}
					/>

					<AddonCheckboxes
						title='Karnay-surnay'
						emptyText='No karnay-surnay available'
						items={availableKarnay.map(k => ({
							id: k.id,
							label: formatCurrency(k.price),
						}))}
						selectedIds={selection.selectedKarnayIds}
						onToggle={id => toggleId('selectedKarnayIds', id)}
					/>
				</div>

				<div className='mt-5 space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4'>
					<PriceRow
						label={`Seats (${guestCount} x ${formatCurrency(venue.pricePerSeat)})`}
						value={priceBreakdown.baseTotal}
					/>
					{priceBreakdown.singersTotal > 0 && (
						<PriceRow label='Singers' value={priceBreakdown.singersTotal} />
					)}
					{priceBreakdown.carsTotal > 0 && (
						<PriceRow label='Cars' value={priceBreakdown.carsTotal} />
					)}
					{priceBreakdown.karnayTotal > 0 && (
						<PriceRow
							label='Karnay-surnay'
							value={priceBreakdown.karnayTotal}
						/>
					)}
					<div className='flex justify-between border-t border-[var(--color-border)] pt-2 text-base font-black text-[var(--color-text-primary)]'>
						<span>Total</span>
						<span className='text-[var(--color-brand)]'>
							{formatCurrency(priceBreakdown.grandTotal)}
						</span>
					</div>
				</div>

				<Button
					type='button'
					className='mt-5 w-full py-3 text-base'
					loading={isSubmitting}
					disabled={isSubmitting || isPaying || !!successData}
					onClick={() => void handleBronClick()}
				>
					{isSubmitting ? 'Creating booking...' : 'Book venue'}
				</Button>
			</div>

			<PaymentModal
				open={paymentOpen}
				onClose={() => {
					if (!isPaying) setPaymentOpen(false)
				}}
				amount={createdBooking?.advanceAmount ?? 0}
				onPay={handlePayment}
				isProcessing={isPaying}
			/>

			{successData && <BookingSuccessView data={successData} />}
		</>
	)
}

function AddonCheckboxes({
	title,
	emptyText,
	items,
	selectedIds,
	onToggle,
}: {
	title: string
	emptyText: string
	items: Array<{ id: number; label: string }>
	selectedIds: number[]
	onToggle: (id: number) => void
}) {
	return (
		<div className='rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-3'>
			<p className='mb-2 text-sm font-black text-[var(--color-text-primary)]'>
				{title}
			</p>
			{items.length === 0 ? (
				<p className='text-xs text-[var(--color-text-hint)]'>{emptyText}</p>
			) : (
				<ul className='flex max-h-36 flex-col gap-2 overflow-y-auto pr-1'>
					{items.map(item => (
						<li key={item.id}>
							<label className='flex cursor-pointer items-start gap-2 rounded-[var(--radius-md)] p-2 text-sm transition hover:bg-[var(--color-surface-secondary)]'>
								<input
									type='checkbox'
									checked={selectedIds.includes(item.id)}
									onChange={() => onToggle(item.id)}
									className='mt-0.5 accent-[var(--color-brand)]'
								/>
								<span className='text-[var(--color-text-secondary)]'>
									{item.label}
								</span>
							</label>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

function PriceRow({ label, value }: { label: string; value: number }) {
	return (
		<div className='flex justify-between gap-4 text-sm text-[var(--color-text-secondary)]'>
			<span>{label}</span>
			<span className='font-bold'>{formatCurrency(value)}</span>
		</div>
	)
}
