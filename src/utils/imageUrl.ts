const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''

export function resolveImageUrl(url: string | null | undefined): string | null {
	if (!url) return null
	if (url.startsWith('http://') || url.startsWith('https://')) return url
	if (url.startsWith('/')) return `${API_BASE}${url}`
	return `${API_BASE}/${url}`
}
