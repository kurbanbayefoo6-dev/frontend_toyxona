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
			className='mx-auto flex w-full max-w-[700px] flex-col gap-2 rounded-[var(--radius-lg)] border p-2 sm:flex-row sm:items-stretch sm:gap-0 sm:p-2'
			style={{
				backgroundColor: 'var(--color-card-bg)',
				borderColor: 'var(--color-border)',
			}}
		>
			<div className='relative min-w-0 flex-1'>
				<Search
					className='pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2'
					style={{ color: 'var(--color-text-hint)' }}
					aria-hidden
				/>
				<Input
					type='search'
					placeholder='Maskan nomi yoki manzil...'
					value={search}
					onChange={e => onSearchChange(e.target.value)}
					disabled={disabled}
					className='border-0 py-3 pl-11 text-base focus:ring-0 sm:rounded-r-none'
					aria-label='Qidiruv'
				/>
			</div>

			<div
				className='hidden w-px sm:block'
				style={{ backgroundColor: 'var(--color-border)' }}
				aria-hidden
			/>

			<Select
				value={district ?? ''}
				onChange={e =>
					onDistrictChange(
						e.target.value ? (e.target.value as District) : null,
					)
				}
				disabled={disabled}
				className='border-0 py-3 text-base focus:ring-0 sm:max-w-[200px] sm:rounded-none'
				aria-label='Tuman'
			>
				<option value=''>Barcha tumanlar</option>
				{DISTRICTS.map(d => (
					<option key={d} value={d}>
						{d}
					</option>
				))}
			</Select>

			<Button
				type='submit'
				disabled={disabled}
				className='shrink-0 px-6 py-3 text-base sm:w-auto sm:min-w-[120px] sm:rounded-l-none'
			>
				Qidirish
			</Button>
		</form>
	)
}
