export function VenueCardSkeleton() {
	return (
		<div
			className='flex flex-col overflow-hidden rounded-[var(--radius-lg)] border animate-pulse'
			style={{
				backgroundColor: 'var(--color-card-bg)',
				borderColor: 'var(--color-border)',
			}}
		>
			<div
				className='aspect-[4/3]'
				style={{ backgroundColor: 'var(--color-surface-secondary)' }}
			/>
			<div className='flex flex-col gap-2 p-4'>
				<div
					className='h-5 w-3/4 rounded-[var(--radius-sm)]'
					style={{ backgroundColor: 'var(--color-surface-secondary)' }}
				/>
				<div
					className='h-4 w-1/2 rounded-[var(--radius-sm)]'
					style={{ backgroundColor: 'var(--color-surface-secondary)' }}
				/>
				<div
					className='h-4 w-full rounded-[var(--radius-sm)]'
					style={{ backgroundColor: 'var(--color-surface-secondary)' }}
				/>
				<div
					className='h-4 w-1/3 rounded-[var(--radius-sm)]'
					style={{ backgroundColor: 'var(--color-surface-secondary)' }}
				/>
				<div
					className='mt-2 h-10 w-full rounded-[var(--radius-md)]'
					style={{ backgroundColor: 'var(--color-surface-secondary)' }}
				/>
			</div>
		</div>
	)
}
