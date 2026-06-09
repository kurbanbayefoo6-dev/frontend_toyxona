import { useState } from 'react'

import {
	AdminTable,
	AdminTableSkeleton,
	AdminToolbar,
} from '@/components/features/admin'
import { StatusBadge } from '@/components/features/customer'
import { VenueListError } from '@/components/features/venues'
import { Pagination } from '@/components/ui/Pagination'
import { useAdminPayments } from '@/hooks/useAdminPayments'
import { useDebounce } from '@/hooks/useDebounce'
import { getApiErrorMessage } from '@/utils/authErrors'
import {
	getPaymentStatusLabel,
	getPaymentStatusStyle,
	normalizeDateKey,
} from '@/utils/customerStatus'
import { formatCurrency } from '@/utils/formatCurrency'

const PAGE_SIZE = 10

export default function AdminPaymentsPage() {
	const [search, setSearch] = useState('')
	const [page, setPage] = useState(1)
	const debouncedSearch = useDebounce(search.trim())

	const { data, isLoading, isError, error, refetch, isFetching } =
		useAdminPayments(page, PAGE_SIZE, debouncedSearch || undefined)

	const payments = data?.items ?? []

	const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE))

	if (isLoading) {
		return (
			<div>
				<h1 className='mb-6 text-2xl font-semibold'>ToвЂlovlar</h1>
				<AdminTableSkeleton />
			</div>
		)
	}

	if (isError) {
		return (
			<div>
				<h1 className='mb-6 text-2xl font-semibold'>ToвЂlovlar</h1>
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
				ToвЂlovlar
			</h1>

			<AdminToolbar
				search={search}
				onSearchChange={v => {
					setSearch(v)
					setPage(1)
				}}
				searchPlaceholder='Tranzaksiya, To‘yxona yoki mijoz...'
			/>

			<AdminTable
				headers={[
					'Tranzaksiya',
					'Summa',
					'Bandlov',
					'Mijoz',
					'Sana',
					'Holat',
				]}
				rows={payments.map(p => {
					const style = getPaymentStatusStyle(p.paymentStatus)
					const date = p.paidAt ?? p.createdAt
					return {
						key: p.id,
						cells: [
							<span key='tx' className='font-mono text-xs'>
								{p.transactionId}
							</span>,
							formatCurrency(p.amount),
							p.venueName,
							p.customerName,
							normalizeDateKey(date),
							<StatusBadge
								key='st'
								label={getPaymentStatusLabel(p.paymentStatus)}
								bg={style.bg}
								color={style.color}
							/>,
						],
						mobile: (
							<div className='space-y-1 text-sm'>
								<p className='font-mono text-xs'>{p.transactionId}</p>
								<p className='font-semibold'>{formatCurrency(p.amount)}</p>
								<p>
									{p.venueName} В· {p.customerName}
								</p>
								<p>{normalizeDateKey(date)}</p>
								<StatusBadge
									label={getPaymentStatusLabel(p.paymentStatus)}
									bg={style.bg}
									color={style.color}
								/>
							</div>
						),
					}
				})}
				emptyMessage='ToвЂlovlar topilmadi'
			/>

			<div className='mt-6'>
				<Pagination
					page={page}
					totalPages={totalPages}
					onPageChange={setPage}
					disabled={isFetching}
				/>
			</div>
		</div>
	)
}
