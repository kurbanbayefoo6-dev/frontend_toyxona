import { useEffect, useState } from 'react'

import { Modal } from '@/components/ui/Modal'
import { Button, Select } from '@/components/ui'
import type { ReviewItem } from '@/types/customer'

type ReviewFormModalProps = {
	open: boolean
	onClose: () => void
	review: ReviewItem | null
	venueOptions: Array<{ venueId: number; venueName: string }>
	onSubmit: (payload: {
		venueId: number
		rating: number
		comment: string
	}) => Promise<void>
	isSubmitting: boolean
}

export function ReviewFormModal({
	open,
	onClose,
	review,
	venueOptions,
	onSubmit,
	isSubmitting,
}: ReviewFormModalProps) {
	const [venueId, setVenueId] = useState('')
	const [rating, setRating] = useState('5')
	const [comment, setComment] = useState('')

	useEffect(() => {
		if (!open) return
		if (review) {
			setVenueId(String(review.venueId))
			setRating(String(review.rating))
			setComment(review.comment)
		} else {
			setVenueId(venueOptions[0] ? String(venueOptions[0].venueId) : '')
			setRating('5')
			setComment('')
		}
	}, [open, review, venueOptions])

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		const parsedVenueId = Number(venueId)
		const parsedRating = Number(rating)
		if (!parsedVenueId || !comment.trim()) return
		await onSubmit({
			venueId: parsedVenueId,
			rating: parsedRating,
			comment: comment.trim(),
		})
	}

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={review ? 'Sharhni tahrirlash' : 'Yangi sharh'}
			size='lg'
		>
			<form onSubmit={e => void handleSubmit(e)} className='flex flex-col gap-4'>
				{!review && (
					<div className='flex flex-col gap-1.5'>
						<label
							className='text-sm font-medium'
							style={{ color: 'var(--color-text-primary)' }}
						>
							To‘yxona
						</label>
						<Select
							value={venueId}
							onChange={e => setVenueId(e.target.value)}
							disabled={isSubmitting || venueOptions.length === 0}
						>
							{venueOptions.length === 0 ? (
								<option value=''>To‘yxona mavjud emas</option>
							) : (
								venueOptions.map(v => (
									<option key={v.venueId} value={v.venueId}>
										{v.venueName}
									</option>
								))
							)}
						</Select>
					</div>
				)}

				<div className='flex flex-col gap-1.5'>
					<label
						className='text-sm font-medium'
						style={{ color: 'var(--color-text-primary)' }}
					>
						Baho (1вЂ“5)
					</label>
					<Select
						value={rating}
						onChange={e => setRating(e.target.value)}
						disabled={isSubmitting}
					>
						{[5, 4, 3, 2, 1].map(n => (
							<option key={n} value={n}>
								{n} yulduz
							</option>
						))}
					</Select>
				</div>

				<label className='flex flex-col gap-1.5'>
					<span
						className='text-sm font-medium'
						style={{ color: 'var(--color-text-primary)' }}
					>
						Izoh
					</span>
					<textarea
						value={comment}
						onChange={e => setComment(e.target.value)}
						disabled={isSubmitting}
						placeholder='Tajribangiz haqida yozing...'
						rows={4}
						className='w-full resize-y rounded-[var(--radius-md)] border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-light)]'
						style={{
							backgroundColor: 'var(--color-card-bg)',
							borderColor: 'var(--color-border)',
							color: 'var(--color-text-primary)',
						}}
					/>
				</label>

				<Button type='submit' loading={isSubmitting} disabled={isSubmitting}>
					{review ? 'Saqlash' : 'Yuborish'}
				</Button>
			</form>
		</Modal>
	)
}
