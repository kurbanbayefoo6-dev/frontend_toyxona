import { Building2, CalendarCheck, MapPin, Users } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { FavoriteButton } from '@/components/features/venues/FavoriteButton'
import { Button } from '@/components/ui/Button'
import type { Venue } from '@/types/venue'
import { formatCurrency } from '@/utils/formatCurrency'

type VenueCardProps = {
	venue: Venue
	featured?: boolean
}

export function VenueCard({ venue, featured = false }: VenueCardProps) {
	const detailPath = `/venues/${venue.id}`
	const isApproved = venue.status === 'approved'
	const [imageFailed, setImageFailed] = useState(false)

	return (
		<article className='group product-card flex min-h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]'>
			<Link to={detailPath} className='block'>
				<div className='relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-secondary)]'>
					<div className='absolute left-3 top-3 z-10 flex gap-2'>
						<span
							className='rounded-full px-3 py-1 text-xs font-black shadow-sm'
							style={{
								backgroundColor: isApproved
									? 'var(--color-available-light)'
									: 'var(--color-pending-light)',
								color: isApproved
									? 'var(--color-available)'
									: 'var(--color-pending)',
							}}
						>
							{isApproved ? 'Available' : 'Pending'}
						</span>
						{featured ? (
							<span className='rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[var(--color-brand)] shadow-sm'>
								Featured
							</span>
						) : null}
					</div>
					<div className='absolute right-3 top-3 z-10'>
						<FavoriteButton venueId={venue.id} />
					</div>
					{venue.imageUrl && !imageFailed ? (
						<img
							src={venue.imageUrl}
							alt={venue.name}
							className='size-full object-cover transition duration-500 group-hover:scale-105'
							loading='lazy'
							onError={() => setImageFailed(true)}
						/>
					) : (
						<div className='flex size-full items-center justify-center'>
							<Building2
								className='size-14 opacity-50'
								style={{ color: 'var(--color-brand)' }}
								aria-hidden
							/>
						</div>
					)}
					<div className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent' />
				</div>
			</Link>

			<div className='flex flex-1 flex-col gap-4 p-4'>
				<div>
					<Link to={detailPath} className='block'>
						<h2 className='line-clamp-2 text-lg font-black leading-snug transition-colors group-hover:text-[var(--color-brand)]'>
							{venue.name}
						</h2>
					</Link>
					<div className='mt-2 flex flex-wrap items-center gap-2 text-sm text-[var(--color-text-secondary)]'>
						<span className='inline-flex items-center gap-1'>
							<MapPin className='size-3.5 shrink-0' aria-hidden />
							{venue.district}
						</span>
						<span className='inline-flex items-center gap-1'>
							<Users className='size-3.5 shrink-0' aria-hidden />
							{venue.capacity} guests
						</span>
					</div>
				</div>

				<div className='mt-auto flex items-end justify-between gap-3 border-t border-[var(--color-border)] pt-4'>
					<div>
						<p className='text-xs font-bold uppercase tracking-wide text-[var(--color-text-hint)]'>
							From
						</p>
						<p className='text-lg font-black text-[var(--color-text-primary)]'>
							{formatCurrency(venue.pricePerSeat)}
						</p>
						<p className='text-xs text-[var(--color-text-secondary)]'>
							per seat
						</p>
					</div>
					<Link to={detailPath}>
						<Button type='button' className='w-auto px-4'>
							<CalendarCheck className='size-4' />
							Book
						</Button>
					</Link>
				</div>
			</div>
		</article>
	)
}
