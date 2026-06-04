import { Search } from 'lucide-react'
import type { ReactNode } from 'react'

import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { DISTRICTS } from '@/constants/districts'
import type { District } from '@/stores/districtStore'
import type { VenueSortField } from '@/types/venue'

export type SortOption =
	| 'created_at:desc'
	| 'name:asc'
	| 'price_per_seat:asc'
	| 'price_per_seat:desc'
	| 'capacity:desc'

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
	{ value: 'created_at:desc', label: 'Eng yangi' },
	{ value: 'name:asc', label: 'Nomi (A–Z)' },
	{ value: 'price_per_seat:asc', label: 'Narxi: arzon' },
	{ value: 'price_per_seat:desc', label: 'Narxi: qimmat' },
	{ value: 'capacity:desc', label: 'Sig‘imi: katta' },
]

export function parseSortOption(
	value: SortOption,
): { sortBy: VenueSortField; sortOrder: 'asc' | 'desc' } {
	const [sortBy, sortOrder] = value.split(':') as [
		VenueSortField,
		'asc' | 'desc',
	]
	return { sortBy, sortOrder }
}

type VenueFiltersProps = {
	search: string
	onSearchChange: (value: string) => void
	district: District | null
	onDistrictChange: (district: District | null) => void
	capacity: string
	onCapacityChange: (value: string) => void
	minPrice: string
	onMinPriceChange: (value: string) => void
	maxPrice: string
	onMaxPriceChange: (value: string) => void
	sort: SortOption
	onSortChange: (value: SortOption) => void
	disabled?: boolean
	hideSearch?: boolean
}

export function VenueFilters({
	search,
	onSearchChange,
	district,
	onDistrictChange,
	capacity,
	onCapacityChange,
	minPrice,
	onMinPriceChange,
	maxPrice,
	onMaxPriceChange,
	sort,
	onSortChange,
	disabled = false,
	hideSearch = false,
}: VenueFiltersProps) {
	return (
		<div
			className='rounded-[var(--radius-lg)] border p-4 sm:p-5'
			style={{
				backgroundColor: 'var(--color-card-bg)',
				borderColor: 'var(--color-border)',
			}}
		>
			{!hideSearch && (
				<div className='relative mb-4'>
					<Search
						className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2'
						style={{ color: 'var(--color-text-hint)' }}
						aria-hidden
					/>
					<Input
						type='search'
						placeholder='Maskan nomi, tuman yoki manzil...'
						value={search}
						onChange={e => onSearchChange(e.target.value)}
						disabled={disabled}
						className='pl-10'
						aria-label='Qidiruv'
					/>
					<p
						className='mt-1.5 text-xs'
						style={{ color: 'var(--color-text-hint)' }}
					>
						Birinchi harf yoki to‘liq nom bo‘yicha qidirish
					</p>
				</div>
			)}

			<div
				className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${hideSearch ? 'lg:grid-cols-4' : 'lg:grid-cols-5'}`}
			>
				{!hideSearch && (
					<FilterField label='Tuman'>
						<Select
							value={district ?? ''}
							onChange={e =>
								onDistrictChange(
									e.target.value ? (e.target.value as District) : null,
								)
							}
							disabled={disabled}
							aria-label='Tuman filtri'
						>
							<option value=''>Barcha tumanlar</option>
							{DISTRICTS.map(d => (
								<option key={d} value={d}>
									{d}
								</option>
							))}
						</Select>
					</FilterField>
				)}

				<FilterField label='Minimal sig‘im'>
					<Input
						type='number'
						min={1}
						placeholder='Masalan: 50'
						value={capacity}
						onChange={e => onCapacityChange(e.target.value)}
						disabled={disabled}
						aria-label='Minimal sig‘im'
					/>
				</FilterField>

				<FilterField label='Minimal narx'>
					<Input
						type='number'
						min={0}
						placeholder='so‘m'
						value={minPrice}
						onChange={e => onMinPriceChange(e.target.value)}
						disabled={disabled}
						aria-label='Minimal narx'
					/>
				</FilterField>

				<FilterField label='Maksimal narx'>
					<Input
						type='number'
						min={0}
						placeholder='so‘m'
						value={maxPrice}
						onChange={e => onMaxPriceChange(e.target.value)}
						disabled={disabled}
						aria-label='Maksimal narx'
					/>
				</FilterField>

				<FilterField label='Saralash'>
					<Select
						value={sort}
						onChange={e => onSortChange(e.target.value as SortOption)}
						disabled={disabled}
						aria-label='Saralash'
					>
						{SORT_OPTIONS.map(option => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</Select>
				</FilterField>
			</div>
		</div>
	)
}

function FilterField({
	label,
	children,
}: {
	label: string
	children: ReactNode
}) {
	return (
		<div className='flex flex-col gap-1.5'>
			<span
				className='text-xs font-medium'
				style={{ color: 'var(--color-text-secondary)' }}
			>
				{label}
			</span>
			{children}
		</div>
	)
}
