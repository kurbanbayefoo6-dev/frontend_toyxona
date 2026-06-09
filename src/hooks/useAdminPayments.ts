import { useQuery } from '@tanstack/react-query'

import { getPayments } from '@/services/payment.service'

export function useAdminPayments(
	page: number,
	limit = 10,
	search?: string,
) {
	return useQuery({
		queryKey: ['admin', 'payments', page, limit, search],
		queryFn: () => getPayments({ page, limit, search }),
	})
}
