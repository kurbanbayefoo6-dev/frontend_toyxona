import type { NavigateFunction } from 'react-router-dom'

import type { UserRole } from '@/types/auth'

export function navigateByRole(navigate: NavigateFunction, role: UserRole) {
	if (role === 'customer') navigate('/customer')
	else if (role === 'owner') navigate('/owner')
	else navigate('/admin')
}

export function normalizeAuthUser<T extends { id: number | string }>(
	user: T,
): T & { id: string } {
	return { ...user, id: String(user.id) }
}
