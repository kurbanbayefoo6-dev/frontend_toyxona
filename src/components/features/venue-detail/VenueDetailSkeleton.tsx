export function VenueDetailSkeleton() {
	return (
		<div className='mx-auto max-w-7xl animate-pulse'>
			<div className='grid grid-cols-1 gap-6 lg:grid-cols-[65fr_35fr]'>
				<div className='flex flex-col gap-6'>
					<div
						className='aspect-[16/10] rounded-[var(--radius-lg)]'
						style={{ backgroundColor: 'var(--color-surface-secondary)' }}
					/>
					<div className='grid grid-cols-4 gap-2'>
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className='aspect-[4/3] rounded-[var(--radius-md)]'
								style={{
									backgroundColor: 'var(--color-surface-secondary)',
								}}
							/>
						))}
					</div>
					<div
						className='h-8 w-2/3 rounded-[var(--radius-sm)]'
						style={{ backgroundColor: 'var(--color-surface-secondary)' }}
					/>
					<div
						className='h-24 rounded-[var(--radius-md)]'
						style={{ backgroundColor: 'var(--color-surface-secondary)' }}
					/>
					<div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
						{Array.from({ length: 3 }).map((_, i) => (
							<div
								key={i}
								className='h-40 rounded-[var(--radius-lg)]'
								style={{
									backgroundColor: 'var(--color-surface-secondary)',
								}}
							/>
						))}
					</div>
				</div>
				<div
					className='h-[520px] rounded-[var(--radius-lg)]'
					style={{ backgroundColor: 'var(--color-surface-secondary)' }}
				/>
			</div>
		</div>
	)
}
