import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Heart, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

import {
	CustomerEmptyState,
	CustomerListSkeleton,
} from '@/components/features/customer'
import { VenueListError } from '@/components/features/venues'
import { Button } from '@/components/ui/Button'
import { useCustomerFavorites } from '@/hooks/useCustomerFavorites'
import { removeFavorite } from '@/services/favorite.service'
import { toast } from '@/stores/toastStore'
import { getApiErrorMessage } from '@/utils/authErrors'
import { formatCurrency } from '@/utils/formatCurrency'
import { resolveVenueImageUrl } from '@/utils/imageUrl'

export default function CustomerFavoritesPage() {
	const queryClient = useQueryClient()
	const { data, isLoading, isError, error, refetch, isFetching } =
		useCustomerFavorites()

	const removeMutation = useMutation({
		mutationFn: (venueId: number) => removeFavorite(venueId),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['customer', 'favorites'] })
			toast.success('Sevimlilardan olib tashlandi')
		},
		onError: err => {
			toast.error(getApiErrorMessage(err, 'Server bilan bogвЂlanib boвЂlmadi'))
		},
	})

	if (isLoading) {
		return (
			<div>
				<h1
					className='mb-6 text-2xl font-semibold'
					style={{ color: 'var(--color-text-primary)' }}
				>
					Sevimlilar
				</h1>
				<CustomerListSkeleton />
			</div>
		)
	}

	if (isError) {
		return (
			<div>
				<h1
					className='mb-6 text-2xl font-semibold'
					style={{ color: 'var(--color-text-primary)' }}
				>
					Sevimlilar
				</h1>
				<VenueListError
					message={getApiErrorMessage(error, 'Sevimlilar yuklanmadi')}
					onRetry={() => void refetch()}
					isRetrying={isFetching}
				/>
			</div>
		)
	}

	const favorites = data ?? []

	return (
		<div>
			<h1
				className='mb-6 text-2xl font-semibold'
				style={{ color: 'var(--color-text-primary)' }}
			>
				Sevimlilar
			</h1>

			{favorites.length === 0 ? (
				<CustomerEmptyState message='Sevimli To‘yxonalar roвЂyxati boвЂsh' />
			) : (
				<ul className='grid grid-cols-1 gap-4 md:grid-cols-2'>
					{favorites.map(fav => {
						const imageSrc = fav.venue ? resolveVenueImageUrl(fav.venue) : null

						return (
						<li
							key={fav.id}
							className='flex flex-col overflow-hidden rounded-[var(--radius-lg)] border'
							style={{
								backgroundColor: 'var(--color-card-bg)',
								borderColor: 'var(--color-border)',
							}}
						>
							<div
								className='aspect-[16/9]'
								style={{
									backgroundColor: 'var(--color-surface-secondary)',
								}}
							>
								{imageSrc ? (
									<img
										src={imageSrc}
										alt={fav.venue?.name ?? `To‘yxona #${fav.venueId}`}
										className='size-full object-cover'
									/>
								) : (
									<div
										className='flex size-full items-center justify-center text-sm'
										style={{ color: 'var(--color-text-hint)' }}
									>
										Rasm yoвЂq
									</div>
								)}
							</div>
							<div className='flex flex-1 flex-col gap-3 p-4'>
								<div>
									<p
										className='font-semibold'
										style={{ color: 'var(--color-text-primary)' }}
									>
										{fav.venue?.name ?? `To‘yxona #${fav.venueId}`}
									</p>
									{fav.venue && (
										<p
											className='mt-1 inline-flex items-center gap-1 text-sm'
											style={{ color: 'var(--color-text-secondary)' }}
										>
											<MapPin className='size-3.5' />
											{fav.venue.district}
										</p>
									)}
									{fav.venue && (
										<p
											className='mt-1 text-sm font-medium'
											style={{ color: 'var(--color-brand)' }}
										>
											{formatCurrency(fav.venue.pricePerSeat)} / oвЂrin
										</p>
									)}
								</div>
								<div className='mt-auto flex gap-2'>
									<Link
										to={`/venues/${fav.venueId}`}
										className='flex-1'
									>
										<Button type='button' variant='secondary'>
											KoвЂrish
										</Button>
									</Link>
									<Button
										type='button'
										variant='ghost'
										className='!w-auto shrink-0 px-3'
										loading={removeMutation.isPending}
										onClick={() => removeMutation.mutate(fav.venueId)}
										aria-label='Sevimlidan olib tashlash'
									>
										<Heart className='size-4 fill-current' />
									</Button>
								</div>
							</div>
						</li>
					)})}
				</ul>
			)}
		</div>
	)
}
