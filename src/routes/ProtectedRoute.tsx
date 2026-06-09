import { Navigate } from 'react-router-dom'

import { useAuthHydrated } from '@/hooks/useAuthHydrated'
import { useAuthStore } from '@/stores/authStore'
import type { UserRole } from '@/types/auth'

type Props = {
	children: React.ReactNode
	role?: UserRole
}

export default function ProtectedRoute({ children, role }: Props) {
	const hydrated = useAuthHydrated()
	const { isAuthenticated, role: userRole } = useAuthStore()

	if (!hydrated) {
		return (
			<div
				className='flex min-h-[40vh] items-center justify-center text-sm'
				style={{ color: 'var(--color-text-hint)' }}
			>
				Yuklanmoqda...
			</div>
		)
	}

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />
	}

	if (role && userRole !== role) {
		return <Navigate to='/' replace />
	}

	return <>{children}</>
}
