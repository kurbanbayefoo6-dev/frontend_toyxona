import { Outlet } from 'react-router-dom'

import { MobileNav } from '@/components/layout/MobileNav'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

export const ownerLinks = [
	{ to: '/owner/dashboard', label: 'Bosh sahifa' },
	{ to: '/owner/venues', label: 'Maskanlar' },
	{ to: '/owner/bookings', label: 'Bandlovlar' },
]

export default function OwnerLayout() {
	return (
		<div className='flex min-h-screen flex-col lg:flex-row'>
			<aside className='hidden lg:block'>
				<Sidebar links={ownerLinks} />
			</aside>
			<div className='flex min-w-0 flex-1 flex-col'>
				<Topbar title='Sahib' />
				<MobileNav links={ownerLinks} />
				<main className='flex-1 p-4 sm:p-6'>
					<Outlet />
				</main>
			</div>
		</div>
	)
}
