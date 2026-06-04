import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { AuthCard } from '@/components/auth/AuthCard'
import { FormField } from '@/components/auth/FormField'
import { Alert, Button } from '@/components/ui'
import { apiClient } from '@/services/apiClient'
import { toast } from '@/stores/toastStore'
import type { ApiSuccessResponse } from '@/types/api'
import { handleAuthError } from '@/utils/handleAuthError'
import { AUTH_TOAST } from '@/utils/toastMessages'

const resetSchema = z
	.object({
		newPassword: z.string().min(1, 'Yangi parol majburiy').min(6, 'Parol kamida 6 ta belgidan iborat bo‘lsin'),
		confirmPassword: z.string().min(1, 'Parolni tasdiqlang'),
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: 'Parollar mos kelmayapti',
		path: ['confirmPassword'],
	})

type ResetFormValues = z.infer<typeof resetSchema>

export default function ResetPasswordPage() {
	const navigate = useNavigate()
	const location = useLocation()

	const resetToken = useMemo(() => {
		const params = new URLSearchParams(location.search)
		return params.get('token') ?? ''
	}, [location.search])

	const [serverError, setServerError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	const form = useForm<ResetFormValues>({
		resolver: zodResolver(resetSchema),
		defaultValues: {
			newPassword: '',
			confirmPassword: '',
		},
	})

	const isSubmitting = form.formState.isSubmitting

	async function onSubmit(values: ResetFormValues) {
		setServerError(null)

		if (!resetToken) {
			const msg =
				'Tiklash havolasi topilmadi. Elektron pochtadagi havoladan kiring yoki qayta so‘rang.'
			setServerError(msg)
			toast.error(msg)
			return
		}

		try {
			const res = await apiClient.post<ApiSuccessResponse<null>>(
				'/api/auth/reset-password',
				{
					token: resetToken,
					newPassword: values.newPassword,
				},
			)

			if (!res.data.success) {
				const msg = 'Parol yangilanmadi. Qayta urinib ko‘ring'
				setServerError(msg)
				toast.error(msg)
				return
			}

			const msg =
				'Parolingiz muvaffaqiyatli yangilandi. Endi yangi parol bilan kiring.'
			setSuccessMessage(msg)
			toast.success(AUTH_TOAST.passwordResetSuccess)
		} catch (error) {
			setServerError(
				handleAuthError(error, 'Parol yangilanmadi. Qayta urinib ko‘ring'),
			)
		}
	}

	if (!resetToken && !successMessage) {
		return (
			<AuthCard
				title='Parolni yangilash'
				subtitle='Tiklash havolasi noto‘g‘ri yoki muddati tugagan'
				size='compact'
				footer={
					<p style={{ color: 'var(--color-text-secondary)' }}>
						<Link
							to='/forgot-password'
							style={{ color: 'var(--color-brand)' }}
						>
							Qayta so‘rash
						</Link>
					</p>
				}
			>
				<Alert variant='error'>
					Tiklash kaliti topilmadi. Elektron pochtadagi havoladan kiring yoki parolni
					qayta tiklashni so‘rang.
				</Alert>
				<Button
					type='button'
					className='mt-4'
					onClick={() => navigate('/forgot-password')}
				>
					Parolni tiklash
				</Button>
			</AuthCard>
		)
	}

	return (
		<AuthCard
			title='Yangi parol o‘rnatish'
			subtitle='Hisobingiz uchun yangi parol kiriting'
			size='compact'
			footer={
				<p style={{ color: 'var(--color-text-secondary)' }}>
					<Link to='/login' style={{ color: 'var(--color-brand)' }}>
						Kirish sahifasiga qaytish
					</Link>
				</p>
			}
		>
			{successMessage ? (
				<div className='flex flex-col gap-4'>
					<Alert variant='success'>{successMessage}</Alert>
					<Button type='button' onClick={() => navigate('/login')}>
						Kirish
					</Button>
				</div>
			) : (
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='flex flex-col gap-4'
					noValidate
				>
					{serverError && <Alert variant='error'>{serverError}</Alert>}

					<FormField
						label='Yangi parol'
						type='password'
						placeholder='Kamida 6 ta belgi'
						autoComplete='new-password'
						hint='Kamida 6 ta belgi'
						disabled={isSubmitting}
						error={form.formState.errors.newPassword?.message}
						{...form.register('newPassword')}
					/>

					<FormField
						label='Parolni tasdiqlash'
						type='password'
						placeholder='Parolni qayta kiriting'
						autoComplete='new-password'
						disabled={isSubmitting}
						error={form.formState.errors.confirmPassword?.message}
						{...form.register('confirmPassword')}
					/>

					<Button
						type='submit'
						loading={isSubmitting}
						disabled={isSubmitting || !resetToken}
					>
						{isSubmitting ? 'Saqlanmoqda...' : 'Parolni saqlash'}
					</Button>
				</form>
			)}
		</AuthCard>
	)
}
