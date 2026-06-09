import type { BookingAddonsSelection } from '@/utils/bookingPrice'

const DRAFT_KEY = 'toyxona-booking-draft'
const REDIRECT_KEY = 'toyxona-auth-redirect'

export type BookingDraft = {
	venueId: number
	selectedDate: string | null
	guestCount: number
	selection: BookingAddonsSelection
}

export function saveBookingDraft(draft: BookingDraft): void {
	sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
}

export function loadBookingDraft(venueId: number): BookingDraft | null {
	try {
		const raw = sessionStorage.getItem(DRAFT_KEY)
		if (!raw) return null
		const draft = JSON.parse(raw) as BookingDraft
		if (draft.venueId !== venueId) return null
		return draft
	} catch {
		return null
	}
}

export function clearBookingDraft(): void {
	sessionStorage.removeItem(DRAFT_KEY)
}

export function setAuthRedirect(path: string): void {
	sessionStorage.setItem(REDIRECT_KEY, path)
}

export function consumeAuthRedirect(): string | null {
	const path = sessionStorage.getItem(REDIRECT_KEY)
	sessionStorage.removeItem(REDIRECT_KEY)
	return path
}

export function getVenueDetailPath(venueId: number): string {
	return `/venues/${venueId}`
}

export function isSafeRedirectPath(path: string | null): path is string {
	if (!path) return false
	if (path.includes('//')) return false
	if (path.startsWith('/login') || path.startsWith('/register')) return false
	return path === '/' || path.startsWith('/venues/')
}
