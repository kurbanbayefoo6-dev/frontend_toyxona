import { NavLink } from 'react-router-dom'

type MobileNavLink = {
	to: string
	label: string
}

type MobileNavProps = {
	links: MobileNavLink[]
}

export function MobileNav({ links }: MobileNavProps) {
	return (
		<nav
			className='flex gap-1 overflow-x-auto border-b px-2 py-2 lg:hidden'
			style={{
				backgroundColor: 'var(--color-card-bg)',
				borderColor: 'var(--color-border)',
			}}
		>
			{links.map(link => (
				<NavLink key={link.to} to={link.to}>
					{({ isActive }) => (
						<span
							className='block shrink-0 rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-medium whitespace-nowrap'
							style={{
								backgroundColor: isActive
									? 'var(--color-brand-light)'
									: 'transparent',
								color: isActive
									? 'var(--color-brand)'
									: 'var(--color-text-secondary)',
							}}
						>
							{link.label}
						</span>
					)}
				</NavLink>
			))}
		</nav>
	)
}
