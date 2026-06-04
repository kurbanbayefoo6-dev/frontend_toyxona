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

	function toggleId(
		key: keyof BookingAddonsSelection,
		id: number,
	) {
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
			const message = getApiErrorMessage(
				error,
				BOOKING_TOAST.networkError,
			)
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
			toast.error(
				getApiErrorMessage(error, BOOKING_TOAST.networkError),
			)
		} finally {
			setIsPaying(false)
		}
	}

	return (
		<>
			<div
				className='rounded-[var(--radius-lg)] border p-4 lg:sticky lg:top-[72px]'
				style={{
					backgroundColor: 'var(--color-card-bg)',
					borderColor: 'var(--color-border)',
				}}
			>
				<h2
					className='mb-4 text-lg font-semibold'
					style={{ color: 'var(--color-text-primary)' }}
				>
					Bron qilish
				</h2>

				<BookingCalendar
					availability={availability}
					selectedDate={selectedDate}
					onSelectDate={setSelectedDate}
					onBookedDateClick={onBookedDateClick}
					canViewBookingDetails={canViewBookingDetails}
				/>

				<div className='mt-4 flex flex-col gap-1.5'>
					<label
						className='text-sm font-medium'
						style={{ color: 'var(--color-text-primary)' }}
					>
						Mehmonlar soni
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
					<p className='text-xs' style={{ color: 'var(--color-text-hint)' }}>
						Maksimum: {venue.capacity} kishi
					</p>
				</div>

				{selectedDate && (
					<p
						className='mt-3 text-sm'
						style={{ color: 'var(--color-text-secondary)' }}
					>
						Tanlangan sana:{' '}
						<span className='font-medium'>{selectedDate}</span>
					</p>
				)}

				<AddonCheckboxes
					title='Qo‘shimcha xonandalar'
					emptyText='Xonandalar mavjud emas'
					items={singers.map(s => ({
						id: s.id,
						label: `${s.name} — ${formatCurrency(s.price)}`,
					}))}
					selectedIds={selection.selectedSingerIds}
					onToggle={id => toggleId('selectedSingerIds', id)}
				/>

				<AddonCheckboxes
					title='Avtomobillar'
					emptyText='Avtomobillar mavjud emas'
					items={cars.map(c => ({
						id: c.id,
						label: `${c.brand} — ${formatCurrency(c.price)}`,
					}))}
					selectedIds={selection.selectedCarIds}
					onToggle={id => toggleId('selectedCarIds', id)}
				/>

				<AddonCheckboxes
					title='Karnay-surnay'
					emptyText='Karnay-surnay mavjud emas'
					items={availableKarnay.map(k => ({
						id: k.id,
						label: formatCurrency(k.price),
					}))}
					selectedIds={selection.selectedKarnayIds}
					onToggle={id => toggleId('selectedKarnayIds', id)}
				/>

				<div
					className='mt-4 space-y-2 rounded-[var(--radius-md)] border p-3'
					style={{
						backgroundColor: 'var(--color-surface-secondary)',
						borderColor: 'var(--color-border)',
					}}
				>
					<PriceRow
						label={`O‘rin narxi (${guestCount} × ${formatCurrency(venue.pricePerSeat)})`}
						value={priceBreakdown.baseTotal}
					/>
					{priceBreakdown.singersTotal > 0 && (
						<PriceRow
							label='Xonandalar'
							value={priceBreakdown.singersTotal}
						/>
					)}
					{priceBreakdown.carsTotal > 0 && (
						<PriceRow label='Avtomobillar' value={priceBreakdown.carsTotal} />
					)}
					{priceBreakdown.karnayTotal > 0 && (
						<PriceRow
							label='Karnay-surnay'
							value={priceBreakdown.karnayTotal}
						/>
					)}
					<div
						className='flex justify-between border-t pt-2 text-base font-semibold'
						style={{
							borderColor: 'var(--color-border)',
							color: 'var(--color-text-primary)',
						}}
					>
						<span>Jami</span>
						<span style={{ color: 'var(--color-brand)' }}>
							{formatCurrency(priceBreakdown.grandTotal)}
						</span>
					</div>
				</div>

				<Button
					type='button'
					className='mt-4 w-full'
					loading={isSubmitting}
					disabled={isSubmitting || isPaying || !!successData}
					onClick={() => void handleBronClick()}
				>
					{isSubmitting ? 'Bron yaratilmoqda...' : 'Bron qilish'}
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
		<div className='mt-4'>
			<p
				className='mb-2 text-sm font-medium'
				style={{ color: 'var(--color-text-primary)' }}
			>
				{title}
			</p>
			{items.length === 0 ? (
				<p className='text-xs' style={{ color: 'var(--color-text-hint)' }}>
					{emptyText}
				</p>
			) : (
				<ul className='flex max-h-32 flex-col gap-2 overflow-y-auto'>
					{items.map(item => (
						<li key={item.id}>
							<label className='flex cursor-pointer items-start gap-2 text-sm'>
								<input
									type='checkbox'
									checked={selectedIds.includes(item.id)}
									onChange={() => onToggle(item.id)}
									className='mt-0.5'
								/>
								<span style={{ color: 'var(--color-text-secondary)' }}>
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
		<div
			className='flex justify-between text-sm'
			style={{ color: 'var(--color-text-secondary)' }}
		>
			<span>{label}</span>
			<span>{formatCurrency(value)}</span>
		</div>
	)
}
