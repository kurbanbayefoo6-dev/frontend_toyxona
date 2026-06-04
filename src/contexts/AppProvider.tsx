import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

import { ToastContainer } from '@/components/ui/ToastContainer'

type AppProviderProps = {
	children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60_000,
						retry: 1,
					},
				},
			}),
	)

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ToastContainer />
		</QueryClientProvider>
	)
}
