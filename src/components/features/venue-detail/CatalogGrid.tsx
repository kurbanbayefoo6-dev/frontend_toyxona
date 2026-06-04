import { Building2 } from 'lucide-react'
import { useState } from 'react'

import { formatCurrency } from '@/utils/formatCurrency'

export type CatalogItem = {
	id: number
	name: string
	price?: number | null
	imageUrl?: string | null
}

type CatalogGridProps = {
	title: string
	items: CatalogItem[]
	emptyMessage: string
}

export function CatalogGrid({
	title,
	items,
	emptyMessage,
}: CatalogGridProps) {
	const [failedIds, setFailedIds] = useState<Set<number>>(new Set())

	return (
		<section className='product-card p-5 sm:p-6'>
			<div className='mb-4 flex items-end justify-between gap-4'>
				<div>
					<p className='section-kicker'>Services</p>
					<h2 className='text-2xl font-black'>{title}</h2>
				</div>
				{items.length > 0 ? (
					<span className='premium-badge'>{items.length} options</span>
				) : null}
			</div>
			{items.length === 0 ? (
				<p className='text-sm text-[var(--color-text-hint)]'>
					{emptyMessage}
				</p>
			) : (
				<div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3'>
					{items.map(item => (
						<article
							key={item.id}
							className='overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white'
						>
							<div className='aspect-[4/3] bg-[var(--color-surface-secondary)]'>
								{item.imageUrl && !failedIds.has(item.id) ? (
									<img
										src={item.imageUrl}
										alt={item.name}
										className='size-full object-cover'
										loading='lazy'
										onError={() =>
											setFailedIds(prev => new Set(prev).add(item.id))
										}
									/>
								) : (
									<div className='flex size-full items-center justify-center'>
										<Building2 className='size-8 opacity-40 text-[var(--color-brand)]' />
									</div>
								)}
							</div>
							<div className='p-4'>
								<p className='line-clamp-2 text-sm font-black text-[var(--color-text-primary)]'>
									{item.name}
								</p>
								{item.price != null && item.price > 0 && (
									<p className='mt-1 text-sm font-bold text-[var(--color-brand)]'>
										{formatCurrency(item.price)}
									</p>
								)}
							</div>
						</article>
					))}
				</div>
			)}
		</section>
	)
}
