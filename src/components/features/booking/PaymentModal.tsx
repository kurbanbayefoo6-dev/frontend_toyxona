import { CreditCard } from 'lucide-react'
import { useState } from 'react'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
	isPaymentFormValid,
	maskCardHolder,
	maskCardNumber,
	maskCvv,
	maskExpiry,
} from '@/utils/inputMasks'
import { formatCurrency } from '@/utils/formatCurrency'

type PaymentModalProps = {
	open: boolean
	onClose: () => void
	amount: number
	onPay: () => Promise<void>
	isProcessing: boolean
}

export function PaymentModal({
	open,
	onClose,
	amount,
	onPay,
	isProcessing,
}: PaymentModalProps) {
	const [cardHolder, setCardHolder] = useState('')
	const [cardNumber, setCardNumber] = useState('')
	const [expiry, setExpiry] = useState('')
	const [cvv, setCvv] = useState('')

	const valid = isPaymentFormValid({ cardHolder, cardNumber, expiry, cvv })

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!valid || isProcessing) return
		await onPay()
	}

	return (
		<Modal
			open={open}
			onClose={onClose}
			title='To‘lov'
			size='lg'
		>
			<div
				className='mb-4 flex items-center gap-3 rounded-[var(--radius-md)] border p-3'
				style={{
					backgroundColor: 'var(--color-surface-secondary)',
					borderColor: 'var(--color-border)',
				}}
			>
				<CreditCard
					className='size-8 shrink-0'
					style={{ color: 'var(--color-brand)' }}
				/>
				<div>
					<p
						className='text-xs'
						style={{ color: 'var(--color-text-hint)' }}
					>
						Oldindan to‘lov (20%)
					</p>
					<p
						className='text-lg font-semibold'
						style={{ color: 'var(--color-text-primary)' }}
					>
						{formatCurrency(amount)}
					</p>
				</div>
			</div>

			<form onSubmit={e => void handleSubmit(e)} className='flex flex-col gap-3'>
				<Field label='Karta egasi'>
					<Input
						value={cardHolder}
						onChange={e =>
							setCardHolder(maskCardHolder(e.target.value))
						}
						placeholder='TO‘LIQ ISM'
						autoComplete='cc-name'
						disabled={isProcessing}
					/>
				</Field>

				<Field label='Karta raqami'>
					<Input
						value={cardNumber}
						onChange={e =>
							setCardNumber(maskCardNumber(e.target.value))
						}
						placeholder='0000 0000 0000 0000'
						inputMode='numeric'
						autoComplete='cc-number'
						disabled={isProcessing}
					/>
				</Field>

				<div className='grid grid-cols-2 gap-3'>
					<Field label='Amal qilish muddati'>
						<Input
							value={expiry}
							onChange={e =>
								setExpiry(maskExpiry(e.target.value))
							}
							placeholder='MM/YY'
							inputMode='numeric'
							autoComplete='cc-exp'
							disabled={isProcessing}
						/>
					</Field>
					<Field label='Xavfsizlik kodi'>
						<Input
							value={cvv}
							onChange={e => setCvv(maskCvv(e.target.value))}
							placeholder='123'
							type='password'
							inputMode='numeric'
							autoComplete='cc-csc'
							disabled={isProcessing}
						/>
					</Field>
				</div>

				<p
					className='text-xs'
					style={{ color: 'var(--color-text-hint)' }}
				>
					Sinov rejimi: to‘lov har doim muvaffaqiyatli amalga oshiriladi.
				</p>

				<Button
					type='submit'
					className='mt-2 w-full'
					loading={isProcessing}
					disabled={!valid || isProcessing}
				>
					{isProcessing ? 'To‘lov amalga oshirilmoqda...' : 'To‘lash'}
				</Button>
			</form>
		</Modal>
	)
}

function Field({
	label,
	children,
}: {
	label: string
	children: React.ReactNode
}) {
	return (
		<label className='flex flex-col gap-1'>
			<span
				className='text-sm font-medium'
				style={{ color: 'var(--color-text-primary)' }}
			>
				{label}
			</span>
			{children}
		</label>
	)
}
