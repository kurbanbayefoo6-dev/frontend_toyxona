import { Building2, Images } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { VenueImage } from '@/types/venueDetail'
import { logImageRenderDebug, resolveImageUrl } from '@/utils/imageUrl'

type VenueGalleryProps = {
	images: VenueImage[]
	venueName: string
}

const THUMB_COUNT = 4

export function VenueGallery({ images, venueName }: VenueGalleryProps) {
	const displayImages = useMemo(
		() =>
			images.length > 0
				? images.map(img => ({
						...img,
						resolvedUrl: resolveImageUrl(img.imageUrl),
					}))
				: [{ id: 0, imageUrl: '', resolvedUrl: null }],
		[images],
	)
	const [activeIndex, setActiveIndex] = useState(0)
	const [failedIds, setFailedIds] = useState<Set<number>>(new Set())
	const mainImage = displayImages[activeIndex] ?? displayImages[0]
	const thumbnails = displayImages.slice(0, THUMB_COUNT)

	if (import.meta.env.DEV && images[0]) {
		logImageRenderDebug(
			'VenueGallery',
			{ images },
			mainImage?.resolvedUrl ?? null,
		)
	}
	const mainHasImage = Boolean(
		mainImage?.resolvedUrl && !failedIds.has(mainImage.id),
	)

	while (thumbnails.length < THUMB_COUNT) {
		thumbnails.push({ id: -thumbnails.length, imageUrl: '', resolvedUrl: null })
	}

	return (
		<div className='grid gap-3 lg:grid-cols-[1fr_220px]'>
			<div className='relative aspect-[16/10] overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-surface-secondary)] shadow-[var(--shadow-md)]'>
				{mainHasImage ? (
					<img
						src={mainImage.resolvedUrl!}
						alt={venueName}
						className='size-full object-cover'
						onError={() => {
							if (import.meta.env.DEV) {
								console.warn(
									'[image-render:VenueGallery] main img onError',
									{ src: mainImage.resolvedUrl },
								)
							}
							setFailedIds(prev => new Set(prev).add(mainImage.id))
						}}
					/>
				) : (
					<div className='flex size-full items-center justify-center'>
						<Building2
							className='size-16 opacity-40'
							style={{ color: 'var(--color-brand)' }}
						/>
					</div>
				)}
				<div className='absolute bottom-4 left-4 rounded-full bg-black/45 px-3 py-1.5 text-sm font-bold text-white backdrop-blur'>
					<Images className='mr-1 inline size-4' />
					{displayImages.filter(img => img.resolvedUrl && !failedIds.has(img.id)).length || 1} ta rasm
				</div>
			</div>

			<div className='grid grid-cols-4 gap-2 lg:grid-cols-1'>
				{thumbnails.map((img, index) => {
					const hasImage = Boolean(img.resolvedUrl && !failedIds.has(img.id))
					const isActive = activeIndex === index && hasImage

					return (
						<button
							key={img.id}
							type='button'
							disabled={!hasImage}
							onClick={() => hasImage && setActiveIndex(index)}
							className={[
								'relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border-2 transition-all',
								!hasImage ? 'cursor-default opacity-50' : 'cursor-pointer hover:-translate-y-0.5',
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
									src={img.resolvedUrl!}
									alt=''
									className='size-full object-cover'
									onError={() =>
										setFailedIds(prev => new Set(prev).add(img.id))
									}
								/>
							) : (
								<div className='flex size-full items-center justify-center'>
									<Building2 className='size-6 opacity-30 text-[var(--color-text-hint)]' />
								</div>
							)}
						</button>
					)
				})}
			</div>
		</div>
	)
}
