import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { AUTH_STORAGE_KEY } from '@/constants'
import type { AuthUser, UserRole } from '@/types/auth'

type AuthState = {
	token: string | null
	user: AuthUser | null
	isAuthenticated: boolean
	role: UserRole | null
	setAuth: (payload: { token: string; user: AuthUser }) => void
	setUser: (user: AuthUser) => void
	logout: () => void
}

export const useAuthStore = create<AuthState>()(
	persist(
		set => ({
			token: null,
			user: null,
			role: null,
			isAuthenticated: false,
			setAuth: ({ token, user }) =>
				set({
					token,
					user,
					role: user.role,
					isAuthenticated: true,
				}),
			setUser: user =>
				set({
					user,
					role: user.role,
				}),
			logout: () =>
				set({
					token: null,
					user: null,
					role: null,
					isAuthenticated: false,
				}),
		}),
		{
			name: AUTH_STORAGE_KEY,
			partialize: state => ({
				token: state.token,
				user: state.user,
			}),
			merge: (persisted, current) => {
				const saved = persisted as Pick<AuthState, 'token' | 'user'>
				if (saved?.token && saved?.user) {
					return {
						...current,
						token: saved.token,
						user: saved.user,
						role: saved.user.role,
						isAuthenticated: true,
					}
				}
				return { ...current, ...saved }
			},
		},
	),
)
