import type { VenueStatus } from '@/types/venue'

export const VENUE_STATUS_LABELS: Record<VenueStatus, string> = {
	approved: 'Tasdiqlangan',
	pending: 'Tasdiqlanmagan',
	rejected: 'Rad etilgan',
}

export function getVenueStatusStyle(status: VenueStatus): {
	bg: string
	color: string
} {
	switch (status) {
		case 'approved':
			return {
				bg: 'var(--color-available-light)',
				color: 'var(--color-available)',
			}
		case 'rejected':
			return {
				bg: 'var(--color-booked-light)',
				color: 'var(--color-booked)',
			}
		default:
			return {
				bg: 'var(--color-pending-light)',
				color: 'var(--color-pending)',
			}
	}
}
