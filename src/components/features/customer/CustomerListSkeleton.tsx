type CustomerListSkeletonProps = {
	rows?: number
}

export function CustomerListSkeleton({ rows = 5 }: CustomerListSkeletonProps) {
	return (
		<div className='flex flex-col gap-3'>
			{Array.from({ length: rows }).map((_, i) => (
				<div
					key={i}
					className='animate-pulse rounded-[var(--radius-lg)] border p-4'
					style={{
						backgroundColor: 'var(--color-card-bg)',
						borderColor: 'var(--color-border)',
					}}
				>
					<div
						className='mb-2 h-5 w-1/3 rounded-[var(--radius-sm)]'
						style={{ backgroundColor: 'var(--color-surface-secondary)' }}
					/>
					<div
						className='h-4 w-2/3 rounded-[var(--radius-sm)]'
						style={{ backgroundColor: 'var(--color-surface-secondary)' }}
					/>
				</div>
			))}
		</div>
	)
}
