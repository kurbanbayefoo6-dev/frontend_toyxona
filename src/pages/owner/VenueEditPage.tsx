import { useParams } from 'react-router-dom'

import VenueManagePage from '@/pages/owner/VenueManagePage'

export default function VenueEditPage() {
	const { id } = useParams()
	const venueId = Number(id)

	if (Number.isNaN(venueId) || venueId <= 0) {
		return (
			<p style={{ color: 'var(--color-text-secondary)' }}>
				Noto‘g‘ri maskan identifikatori
			</p>
		)
	}

	return <VenueManagePage mode='edit' venueId={venueId} />
}
