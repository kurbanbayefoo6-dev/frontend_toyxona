import type { ReactNode } from 'react'

type AlertVariant = 'error' | 'success' | 'info'

type AlertProps = {
	variant: AlertVariant
	children: ReactNode
}

const variantStyles: Record<
	AlertVariant,
	{ background: string; border: string; color: string }
> = {
	error: {
		background: 'var(--color-booked-light)',
		border: 'var(--color-booked)',
		color: 'var(--color-booked)',
	},
	success: {
		background: 'var(--color-available-light)',
		border: 'var(--color-available)',
		color: 'var(--color-available)',
	},
	info: {
		background: 'var(--color-brand-light)',
		border: 'var(--color-brand)',
		color: 'var(--color-brand)',
	},
}

export function Alert({ variant, children }: AlertProps) {
	const styles = variantStyles[variant]

	return (
		<div
			role='alert'
			className='rounded-[var(--radius-md)] border px-3 py-2.5 text-sm'
			style={{
				backgroundColor: styles.background,
				borderColor: styles.border,
				color: styles.color,
			}}
		>
			{children}
		</div>
	)
}
