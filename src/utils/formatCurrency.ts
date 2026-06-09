export function formatCurrency(amount: number): string {
	return `${new Intl.NumberFormat('uz-UZ').format(amount)} soвЂm`
}
