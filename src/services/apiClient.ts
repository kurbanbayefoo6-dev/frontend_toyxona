import axios, { type AxiosError } from 'axios'

import { useAuthStore } from '@/stores/authStore'

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
})

apiClient.interceptors.request.use(config => {
	const token = useAuthStore.getState().token
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

apiClient.interceptors.response.use(
	response => response,
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			useAuthStore.getState().logout()
		}
		return Promise.reject(error)
	},
)
