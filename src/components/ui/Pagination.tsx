import { Button } from '@/components/ui/Button'

type PaginationProps = {
	page: number
	totalPages: number
	onPageChange: (page: number) => void
	disabled?: boolean
}

export function Pagination({
	page,
	totalPages,
	onPageChange,
	disabled = false,
}: PaginationProps) {
	if (totalPages <= 1) return null

	const pages = buildPageNumbers(page, totalPages)

	return (
		<nav
			className='flex flex-wrap items-center justify-center gap-2'
			aria-label='Sahifalar'
		>
			<Button
				type='button'
				variant='secondary'
				className='!w-auto px-3'
				disabled={disabled || page <= 1}
				onClick={() => onPageChange(page - 1)}
			>
				Oldingi
			</Button>

			{pages.map((item, index) =>
				item === '...' ? (
					<span
						key={`ellipsis-${index}`}
						className='px-2 text-sm'
						style={{ color: 'var(--color-text-hint)' }}
					>
						вЂ¦
					</span>
				) : (
					<Button
						key={item}
						type='button'
						variant={item === page ? 'primary' : 'secondary'}
						className='!w-auto min-w-9 px-3'
						disabled={disabled}
						onClick={() => onPageChange(item)}
					>
						{item}
					</Button>
				),
			)}

			<Button
				type='button'
				variant='secondary'
				className='!w-auto px-3'
				disabled={disabled || page >= totalPages}
				onClick={() => onPageChange(page + 1)}
			>
				Keyingi
			</Button>
		</nav>
	)
}

function buildPageNumbers(
	current: number,
	total: number,
): Array<number | '...'> {
	if (total <= 7) {
		return Array.from({ length: total }, (_, i) => i + 1)
	}

	const pages: Array<number | '...'> = [1]
	if (current > 3) pages.push('...')

	const start = Math.max(2, current - 1)
	const end = Math.min(total - 1, current + 1)
	for (let i = start; i <= end; i += 1) pages.push(i)

	if (current < total - 2) pages.push('...')
	pages.push(total)

	return pages
}
