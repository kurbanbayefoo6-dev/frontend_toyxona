type CustomerEmptyStateProps = {
	message: string
}

export function CustomerEmptyState({ message }: CustomerEmptyStateProps) {
	return (
		<div
			className='rounded-[var(--radius-lg)] border px-6 py-12 text-center text-sm'
			style={{
				backgroundColor: 'var(--color-card-bg)',
				borderColor: 'var(--color-border)',
				color: 'var(--color-text-secondary)',
			}}
		>
			{message}
		</div>
	)
}
