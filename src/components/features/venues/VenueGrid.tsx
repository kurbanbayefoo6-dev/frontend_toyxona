import type { ReactNode } from 'react'

type VenueGridProps = {
	children: ReactNode
}

export function VenueGrid({ children }: VenueGridProps) {
	return (
		<div className='grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3'>
			{children}
		</div>
	)
}
