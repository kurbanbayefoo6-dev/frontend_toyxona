export function parseApiNumber(value: string | number): number {
	if (typeof value === 'number') return value
	const parsed = Number(value)
	return Number.isNaN(parsed) ? 0 : parsed
}
