import { useParams } from 'react-router-dom'

import VenueManagePage from '@/pages/owner/VenueManagePage'

export default function AdminVenueEditPage() {
	const { id } = useParams()
	const venueId = Number(id)

	if (Number.isNaN(venueId) || venueId <= 0) {
		return <p>Noto'g'ri maskan identifikatori</p>
	}

	return <VenueManagePage mode='edit' venueId={venueId} adminMode />
}
