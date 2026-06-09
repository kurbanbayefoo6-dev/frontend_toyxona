import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { AuthCard } from '@/components/auth/AuthCard'
import { FormField } from '@/components/auth/FormField'
import { Alert, Button } from '@/components/ui'
import { apiClient } from '@/services/apiClient'
import { toast } from '@/stores/toastStore'
import { useAuthStore } from '@/stores/authStore'
import type { ApiSuccessResponse } from '@/types/api'
import type { AuthUser } from '@/types/auth'
import { handleAuthError } from '@/utils/handleAuthError'
import { navigateByRole, normalizeAuthUser } from '@/utils/authNavigation'
import {
	consumeAuthRedirect,
	isSafeRedirectPath,
} from '@/utils/bookingRedirect'
import { AUTH_TOAST } from '@/utils/toastMessages'

const loginSchema = z.object({
	identifier: z.string().min(1, 'Foydalanuvchi nomi yoki elektron pochta kiriting'),
	password: z.string().min(1, 'Parol kiriting'),
})

type LoginFormValues = z.infer<typeof loginSchema>

type LoginResponse = ApiSuccessResponse<{
	accessToken: string
	user: AuthUser & { id: number | string }
}>

export default function LoginPage() {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const setAuth = useAuthStore(s => s.setAuth)
	const [serverError, setServerError] = useState<string | null>(null)

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			identifier: '',
			password: '',
		},
	})

	const isSubmitting = form.formState.isSubmitting

	async function onSubmit(values: LoginFormValues) {
		setServerError(null)
		try {
			const res = await apiClient.post<LoginResponse>('/api/auth/login', {
				identifier: values.identifier,
				password: values.password,
			})

			if (!res.data.success) {
				const msg = AUTH_TOAST.invalidCredentials
				setServerError(msg)
				toast.error(msg)
				return
			}

			const token = res.data.data.accessToken
			const user = normalizeAuthUser(
				res.data.data.user,
			) as AuthUser
			setAuth({ token, user })

			toast.success(AUTH_TOAST.loginSuccess)

			const redirectParam = searchParams.get('redirect')
			const storedRedirect = consumeAuthRedirect()
			const redirect =
				isSafeRedirectPath(redirectParam)
					? redirectParam
					: isSafeRedirectPath(storedRedirect)
						? storedRedirect
						: null

			if (redirect) {
				navigate(redirect, { replace: true })
				return
			}

			navigateByRole(navigate, user.role)
		} catch (error) {
			if (
				axios.isAxiosError(error) &&
				error.response?.status === 403 &&
				values.identifier.includes('@')
			) {
				toast.error('Hisob tasdiqlanmagan. Tasdiqlash kodini kiriting.')
				navigate(
					`/verify-otp?email=${encodeURIComponent(values.identifier)}`,
				)
				return
			}
			setServerError(
				handleAuthError(error, AUTH_TOAST.invalidCredentials),
			)
		}
	}

	return (
		<AuthCard
			title='Kirish'
			subtitle='Toyxonaga xush kelibsiz'
			size='compact'
			footer={
				<p style={{ color: 'var(--color-text-secondary)' }}>
					Hisobingiz yo‘qmi?{' '}
					<Link
						to='/register'
						style={{ color: 'var(--color-brand)' }}
					>
						Ro‘yxatdan o‘ting
					</Link>
				</p>
			}
		>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col gap-4'
				noValidate
			>
				{serverError && <Alert variant='error'>{serverError}</Alert>}

				<FormField
					label='Foydalanuvchi nomi yoki elektron pochta'
					placeholder='foydalanuvchi nomi yoki elektron pochta'
					autoComplete='username'
					disabled={isSubmitting}
					hint='Foydalanuvchi nomi yoki elektron pochta manzili'
					error={form.formState.errors.identifier?.message}
					{...form.register('identifier')}
				/>

				<FormField
					label='Parol'
					type='password'
					placeholder='Parolingiz'
					autoComplete='current-password'
					disabled={isSubmitting}
					error={form.formState.errors.password?.message}
					{...form.register('password')}
				/>

				<div className='text-right'>
					<Link
						to='/forgot-password'
						className='text-sm'
						style={{ color: 'var(--color-brand)' }}
					>
						Parolni unutdingizmi?
					</Link>
				</div>

				<Button
					type='submit'
					loading={isSubmitting}
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Kirish...' : 'Kirish'}
				</Button>
			</form>
		</AuthCard>
	)
}
