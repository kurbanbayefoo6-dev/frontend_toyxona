import type { ReactNode } from 'react'

type AuthCardProps = {
	title: string
	subtitle?: string
	children: ReactNode
	footer?: ReactNode
	/** compact = 400px login card; wide = register forms */
	size?: 'compact' | 'wide'
}

export function AuthCard({
	title,
	subtitle,
	children,
	footer,
	size = 'compact',
}: AuthCardProps) {
	const maxWidth = size === 'wide' ? 'max-w-[480px]' : 'max-w-[400px]'

	return (
		<div
			className={`mx-auto flex w-full ${maxWidth} flex-col px-4 py-10`}
		>
			<div
				className='rounded-[var(--radius-xl)] border p-6'
				style={{
					backgroundColor: 'var(--color-card-bg)',
					borderColor: 'var(--color-border)',
				}}
			>
				<header className='mb-6 text-center'>
					<h1
						className='text-2xl font-semibold'
						style={{ color: 'var(--color-text-primary)' }}
					>
						{title}
					</h1>
					{subtitle && (
						<p
							className='mt-2 text-sm'
							style={{ color: 'var(--color-text-secondary)' }}
						>
							{subtitle}
						</p>
					)}
				</header>
				{children}
			</div>
			{footer && <div className='mt-4 text-center text-sm'>{footer}</div>}
		</div>
	)
}
