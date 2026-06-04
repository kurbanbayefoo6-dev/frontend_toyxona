import { useQuery } from '@tanstack/react-query'

import { getMe } from '@/services/user.service'

export function useCustomerProfile() {
	return useQuery({
		queryKey: ['customer', 'profile'],
		queryFn: () => getMe(),
	})
}
