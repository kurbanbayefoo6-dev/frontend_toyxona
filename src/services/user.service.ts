import { apiClient } from '@/services/apiClient'
import type { ApiSuccessResponse } from '@/types/api'
import type {
	ChangePasswordPayload,
	UpdateProfilePayload,
	UserProfile,
} from '@/types/customer'

export async function getMe(): Promise<UserProfile> {
	const res = await apiClient.get<ApiSuccessResponse<UserProfile>>(
		'/api/users/me',
	)
	return res.data.data
}

export async function updateProfile(
	payload: UpdateProfilePayload,
): Promise<UserProfile> {
	const res = await apiClient.patch<ApiSuccessResponse<UserProfile>>(
		'/api/users',
		payload,
	)
	return res.data.data
}

export async function changePassword(
	payload: ChangePasswordPayload,
): Promise<void> {
	await apiClient.post('/api/users/change-password', payload)
}
