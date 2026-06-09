import type { ComponentProps, ReactNode } from 'react'

import { Input } from '@/components/ui/Input'

type FormFieldProps = {
	label: string
	hint?: string
	error?: string
	children?: ReactNode
} & ComponentProps<typeof Input>

export function FormField({
	label,
	hint,
	error,
	id,
	children,
	...inputProps
}: FormFieldProps) {
	const fieldId = id ?? inputProps.name

	return (
		<div className='flex flex-col gap-1.5'>
			<label
				htmlFor={fieldId}
				className='text-sm font-medium'
				style={{ color: 'var(--color-text-primary)' }}
			>
				{label}
			</label>
			{children ?? (
				<Input id={fieldId} hasError={Boolean(error)} {...inputProps} />
			)}
			{hint && !error && (
				<p className='text-xs' style={{ color: 'var(--color-text-hint)' }}>
					{hint}
				</p>
			)}
			{error && (
				<p className='text-xs' style={{ color: 'var(--color-booked)' }}>
					{error}
				</p>
			)}
		</div>
	)
}
