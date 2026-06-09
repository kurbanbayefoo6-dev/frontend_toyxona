import axios from 'axios'

import type { ApiErrorResponse } from '@/types/api'

const ERROR_MESSAGES_UZ: Record<string, string> = {
	'Identifier and password are required':
		'Foydalanuvchi nomi va parol majburiy',
	'Invalid credentials': 'Noto‘g‘ri elektron pochta yoki parol',
	'User is not verified': 'Hisob tasdiqlanmagan. Tasdiqlash kodini kiriting.',
	'Email and otpCode are required':
		'Elektron pochta va tasdiqlash kodi majburiy',
	'Invalid or expired OTP': 'Tasdiqlash kodi noto‘g‘ri yoki muddati tugagan',
	'Email is required': 'Elektron pochta majburiy',
	'User not found': 'Foydalanuvchi topilmadi',
	'User already verified': 'Hisob allaqachon tasdiqlangan',
	'All fields are required': 'Barcha maydonlarni to‘ldiring',
	'Email already exists':
		'Bu elektron pochta allaqachon ro‘yxatdan o‘tgan',
	'Username already exists': 'Bu foydalanuvchi nomi band',
	'Token and newPassword are required':
		'Tiklash kaliti va yangi parol majburiy',
	'Password must be at least 6 characters':
		'Parol kamida 6 ta belgidan iborat bo‘lsin',
	'Invalid or expired reset token':
		'Tiklash havolasi noto‘g‘ri yoki muddati tugagan',
	'Venue is already booked for this date': 'Bu kun band',
	'venueId, bookingDate and guestCount are required': 'Sana tanlanmagan',
	'guestCount must be greater than 0': 'Mehmonlar soni noto‘g‘ri',
	'Only customers can create bookings': 'Faqat mijozlar bron qila oladi',
	'Only customers can create payments': 'Faqat mijozlar to‘lov qila oladi',
	Forbidden: 'Ruxsat yo‘q',
	'You can only pay for your own bookings':
		'Faqat o‘z broningiz uchun to‘lov qilishingiz mumkin',
	'Booking is already cancelled': 'Bron allaqachon bekor qilingan',
	'Owners can only cancel bookings': 'Egasi faqat bronni bekor qila oladi',
	'Customers can only cancel bookings': 'Mijoz faqat bronni bekor qila oladi',
	'Invalid role': 'Noto‘g‘ri rol',
	'You have already reviewed this venue': 'Bu To‘yxona uchun sharh allaqachon mavjud',
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
