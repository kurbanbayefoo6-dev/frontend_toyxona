type HomeHeroStatsProps = {
	venueCount: number | null
	activeBookingsCount: number | null
	approvedVenueCount: number | null
	isLoading?: boolean
}

export function HomeHeroStats({
	venueCount,
	activeBookingsCount,
	approvedVenueCount,
	isLoading = false,
}: HomeHeroStatsProps) {
	const items = [
		{ label: 'To‘yxonalar soni', value: venueCount },
		{ label: 'Faol bronlar', value: activeBookingsCount },
		{ label: 'Tasdiqlangan to‘yxonalar', value: approvedVenueCount },
	]

	return (
		<div className='mx-auto flex w-full max-w-[700px] flex-wrap items-center justify-center gap-6 sm:gap-10'>
			{items.map(item => (
				<div key={item.label} className='min-w-[120px] text-center'>
					<p
						className='text-2xl font-semibold tabular-nums sm:text-3xl'
						style={{ color: '#ffffff' }}
					>
						{isLoading ? '—' : formatStatValue(item.value)}
					</p>
					<p
						className='mt-1 text-xs font-medium sm:text-sm'
						style={{ color: 'rgba(255, 255, 255, 0.88)' }}
					>
						{item.label}
					</p>
				</div>
			))}
		</div>
	)
}

function formatStatValue(value: number | null): string {
	if (value === null) return '—'
	return value.toLocaleString('uz-UZ')
}
