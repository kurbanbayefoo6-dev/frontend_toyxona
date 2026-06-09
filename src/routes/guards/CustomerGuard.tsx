import ProtectedRoute from '@/routes/ProtectedRoute'
import type { UserRole } from '@/types/auth'

export default function CustomerGuard({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<ProtectedRoute role={'customer' satisfies UserRole}>
			{children}
		</ProtectedRoute>
	)
}
