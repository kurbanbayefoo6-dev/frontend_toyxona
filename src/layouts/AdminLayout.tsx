import { Outlet } from 'react-router-dom'

import { MobileNav } from '@/components/layout/MobileNav'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

export const adminLinks = [
	{ to: '/admin/dashboard', label: 'Bosh sahifa' },
	{ to: '/admin/users', label: 'Foydalanuvchilar' },
	{ to: '/admin/owners', label: 'Egalar' },
	{ to: '/admin/venues', label: 'Maskanlar' },
	{ to: '/admin/bookings', label: 'Bandlovlar' },
	{ to: '/admin/payments', label: 'To‘lovlar' },
	{ to: '/admin/settings', label: 'Sozlamalar' },
]

export default function AdminLayout() {
	return (
		<div className='flex min-h-screen flex-col lg:flex-row'>
			<aside className='hidden lg:block'>
				<Sidebar links={adminLinks} />
			</aside>
			<div className='flex min-w-0 flex-1 flex-col'>
				<Topbar title='Boshqaruv' />
				<MobileNav links={adminLinks} />
				<main className='flex-1 p-4 sm:p-6 lg:p-8'>
					<Outlet />
				</main>
			</div>
		</div>
	)
}
