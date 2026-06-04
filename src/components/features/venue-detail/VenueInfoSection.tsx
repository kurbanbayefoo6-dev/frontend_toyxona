import { MapPin, Phone, Users, WalletCards } from 'lucide-react'
import type { ReactNode } from 'react'

import { FavoriteButton } from '@/components/features/venues/FavoriteButton'
import type { Venue } from '@/types/venue'
import { formatCurrency } from '@/utils/formatCurrency'

type VenueInfoSectionProps = {
	venue: Venue
}

export function VenueInfoSection({ venue }: VenueInfoSectionProps) {
	return (
		<section className='product-card p-5 sm:p-7'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
				<div>
					<p className='section-kicker'>Maskan tafsilotlari</p>
					<h1 className='mt-2 text-3xl font-black leading-tight sm:text-5xl'>
						{venue.name}
					</h1>
				</div>
				<FavoriteButton venueId={venue.id} className='shrink-0 bg-transparent shadow-none' />
			</div>

			<div className='mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
				<InfoPill icon={<MapPin className='size-4' />} label='Tuman' value={venue.district} />
				<InfoPill icon={<Users className='size-4' />} label='Sig‘im' value={`${venue.capacity} mehmon`} />
				<InfoPill icon={<Phone className='size-4' />} label='Telefon' value={venue.phone} />
				<InfoPill icon={<WalletCards className='size-4' />} label='Narx' value={`${formatCurrency(venue.pricePerSeat)} / o‘rin`} />
			</div>

			<div className='mt-6 rounded-[var(--radius-lg)] bg-[var(--color-surface-secondary)] p-5'>
				<h2 className='text-lg font-black'>Bu maskan haqida</h2>
				<p className='mt-2 leading-relaxed text-[var(--color-text-secondary)]'>
					{venue.name} {venue.address} manzilida joylashgan. Zal {venue.capacity}{' '}
					mehmongacha, to‘y va oilaviy tadbirlar uchun mos. Barcha xizmatlar bir
					joyda.
				</p>
			</div>
		</section>
	)
}

function InfoPill({
	icon,
	label,
	value,
}: {
	icon: ReactNode
	label: string
	value: string
}) {
	return (
		<div className='rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4'>
			<div className='mb-3 flex size-9 items-center justify-center rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand)]'>
				{icon}
			</div>
			<p className='text-xs font-bold uppercase tracking-wide text-[var(--color-text-hint)]'>
				{label}
			</p>
			<p className='mt-1 text-sm font-black text-[var(--color-text-primary)]'>
				{value}
			</p>
		</div>
	)
}
