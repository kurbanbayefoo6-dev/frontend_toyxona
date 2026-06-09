import { apiClient } from '@/services/apiClient'
import type { ApiSuccessResponse } from '@/types/api'
import type {
	CreateReviewPayload,
	ReviewItem,
	UpdateReviewPayload,
} from '@/types/customer'

export async function getMyReviews(): Promise<ReviewItem[]> {
	const res = await apiClient.get<ApiSuccessResponse<ReviewItem[]>>(
		'/api/reviews/my-reviews',
	)
	return res.data.data
}

export async function createReview(
	payload: CreateReviewPayload,
): Promise<ReviewItem> {
	const res = await apiClient.post<ApiSuccessResponse<ReviewItem>>(
		'/api/reviews',
		payload,
	)
	return res.data.data
}

export async function updateReview(
	id: number,
	payload: UpdateReviewPayload,
): Promise<ReviewItem> {
	const res = await apiClient.patch<ApiSuccessResponse<ReviewItem>>(
		`/api/reviews/${id}`,
		payload,
	)
	return res.data.data
}

export async function deleteReview(id: number): Promise<void> {
	await apiClient.delete(`/api/reviews/${id}`)
}
