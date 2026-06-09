import { Modal } from '@/components/ui/Modal'
import type { BookingCalendarEntry } from '@/types/venueDetail'

const STATUS_LABELS: Record<BookingCalendarEntry['status'], string> = {
	upcoming: 'Yaqinlashmoqda',
	completed: 'Yakunlangan',
	cancelled: 'Bekor qilingan',
}

type BookingDetailsModalProps = {
	open: boolean
	onClose: () => void
	booking: BookingCalendarEntry | null
	date: string | null
}

export function BookingDetailsModal({
	open,
	onClose,
	booking,
	date,
}: BookingDetailsModalProps) {
	return (
		<Modal
			open={open}
			onClose={onClose}
			title='Bandlov tafsilotlari'
		>
			{booking ? (
				<dl className='flex flex-col gap-3 text-sm'>
					{date && (
						<DetailRow label='Sana' value={date} />
					)}
					<DetailRow label='Mijoz' value={booking.customerName} />
					<DetailRow label='Telefon' value={booking.customerPhone} />
					<DetailRow
						label='Mehmonlar'
						value={String(booking.guestCount)}
					/>
					<DetailRow
						label='Holat'
						value={STATUS_LABELS[booking.status]}
					/>
				</dl>
			) : (
				<p style={{ color: 'var(--color-text-hint)' }}>
					Bu sana uchun bandlov topilmadi
				</p>
			)}
		</Modal>
	)
}

function DetailRow({ label, value }: { label: string; value: string }) {
	return (
		<div className='flex justify-between gap-4'>
			<dt style={{ color: 'var(--color-text-hint)' }}>{label}</dt>
			<dd
				className='font-medium text-right'
				style={{ color: 'var(--color-text-primary)' }}
			>
				{value}
			</dd>
		</div>
	)
}
