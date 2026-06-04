import { MapPin, Phone, Users } from 'lucide-react'

import { FavoriteButton } from '@/components/features/venues/FavoriteButton'
import type { Venue } from '@/types/venue'
import { formatCurrency } from '@/utils/formatCurrency'

type VenueInfoSectionProps = {
	venue: Venue
}

export function VenueInfoSection({ venue }: VenueInfoSectionProps) {
	return (
		<section className='flex flex-col gap-4'>
			<div className='flex items-start justify-between gap-3'>
				<h1
					className='text-2xl font-semibold sm:text-3xl'
					style={{ color: 'var(--color-text-primary)' }}
				>
					{venue.name}
				</h1>
				<FavoriteButton venueId={venue.id} className='shrink-0 bg-transparent shadow-none' />
			</div>

			<div
				className='flex flex-wrap gap-4 text-sm'
				style={{ color: 'var(--color-text-secondary)' }}
			>
				<span className='inline-flex items-center gap-1.5'>
					<MapPin className='size-4' aria-hidden />
					{venue.district}
				</span>
				<span className='inline-flex items-center gap-1.5'>
					<Users className='size-4' aria-hidden />
					{venue.capacity} kishi sig‘imi
				</span>
				<span className='inline-flex items-center gap-1.5'>
					<Phone className='size-4' aria-hidden />
					{venue.phone}
				</span>
			</div>

			<p className='text-sm' style={{ color: 'var(--color-text-secondary)' }}>
				<span className='font-medium'>Manzil: </span>
				{venue.address}
			</p>

			<p
				className='text-lg font-semibold'
				style={{ color: 'var(--color-brand)' }}
			>
				{formatCurrency(venue.pricePerSeat)}
				<span
					className='text-sm font-normal'
					style={{ color: 'var(--color-text-secondary)' }}
				>
					{' '}
					/ o‘rin
				</span>
			</p>

			<div
				className='rounded-[var(--radius-md)] border p-4'
				style={{
					backgroundColor: 'var(--color-surface-secondary)',
					borderColor: 'var(--color-border)',
				}}
			>
				<h2
					className='mb-2 text-sm font-semibold'
					style={{ color: 'var(--color-text-primary)' }}
				>
					Tavsif
				</h2>
				<p className='text-sm' style={{ color: 'var(--color-text-secondary)' }}>
					{venue.address} manzilidagi {venue.name} — {venue.capacity} kishilik
					zal. To‘y va bayram tadbirlari uchun qulay maskan.
				</p>
			</div>
		</section>
	)
}
