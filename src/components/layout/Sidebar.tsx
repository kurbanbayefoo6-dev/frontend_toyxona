import { NavLink } from 'react-router-dom'

type SidebarLink = {
	to: string
	label: string
}

type SidebarProps = {
	links: SidebarLink[]
}

export function Sidebar({ links }: SidebarProps) {
	return (
		<aside
			className='sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r'
			style={{
				backgroundColor: 'var(--color-surface-elevated)',
				borderColor: 'var(--color-border)',
			}}
		>
			<div className='px-5 pb-3 pt-6'>
				<p className='section-kicker'>Ish maydoni</p>
				<p className='mt-1 text-lg font-black'>Toyxona</p>
			</div>
			<nav className='flex flex-col gap-1 p-3'>
				{links.map(link => (
					<NavLink key={link.to} to={link.to}>
						{({ isActive }) => (
							<span
								className='block rounded-[var(--radius-md)] px-3 py-2.5 text-sm transition-all'
								style={{
									backgroundColor: isActive
										? 'var(--color-card-bg)'
										: 'transparent',
									color: isActive
										? 'var(--color-text-primary)'
										: 'var(--color-text-secondary)',
									fontWeight: isActive ? 750 : 500,
									boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
								}}
							>
								{link.label}
							</span>
						)}
					</NavLink>
				))}
			</nav>
		</aside>
	)
}
