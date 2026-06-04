import { useQuery } from '@tanstack/react-query'

import { getMyReviews } from '@/services/review.service'

export function useCustomerReviews() {
	return useQuery({
		queryKey: ['customer', 'reviews'],
		queryFn: () => getMyReviews(),
	})
}
