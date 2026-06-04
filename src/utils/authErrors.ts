import axios from 'axios'

import type { ApiErrorResponse } from '@/types/api'

const ERROR_MESSAGES_UZ: Record<string, string> = {
	'Identifier and password are required': 'Login va parol majburiy',
	'Invalid credentials': 'Noto‘g‘ri email yoki parol',
	'User is not verified': 'Hisob tasdiqlanmagan. OTP kodini kiriting.',
	'Email and otpCode are required': 'Email va OTP kodi majburiy',
	'Invalid or expired OTP': 'OTP noto‘g‘ri',
	'Email is required': 'Email majburiy',
	'User not found': 'Foydalanuvchi topilmadi',
	'User already verified': 'Hisob allaqachon tasdiqlangan',
	'All fields are required': 'Barcha maydonlarni to‘ldiring',
	'Email already exists': 'Bu email allaqachon ro‘yxatdan o‘tgan',
	'Username already exists': 'Bu foydalanuvchi nomi band',
	'Token and newPassword are required': 'Token va yangi parol majburiy',
	'Password must be at least 6 characters':
		'Parol kamida 6 ta belgidan iborat bo‘lsin',
	'Invalid or expired reset token':
		'Tiklash havolasi noto‘g‘ri yoki muddati tugagan',
	'Venue is already booked for this date': 'Bu kun band',
	'venueId, bookingDate and guestCount are required': 'Sana tanlanmagan',
	'guestCount must be greater than 0': 'Mehmonlar soni noto‘g‘ri',
	'Only customers can create bookings': 'Faqat mijozlar bron qila oladi',
	'Only customers can create payments': 'Faqat mijozlar to‘lov qila oladi',
	'You have already reviewed this venue': 'Bu maskan uchun sharh allaqachon mavjud',
	'Rating must be between 1 and 5': 'Baho 1 dan 5 gacha bo‘lishi kerak',
	'Current password is incorrect': 'Joriy parol noto‘g‘ri',
}

export function mapAuthErrorMessage(message: string): string {
	return ERROR_MESSAGES_UZ[message] ?? message
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
	if (axios.isAxiosError(error)) {
		if (!error.response) {
			return 'Server bilan bog‘lanib bo‘lmadi'
		}
		const data = error.response.data as ApiErrorResponse | undefined
		if (data?.message) {
			return mapAuthErrorMessage(data.message)
		}
	}
	return fallback
}
