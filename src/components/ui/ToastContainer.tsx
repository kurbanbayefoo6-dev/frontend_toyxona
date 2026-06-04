import { X } from 'lucide-react'

import { useToastStore, type ToastVariant } from '@/stores/toastStore'

const variantStyles: Record<
	ToastVariant,
	{ background: string; border: string; color: string }
> = {
	success: {
		background: 'var(--color-available-light)',
		border: 'var(--color-available)',
		color: 'var(--color-available)',
	},
	error: {
		background: 'var(--color-booked-light)',
		border: 'var(--color-booked)',
		color: 'var(--color-booked)',
	},
}

export function ToastContainer() {
	const toasts = useToastStore(s => s.toasts)
	const dismiss = useToastStore(s => s.dismiss)

	if (toasts.length === 0) return null

	return (
		<div
			className='pointer-events-none fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 px-4'
			aria-live='polite'
		>
			{toasts.map(item => {
				const styles = variantStyles[item.variant]
				return (
					<div
						key={item.id}
						role='status'
						className='pointer-events-auto flex items-start gap-2 rounded-[var(--radius-md)] border px-3 py-2.5 text-sm shadow-none'
						style={{
							backgroundColor: styles.background,
							borderColor: styles.border,
							color: styles.color,
						}}
					>
						<p className='flex-1 font-medium'>{item.message}</p>
						<button
							type='button'
							className='shrink-0 opacity-70 transition-opacity hover:opacity-100'
							onClick={() => dismiss(item.id)}
							aria-label='Yopish'
						>
							<X className='size-4' />
						</button>
					</div>
				)
			})}
		</div>
	)
}
