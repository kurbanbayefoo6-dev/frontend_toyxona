import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

type ModalProps = {
	open: boolean
	onClose: () => void
	title: string
	children: ReactNode
	size?: 'md' | 'lg'
}

export function Modal({
	open,
	onClose,
	title,
	children,
	size = 'md',
}: ModalProps) {
	useEffect(() => {
		if (!open) return
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [open, onClose])

	if (!open) return null

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-4'
			role='dialog'
			aria-modal
			aria-labelledby='modal-title'
		>
			<button
				type='button'
				className='absolute inset-0 bg-black/40'
				onClick={onClose}
				aria-label='Yopish'
			/>
			<div
				className={[
					'relative z-10 w-full rounded-[var(--radius-lg)] border p-6',
					size === 'lg' ? 'max-w-lg' : 'max-w-md',
				].join(' ')}
				style={{
					backgroundColor: 'var(--color-card-bg)',
					borderColor: 'var(--color-border)',
				}}
			>
				<div className='mb-4 flex items-center justify-between gap-3'>
					<h2
						id='modal-title'
						className='text-lg font-semibold'
						style={{ color: 'var(--color-text-primary)' }}
					>
						{title}
					</h2>
					<button
						type='button'
						onClick={onClose}
						className='rounded-[var(--radius-sm)] p-1'
						style={{ color: 'var(--color-text-secondary)' }}
						aria-label='Yopish'
					>
						<X className='size-5' />
					</button>
				</div>
				{children}
			</div>
		</div>
	)
}
