import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type DashboardCardProps = {
	label: string
	value: ReactNode
	href?: string
}

export function DashboardCard({ label, value, href }: DashboardCardProps) {
	const content = (
		<div
			className='flex flex-col gap-2 rounded-[var(--radius-lg)] border p-4 sm:p-5'
			style={{
				backgroundColor: 'var(--color-card-bg)',
				borderColor: 'var(--color-border)',
			}}
		>
			<span
				className='text-sm'
				style={{ color: 'var(--color-text-secondary)' }}
			>
				{label}
			</span>
			<span
				className='text-2xl font-semibold sm:text-3xl'
				style={{ color: 'var(--color-text-primary)' }}
			>
				{value}
			</span>
		</div>
	)

	if (href) {
		return (
			<Link to={href} className='block transition-opacity hover:opacity-90'>
				{content}
			</Link>
		)
	}

	return content
}
