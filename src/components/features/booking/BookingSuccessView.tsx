import { CheckCircle2 } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/utils/formatCurrency'

export type BookingSuccessData = {
	venueName: string
	bookingDate: string
	guestCount: number
	totalAmount: number
	transactionId: string
}

type BookingSuccessViewProps = {
	data: BookingSuccessData
	autoRedirectMs?: number
}

export function BookingSuccessView({
	data,
	autoRedirectMs = 4000,
}: BookingSuccessViewProps) {
	const navigate = useNavigate()

	useEffect(() => {
		const timer = window.setTimeout(() => {
			navigate('/customer/bookings', { replace: true })
		}, autoRedirectMs)
		return () => window.clearTimeout(timer)
	}, [navigate, autoRedirectMs])

	return (
		<div
			className='fixed inset-0 z-[60] flex items-center justify-center p-4'
			role='status'
			aria-live='polite'
		>
			<div className='absolute inset-0 bg-black/50' />
			<div
				className='relative z-10 w-full max-w-md rounded-[var(--radius-lg)] border p-6 sm:p-8'
				style={{
					backgroundColor: 'var(--color-card-bg)',
					borderColor: 'var(--color-border)',
				}}
			>
				<div className='mb-4 flex flex-col items-center text-center'>
					<CheckCircle2
						className='size-14'
						style={{ color: 'var(--color-available)' }}
					/>
					<h2
						className='mt-3 text-xl font-semibold'
						style={{ color: 'var(--color-text-primary)' }}
					>
						Bron tasdiqlandi
					</h2>
					<p
						className='mt-2 text-sm'
						style={{ color: 'var(--color-text-secondary)' }}
					>
						To‘lov muvaffaqiyatli amalga oshirildi
					</p>
				</div>

				<dl className='space-y-3 text-sm'>
					<SuccessRow label='Maskan' value={data.venueName} />
					<SuccessRow label='Sana' value={data.bookingDate} />
					<SuccessRow
						label='Mehmonlar'
						value={`${data.guestCount} kishi`}
					/>
					<SuccessRow
						label='Jami summa'
						value={formatCurrency(data.totalAmount)}
						highlight
					/>
					<SuccessRow
						label='Tranzaksiya ID'
						value={data.transactionId}
						mono
					/>
				</dl>

				<Button
					type='button'
					className='mt-6 w-full'
					onClick={() => navigate('/customer/bookings', { replace: true })}
				>
					Bandlovlarga o‘tish
				</Button>
			</div>
		</div>
	)
}

function SuccessRow({
	label,
	value,
	highlight,
	mono,
}: {
	label: string
	value: string
	highlight?: boolean
	mono?: boolean
}) {
	return (
		<div className='flex justify-between gap-4'>
			<dt style={{ color: 'var(--color-text-hint)' }}>{label}</dt>
			<dd
				className={[
					'text-right font-medium',
					mono ? 'font-mono text-xs' : '',
				].join(' ')}
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
