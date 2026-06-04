import { Music2 } from 'lucide-react'

import type { VenueKarnaySurnay } from '@/types/venueDetail'
import { formatCurrency } from '@/utils/formatCurrency'

type KarnaySectionProps = {
	items: VenueKarnaySurnay[]
}

export function KarnaySection({ items }: KarnaySectionProps) {
	return (
		<section className='product-card p-5 sm:p-6'>
			<div className='mb-4 flex items-end justify-between gap-4'>
				<div>
					<p className='section-kicker'>Marosim musiqasi</p>
					<h2 className='text-2xl font-black'>Karnay-surnay</h2>
				</div>
				<Music2 className='size-6 text-[var(--color-brand)]' />
			</div>
			{items.length === 0 ? (
				<p className='text-sm text-[var(--color-text-hint)]'>
					Karnay-surnay xizmati mavjud emas.
				</p>
			) : (
				<div className='grid gap-3 sm:grid-cols-2'>
					{items.map(item => (
						<div
							key={item.id}
							className='flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white px-4 py-3'
						>
							<span
								className='rounded-full px-3 py-1 text-sm font-black'
								style={{
									backgroundColor: item.isAvailable
										? 'var(--color-available-light)'
										: 'var(--color-surface-secondary)',
									color: item.isAvailable
										? 'var(--color-available)'
										: 'var(--color-text-hint)',
								}}
							>
								{item.isAvailable ? 'Mavjud' : 'Mavjud emas'}
							</span>
							<span className='text-sm font-black text-[var(--color-text-primary)]'>
								{formatCurrency(item.price)}
							</span>
						</div>
					))}
				</div>
			)}
		</section>
	)
}
