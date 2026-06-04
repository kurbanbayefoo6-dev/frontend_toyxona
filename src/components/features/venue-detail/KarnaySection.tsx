import type { VenueKarnaySurnay } from '@/types/venueDetail'
import { formatCurrency } from '@/utils/formatCurrency'

type KarnaySectionProps = {
	items: VenueKarnaySurnay[]
}

export function KarnaySection({ items }: KarnaySectionProps) {
	return (
		<section>
			<h2
				className='mb-3 text-lg font-semibold'
				style={{ color: 'var(--color-text-primary)' }}
			>
				Karnay-surnay
			</h2>
			{items.length === 0 ? (
				<p className='text-sm' style={{ color: 'var(--color-text-hint)' }}>
					Karnay-surnay xizmati mavjud emas
				</p>
			) : (
				<div className='flex flex-col gap-2'>
					{items.map(item => (
						<div
							key={item.id}
							className='flex items-center justify-between rounded-[var(--radius-md)] border px-4 py-3'
							style={{
								backgroundColor: 'var(--color-card-bg)',
								borderColor: 'var(--color-border)',
							}}
						>
							<span
								className='text-sm font-medium'
								style={{
									color: item.isAvailable
										? 'var(--color-available)'
										: 'var(--color-text-hint)',
								}}
							>
								{item.isAvailable ? 'Mavjud' : 'Mavjud emas'}
							</span>
							<span
								className='text-sm font-semibold'
								style={{ color: 'var(--color-text-primary)' }}
							>
								{formatCurrency(item.price)}
							</span>
						</div>
					))}
				</div>
			)}
		</section>
	)
}
