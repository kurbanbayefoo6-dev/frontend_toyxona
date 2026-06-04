/**
 * Image render audit: API fields → resolved URL → HTTP status.
 * Usage: node scripts/audit-image-render.mjs [apiOrigin]
 */
const API_ORIGIN =
	process.argv[2]?.replace(/\/$/, '').replace(/\/api$/i, '') ??
	process.env.VITE_API_URL?.replace(/\/$/, '').replace(/\/api$/i, '') ??
	'https://toyxona-backend-1.onrender.com'

function pickVenueImageSource(source) {
	const fromArray = source.images?.[0]
	const arrayUrl =
		typeof fromArray === 'string' ? fromArray : (fromArray?.imageUrl ?? null)
	return (
		source.imageUrl ??
		source.coverImage ??
		source.image ??
		arrayUrl ??
		null
	)
}

function resolveImageUrl(url) {
	if (!url) return null
	const trimmed = url.trim()
	if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
		return trimmed
	}
	let path = trimmed
	if (!path.startsWith('/uploads/')) {
		if (path.startsWith('uploads/')) path = `/${path}`
		else if (!path.startsWith('/')) path = `/uploads/${path}`
	}
	return `${API_ORIGIN}${path}`
}

async function headStatus(url) {
	try {
		const res = await fetch(url, { method: 'HEAD' })
		return res.status
	} catch {
		return 'ERR'
	}
}

const venuesRes = await fetch(`${API_ORIGIN}/api/venues?page=1&limit=5`)
const venuesJson = await venuesRes.json()
const items = venuesJson?.data?.items ?? []

console.log('API_ORIGIN:', API_ORIGIN)
console.log('---')

for (const venue of items) {
	const picked = pickVenueImageSource(venue)
	const resolved = resolveImageUrl(picked)
	const status = resolved ? await headStatus(resolved) : 'N/A'

	console.log({
		venueId: venue.id,
		name: venue.name,
		imageUrl: venue.imageUrl,
		coverImage: venue.coverImage,
		image: venue.image,
		images0: venue.images?.[0]?.imageUrl ?? venue.images?.[0],
		picked,
		resolved,
		httpStatus: status,
	})
}
