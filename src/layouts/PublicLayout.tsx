import { Outlet } from 'react-router-dom'

import { Topbar } from '@/components/layout/Topbar'

export default function PublicLayout() {
	return (
		<div className='flex min-h-screen flex-col'>
			<Topbar />
			<main className='flex-1'>
				<Outlet />
			</main>
		</div>
	)
}
