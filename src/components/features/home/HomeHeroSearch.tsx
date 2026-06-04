import { Search } from 'lucide-react'
import type { FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { DISTRICTS } from '@/constants/districts'
import type { District } from '@/stores/districtStore'

type HomeHeroSearchProps = {
	search: string
	onSearchChange: (value: string) => void
	district: District | null
	onDistrictChange: (district: District | null) => void
	disabled?: boolean
	onSearchSubmit?: () => void
}

export function HomeHeroSearch({
	search,
	onSearchChange,
	district,
	onDistrictChange,
	disabled = false,
	onSearchSubmit,
}: HomeHeroSearchProps) {
	function handleSubmit(e: FormEvent) {
		e.preventDefault()
		onSearchSubmit?.()
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='product-panel mx-auto grid w-full max-w-4xl grid-cols-1 gap-3 p-3 text-left sm:grid-cols-[1fr_220px_auto] sm:items-end sm:gap-2'
			style={{ backgroundColor: 'rgb(255 255 255 / 0.94)' }}
		>
			<label className='flex min-w-0 flex-col gap-1'>
				<span className='px-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text-secondary)]'>
					Search venues
				</span>
				<div className='relative min-w-0'>
					<Search
						className='pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2'
						style={{ color: 'var(--color-text-hint)' }}
						aria-hidden
					/>
					<Input
						type='search'
						placeholder='Venue name, address, district...'
						value={search}
						onChange={e => onSearchChange(e.target.value)}
						disabled={disabled}
						className='py-3 pl-11 text-base'
						aria-label='Search'
					/>
				</div>
			</label>

			<label className='flex min-w-0 flex-col gap-1'>
				<span className='px-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text-secondary)]'>
					District
				</span>
				<Select
					value={district ?? ''}
					onChange={e =>
						onDistrictChange(
							e.target.value ? (e.target.value as District) : null,
						)
					}
					disabled={disabled}
					className='py-3 text-base'
					aria-label='District'
				>
					<option value=''>All districts</option>
					{DISTRICTS.map(d => (
						<option key={d} value={d}>
							{d}
						</option>
					))}
				</Select>
			</label>

			<Button
				type='submit'
				disabled={disabled}
				className='h-[50px] shrink-0 px-7 text-base sm:w-auto'
			>
				Search
			</Button>
		</form>
	)
}
