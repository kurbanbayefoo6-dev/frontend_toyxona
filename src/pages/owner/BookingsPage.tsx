import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'

import { CustomerEmptyState, CustomerListSkeleton, StatusBadge } from '@/components/features/customer'
import { VenueListError } from '@/components/features/venues'
import { Button } from '@/components/ui/Button'
import { useOwnerBookingPhones } from '@/hooks/useOwnerBookingPhones'
import { useOwnerBookings } from '@/hooks/useOwnerBookings'
import { cancelBooking } from '@/services/booking.service'
import { toast } from '@/stores/toastStore'
import { getApiErrorMessage } from '@/utils/authErrors'
import {
	getBookingDisplayStatus,
	getBookingStatusLabel,
	getBookingStatusStyle,
	normalizeDateKey,
} from '@/utils/customerStatus'
import { formatCurrency } from '@/utils/formatCurrency'

export default function OwnerBookingsPage() {
	const queryClient = useQueryClient()
	const { data, isLoading, isError, error, refetch, isFetching } =
		useOwnerBookings()

	const cancelMutation = useMutation({
		mutationFn: (bookingId: number) => cancelBooking(bookingId),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['owner', 'bookings'] })
			toast.success('Bandlov bekor qilindi')
		},
		onError: err => {
			toast.error(getApiErrorMessage(err, 'Bandlovni bekor qilib bo‘lmadi'))
		},
	})

	const bookings = data?.items ?? []
	const venueIds = useMemo(
		() => Array.from(new Set(bookings.map(b => b.venueId))),
		[bookings],
	)
	const phonesQuery = useOwnerBookingPhones(venueIds)
	const paidIds = useMemo(() => new Set<number>(), [])

	if (isLoading) {
		return (
			<div>
				<h1 className='mb-6 text-2xl font-semibold'>Bandlovlar</h1>
				<CustomerListSkeleton rows={5} />
			</div>
		)
	}

	if (isError) {
		return (
			<div>
				<h1 className='mb-6 text-2xl font-semibold'>Bandlovlar</h1>
				<VenueListError
					message={getApiErrorMessage(error, 'Bandlovlar yuklanmadi')}
					onRetry={() => void refetch()}
					isRetrying={isFetching}
				/>
			</div>
		)
	}

	return (
		<div>
			<h1
				className='mb-6 text-2xl font-semibold'
				style={{ color: 'var(--color-text-primary)' }}
			>
				Bandlovlar
			</h1>

			{bookings.length === 0 ? (
				<CustomerEmptyState message='Bandlovlar topilmadi' />
			) : (
				<>
					<div className='hidden overflow-x-auto rounded-[var(--radius-lg)] border md:block'
						style={{
							backgroundColor: 'var(--color-card-bg)',
							borderColor: 'var(--color-border)',
						}}
					>
						<table className='w-full min-w-[640px] text-left text-sm'>
							<thead>
								<tr
									className='border-b text-xs uppercase'
									style={{
										borderColor: 'var(--color-border)',
										color: 'var(--color-text-hint)',
									}}
								>
									<th className='px-4 py-3'>To‘yxona</th>
									<th className='px-4 py-3'>Sana</th>
									<th className='px-4 py-3'>Mehmon</th>
									<th className='px-4 py-3'>Mijoz</th>
									<th className='px-4 py-3'>Telefon</th>
									<th className='px-4 py-3'>Holat</th>
									<th className='px-4 py-3 text-right'>Summa</th>
									<th className='px-4 py-3 text-right'>Amallar</th>
								</tr>
							</thead>
							<tbody>
								{bookings.map(booking => {
									const displayStatus = getBookingDisplayStatus(
										booking,
										paidIds,
									)
									const style = getBookingStatusStyle(displayStatus)
									const canCancel = booking.status !== 'cancelled'
									return (
										<tr
											key={booking.id}
											className='border-b last:border-0'
											style={{ borderColor: 'var(--color-border)' }}
										>
											<td className='px-4 py-3 font-medium'>
												{booking.venueName}
											</td>
											<td className='px-4 py-3'>
												{normalizeDateKey(booking.bookingDate)}
											</td>
											<td className='px-4 py-3'>
												{booking.guestCount}
											</td>
											<td className='px-4 py-3'>
												{booking.customerName}
											</td>
											<td className='px-4 py-3'>
												{phonesQuery.data?.get(booking.id) ?? '—'}
											</td>
											<td className='px-4 py-3'>
												<StatusBadge
													label={getBookingStatusLabel(displayStatus)}
													bg={style.bg}
													color={style.color}
												/>
											</td>
											<td
												className='px-4 py-3 text-right font-medium'
												style={{ color: 'var(--color-brand)' }}
											>
												{formatCurrency(booking.totalPrice)}
											</td>
											<td className='px-4 py-3 text-right'>
												{canCancel ? (
													<Button
														type='button'
														variant='ghost'
														className='!w-auto px-2 text-xs'
														disabled={cancelMutation.isPending}
														onClick={() => {
															if (
																window.confirm(
																	'Bandlovni bekor qilishni tasdiqlaysizmi?',
																)
															) {
																cancelMutation.mutate(booking.id)
															}
														}}
													>
														Bekor qilish
													</Button>
												) : (
													'—'
												)}
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>

					<ul className='flex flex-col gap-3 md:hidden'>
						{bookings.map(booking => {
							const displayStatus = getBookingDisplayStatus(
								booking,
								paidIds,
							)
							const style = getBookingStatusStyle(displayStatus)
							const canCancel = booking.status !== 'cancelled'
							return (
								<li
									key={booking.id}
									className='rounded-[var(--radius-lg)] border p-4'
									style={{
										backgroundColor: 'var(--color-card-bg)',
										borderColor: 'var(--color-border)',
									}}
								>
									<div className='mb-2 flex justify-between gap-2'>
										<p className='font-semibold'>{booking.venueName}</p>
										<StatusBadge
											label={getBookingStatusLabel(displayStatus)}
											bg={style.bg}
											color={style.color}
										/>
									</div>
									<dl className='grid grid-cols-2 gap-1 text-sm'>
										<dt style={{ color: 'var(--color-text-hint)' }}>Sana</dt>
										<dd>{normalizeDateKey(booking.bookingDate)}</dd>
										<dt style={{ color: 'var(--color-text-hint)' }}>Mehmon</dt>
										<dd>{booking.guestCount}</dd>
										<dt style={{ color: 'var(--color-text-hint)' }}>Mijoz</dt>
										<dd>{booking.customerName}</dd>
										<dt style={{ color: 'var(--color-text-hint)' }}>Telefon</dt>
										<dd>
											{phonesQuery.data?.get(booking.id) ?? '—'}
										</dd>
									</dl>
									<p
										className='mt-2 font-medium'
										style={{ color: 'var(--color-brand)' }}
									>
										{formatCurrency(booking.totalPrice)}
									</p>
									{canCancel ? (
										<Button
											type='button'
											variant='ghost'
											className='mt-2 text-xs'
											disabled={cancelMutation.isPending}
											onClick={() => cancelMutation.mutate(booking.id)}
										>
											Bekor qilish
										</Button>
									) : null}
								</li>
							)
						})}
					</ul>
				</>
			)}
		</div>
	)
}
