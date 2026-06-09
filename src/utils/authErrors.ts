import axios from 'axios'

import type { ApiErrorResponse } from '@/types/api'

const ERROR_MESSAGES_UZ: Record<string, string> = {
	'Identifier and password are required':
		'Foydalanuvchi nomi va parol majburiy',
	'Invalid credentials': 'NotoвЂgвЂri elektron pochta yoki parol',
	'User is not verified': 'Hisob tasdiqlanmagan. Tasdiqlash kodini kiriting.',
	'Email and otpCode are required':
		'Elektron pochta va tasdiqlash kodi majburiy',
	'Invalid or expired OTP': 'Tasdiqlash kodi notoвЂgвЂri yoki muddati tugagan',
	'Email is required': 'Elektron pochta majburiy',
	'User not found': 'Foydalanuvchi topilmadi',
	'User already verified': 'Hisob allaqachon tasdiqlangan',
	'All fields are required': 'Barcha maydonlarni toвЂldiring',
	'Email already exists':
		'Bu elektron pochta allaqachon roвЂyxatdan oвЂtgan',
	'Username already exists': 'Bu foydalanuvchi nomi band',
	'Token and newPassword are required':
		'Tiklash kaliti va yangi parol majburiy',
	'Password must be at least 6 characters':
		'Parol kamida 6 ta belgidan iborat boвЂlsin',
	'Invalid or expired reset token':
		'Tiklash havolasi notoвЂgвЂri yoki muddati tugagan',
	'Venue is already booked for this date': 'Bu kun band',
	'venueId, bookingDate and guestCount are required': 'Sana tanlanmagan',
	'guestCount must be greater than 0': 'Mehmonlar soni notoвЂgвЂri',
	'Only customers can create bookings': 'Faqat mijozlar bron qila oladi',
	'Only customers can create payments': 'Faqat mijozlar toвЂlov qila oladi',
	Forbidden: 'Ruxsat yoвЂq',
	'You can only pay for your own bookings':
		'Faqat oвЂz broningiz uchun toвЂlov qilishingiz mumkin',
	'Booking is already cancelled': 'Bron allaqachon bekor qilingan',
	'Owners can only cancel bookings': 'Egasi faqat bronni bekor qila oladi',
	'Customers can only cancel bookings': 'Mijoz faqat bronni bekor qila oladi',
	'Invalid role': 'NotoвЂgвЂri rol',
	'You have already reviewed this venue': 'Bu To‘yxona uchun sharh allaqachon mavjud',
	'Rating must be between 1 and 5': 'Baho 1 dan 5 gacha boвЂlishi kerak',
	'Current password is incorrect': 'Joriy parol notoвЂgвЂri',
}

export function mapAuthErrorMessage(message: string): string {
	return ERROR_MESSAGES_UZ[message] ?? message
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
	if (axios.isAxiosError(error)) {
		if (!error.response) {
			return 'Server bilan bogвЂlanib boвЂlmadi'
		}
		const data = error.response.data as ApiErrorResponse | undefined
		if (data?.message) {
			return mapAuthErrorMessage(data.message)
		}
	}
	return fallback
}
