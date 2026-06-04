import { ImagePlus, Trash2, X } from 'lucide-react'
import { useRef, useState } from 'react'

import type { VenueImage } from '@/types/venueDetail'
import { resolveImageUrl } from '@/utils/imageUrl'

type PendingImage = {
	id: string
	file: File
	previewUrl: string
}

type VenueImageUploaderProps = {
	existing: VenueImage[]
	pending: PendingImage[]
	onAddPending: (files: File[]) => void
	onRemovePending: (id: string) => void
	onDeleteExisting: (imageId: number) => void
	disabled?: boolean
}

export function VenueImageUploader({
	existing,
	pending,
	onAddPending,
	onRemovePending,
	onDeleteExisting,
	disabled = false,
}: VenueImageUploaderProps) {
	const inputRef = useRef<HTMLInputElement>(null)

	return (
		<div>
			<div className='flex flex-wrap gap-3'>
				{existing.map(img => (
					<div
						key={img.id}
						className='relative size-24 overflow-hidden rounded-[var(--radius-md)] border'
						style={{ borderColor: 'var(--color-border)' }}
					>
						<img
							src={resolveImageUrl(img.imageUrl) ?? ''}
							alt=''
							className='size-full object-cover'
						/>
						<button
							type='button'
							disabled={disabled}
							onClick={() => onDeleteExisting(img.id)}
							className='absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white'
							aria-label='Rasmni o‘chirish'
						>
							<Trash2 className='size-3.5' />
						</button>
					</div>
				))}
				{pending.map(img => (
					<div
						key={img.id}
						className='relative size-24 overflow-hidden rounded-[var(--radius-md)] border'
						style={{ borderColor: 'var(--color-border)' }}
					>
						<img
							src={img.previewUrl}
							alt=''
							className='size-full object-cover'
						/>
						<button
							type='button'
							disabled={disabled}
							onClick={() => onRemovePending(img.id)}
							className='absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white'
							aria-label='Bekor qilish'
						>
							<X className='size-3.5' />
						</button>
					</div>
				))}
				<button
					type='button'
					disabled={disabled}
					onClick={() => inputRef.current?.click()}
					className='flex size-24 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-dashed text-xs'
					style={{
						borderColor: 'var(--color-border)',
						color: 'var(--color-text-hint)',
					}}
				>
					<ImagePlus className='size-5' />
					Rasm qo‘shish
				</button>
			</div>
			<input
				ref={inputRef}
				type='file'
				accept='image/*'
				multiple
				className='hidden'
				onChange={e => {
					const files = Array.from(e.target.files ?? [])
					if (files.length) onAddPending(files)
					e.target.value = ''
				}}
			/>
		</div>
	)
}

export function usePendingImages() {
	const [pending, setPending] = useState<PendingImage[]>([])

	function addFiles(files: File[]) {
		const next = files.map(file => ({
			id: crypto.randomUUID(),
			file,
			previewUrl: URL.createObjectURL(file),
		}))
		setPending(prev => [...prev, ...next])
	}

	function removePending(id: string) {
		setPending(prev => {
			const item = prev.find(p => p.id === id)
			if (item) URL.revokeObjectURL(item.previewUrl)
			return prev.filter(p => p.id !== id)
		})
	}

	function clearPending() {
		pending.forEach(p => URL.revokeObjectURL(p.previewUrl))
		setPending([])
	}

	return { pending, addFiles, removePending, clearPending }
}
