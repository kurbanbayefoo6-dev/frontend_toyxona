import { useMemo, useState } from 'react'

import {
	AdminTable,
	AdminTableSkeleton,
	AdminToolbar,
	FilterSelect,
} from '@/components/features/admin'
import { StatusBadge } from '@/components/features/customer'
import { VenueListError } from '@/components/features/venues'
import { Pagination } from '@/components/ui/Pagination'
import { useAdminUsers } from '@/hooks/useAdminUsers'
import { useDebounce } from '@/hooks/useDebounce'
import type { AdminUser } from '@/types/admin'
import { getApiErrorMessage } from '@/utils/authErrors'
import { getUserRoleLabel, getUserStatusLabel } from '@/utils/adminLabels'

const PAGE_SIZE = 10

export default function AdminUsersPage() {
	const [search, setSearch] = useState('')
	const [roleFilter, setRoleFilter] = useState('')
	const [page, setPage] = useState(1)
	const debouncedSearch = useDebounce(search.trim())

	const params = useMemo(
		() => ({
			search: debouncedSearch || undefined,
			page,
			limit: PAGE_SIZE,
		}),
		[debouncedSearch, page],
	)

	const { data, isLoading, isError, error, refetch, isFetching } =
		useAdminUsers(params)

	const users = useMemo(() => {
		const items = data?.items ?? []
		if (!roleFilter) return items
		return items.filter(u => u.role === roleFilter)
	}, [data?.items, roleFilter])

	const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE))

	if (isLoading) {
		return (
			<div>
				<h1 className='mb-6 text-2xl font-semibold'>Foydalanuvchilar</h1>
				<AdminTableSkeleton />
			</div>
		)
	}

	if (isError) {
		return (
			<div>
				<h1 className='mb-6 text-2xl font-semibold'>Foydalanuvchilar</h1>
				<VenueListError
					message={getApiErrorMessage(error, 'Foydalanuvchilar yuklanmadi')}
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
				Foydalanuvchilar
			</h1>

			<AdminToolbar
				search={search}
				onSearchChange={v => {
					setSearch(v)
					setPage(1)
				}}
				searchPlaceholder='Ism, email yoki login...'
			>
				<FilterSelect
					label='Rol'
					value={roleFilter}
					onChange={v => {
						setRoleFilter(v)
						setPage(1)
					}}
					options={[
						{ value: '', label: 'Barchasi' },
						{ value: 'customer', label: 'Mijoz' },
						{ value: 'owner', label: 'Sahib' },
						{ value: 'admin', label: 'Boshqaruvchi' },
					]}
				/>
			</AdminToolbar>

			<AdminTable
				headers={['Ism', 'Elektron pochta', 'Telefon', 'Rol', 'Holat']}
				rows={users.map(user => buildUserRow(user))}
				emptyMessage='Foydalanuvchilar topilmadi'
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

function buildUserRow(user: AdminUser) {
	const name = `${user.firstName} ${user.lastName}`.trim() || user.username
	const verified = user.isVerified
	return {
		key: user.id,
		cells: [
			name,
			user.email,
			user.phone || '—',
			getUserRoleLabel(user.role),
			<StatusBadge
				key='status'
				label={getUserStatusLabel(verified)}
				bg={
					verified
						? 'var(--color-available-light)'
						: 'var(--color-pending-light)'
				}
				color={
					verified ? 'var(--color-available)' : 'var(--color-pending)'
				}
			/>,
		],
		mobile: (
			<div className='space-y-1 text-sm'>
				<p className='font-semibold'>{name}</p>
				<p>{user.email}</p>
				<p>{user.phone || '—'}</p>
				<p>
					{getUserRoleLabel(user.role)} · {getUserStatusLabel(verified)}
				</p>
			</div>
		),
	}
}
