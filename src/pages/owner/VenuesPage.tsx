import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

import { CustomerEmptyState, CustomerListSkeleton } from '@/components/features/customer'
import { VenueStatusBadge } from '@/components/features/owner'
import { VenueListError } from '@/components/features/venues'
import { Button } from '@/components/ui/Button'
import { useOwnerVenues } from '@/hooks/useOwnerVenues'
import { getApiErrorMessage } from '@/utils/authErrors'
import { formatCurrency } from '@/utils/formatCurrency'
import { resolveVenueImageUrl } from '@/utils/imageUrl'

export default function OwnerVenuesPage() {
	const { data, isLoading, isError, error, refetch, isFetching } =
		useOwnerVenues()

	if (isLoading) {
		return (
			<div>
				<PageHeader />
				<CustomerListSkeleton rows={4} />
			</div>
		)
	}

	if (isError) {
		return (
			<div>
				<PageHeader />
				<VenueListError
					message={getApiErrorMessage(error, 'To‘yxonalar yuklanmadi')}
					onRetry={() => void refetch()}
					isRetrying={isFetching}
				/>
			</div>
		)
	}

	const venues = data ?? []

	return (
		<div>
			<PageHeader />

			{venues.length === 0 ? (
				<CustomerEmptyState message='Sizda hali To‘yxonalar yoвЂq' />
			) : (
				<ul className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
					{venues.map(venue => {
						const imageSrc = resolveVenueImageUrl(venue)

						return (
						<li
							key={venue.id}
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
										alt={venue.name}
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
							<div className='flex flex-1 flex-col gap-2 p-4'>
								<div className='flex items-start justify-between gap-2'>
									<h2
										className='font-semibold'
										style={{ color: 'var(--color-text-primary)' }}
									>
										{venue.name}
									</h2>
									<VenueStatusBadge status={venue.status} />
								</div>
								<p
									className='text-sm'
									style={{ color: 'var(--color-text-secondary)' }}
								>
									{venue.district} В· {venue.capacity} kishi
								</p>
								<p
									className='text-sm font-medium'
									style={{ color: 'var(--color-brand)' }}
								>
									{formatCurrency(venue.pricePerSeat)} / oвЂrin
								</p>
								<Link
									to={`/owner/venues/${venue.id}/edit`}
									className='mt-auto'
								>
									<Button type='button' variant='secondary'>
										Tahrirlash
									</Button>
								</Link>
							</div>
						</li>
					)})}
				</ul>
			)}
		</div>
	)
}

function PageHeader() {
	return (
		<div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
			<h1
				className='text-2xl font-semibold'
				style={{ color: 'var(--color-text-primary)' }}
			>
				To‘yxonalar
			</h1>
			<Link to='/owner/venues/new'>
				<Button type='button' className='!w-auto gap-2 px-4'>
					<Plus className='size-4' />
					Yangi To‘yxona
				</Button>
			</Link>
		</div>
	)
}
