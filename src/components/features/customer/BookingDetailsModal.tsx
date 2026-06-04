import { Link } from 'react-router-dom'

import { Modal } from '@/components/ui/Modal'
import type { BookingListItem } from '@/types/customer'
import {
	getBookingDisplayStatus,
	getBookingStatusLabel,
	getBookingStatusStyle,
	normalizeDateKey,
} from '@/utils/customerStatus'
import { formatCurrency } from '@/utils/formatCurrency'

import { StatusBadge } from './StatusBadge'

type BookingDetailsModalProps = {
	open: boolean
	onClose: () => void
	booking: BookingListItem | null
	paidBookingIds: Set<number>
}

export function BookingDetailsModal({
	open,
	onClose,
	booking,
	paidBookingIds,
}: BookingDetailsModalProps) {
	if (!booking) return null

	const displayStatus = getBookingDisplayStatus(booking, paidBookingIds)
	const statusStyle = getBookingStatusStyle(displayStatus)

	return (
		<Modal open={open} onClose={onClose} title='Bron tafsilotlari' size='lg'>
			<dl className='space-y-3 text-sm'>
				<DetailRow label='Maskan' value={booking.venueName} />
				<DetailRow
					label='Sana'
					value={normalizeDateKey(booking.bookingDate)}
				/>
				<DetailRow label='Mehmonlar' value={`${booking.guestCount} kishi`} />
				<DetailRow
					label='Jami summa'
					value={formatCurrency(booking.totalPrice)}
					highlight
				/>
				<DetailRow
					label='Oldindan to‘lov'
					value={formatCurrency(booking.advanceAmount)}
				/>
				<div className='flex justify-between gap-4'>
					<dt style={{ color: 'var(--color-text-hint)' }}>Holat</dt>
					<dd>
						<StatusBadge
							label={getBookingStatusLabel(displayStatus)}
							bg={statusStyle.bg}
							color={statusStyle.color}
						/>
					</dd>
				</div>
				<DetailRow label='Bron ID' value={`#${booking.id}`} />
			</dl>
			<Link
				to={`/venues/${booking.venueId}`}
				className='mt-4 inline-block text-sm font-medium'
				style={{ color: 'var(--color-brand)' }}
			>
				Maskan sahifasiga →
			</Link>
		</Modal>
	)
}

function DetailRow({
	label,
	value,
	highlight,
}: {
	label: string
	value: string
	highlight?: boolean
}) {
	return (
		<div className='flex justify-between gap-4'>
			<dt style={{ color: 'var(--color-text-hint)' }}>{label}</dt>
			<dd
				className='text-right font-medium'
				style={{
					color: highlight
						? 'var(--color-brand)'
						: 'var(--color-text-primary)',
				}}
			>
				{value}
			</dd>
		</div>
	)
}
