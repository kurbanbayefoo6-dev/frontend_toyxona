import { create } from 'zustand'

export type ToastVariant = 'success' | 'error'

export type ToastItem = {
	id: string
	message: string
	variant: ToastVariant
}

type ToastState = {
	toasts: ToastItem[]
	show: (message: string, variant: ToastVariant) => void
	dismiss: (id: string) => void
}

const AUTO_DISMISS_MS = 4500

export const useToastStore = create<ToastState>((set, get) => ({
	toasts: [],
	show: (message, variant) => {
		const id = crypto.randomUUID()
		set(state => ({
			toasts: [...state.toasts, { id, message, variant }],
		}))
		window.setTimeout(() => {
			get().dismiss(id)
		}, AUTO_DISMISS_MS)
	},
	dismiss: id =>
		set(state => ({
			toasts: state.toasts.filter(t => t.id !== id),
		})),
}))

export const toast = {
	success: (message: string) => useToastStore.getState().show(message, 'success'),
	error: (message: string) => useToastStore.getState().show(message, 'error'),
}
