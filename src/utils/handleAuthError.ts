import axios from 'axios'

import { toast } from '@/stores/toastStore'
import { getApiErrorMessage } from '@/utils/authErrors'
import { AUTH_TOAST } from '@/utils/toastMessages'

export function handleAuthError(error: unknown, fallback: string): string {
	const message = axios.isAxiosError(error)
		? error.response
			? getApiErrorMessage(error, fallback)
			: AUTH_TOAST.networkError
		: fallback

	toast.error(message)
	return message
}
