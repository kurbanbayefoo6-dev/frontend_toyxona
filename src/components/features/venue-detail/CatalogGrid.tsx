import { Building2 } from 'lucide-react'

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
	return (
		<section>
			<h2
				className='mb-3 text-lg font-semibold'
				style={{ color: 'var(--color-text-primary)' }}
			>
				{title}
			</h2>
			{items.length === 0 ? (
				<p className='text-sm' style={{ color: 'var(--color-text-hint)' }}>
					{emptyMessage}
				</p>
			) : (
				<div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
					{items.map(item => (
						<article
							key={item.id}
							className='overflow-hidden rounded-[var(--radius-lg)] border'
							style={{
								backgroundColor: 'var(--color-card-bg)',
								borderColor: 'var(--color-border)',
							}}
						>
							<div
								className='aspect-[4/3]'
								style={{
									backgroundColor: 'var(--color-surface-secondary)',
								}}
							>
								{item.imageUrl ? (
									<img
										src={item.imageUrl}
										alt={item.name}
										className='size-full object-cover'
										loading='lazy'
									/>
								) : (
									<div className='flex size-full items-center justify-center'>
										<Building2
											className='size-8 opacity-40'
											style={{ color: 'var(--color-brand)' }}
										/>
									</div>
								)}
							</div>
							<div className='p-3'>
								<p
									className='line-clamp-2 text-sm font-medium'
									style={{ color: 'var(--color-text-primary)' }}
								>
									{item.name}
								</p>
								{item.price != null && item.price > 0 && (
									<p
										className='mt-1 text-sm font-semibold'
										style={{ color: 'var(--color-brand)' }}
									>
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
