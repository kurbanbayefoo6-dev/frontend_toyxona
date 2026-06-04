import { apiClient } from '@/services/apiClient'

export async function logoutApi(): Promise<void> {
	await apiClient.post('/api/auth/logout')
}
