import { StatusBadge } from '@/components/features/customer/StatusBadge'
import type { VenueStatus } from '@/types/venue'
import {
	getVenueStatusStyle,
	VENUE_STATUS_LABELS,
} from '@/utils/ownerStatus'

export function VenueStatusBadge({ status }: { status: VenueStatus }) {
	const style = getVenueStatusStyle(status)
	return (
		<StatusBadge
			label={VENUE_STATUS_LABELS[status]}
			bg={style.bg}
			color={style.color}
		/>
	)
}
