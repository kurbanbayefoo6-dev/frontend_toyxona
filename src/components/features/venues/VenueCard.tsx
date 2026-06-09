import { Building2, CalendarCheck, MapPin, Users } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { FavoriteButton } from '@/components/features/venues/FavoriteButton'
import { Button } from '@/components/ui/Button'
import type { Venue } from '@/types/venue'
import { formatCurrency } from '@/utils/formatCurrency'
import { logImageRenderDebug, resolveVenueImageUrl } from '@/utils/imageUrl'

type VenueCardProps = {
	venue: Venue
	featured?: boolean
}

export function VenueCard({ venue, featured = false }: VenueCardProps) {
	const detailPath = `/venues/${venue.id}`
	const isApproved = venue.status === 'approved'
	const [imageFailed, setImageFailed] = useState(false)
	const imageSrc = resolveVenueImageUrl(venue)

	logImageRenderDebug('VenueCard', venue, imageSrc)

	return (
		<article className='group product-card flex min-h-full flex-col overflow-hidden border-white/70 bg-white/95 shadow-[0_18px_45px_rgba(68,42,22,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(68,42,22,0.14)]'>
			<Link to={detailPath} className='block'>
				<div className='relative aspect-[4/3] overflow-hidden bg-[linear-gradient(135deg,#fff7ed_0%,#f4ece4_48%,#e7d8cc_100%)]'>
					<div className='absolute left-3 top-3 z-10 flex gap-2'>
						<span
							className='rounded-full border border-white/80 px-3 py-1 text-xs font-black shadow-sm backdrop-blur'
							style={{
								backgroundColor: isApproved
									? 'color-mix(in srgb, var(--color-available-light) 88%, white)'
									: 'color-mix(in srgb, var(--color-pending-light) 88%, white)',
								color: isApproved
									? 'var(--color-available)'
									: 'var(--color-pending)',
							}}
						>
							{isApproved ? 'Mavjud' : 'Kutilmoqda'}
						</span>
						{featured ? (
							<span className='rounded-full border border-white/80 bg-white/90 px-3 py-1 text-xs font-black text-[var(--color-brand)] shadow-sm backdrop-blur'>
								Tavsiya
							</span>
						) : null}
					</div>
					<div className='absolute right-3 top-3 z-10'>
						<FavoriteButton venueId={venue.id} />
					</div>
					{imageSrc && !imageFailed ? (
						<img
							src={imageSrc}
							alt={venue.name}
							className='size-full object-cover transition duration-500 group-hover:scale-105'
							loading='lazy'
							onError={() => {
								if (import.meta.env.DEV) {
									console.warn(
										'[image-render:VenueCard] img onError — showing placeholder',
										{ venueId: venue.id, src: imageSrc },
									)
								}
								setImageFailed(true)
							}}
						/>
					) : (
						<div className='flex size-full items-center justify-center'>
							<div className='flex size-24 items-center justify-center rounded-3xl border border-white/70 bg-white/45 shadow-inner backdrop-blur-sm'>
								<Building2
									className='size-12 opacity-70'
									style={{ color: 'var(--color-brand)' }}
									aria-hidden
								/>
							</div>
						</div>
					)}
					<div className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-90' />
				</div>
			</Link>

			<div className='flex flex-1 flex-col gap-4 p-5'>
				<div>
					<Link to={detailPath} className='block'>
						<h2 className='line-clamp-2 text-xl font-black leading-snug tracking-normal transition-colors group-hover:text-[var(--color-brand)]'>
							{venue.name}
						</h2>
					</Link>
					<div className='mt-3 flex flex-wrap items-center gap-2 text-sm text-[var(--color-text-secondary)]'>
						<span className='inline-flex items-center gap-1 rounded-full bg-[var(--color-surface-secondary)] px-2.5 py-1'>
							<MapPin className='size-3.5 shrink-0' aria-hidden />
							{venue.district}
						</span>
						<span className='inline-flex items-center gap-1 rounded-full bg-[var(--color-surface-secondary)] px-2.5 py-1'>
							<Users className='size-3.5 shrink-0' aria-hidden />
							{venue.capacity} kishi
						</span>
					</div>
				</div>

				<div className='mt-auto flex items-end justify-between gap-3 border-t border-[var(--color-border)] pt-4'>
					<div>
						<p className='text-xs font-bold uppercase tracking-wide text-[var(--color-text-hint)]'>
							Dan
						</p>
						<p className='text-lg font-black text-[var(--color-text-primary)]'>
							{formatCurrency(venue.pricePerSeat)}
						</p>
						<p className='text-xs text-[var(--color-text-secondary)]'>
							o‘rin uchun
						</p>
					</div>
					<Link to={detailPath}>
						<Button type='button' className='w-auto px-4 shadow-[0_12px_30px_rgba(164,83,38,0.25)]'>
							<CalendarCheck className='size-4' />
							Bron
						</Button>
					</Link>
				</div>
			</div>
		</article>
	)
}
