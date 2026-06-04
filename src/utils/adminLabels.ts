import type { UserRole } from '@/types/auth'

export function getUserRoleLabel(role: UserRole): string {
	switch (role) {
		case 'admin':
			return 'Boshqaruvchi'
		case 'owner':
			return 'Sahib'
		case 'customer':
			return 'Mijoz'
		default:
			return role
	}
}

export function getUserStatusLabel(isVerified: boolean): string {
	return isVerified ? 'Tasdiqlangan' : 'Tasdiqlanmagan'
}
