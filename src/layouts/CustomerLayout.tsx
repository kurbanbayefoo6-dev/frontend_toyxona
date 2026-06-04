import { Outlet } from 'react-router-dom'

import { MobileNav } from '@/components/layout/MobileNav'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

export const customerLinks = [
	{ to: '/customer/dashboard', label: 'Bosh sahifa' },
	{ to: '/customer/bookings', label: 'Bandlovlar' },
	{ to: '/customer/payments', label: 'To‘lovlar' },
	{ to: '/customer/favorites', label: 'Sevimlilar' },
	{ to: '/customer/reviews', label: 'Sharhlar' },
	{ to: '/customer/profile', label: 'Profil' },
]

export default function CustomerLayout() {
	return (
		<div className='flex min-h-screen flex-col lg:flex-row'>
			<aside className='hidden lg:block'>
				<Sidebar links={customerLinks} />
			</aside>
			<div className='flex min-w-0 flex-1 flex-col'>
				<Topbar title='Mijoz' />
				<MobileNav links={customerLinks} />
				<main className='flex-1 p-4 sm:p-6 lg:p-8'>
					<Outlet />
				</main>
			</div>
		</div>
	)
}
