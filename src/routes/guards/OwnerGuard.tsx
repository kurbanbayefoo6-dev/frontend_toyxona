import ProtectedRoute from '@/routes/ProtectedRoute'
import type { UserRole } from '@/types/auth'

export default function OwnerGuard({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<ProtectedRoute role={'owner' satisfies UserRole}>
			{children}
		</ProtectedRoute>
	)
}
