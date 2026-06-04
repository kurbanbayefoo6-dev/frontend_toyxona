import { Building2, MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { FavoriteButton } from '@/components/features/venues/FavoriteButton'
import { Button } from '@/components/ui/Button'
import type { Venue } from '@/types/venue'
import { formatCurrency } from '@/utils/formatCurrency'

type VenueCardProps = {
	venue: Venue
}

export function VenueCard({ venue }: VenueCardProps) {
	const detailPath = `/venues/${venue.id}`

	return (
		<article
			className='group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] transition-colors duration-200 hover:border-[var(--color-brand)]'
			style={{ backgroundColor: 'var(--color-card-bg)' }}
		>
			<Link to={detailPath} className='block'>
				<div
					className='relative aspect-[4/3] overflow-hidden'
					style={{ backgroundColor: 'var(--color-surface-secondary)' }}
				>
					<div className='absolute top-2 right-2 z-10'>
						<FavoriteButton venueId={venue.id} />
					</div>
					{venue.imageUrl ? (
						<img
							src={venue.imageUrl}
							alt={venue.name}
							className='size-full object-cover'
							loading='lazy'
						/>
					) : (
						<div className='flex size-full items-center justify-center'>
							<Building2
								className='size-12 opacity-50'
								style={{ color: 'var(--color-brand)' }}
								aria-hidden
							/>
						</div>
					)}
				</div>
			</Link>

			<div className='flex flex-1 flex-col gap-3 p-4'>
				<Link to={detailPath} className='block'>
					<h2
						className='line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-[var(--color-brand)]'
						style={{ color: 'var(--color-text-primary)' }}
					>
						{venue.name}
					</h2>
				</Link>

				<div
					className='flex flex-wrap items-center gap-2 text-sm'
					style={{ color: 'var(--color-text-secondary)' }}
				>
					<span className='inline-flex items-center gap-1'>
						<MapPin className='size-3.5 shrink-0' aria-hidden />
						{venue.district}
					</span>
					<span aria-hidden>·</span>
					<span className='inline-flex items-center gap-1'>
						<Users className='size-3.5 shrink-0' aria-hidden />
						{venue.capacity} kishi
					</span>
				</div>

				<p
					className='text-sm font-semibold'
					style={{ color: 'var(--color-brand)' }}
				>
					{formatCurrency(venue.pricePerSeat)}
					<span
						className='font-normal'
						style={{ color: 'var(--color-text-secondary)' }}
					>
						{' '}
						/ o‘rin
					</span>
				</p>

				<Link to={detailPath} className='mt-auto'>
					<Button type='button' className='w-full'>
						Bron qilish
					</Button>
				</Link>
			</div>
		</article>
	)
}
