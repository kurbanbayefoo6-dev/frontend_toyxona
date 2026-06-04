import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import {
	BookingDetailsModal,
	CustomerEmptyState,
	CustomerListSkeleton,
	StatusBadge,
} from '@/components/features/customer'
import { VenueListError } from '@/components/features/venues'
import { useCustomerBookings } from '@/hooks/useCustomerBookings'
import { useCustomerPayments } from '@/hooks/useCustomerPayments'
import { cancelBooking } from '@/services/booking.service'
import { toast } from '@/stores/toastStore'
import type { BookingListItem } from '@/types/customer'
import { getApiErrorMessage } from '@/utils/authErrors'
import {
	buildPaidBookingIds,
	getBookingDisplayStatus,
	getBookingStatusLabel,
	getBookingStatusStyle,
	normalizeDateKey,
} from '@/utils/customerStatus'
import { formatCurrency } from '@/utils/formatCurrency'

export default function CustomerBookingsPage() {
	const queryClient = useQueryClient()
	const { data, isLoading, isError, error, refetch, isFetching } =
		useCustomerBookings()
	const paymentsQuery = useCustomerPayments()

	const [selected, setSelected] = useState<BookingListItem | null>(null)
	const [modalOpen, setModalOpen] = useState(false)

	const cancelMutation = useMutation({
		mutationFn: (bookingId: number) => cancelBooking(bookingId),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['customer', 'bookings'] })
			void queryClient.invalidateQueries({ queryKey: ['customer', 'payments'] })
			toast.success('Bron bekor qilindi')
			setModalOpen(false)
			setSelected(null)
		},
		onError: err => {
			toast.error(getApiErrorMessage(err, 'Bronni bekor qilib bo‘lmadi'))
		},
	})

	const paidBookingIds = useMemo(
		() => buildPaidBookingIds(paymentsQuery.data?.items ?? []),
		[paymentsQuery.data],
	)

	const bookings = data?.items ?? []

	function openDetails(booking: BookingListItem) {
		setSelected(booking)
		setModalOpen(true)
	}

	if (isLoading) {
		return <PageShell title='Bandlovlarim' skeleton />
	}

	if (isError) {
		return (
			<PageShell title='Bandlovlarim'>
				<VenueListError
					message={getApiErrorMessage(error, 'Bandlovlar yuklanmadi')}
					onRetry={() => void refetch()}
					isRetrying={isFetching}
				/>
			</PageShell>
		)
	}

	return (
		<PageShell title='Bandlovlarim'>
			{bookings.length === 0 ? (
				<CustomerEmptyState message='Sizda hali bandlovlar yo‘q' />
			) : (
				<ul className='flex flex-col gap-3'>
					{bookings.map(booking => {
						const displayStatus = getBookingDisplayStatus(
							booking,
							paidBookingIds,
						)
						const style = getBookingStatusStyle(displayStatus)
						return (
							<li key={booking.id}>
								<button
									type='button'
									onClick={() => openDetails(booking)}
									className='w-full rounded-[var(--radius-lg)] border p-4 text-left transition-opacity hover:opacity-90'
									style={{
										backgroundColor: 'var(--color-card-bg)',
										borderColor: 'var(--color-border)',
									}}
								>
									<div className='flex flex-wrap items-start justify-between gap-2'>
										<div>
											<p
												className='font-semibold'
												style={{
													color: 'var(--color-text-primary)',
												}}
											>
												{booking.venueName}
											</p>
											<p
												className='mt-1 text-sm'
												style={{
													color: 'var(--color-text-secondary)',
												}}
											>
												{normalizeDateKey(booking.bookingDate)} ·{' '}
												{booking.guestCount} mehmon
											</p>
										</div>
										<StatusBadge
											label={getBookingStatusLabel(displayStatus)}
											bg={style.bg}
											color={style.color}
										/>
									</div>
									<p
										className='mt-2 text-sm font-medium'
										style={{ color: 'var(--color-brand)' }}
									>
										{formatCurrency(booking.totalPrice)}
									</p>
								</button>
							</li>
						)
					})}
				</ul>
			)}

			<BookingDetailsModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				booking={selected}
				paidBookingIds={paidBookingIds}
				isCancelling={cancelMutation.isPending}
				onCancel={
					selected
						? () => cancelMutation.mutate(selected.id)
						: undefined
				}
			/>
		</PageShell>
	)
}

function PageShell({
	title,
	children,
	skeleton,
}: {
	title: string
	children?: React.ReactNode
	skeleton?: boolean
}) {
	return (
		<div>
			<h1
				className='mb-6 text-2xl font-semibold'
				style={{ color: 'var(--color-text-primary)' }}
			>
				{title}
			</h1>
			{skeleton ? <CustomerListSkeleton /> : children}
		</div>
	)
}
