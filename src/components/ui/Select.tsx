import { forwardRef, type SelectHTMLAttributes } from 'react'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	function Select({ className = '', disabled, children, ...props }, ref) {
		return (
			<select
				ref={ref}
				disabled={disabled}
				className={[
					'w-full rounded-[var(--radius-md)] border px-3.5 py-2.5 text-sm outline-none transition-all',
					'focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand-light)]',
					disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
					className,
				].join(' ')}
				style={{
					backgroundColor: 'var(--color-card-bg)',
					borderColor: 'var(--color-border)',
					color: 'var(--color-text-primary)',
				}}
				{...props}
			>
				{children}
			</select>
		)
	},
)
