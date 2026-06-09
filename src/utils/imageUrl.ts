const API_BASE = getApiOrigin()

export type VenueImageSource = {
	imageUrl?: string | null
	coverImage?: string | null
	image?: string | null
	images?: Array<{ imageUrl?: string | null } | string | null> | null
}

/** API host for static /uploads (no trailing slash, no /api suffix). */
export function getApiOrigin(): string {
	const raw =
		import.meta.env.VITE_API_URL ??
		import.meta.env.VITE_API_BASE_URL ??
		''
	return raw.replace(/\/$/, '').replace(/\/api$/i, '')
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

function normalizeAssetPath(url: string): string {
	const trimmed = url.trim()
	if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
		return trimmed
	}
	if (trimmed.startsWith('/uploads/')) {
		return trimmed
	}
	if (trimmed.startsWith('/')) {
		return trimmed
	}
	if (trimmed.startsWith('uploads/')) {
		return `/${trimmed}`
	}
	return `/uploads/${trimmed.replace(/^\/+/, '')}`
}

export function resolveImageUrl(url: string | null | undefined): string | null {
	if (!url) return null

	const path = normalizeAssetPath(url)
	if (path.startsWith('http://') || path.startsWith('https://')) {
		return path
	}

	if (!API_BASE) {
		if (import.meta.env.DEV) {
			console.warn(
				'[imageUrl] VITE_API_URL is unset; image paths resolve to the frontend origin and will 404 for /uploads',
				path,
			)
		}
		return path
	}

	return `${API_BASE}${path}`
}

export function resolveVenueImageUrl(
	source: VenueImageSource | null | undefined,
): string | null {
	if (!source) return null
	return resolveImageUrl(pickVenueImageSource(source))
}

/** Dev-only: log API fields vs resolved src (for render audits). */
export function logImageRenderDebug(
	component: string,
	source: VenueImageSource | null | undefined,
	resolved: string | null,
): void {
	if (!import.meta.env.DEV) return

	console.debug(`[image-render:${component}]`, {
		imageUrl: source?.imageUrl ?? null,
		coverImage: source?.coverImage ?? null,
		image: source?.image ?? null,
		images0:
			typeof source?.images?.[0] === 'string'
				? source.images[0]
				: (source?.images?.[0]?.imageUrl ?? null),
		picked: source ? pickVenueImageSource(source) : null,
		resolved,
		apiOrigin: API_BASE || '(empty — will load from Vite origin)',
	})
}
