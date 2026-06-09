import { apiClient } from '@/services/apiClient'
import type { ApiSuccessResponse } from '@/types/api'
import type { PaginatedResult, PaymentListItem } from '@/types/customer'
import { parseApiNumber } from '@/utils/parseApiNumber'

type RawPayment = Omit<PaymentListItem, 'amount'> & { amount: number | string }

function normalizePayment(raw: RawPayment): PaymentListItem {
	return { ...raw, amount: parseApiNumber(raw.amount) }
}

export async function getPayments(params?: {
	page?: number
	limit?: number
	search?: string
}): Promise<PaginatedResult<PaymentListItem>> {
	const res = await apiClient.get<
		ApiSuccessResponse<PaginatedResult<RawPayment>>
	>('/api/payments', {
		params: { page: params?.page ?? 1, limit: params?.limit ?? 10, search: params?.search },
	})
	return {
		total: res.data.data.total,
		items: res.data.data.items.map(normalizePayment),
	}
}
