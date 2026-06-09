export function digitsOnly(value: string, maxLength?: number): string {
	const digits = value.replace(/\D/g, '')
	return maxLength !== undefined ? digits.slice(0, maxLength) : digits
}

export function maskCardNumber(value: string): string {
	const digits = digitsOnly(value, 16)
	return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

export function maskExpiry(value: string): string {
	const digits = digitsOnly(value, 4)
	if (digits.length <= 2) return digits
	return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export function maskCvv(value: string): string {
	return digitsOnly(value, 4)
}

export function maskCardHolder(value: string): string {
	return value.replace(/[^a-zA-Z\u0400-\u04FF\s'-]/g, '').slice(0, 40)
}

export function isPaymentFormValid(input: {
	cardHolder: string
	cardNumber: string
	expiry: string
	cvv: string
}): boolean {
	const digits = digitsOnly(input.cardNumber)
	const expiryDigits = digitsOnly(input.expiry)
	const cvvDigits = digitsOnly(input.cvv)
	return (
		input.cardHolder.trim().length >= 3 &&
		digits.length === 16 &&
		expiryDigits.length === 4 &&
		cvvDigits.length >= 3
	)
}
