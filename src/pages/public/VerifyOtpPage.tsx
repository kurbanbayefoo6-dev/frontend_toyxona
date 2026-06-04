import { zodResolver } from '@hookform/resolvers/zod'

import { useEffect, useMemo, useState } from 'react'

import { useForm } from 'react-hook-form'

import { Link, useLocation, useNavigate } from 'react-router-dom'

import { z } from 'zod'



import { AuthCard } from '@/components/auth/AuthCard'

import { DemoOtpBox } from '@/components/auth/DemoOtpBox'

import { FormField } from '@/components/auth/FormField'

import { Alert, Button } from '@/components/ui'

import { apiClient } from '@/services/apiClient'

import { toast } from '@/stores/toastStore'

import { useAuthStore } from '@/stores/authStore'

import type { ApiSuccessResponse } from '@/types/api'

import type { AuthUser } from '@/types/auth'

import { handleAuthError } from '@/utils/handleAuthError'

import { navigateByRole, normalizeAuthUser } from '@/utils/authNavigation'

import { AUTH_TOAST } from '@/utils/toastMessages'



const verifySchema = z.object({

	email: z.string().email('Elektron pochta noto‘g‘ri'),

	otpCode: z.string().min(1, 'Tasdiqlash kodi majburiy'),

})



type VerifyFormValues = z.infer<typeof verifySchema>



type VerifyResponse = ApiSuccessResponse<{

	accessToken: string

	user: AuthUser & { id: number | string }

}>



export default function VerifyOtpPage() {

	const navigate = useNavigate()

	const location = useLocation()

	const setAuth = useAuthStore(s => s.setAuth)



	const queryEmail = useMemo(() => {

		const params = new URLSearchParams(location.search)

		return params.get('email') ?? ''

	}, [location.search])



	const [serverError, setServerError] = useState<string | null>(null)

	const [resendLoading, setResendLoading] = useState(false)



	const form = useForm<VerifyFormValues>({

		resolver: zodResolver(verifySchema),

		defaultValues: {

			email: queryEmail,

			otpCode: '',

		},

	})



	useEffect(() => {

		if (queryEmail) {

			form.setValue('email', queryEmail)

		}

	}, [queryEmail, form])



	const isSubmitting = form.formState.isSubmitting

	const emailValue = form.watch('email')



	async function onSubmit(values: VerifyFormValues) {

		setServerError(null)



		try {

			const res = await apiClient.post<VerifyResponse>('/api/auth/verify-otp', {

				email: values.email,

				otpCode: values.otpCode,

			})



			if (!res.data.success) {

				const msg = AUTH_TOAST.invalidOtp

				setServerError(msg)

				toast.error(msg)

				return

			}



			const token = res.data.data.accessToken

			const user = normalizeAuthUser(

				res.data.data.user,

			) as AuthUser



			setAuth({ token, user })

			toast.success(AUTH_TOAST.otpVerified)

			navigateByRole(navigate, user.role)

		} catch (error) {

			setServerError(handleAuthError(error, AUTH_TOAST.invalidOtp))

		}

	}



	async function handleResendOtp() {

		if (!emailValue) {

			const msg = 'Avval elektron pochta manzilini kiriting'

			setServerError(msg)

			toast.error(msg)

			return

		}



		setServerError(null)

		setResendLoading(true)



		try {

			const res = await apiClient.post<ApiSuccessResponse<unknown>>(

				'/api/auth/resend-otp',

				{ email: emailValue },

			)



			if (!res.data.success) {

				const msg = 'Kodni qayta yuborib bo‘lmadi'

				setServerError(msg)

				toast.error(msg)

				return

			}



			toast.success(AUTH_TOAST.resendOtpSuccess)

		} catch (error) {

			setServerError(

				handleAuthError(error, 'Kodni qayta yuborib bo‘lmadi'),

			)

		} finally {

			setResendLoading(false)

		}

	}



	return (

		<AuthCard

			title='Elektron pochtani tasdiqlash'

			subtitle='Hisobingizni faollashtirish uchun tasdiqlash kodini kiriting'

			size='compact'

			footer={

				<p style={{ color: 'var(--color-text-secondary)' }}>

					<Link to='/login' style={{ color: 'var(--color-brand)' }}>

						Kirish sahifasiga qaytish

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

					label='Elektron pochta'

					type='email'

					placeholder='email@misol.uz'

					autoComplete='email'

					disabled={isSubmitting || resendLoading}

					error={form.formState.errors.email?.message}

					{...form.register('email')}

				/>



				<DemoOtpBox />



				<FormField

					label='Tasdiqlash kodi'

					placeholder='123456'

					inputMode='numeric'

					maxLength={6}

					disabled={isSubmitting || resendLoading}

					error={form.formState.errors.otpCode?.message}

					hint='6 xonali kod (10 daqiqa amal qiladi)'

					{...form.register('otpCode')}

				/>



				<Button

					type='submit'

					loading={isSubmitting}

					disabled={isSubmitting || resendLoading}

				>

					{isSubmitting ? 'Tekshirilmoqda...' : 'Tasdiqlash'}

				</Button>



				<Button

					type='button'

					variant='secondary'

					loading={resendLoading}

					disabled={isSubmitting || resendLoading || !emailValue}

					onClick={handleResendOtp}

				>

					{resendLoading ? 'Yuborilmoqda...' : 'Kodni qayta yuborish'}

				</Button>

			</form>

		</AuthCard>

	)

}
