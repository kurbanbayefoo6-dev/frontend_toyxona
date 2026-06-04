import { Search } from 'lucide-react'

import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

type AdminToolbarProps = {
	search: string
	onSearchChange: (value: string) => void
	searchPlaceholder?: string
	children?: React.ReactNode
}

export function AdminToolbar({
	search,
	onSearchChange,
	searchPlaceholder = 'Qidirish...',
	children,
}: AdminToolbarProps) {
	return (
		<div className='mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
			<div className='relative min-w-0 flex-1 sm:max-w-xs'>
				<Search
					className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2'
					style={{ color: 'var(--color-text-hint)' }}
				/>
				<Input
					value={search}
					onChange={e => onSearchChange(e.target.value)}
					placeholder={searchPlaceholder}
					className='pl-9'
				/>
			</div>
			{children}
		</div>
	)
}

export function FilterSelect({
	label,
	value,
	onChange,
	options,
}: {
	label: string
	value: string
	onChange: (value: string) => void
	options: Array<{ value: string; label: string }>
}) {
	return (
		<label className='flex flex-col gap-1 text-sm sm:min-w-[140px]'>
			<span style={{ color: 'var(--color-text-hint)' }}>{label}</span>
			<Select value={value} onChange={e => onChange(e.target.value)}>
				{options.map(o => (
					<option key={o.value} value={o.value}>
						{o.label}
					</option>
				))}
			</Select>
		</label>
	)
}
