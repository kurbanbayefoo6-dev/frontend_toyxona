import type { ReactNode } from 'react'

export type AdminTableRowData = {
	key: string | number
	cells: ReactNode[]
	mobile: ReactNode
}

type AdminTableProps = {
	headers: string[]
	rows: AdminTableRowData[]
	emptyMessage?: string
}

export function AdminTable({
	headers,
	rows,
	emptyMessage = 'Ma’lumot topilmadi',
}: AdminTableProps) {
	if (rows.length === 0) {
		return (
			<div className='product-card px-6 py-12 text-center text-sm text-[var(--color-text-secondary)]'>
				{emptyMessage}
			</div>
		)
	}

	return (
		<>
			<div className='product-card hidden overflow-x-auto md:block'>
				<table className='w-full min-w-[640px] text-left text-sm'>
					<thead>
						<tr
							className='border-b text-xs uppercase tracking-wide'
							style={{
								borderColor: 'var(--color-border)',
								color: 'var(--color-text-secondary)',
								backgroundColor: 'var(--color-surface-elevated)',
							}}
						>
							{headers.map(h => (
								<th key={h} className='px-5 py-4 font-black'>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{rows.map(row => (
							<tr
								key={row.key}
								className='border-b transition-colors last:border-0 hover:bg-[var(--color-surface-secondary)]'
								style={{ borderColor: 'var(--color-border)' }}
							>
								{row.cells.map((cell, i) => (
									<td key={i} className='px-5 py-4 align-middle'>
										{cell}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className='flex flex-col gap-3 md:hidden'>
				{rows.map(row => (
					<div key={row.key} className='product-card p-4'>
						{row.mobile}
					</div>
				))}
			</div>
		</>
	)
}

export function AdminTableSkeleton({
	rows = 5,
}: {
	rows?: number
}) {
	return (
		<div className='flex flex-col gap-2'>
			{Array.from({ length: rows }).map((_, i) => (
				<div
					key={i}
					className='product-card animate-pulse p-4'
					style={{
					}}
				>
					<div
						className='h-4 rounded-[var(--radius-sm)]'
						style={{
							width: `${60 + (i % 3) * 10}%`,
							backgroundColor: 'var(--color-surface-secondary)',
						}}
					/>
				</div>
			))}
		</div>
	)
}
