import {
	CustomerEmptyState,
	CustomerListSkeleton,
	StatusBadge,
} from '@/components/features/customer'
import { VenueListError } from '@/components/features/venues'
import { useCustomerPayments } from '@/hooks/useCustomerPayments'
import { getApiErrorMessage } from '@/utils/authErrors'
import {
	getPaymentStatusLabel,
	getPaymentStatusStyle,
	normalizeDateKey,
} from '@/utils/customerStatus'
import { formatCurrency } from '@/utils/formatCurrency'

export default function CustomerPaymentsPage() {
	const { data, isLoading, isError, error, refetch, isFetching } =
		useCustomerPayments()

	const payments = data?.items ?? []

	if (isLoading) {
		return (
			<div>
				<h1
					className='mb-6 text-2xl font-semibold'
					style={{ color: 'var(--color-text-primary)' }}
				>
					ToвЂlovlarim
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
					ToвЂlovlarim
				</h1>
				<VenueListError
					message={getApiErrorMessage(error, 'ToвЂlovlar yuklanmadi')}
					onRetry={() => void refetch()}
					isRetrying={isFetching}
				/>
			</div>
		)
	}

	return (
		<div>
			<h1
				className='mb-6 text-2xl font-semibold'
				style={{ color: 'var(--color-text-primary)' }}
			>
				ToвЂlovlarim
			</h1>

			{payments.length === 0 ? (
				<CustomerEmptyState message='ToвЂlovlar topilmadi' />
			) : (
				<ul className='flex flex-col gap-3'>
					{payments.map(payment => {
						const style = getPaymentStatusStyle(payment.paymentStatus)
						const date = payment.paidAt ?? payment.createdAt
						return (
							<li
								key={payment.id}
								className='rounded-[var(--radius-lg)] border p-4'
								style={{
									backgroundColor: 'var(--color-card-bg)',
									borderColor: 'var(--color-border)',
								}}
							>
								<div className='flex flex-wrap items-start justify-between gap-2'>
									<div className='min-w-0'>
										<p
											className='font-mono text-xs'
											style={{ color: 'var(--color-text-hint)' }}
										>
											{payment.transactionId}
										</p>
										<p
											className='mt-1 font-semibold'
											style={{ color: 'var(--color-text-primary)' }}
										>
											{formatCurrency(payment.amount)}
										</p>
										<p
											className='mt-1 text-sm'
											style={{ color: 'var(--color-text-secondary)' }}
										>
											{payment.venueName} В·{' '}
											{normalizeDateKey(date)}
										</p>
									</div>
									<StatusBadge
										label={getPaymentStatusLabel(
											payment.paymentStatus,
										)}
										bg={style.bg}
										color={style.color}
									/>
								</div>
							</li>
						)
					})}
				</ul>
			)}
		</div>
	)
}
