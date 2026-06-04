import { useMemo, useState } from 'react'

import {
	AdminTable,
	AdminTableSkeleton,
	AdminToolbar,
	CreateOwnerModal,
} from '@/components/features/admin'
import { VenueListError } from '@/components/features/venues'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { useAdminOwners } from '@/hooks/useAdminOwners'
import { useAdminVenues } from '@/hooks/useAdminVenues'
import { useDebounce } from '@/hooks/useDebounce'
import { getApiErrorMessage } from '@/utils/authErrors'

const PAGE_SIZE = 10

export default function AdminOwnersPage() {
	const [search, setSearch] = useState('')
	const [page, setPage] = useState(1)
	const [createOpen, setCreateOpen] = useState(false)
	const debouncedSearch = useDebounce(search.trim())

	const ownersQuery = useAdminOwners({
		search: debouncedSearch || undefined,
		page,
		limit: PAGE_SIZE,
	})

	const venuesQuery = useAdminVenues({ page: 1, limit: 500 })

	const venueCountByOwner = useMemo(() => {
		const map = new Map<number, number>()
		venuesQuery.data?.items.forEach(v => {
			map.set(v.ownerId, (map.get(v.ownerId) ?? 0) + 1)
		})
		return map
	}, [venuesQuery.data])

	const isLoading = ownersQuery.isLoading
	const isError = ownersQuery.isError
	const owners = ownersQuery.data?.items ?? []
	const totalPages = Math.max(
		1,
		Math.ceil((ownersQuery.data?.total ?? 0) / PAGE_SIZE),
	)

	if (isLoading) {
		return (
			<div>
				<h1 className='mb-6 text-2xl font-semibold'>Egalar</h1>
				<AdminTableSkeleton />
			</div>
		)
	}

	if (isError) {
		return (
			<div>
				<h1 className='mb-6 text-2xl font-semibold'>Egalar</h1>
				<VenueListError
					message={getApiErrorMessage(
						ownersQuery.error,
						'Egalar yuklanmadi',
					)}
					onRetry={() => void ownersQuery.refetch()}
					isRetrying={ownersQuery.isFetching}
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
					Egalar
				</h1>
				<Button
					type='button'
					className='!w-auto px-4'
					onClick={() => setCreateOpen(true)}
				>
					Yangi ega qo‘shish
				</Button>
			</div>

			<AdminToolbar
				search={search}
				onSearchChange={v => {
					setSearch(v)
					setPage(1)
				}}
				searchPlaceholder='Ism, email yoki login...'
			/>

			<AdminTable
				headers={['Ega', 'Maskanlar', 'Telefon', 'Elektron pochta']}
				rows={owners.map(owner => {
					const name =
						`${owner.firstName} ${owner.lastName}`.trim() ||
						owner.username
					const count = venueCountByOwner.get(owner.id) ?? 0
					return {
						key: owner.id,
						cells: [name, count, owner.phone || '—', owner.email],
						mobile: (
							<div className='space-y-1 text-sm'>
								<p className='font-semibold'>{name}</p>
								<p>Maskanlar: {count}</p>
								<p>{owner.phone || '—'}</p>
								<p>{owner.email}</p>
							</div>
						),
					}
				})}
				emptyMessage='Egalar topilmadi'
			/>

			<div className='mt-6'>
				<Pagination
					page={page}
					totalPages={totalPages}
					onPageChange={setPage}
					disabled={ownersQuery.isFetching}
				/>
			</div>

			<CreateOwnerModal
				open={createOpen}
				onClose={() => setCreateOpen(false)}
				onCreated={() => void ownersQuery.refetch()}
			/>
		</div>
	)
}
