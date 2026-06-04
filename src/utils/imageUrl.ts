const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''

export type VenueImageSource = {
	imageUrl?: string | null
	coverImage?: string | null
	image?: string | null
	images?: Array<{ imageUrl?: string | null } | string | null> | null
}

export function pickVenueImageSource(source: VenueImageSource): string | null {
	const fromArray = source.images?.[0]
	const arrayUrl =
		typeof fromArray === 'string'
			? fromArray
			: (fromArray?.imageUrl ?? null)

	return (
		source.imageUrl ??
		source.coverImage ??
		source.image ??
		arrayUrl ??
		null
	)
}

export function resolveImageUrl(url: string | null | undefined): string | null {
	if (!url) return null
	if (url.startsWith('http://') || url.startsWith('https://')) return url
	if (url.startsWith('/')) return `${API_BASE}${url}`
	return `${API_BASE}/${url}`
}

export function resolveVenueImageUrl(
	source: VenueImageSource | null | undefined,
): string | null {
	if (!source) return null
	return resolveImageUrl(pickVenueImageSource(source))
}
