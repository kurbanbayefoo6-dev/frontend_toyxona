import { SlidersHorizontal, Search } from 'lucide-react'
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
	{ value: 'created_at:desc', label: 'Newest' },
	{ value: 'name:asc', label: 'Name A-Z' },
	{ value: 'price_per_seat:asc', label: 'Price low first' },
	{ value: 'price_per_seat:desc', label: 'Price high first' },
	{ value: 'capacity:desc', label: 'Largest capacity' },
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
		<div className='product-card p-4 sm:p-5'>
			<div className='mb-4 flex items-center justify-between gap-3'>
				<div>
					<p className='text-sm font-black'>Filters</p>
					<p className='text-xs text-[var(--color-text-secondary)]'>
						Refine by location, size, and budget
					</p>
				</div>
				<span className='flex size-10 items-center justify-center rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand)]'>
					<SlidersHorizontal className='size-4' />
				</span>
			</div>

			<div className='grid grid-cols-1 gap-3'>
				{!hideSearch && (
					<FilterField label='Search'>
						<div className='relative'>
							<Search
								className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-hint)]'
								aria-hidden
							/>
							<Input
								type='search'
								placeholder='Name, address, district...'
								value={search}
								onChange={e => onSearchChange(e.target.value)}
								disabled={disabled}
								className='pl-10'
								aria-label='Search'
							/>
						</div>
					</FilterField>
				)}

				<FilterField label='District'>
					<Select
						value={district ?? ''}
						onChange={e =>
							onDistrictChange(
								e.target.value ? (e.target.value as District) : null,
							)
						}
						disabled={disabled}
						aria-label='District filter'
					>
						<option value=''>All districts</option>
						{DISTRICTS.map(d => (
							<option key={d} value={d}>
								{d}
							</option>
						))}
					</Select>
				</FilterField>

				<FilterField label='Minimum capacity'>
					<Input
						type='number'
						min={1}
						placeholder='Example: 150'
						value={capacity}
						onChange={e => onCapacityChange(e.target.value)}
						disabled={disabled}
						aria-label='Minimum capacity'
					/>
				</FilterField>

				<div className='grid grid-cols-2 gap-3'>
					<FilterField label='Min price'>
						<Input
							type='number'
							min={0}
							placeholder='sum'
							value={minPrice}
							onChange={e => onMinPriceChange(e.target.value)}
							disabled={disabled}
							aria-label='Minimum price'
						/>
					</FilterField>

					<FilterField label='Max price'>
						<Input
							type='number'
							min={0}
							placeholder='sum'
							value={maxPrice}
							onChange={e => onMaxPriceChange(e.target.value)}
							disabled={disabled}
							aria-label='Maximum price'
						/>
					</FilterField>
				</div>

				<FilterField label='Sort'>
					<Select
						value={sort}
						onChange={e => onSortChange(e.target.value as SortOption)}
						disabled={disabled}
						aria-label='Sort'
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
		<label className='flex flex-col gap-1.5'>
			<span className='text-xs font-bold uppercase tracking-wide text-[var(--color-text-secondary)]'>
				{label}
			</span>
			{children}
		</label>
	)
}
