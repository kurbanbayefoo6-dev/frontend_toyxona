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
			className='flex w-56 shrink-0 flex-col border-r'
			style={{
				backgroundColor: 'var(--color-card-bg)',
				borderColor: 'var(--color-border)',
			}}
		>
			<nav className='flex flex-col gap-1 p-3'>
				{links.map(link => (
					<NavLink key={link.to} to={link.to}>
						{({ isActive }) => (
							<span
								className='block rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors'
								style={{
									backgroundColor: isActive
										? 'var(--color-brand-light)'
										: 'transparent',
									color: isActive
										? 'var(--color-brand)'
										: 'var(--color-text-secondary)',
									fontWeight: isActive ? 500 : 400,
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
