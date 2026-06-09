import { forwardRef, type InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	hasError?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{ hasError = false, className = '', disabled, ...props },
	ref,
) {
	return (
		<input
			ref={ref}
			disabled={disabled}
			className={[
				'w-full rounded-[var(--radius-md)] border px-3.5 py-2.5 text-sm outline-none transition-all',
				'focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand-light)]',
				disabled ? 'cursor-not-allowed opacity-60' : '',
				className,
			].join(' ')}
			style={{
				backgroundColor: 'var(--color-card-bg)',
				borderColor: hasError
					? 'var(--color-booked)'
					: 'var(--color-border)',
				color: 'var(--color-text-primary)',
			}}
			{...props}
		/>
	)
})
