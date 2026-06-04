import { useMemo, useState } from 'react'

import {
	AdminTable,
	AdminTableSkeleton,
	AdminToolbar,
	FilterSelect,
} from '@/components/features/admin'
import { StatusBadge } from '@/components/features/customer'
import { VenueListError } from '@/components/features/venues'
import { Input } from '@/components/ui/Input'
import { Pagination } from '@/components/ui/Pagination'
import { DISTRICTS } from '@/constants/districts'
import { useAdminBookings } from '@/hooks/useAdminBookings'
import { useAdminUsers } from '@/hooks/useAdminUsers'
import { useAdminVenues } from '@/hooks/useAdminVenues'
import { useDebounce } from '@/hooks/useDebounce'
import type { AdminBooking } from '@/types/admin'
import { getApiErrorMessage } from '@/utils/authErrors'
import {
	getBookingDisplayStatus,
	getBookingStatusLabel,
	getBookingStatusStyle,
	normalizeDateKey,
} from '@/utils/customerStatus'

const PAGE_SIZE = 10

export default function AdminBookingsPage() {
	const [search, setSearch] = useState('')
	const [statusFilter, setStatusFilter] = useState('')
	const [districtFilter, setDistrictFilter] = useState('')
	const [dateFilter, setDateFilter] = useState('')
	const [page, setPage] = useState(1)
	const debouncedSearch = useDebounce(search.trim())

	const { data, isLoading, isError, error, refetch, isFetching } =
		useAdminBookings({
			search: debouncedSearch || undefined,
			status: statusFilter || undefined,
			page: 1,
			limit: 200,
		})

	const venuesQuery = useAdminVenues({ page: 1, limit: 500 })
	const usersQuery = useAdminUsers({ page: 1, limit: 500 })

	const districtByVenueId = useMemo(() => {
		const map = new Map<number, string>()
		venuesQuery.data?.items.forEach(v => map.set(v.id, v.district))
		return map
	}, [venuesQuery.data])

	const phoneByCustomerId = useMemo(() => {
		const map = new Map<number, string>()
		usersQuery.data?.items.forEach(u => {
			if (u.phone) map.set(u.id, u.phone)
		})
		return map
	}, [usersQuery.data])

	const filtered = useMemo(() => {
		let items = (data?.items ?? []).map(b => ({
			...b,
			district: districtByVenueId.get(b.venueId) ?? '',
			customerPhone: phoneByCustomerId.get(b.customerId) ?? '—',
		}))
		if (districtFilter) {
			items = items.filter(b => b.district === districtFilter)
		}
		if (dateFilter) {
			items = items.filter(
				b => normalizeDateKey(b.bookingDate) === dateFilter,
			)
		}
		return items
	}, [data?.items, districtFilter, dateFilter, districtByVenueId, phoneByCustomerId])

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
	const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
	const paidIds = useMemo(() => new Set<number>(), [])

	if (isLoading) {
		return (
			<div>
				<h1 className='mb-6 text-2xl font-semibold'>Bandlovlar</h1>
				<AdminTableSkeleton />
			</div>
		)
	}

	if (isError) {
		return (
			<div>
				<h1 className='mb-6 text-2xl font-semibold'>Bandlovlar</h1>
				<VenueListError
					message={getApiErrorMessage(error, 'Bandlovlar yuklanmadi')}
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
				Bandlovlar
			</h1>

			<AdminToolbar
				search={search}
				onSearchChange={v => {
					setSearch(v)
					setPage(1)
				}}
				searchPlaceholder='Maskan yoki mijoz...'
			>
				<FilterSelect
					label='Holat'
					value={statusFilter}
					onChange={v => {
						setStatusFilter(v)
						setPage(1)
					}}
					options={[
						{ value: '', label: 'Barchasi' },
						{ value: 'upcoming', label: 'Kelajakdagi' },
						{ value: 'completed', label: 'Yakunlangan' },
						{ value: 'cancelled', label: 'Bekor qilingan' },
					]}
				/>
				<FilterSelect
					label='Tuman'
					value={districtFilter}
					onChange={v => {
						setDistrictFilter(v)
						setPage(1)
					}}
					options={[
						{ value: '', label: 'Barchasi' },
						...DISTRICTS.map(d => ({ value: d, label: d })),
					]}
				/>
				<label className='flex flex-col gap-1 text-sm'>
					<span style={{ color: 'var(--color-text-hint)' }}>Sana</span>
					<Input
						type='date'
						value={dateFilter}
						onChange={e => {
							setDateFilter(e.target.value)
							setPage(1)
						}}
					/>
				</label>
			</AdminToolbar>

			<AdminTable
				headers={[
					'Maskan',
					'Mijoz',
					'Telefon',
					'Mehmon',
					'Sana',
					'Holat',
				]}
				rows={pageItems.map(b => buildBookingRow(b, paidIds))}
				emptyMessage='Bandlovlar topilmadi'
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

function buildBookingRow(
	booking: AdminBooking & { district: string; customerPhone: string },
	paidIds: Set<number>,
) {
	const displayStatus = getBookingDisplayStatus(booking, paidIds)
	const style = getBookingStatusStyle(displayStatus)

	return {
		key: booking.id,
		cells: [
			booking.venueName,
			booking.customerName,
			booking.customerPhone,
			booking.guestCount,
			normalizeDateKey(booking.bookingDate),
			<StatusBadge
				key='st'
				label={getBookingStatusLabel(displayStatus)}
				bg={style.bg}
				color={style.color}
			/>,
		],
		mobile: (
			<div className='space-y-1 text-sm'>
				<p className='font-semibold'>{booking.venueName}</p>
				<p>{booking.customerName}</p>
				<p>{booking.customerPhone}</p>
				<p>
					{booking.guestCount} mehmon ·{' '}
					{normalizeDateKey(booking.bookingDate)}
				</p>
				<StatusBadge
					label={getBookingStatusLabel(displayStatus)}
					bg={style.bg}
					color={style.color}
				/>
			</div>
		),
	}
}
