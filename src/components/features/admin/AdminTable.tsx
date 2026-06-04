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
			<div
				className='rounded-[var(--radius-lg)] border px-6 py-12 text-center text-sm'
				style={{
					backgroundColor: 'var(--color-card-bg)',
					borderColor: 'var(--color-border)',
					color: 'var(--color-text-secondary)',
				}}
			>
				{emptyMessage}
			</div>
		)
	}

	return (
		<>
			<div
				className='hidden overflow-x-auto rounded-[var(--radius-lg)] border md:block'
				style={{
					backgroundColor: 'var(--color-card-bg)',
					borderColor: 'var(--color-border)',
				}}
			>
				<table className='w-full min-w-[640px] text-left text-sm'>
					<thead>
						<tr
							className='border-b text-xs uppercase'
							style={{
								borderColor: 'var(--color-border)',
								color: 'var(--color-text-hint)',
								backgroundColor: 'var(--color-surface-secondary)',
							}}
						>
							{headers.map(h => (
								<th key={h} className='px-4 py-3 font-medium'>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{rows.map(row => (
							<tr
								key={row.key}
								className='border-b even:bg-[var(--color-surface-secondary)]/50 last:border-0'
								style={{ borderColor: 'var(--color-border)' }}
							>
								{row.cells.map((cell, i) => (
									<td key={i} className='px-4 py-3 align-middle'>
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
					<div
						key={row.key}
						className='rounded-[var(--radius-lg)] border p-4'
						style={{
							backgroundColor: 'var(--color-card-bg)',
							borderColor: 'var(--color-border)',
						}}
					>
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
					className='animate-pulse rounded-[var(--radius-md)] border p-4'
					style={{
						backgroundColor: 'var(--color-card-bg)',
						borderColor: 'var(--color-border)',
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
