import type { ReactNode } from 'react'

type DashboardShellProps = {
	kicker: string
	title: string
	subtitle: string
	children: ReactNode
	actions?: ReactNode
}

export function DashboardShell({
	kicker,
	title,
	subtitle,
	children,
	actions,
}: DashboardShellProps) {
	return (
		<div className='mx-auto flex w-full max-w-7xl flex-col gap-6'>
			<header className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
				<div>
					<p className='section-kicker'>{kicker}</p>
					<h1 className='mt-2 text-3xl font-black leading-tight sm:text-5xl'>
						{title}
					</h1>
					<p className='mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base'>
						{subtitle}
					</p>
				</div>
				{actions ? <div className='shrink-0'>{actions}</div> : null}
			</header>
			{children}
		</div>
	)
}

type MetricCardProps = {
	label: string
	value: ReactNode
	helper?: string
	tone?: 'brand' | 'accent' | 'success' | 'warning'
}

const toneClass = {
	brand: 'bg-[var(--color-brand-light)] text-[var(--color-brand)]',
	accent: 'bg-[var(--color-accent-light)] text-[var(--color-accent)]',
	success: 'bg-[var(--color-available-light)] text-[var(--color-available)]',
	warning: 'bg-[var(--color-pending-light)] text-[var(--color-pending)]',
}

export function MetricCard({
	label,
	value,
	helper,
	tone = 'brand',
}: MetricCardProps) {
	return (
		<div className='product-card p-5'>
			<div className={`mb-5 h-2 w-16 rounded-full ${toneClass[tone]}`} />
			<p className='text-sm font-bold text-[var(--color-text-secondary)]'>
				{label}
			</p>
			<p className='mt-2 text-3xl font-black tabular-nums text-[var(--color-text-primary)]'>
				{value}
			</p>
			{helper ? (
				<p className='mt-2 text-xs text-[var(--color-text-hint)]'>{helper}</p>
			) : null}
		</div>
	)
}

type TimelineItem = {
	id: string | number
	title: string
	meta: string
	status?: string
}

export function Timeline({
	title,
	items,
	empty,
}: {
	title: string
	items: TimelineItem[]
	empty: string
}) {
	return (
		<section className='product-card p-5'>
			<h2 className='text-xl font-black'>{title}</h2>
			<div className='mt-5 flex flex-col gap-4'>
				{items.length === 0 ? (
					<p className='text-sm text-[var(--color-text-hint)]'>{empty}</p>
				) : (
					items.map(item => (
						<div key={item.id} className='grid grid-cols-[12px_1fr] gap-3'>
							<span className='mt-1 size-3 rounded-full bg-[var(--color-brand)]' />
							<div className='border-b border-[var(--color-border)] pb-4 last:border-b-0 last:pb-0'>
								<div className='flex flex-wrap items-center justify-between gap-2'>
									<p className='font-black'>{item.title}</p>
									{item.status ? (
										<span className='rounded-full bg-[var(--color-surface-secondary)] px-2.5 py-1 text-xs font-bold text-[var(--color-text-secondary)]'>
											{item.status}
										</span>
									) : null}
								</div>
								<p className='mt-1 text-sm text-[var(--color-text-secondary)]'>
									{item.meta}
								</p>
							</div>
						</div>
					))
				)}
			</div>
		</section>
	)
}

export function BarList({
	title,
	items,
}: {
	title: string
	items: Array<{ label: string; value: number; max: number }>
}) {
	return (
		<section className='product-card p-5'>
			<h2 className='text-xl font-black'>{title}</h2>
			<div className='mt-5 flex flex-col gap-4'>
				{items.map(item => {
					const width = item.max > 0 ? Math.max(8, (item.value / item.max) * 100) : 8
					return (
						<div key={item.label}>
							<div className='mb-2 flex justify-between gap-3 text-sm'>
								<span className='font-bold text-[var(--color-text-secondary)]'>
									{item.label}
								</span>
								<span className='font-black'>{item.value}</span>
							</div>
							<div className='h-3 overflow-hidden rounded-full bg-[var(--color-surface-secondary)]'>
								<div
									className='h-full rounded-full bg-[var(--color-brand)]'
									style={{ width: `${width}%` }}
								/>
							</div>
						</div>
					)
				})}
			</div>
		</section>
	)
}
