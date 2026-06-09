import { useQuery } from '@tanstack/react-query'

import { getPayments } from '@/services/payment.service'

export function useCustomerPayments() {
	return useQuery({
		queryKey: ['customer', 'payments'],
		queryFn: () => getPayments(),
	})
}
