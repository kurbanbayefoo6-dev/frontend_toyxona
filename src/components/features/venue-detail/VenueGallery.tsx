import { Building2 } from 'lucide-react'
import { useState } from 'react'

import type { VenueImage } from '@/types/venueDetail'

type VenueGalleryProps = {
	images: VenueImage[]
	venueName: string
}

const THUMB_COUNT = 4

export function VenueGallery({ images, venueName }: VenueGalleryProps) {
	const displayImages =
		images.length > 0
			? images
			: [{ id: 0, imageUrl: '' } as VenueImage]
	const [activeIndex, setActiveIndex] = useState(0)
	const mainImage = displayImages[activeIndex] ?? displayImages[0]
	const thumbnails = displayImages.slice(0, THUMB_COUNT)

	while (thumbnails.length < THUMB_COUNT) {
		thumbnails.push({ id: -thumbnails.length, imageUrl: '' })
	}

	return (
		<div className='flex flex-col gap-3'>
			<div
				className='relative aspect-[16/10] overflow-hidden rounded-[var(--radius-lg)] border'
				style={{
					backgroundColor: 'var(--color-surface-secondary)',
					borderColor: 'var(--color-border)',
				}}
			>
				{mainImage?.imageUrl ? (
					<img
						src={mainImage.imageUrl}
						alt={venueName}
						className='size-full object-cover'
					/>
				) : (
					<div className='flex size-full items-center justify-center'>
						<Building2
							className='size-16 opacity-40'
							style={{ color: 'var(--color-brand)' }}
						/>
					</div>
				)}
			</div>

			<div className='grid grid-cols-4 gap-2'>
				{thumbnails.map((img, index) => {
					const hasImage = Boolean(img.imageUrl)
					const isActive = activeIndex === index && hasImage

					return (
						<button
							key={img.id}
							type='button'
							disabled={!hasImage}
							onClick={() => hasImage && setActiveIndex(index)}
							className={[
								'relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] border-2 transition-colors',
								!hasImage ? 'cursor-default opacity-50' : 'cursor-pointer',
							].join(' ')}
							style={{
								borderColor: isActive
									? 'var(--color-brand)'
									: 'var(--color-border)',
								backgroundColor: 'var(--color-surface-secondary)',
							}}
						>
							{hasImage ? (
								<img
									src={img.imageUrl}
									alt=''
									className='size-full object-cover'
								/>
							) : (
								<div className='flex size-full items-center justify-center'>
									<Building2
										className='size-6 opacity-30'
										style={{ color: 'var(--color-text-hint)' }}
									/>
								</div>
							)}
						</button>
					)
				})}
			</div>
		</div>
	)
}
