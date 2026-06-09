import ProtectedRoute from '@/routes/ProtectedRoute'
import type { UserRole } from '@/types/auth'

export default function AdminGuard({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<ProtectedRoute role={'admin' satisfies UserRole}>
			{children}
		</ProtectedRoute>
	)
}
