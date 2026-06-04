import type { ReactNode } from 'react'

type OwnerSectionProps = {
	title: string
	children: ReactNode
	action?: ReactNode
}

export function OwnerSection({ title, children, action }: OwnerSectionProps) {
	return (
		<section
			className='rounded-[var(--radius-lg)] border p-4 sm:p-6'
			style={{
				backgroundColor: 'var(--color-card-bg)',
				borderColor: 'var(--color-border)',
			}}
		>
			<div className='mb-4 flex flex-wrap items-center justify-between gap-2'>
				<h2
					className='text-lg font-semibold'
					style={{ color: 'var(--color-text-primary)' }}
				>
					{title}
				</h2>
				{action}
			</div>
			{children}
		</section>
	)
}
