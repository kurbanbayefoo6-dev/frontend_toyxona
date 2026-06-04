import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import {
	AdminTable,
	AdminTableSkeleton,
	AdminToolbar,
	FilterSelect,
} from '@/components/features/admin'
import { VenueStatusBadge } from '@/components/features/owner'
import { VenueListError } from '@/components/features/venues'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { useAdminVenues } from '@/hooks/useAdminVenues'
import { useDebounce } from '@/hooks/useDebounce'
import { updateVenueStatus } from '@/services/admin.service'
import { apiClient } from '@/services/apiClient'
import type { ApiSuccessResponse } from '@/types/api'
import type { AdminVenue } from '@/types/admin'
import type { VenueStatus } from '@/types/venue'
import { toast } from '@/stores/toastStore'
import { getApiErrorMessage } from '@/utils/authErrors'
import { resolveImageUrl } from '@/utils/imageUrl'

const PAGE_SIZE = 10

async function fetchCoverImage(venueId: number): Promise<string | null> {
	try {
		const res = await apiClient.get<
			ApiSuccessResponse<Array<{ id: number; imageUrl: string }>>
		>(`/api/venues/${venueId}/images`)
		return res.data.data?.[0]?.imageUrl ?? null
	} catch {
		return null
	}
}

export default function AdminVenuesPage() {
	const queryClient = useQueryClient()
	const [search, setSearch] = useState('')
	const [statusFilter, setStatusFilter] = useState('')
	const [page, setPage] = useState(1)
	const debouncedSearch = useDebounce(search.trim())

	const { data, isLoading, isError, error, refetch, isFetching } =
		useAdminVenues({
			search: debouncedSearch || undefined,
			status: statusFilter || undefined,
			page,
			limit: PAGE_SIZE,
		})

	const [imageMap, setImageMap] = useState<Record<number, string | null>>({})

	useEffect(() => {
		if (!data?.items.length) return
		let cancelled = false
		data.items.forEach(venue => {
			void fetchCoverImage(venue.id).then(url => {
				if (!cancelled) {
					setImageMap(prev => {
						if (prev[venue.id] !== undefined) return prev
						return { ...prev, [venue.id]: url }
					})
				}
			})
		})
		return () => {
			cancelled = true
		}
	}, [data?.items])

	const statusMutation = useMutation({
		mutationFn: ({
			venueId,
			status,
		}: {
			venueId: number
			status: Exclude<VenueStatus, 'pending'>
		}) => updateVenueStatus(venueId, status),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['admin', 'venues'] })
			void queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
			toast.success('Maskan holati yangilandi')
		},
		onError: err => {
			toast.error(getApiErrorMessage(err, 'Server bilan bog‘lanib bo‘lmadi'))
		},
	})

	const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE))
	const venues = data?.items ?? []

	if (isLoading) {
		return (
			<div>
				<h1 className='mb-6 text-2xl font-semibold'>Maskanlar</h1>
				<AdminTableSkeleton />
			</div>
		)
	}

	if (isError) {
		return (
			<div>
				<h1 className='mb-6 text-2xl font-semibold'>Maskanlar</h1>
				<VenueListError
					message={getApiErrorMessage(error, 'Maskanlar yuklanmadi')}
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
				Maskanlar
			</h1>

			<AdminToolbar
				search={search}
				onSearchChange={v => {
					setSearch(v)
					setPage(1)
				}}
				searchPlaceholder='Maskan nomi yoki tuman...'
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
						{ value: 'pending', label: 'Tasdiqlanmagan' },
						{ value: 'approved', label: 'Tasdiqlangan' },
						{ value: 'rejected', label: 'Rad etilgan' },
					]}
				/>
			</AdminToolbar>

			<AdminTable
				headers={['Rasm', 'Maskan', 'Tuman', 'Sig‘im', 'Holat', 'Amallar']}
				rows={venues.map(venue => buildVenueRow(venue, imageMap, statusMutation))}
				emptyMessage='Maskanlar topilmadi'
			/>

			<div className='mt-6'>
				<Pagination
					page={page}
					totalPages={totalPages}
					onPageChange={setPage}
					disabled={isFetching || statusMutation.isPending}
				/>
			</div>
		</div>
	)
}

function buildVenueRow(
	venue: AdminVenue,
	imageMap: Record<number, string | null>,
	statusMutation: {
		isPending: boolean
		mutate: (vars: {
			venueId: number
			status: Exclude<VenueStatus, 'pending'>
		}) => void
	},
) {
	const imgUrl = resolveImageUrl(imageMap[venue.id] ?? null)
	const canApprove = venue.status === 'pending'
	const canReject = venue.status === 'pending' || venue.status === 'approved'

	return {
		key: venue.id,
		cells: [
			<div
				key='img'
				className='size-12 overflow-hidden rounded-[var(--radius-sm)] border'
				style={{
					borderColor: 'var(--color-border)',
					backgroundColor: 'var(--color-surface-secondary)',
				}}
			>
				{imgUrl ? (
					<img src={imgUrl} alt='' className='size-full object-cover' />
				) : (
					<span
						className='flex size-full items-center justify-center text-xs'
						style={{ color: 'var(--color-text-hint)' }}
					>
						—
					</span>
				)}
			</div>,
			venue.name,
			venue.district,
			`${venue.capacity} kishi`,
			<VenueStatusBadge key='status' status={venue.status} />,
			<div key='actions' className='flex flex-wrap gap-2'>
				{canApprove && (
					<Button
						type='button'
						variant='secondary'
						className='!w-auto px-3 text-xs'
						disabled={statusMutation.isPending}
						onClick={() =>
							statusMutation.mutate({
								venueId: venue.id,
								status: 'approved',
							})
						}
					>
						Tasdiqlash
					</Button>
				)}
				{canReject && (
					<Button
						type='button'
						variant='ghost'
						className='!w-auto px-3 text-xs'
						disabled={statusMutation.isPending}
						onClick={() =>
							statusMutation.mutate({
								venueId: venue.id,
								status: 'rejected',
							})
						}
					>
						Rad etish
					</Button>
				)}
			</div>,
		],
		mobile: (
			<div className='space-y-3'>
				<div className='flex gap-3'>
					{imgUrl ? (
						<img
							src={imgUrl}
							alt=''
							className='size-14 rounded-[var(--radius-sm)] object-cover'
						/>
					) : null}
					<div>
						<p className='font-semibold'>{venue.name}</p>
						<p className='text-sm'>{venue.district}</p>
						<p className='text-sm'>{venue.capacity} kishi</p>
						<VenueStatusBadge status={venue.status} />
					</div>
				</div>
				<div className='flex gap-2'>
					{canApprove && (
						<Button
							type='button'
							variant='secondary'
							className='flex-1 text-xs'
							disabled={statusMutation.isPending}
							onClick={() =>
								statusMutation.mutate({
									venueId: venue.id,
									status: 'approved',
								})
							}
						>
							Tasdiqlash
						</Button>
					)}
					{canReject && (
						<Button
							type='button'
							variant='ghost'
							className='flex-1 text-xs'
							disabled={statusMutation.isPending}
							onClick={() =>
								statusMutation.mutate({
									venueId: venue.id,
									status: 'rejected',
								})
							}
						>
							Rad etish
						</Button>
					)}
				</div>
			</div>
		),
	}
}
