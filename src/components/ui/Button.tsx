import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant
	loading?: boolean
	children: ReactNode
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
	primary: {
		backgroundColor: 'var(--color-brand)',
		color: '#ffffff',
		borderColor: 'var(--color-brand)',
		boxShadow: '0 10px 22px rgb(159 79 38 / 0.22)',
	},
	secondary: {
		backgroundColor: 'var(--color-card-bg)',
		color: 'var(--color-text-primary)',
		borderColor: 'var(--color-border)',
		boxShadow: 'var(--shadow-sm)',
	},
	ghost: {
		backgroundColor: 'transparent',
		color: 'var(--color-brand)',
		borderColor: 'transparent',
	},
}

export function Button({
	variant = 'primary',
	loading = false,
	disabled,
	children,
	className = '',
	style,
	type = 'button',
	...props
}: ButtonProps) {
	const isDisabled = disabled || loading

	return (
		<button
			type={type}
			disabled={isDisabled}
			className={[
				'inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border px-4 py-2.5 text-sm font-semibold transition-all duration-200',
				isDisabled
					? 'cursor-not-allowed opacity-60'
					: 'cursor-pointer hover:-translate-y-0.5 hover:brightness-95 active:translate-y-0',
				className,
			].join(' ')}
			style={{
				...variantStyles[variant],
				...style,
			}}
			{...props}
		>
			{loading && (
				<span
					className='inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent'
					aria-hidden
				/>
			)}
			{children}
		</button>
	)
}
