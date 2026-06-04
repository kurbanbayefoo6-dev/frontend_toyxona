import { Link, useNavigate } from 'react-router-dom'

import { APP_NAME } from '@/constants'
import { logoutApi } from '@/services/auth.service'
import { toast } from '@/stores/toastStore'
import { useAuthStore } from '@/stores/authStore'
import type { UserRole } from '@/types/auth'
import { AUTH_TOAST } from '@/utils/toastMessages'

type TopbarProps = {
	title?: string
}

function roleHomePath(role: UserRole): string {
	if (role === 'customer') return '/customer'
	if (role === 'owner') return '/owner'
	return '/admin'
}

export function Topbar({ title }: TopbarProps) {
	const navigate = useNavigate()
	const isAuthenticated = useAuthStore(s => s.isAuthenticated)
	const role = useAuthStore(s => s.role)
	const user = useAuthStore(s => s.user)
	const logout = useAuthStore(s => s.logout)

	async function handleLogout() {
		try {
			await logoutApi()
		} catch {
			// Local session cleared even if server logout fails
		}
		logout()
		toast.success(AUTH_TOAST.logoutSuccess)
		navigate('/login', { replace: true })
	}

	return (
		<header
			className='flex h-14 shrink-0 items-center justify-between border-b px-4'
			style={{
				backgroundColor: 'var(--color-card-bg)',
				borderColor: 'var(--color-border)',
			}}
		>
			<div className='flex items-center gap-3'>
				<Link
					to='/'
					className='text-sm font-semibold'
					style={{ color: 'var(--color-brand)' }}
				>
					{APP_NAME}
				</Link>
				{title && (
					<span
						className='text-sm'
						style={{ color: 'var(--color-text-secondary)' }}
					>
						{title}
					</span>
				)}
			</div>
			<nav className='flex items-center gap-4 text-sm'>
				{isAuthenticated && role ? (
					<>
						<span style={{ color: 'var(--color-text-hint)' }}>
							{user?.firstName}
						</span>
						<Link
							to={roleHomePath(role)}
							style={{ color: 'var(--color-text-secondary)' }}
						>
							Kabinet
						</Link>
						<button
							type='button'
							className='cursor-pointer border-0 bg-transparent p-0 text-sm'
							style={{ color: 'var(--color-brand)' }}
							onClick={handleLogout}
						>
							Chiqish
						</button>
					</>
				) : (
					<Link
						to='/login'
						style={{ color: 'var(--color-text-secondary)' }}
					>
						Kirish
					</Link>
				)}
			</nav>
		</header>
	)
}
