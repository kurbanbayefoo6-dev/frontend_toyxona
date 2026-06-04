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
			className='sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b px-4 backdrop-blur-xl sm:px-6'
			style={{
				backgroundColor: 'rgb(255 250 244 / 0.92)',
				borderColor: 'var(--color-border)',
			}}
		>
			<div className='flex items-center gap-3'>
				<Link
					to='/'
					className='inline-flex items-center gap-2 text-base font-black'
					style={{ color: 'var(--color-text-primary)' }}
				>
					<span
						className='flex size-8 items-center justify-center rounded-full text-sm text-white'
						style={{ backgroundColor: 'var(--color-brand)' }}
					>
						T
					</span>
					{APP_NAME}
				</Link>
				{title && (
					<span
						className='hidden rounded-full px-3 py-1 text-xs font-semibold sm:inline-flex'
						style={{ color: 'var(--color-text-secondary)' }}
					>
						{title}
					</span>
				)}
			</div>
			<nav className='flex items-center gap-3 text-sm'>
				{isAuthenticated && role ? (
					<>
						<span
							className='hidden sm:inline'
							style={{ color: 'var(--color-text-hint)' }}
						>
							{user?.firstName}
						</span>
						<Link
							to={roleHomePath(role)}
							className='rounded-full border px-3 py-1.5 font-semibold'
							style={{
								color: 'var(--color-text-primary)',
								borderColor: 'var(--color-border)',
								backgroundColor: 'var(--color-card-bg)',
							}}
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
						className='rounded-full border px-4 py-2 font-semibold'
						style={{
							color: 'var(--color-text-primary)',
							borderColor: 'var(--color-border)',
							backgroundColor: 'var(--color-card-bg)',
						}}
					>
						Kirish
					</Link>
				)}
			</nav>
		</header>
	)
}
