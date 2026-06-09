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
		{ label: 'To‘yxonalar', value: venueCount },
		{ label: 'Faol bandlovlar', value: activeBookingsCount },
		{ label: 'Tasdiqlangan hamkorlar', value: approvedVenueCount },
	]

	return (
		<div className='mx-auto grid w-full max-w-4xl grid-cols-3 gap-2 rounded-[var(--radius-xl)] border border-white/20 bg-white/10 p-2 backdrop-blur-md sm:gap-4'>
			{items.map(item => (
				<div
					key={item.label}
					className='rounded-[var(--radius-lg)] px-2 py-3 text-center sm:py-4'
				>
					<p
						className='text-2xl font-black tabular-nums sm:text-4xl'
						style={{ color: '#ffffff' }}
					>
						{isLoading ? '-' : formatStatValue(item.value)}
					</p>
					<p
						className='mt-1 text-xs font-semibold sm:text-sm'
						style={{ color: 'rgba(255, 255, 255, 0.84)' }}
					>
						{item.label}
					</p>
				</div>
			))}
		</div>
	)
}

function formatStatValue(value: number | null): string {
	if (value === null) return '-'
	return value.toLocaleString('uz-UZ')
}
