export function VenueListEmpty() {
	return (
		<div
			className='rounded-[var(--radius-lg)] border px-6 py-16 text-center'
			style={{
				backgroundColor: 'var(--color-card-bg)',
				borderColor: 'var(--color-border)',
			}}
		>
			<p
				className='text-lg font-semibold'
				style={{ color: 'var(--color-text-primary)' }}
			>
				To‘yxonalar topilmadi
			</p>
			<p
				className='mt-2 text-sm'
				style={{ color: 'var(--color-text-hint)' }}
			>
				Filtrlarni o‘zgartiring yoki boshqa kalit so‘z bilan qidiring
			</p>
		</div>
	)
}
