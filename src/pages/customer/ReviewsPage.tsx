import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil, Star, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import {
	CustomerEmptyState,
	CustomerListSkeleton,
	ReviewFormModal,
} from '@/components/features/customer'
import { VenueListError } from '@/components/features/venues'
import { Button } from '@/components/ui/Button'
import { useCustomerBookings } from '@/hooks/useCustomerBookings'
import { useCustomerReviews } from '@/hooks/useCustomerReviews'
import {
	createReview,
	deleteReview,
	updateReview,
} from '@/services/review.service'
import { getVenueById } from '@/services/venue.service'
import { toast } from '@/stores/toastStore'
import type { ReviewItem } from '@/types/customer'
import { getApiErrorMessage } from '@/utils/authErrors'
import { normalizeDateKey } from '@/utils/customerStatus'

export default function CustomerReviewsPage() {
	const queryClient = useQueryClient()
	const reviewsQuery = useCustomerReviews()
	const bookingsQuery = useCustomerBookings()

	const [modalOpen, setModalOpen] = useState(false)
	const [editing, setEditing] = useState<ReviewItem | null>(null)
	const [venueNames, setVenueNames] = useState<Record<number, string>>({})

	const reviews = reviewsQuery.data ?? []

	const venueOptions = useMemo(() => {
		const map = new Map<number, string>()
		bookingsQuery.data?.items.forEach(b => {
			map.set(b.venueId, b.venueName)
		})
		return Array.from(map.entries()).map(([venueId, venueName]) => ({
			venueId,
			venueName,
		}))
	}, [bookingsQuery.data])

	useEffect(() => {
		let cancelled = false
		reviews.forEach(review => {
			if (venueNames[review.venueId]) return
			void getVenueById(review.venueId)
				.then(venue => {
					if (!cancelled) {
						setVenueNames(prev => ({
							...prev,
							[review.venueId]: venue.name,
						}))
					}
				})
				.catch(() => {
					if (!cancelled) {
						setVenueNames(prev => ({
							...prev,
							[review.venueId]: `To‘yxona #${review.venueId}`,
						}))
					}
				})
		})
		return () => {
			cancelled = true
		}
	}, [reviews])

	const saveMutation = useMutation({
		mutationFn: async (payload: {
			venueId: number
			rating: number
			comment: string
		}) => {
			if (editing) {
				return updateReview(editing.id, {
					rating: payload.rating,
					comment: payload.comment,
				})
			}
			return createReview(payload)
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['customer', 'reviews'] })
			toast.success(editing ? 'Sharh yangilandi' : 'Sharh qo‘shildi')
			setModalOpen(false)
			setEditing(null)
		},
		onError: err => {
			toast.error(getApiErrorMessage(err, 'Server bilan bog‘lanib bo‘lmadi'))
		},
	})

	const deleteMutation = useMutation({
		mutationFn: (id: number) => deleteReview(id),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['customer', 'reviews'] })
			toast.success('Sharh o‘chirildi')
		},
		onError: err => {
			toast.error(getApiErrorMessage(err, 'Server bilan bog‘lanib bo‘lmadi'))
		},
	})

	function openCreate() {
		setEditing(null)
		setModalOpen(true)
	}

	function openEdit(review: ReviewItem) {
		setEditing(review)
		setModalOpen(true)
	}

	if (reviewsQuery.isLoading) {
		return (
			<div>
				<h1
					className='mb-6 text-2xl font-semibold'
					style={{ color: 'var(--color-text-primary)' }}
				>
					Sharhlarim
				</h1>
				<CustomerListSkeleton />
			</div>
		)
	}

	if (reviewsQuery.isError) {
		return (
			<div>
				<h1
					className='mb-6 text-2xl font-semibold'
					style={{ color: 'var(--color-text-primary)' }}
				>
					Sharhlarim
				</h1>
				<VenueListError
					message={getApiErrorMessage(
						reviewsQuery.error,
						'Sharhlar yuklanmadi',
					)}
					onRetry={() => void reviewsQuery.refetch()}
					isRetrying={reviewsQuery.isFetching}
				/>
			</div>
		)
	}

	return (
		<div>
			<div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
				<h1
					className='text-2xl font-semibold'
					style={{ color: 'var(--color-text-primary)' }}
				>
					Sharhlarim
				</h1>
				<Button
					type='button'
					className='!w-auto px-6'
					onClick={openCreate}
				>
					Sharh qo‘shish
				</Button>
			</div>

			{reviews.length === 0 ? (
				<CustomerEmptyState message='Sizda hali sharhlar yo‘q' />
			) : (
				<ul className='flex flex-col gap-3'>
					{reviews.map(review => (
						<li
							key={review.id}
							className='rounded-[var(--radius-lg)] border p-4'
							style={{
								backgroundColor: 'var(--color-card-bg)',
								borderColor: 'var(--color-border)',
							}}
						>
							<div className='flex flex-wrap items-start justify-between gap-2'>
								<div>
									<Link
										to={`/venues/${review.venueId}`}
										className='font-semibold'
										style={{ color: 'var(--color-brand)' }}
									>
										{venueNames[review.venueId] ??
											`To‘yxona #${review.venueId}`}
									</Link>
									<div
										className='mt-1 flex items-center gap-0.5'
										aria-label={`${review.rating} yulduz`}
									>
										{Array.from({ length: 5 }).map((_, i) => (
											<Star
												key={i}
												className='size-4'
												style={{
													color:
														i < review.rating
															? 'var(--color-pending)'
															: 'var(--color-border)',
												}}
												fill={
													i < review.rating
														? 'var(--color-pending)'
														: 'transparent'
												}
											/>
										))}
									</div>
									<p
										className='mt-2 text-sm'
										style={{ color: 'var(--color-text-secondary)' }}
									>
										{review.comment}
									</p>
									<p
										className='mt-1 text-xs'
										style={{ color: 'var(--color-text-hint)' }}
									>
										{normalizeDateKey(review.createdAt)}
									</p>
								</div>
								<div className='flex gap-1'>
									<button
										type='button'
										onClick={() => openEdit(review)}
										className='rounded-[var(--radius-sm)] p-2'
										style={{ color: 'var(--color-text-secondary)' }}
										aria-label='Tahrirlash'
									>
										<Pencil className='size-4' />
									</button>
									<button
										type='button'
										onClick={() => deleteMutation.mutate(review.id)}
										className='rounded-[var(--radius-sm)] p-2'
										style={{ color: 'var(--color-booked)' }}
										aria-label='O‘chirish'
										disabled={deleteMutation.isPending}
									>
										<Trash2 className='size-4' />
									</button>
								</div>
							</div>
						</li>
					))}
				</ul>
			)}

			<ReviewFormModal
				open={modalOpen}
				onClose={() => {
					setModalOpen(false)
					setEditing(null)
				}}
				review={editing}
				venueOptions={venueOptions}
				onSubmit={async payload => {
					await saveMutation.mutateAsync(payload)
				}}
				isSubmitting={saveMutation.isPending}
			/>
		</div>
	)
}
