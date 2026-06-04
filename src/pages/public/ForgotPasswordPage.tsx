import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { AuthCard } from '@/components/auth/AuthCard'
import { FormField } from '@/components/auth/FormField'
import { Alert, Button } from '@/components/ui'
import { apiClient } from '@/services/apiClient'
import { toast } from '@/stores/toastStore'
import type { ApiSuccessResponse } from '@/types/api'
import { handleAuthError } from '@/utils/handleAuthError'
import { AUTH_TOAST } from '@/utils/toastMessages'

const forgotSchema = z.object({
	email: z
		.string()
		.min(1, 'Elektron pochta majburiy')
		.email('Elektron pochta noto‘g‘ri'),
})

type ForgotFormValues = z.infer<typeof forgotSchema>

type ForgotResponse = ApiSuccessResponse<{ resetToken: string }>

export default function ForgotPasswordPage() {
	const navigate = useNavigate()
	const [serverError, setServerError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	const form = useForm<ForgotFormValues>({
		resolver: zodResolver(forgotSchema),
		defaultValues: { email: '' },
	})

	const isSubmitting = form.formState.isSubmitting

	async function onSubmit(values: ForgotFormValues) {
		setServerError(null)
		setSuccessMessage(null)

		try {
			const res = await apiClient.post<ForgotResponse>(
				'/api/auth/forgot-password',
				{ email: values.email },
			)

			if (!res.data.success) {
				const msg = 'So‘rov yuborilmadi. Qayta urinib ko‘ring'
				setServerError(msg)
				toast.error(msg)
				return
			}

			const msg =
				'Agar bu email ro‘yxatdan o‘tgan bo‘lsa, parolni tiklash havolasi yuborildi. Pochtangizni tekshiring.'
			setSuccessMessage(msg)
			toast.success(AUTH_TOAST.forgotPasswordSent)
			form.reset({ email: values.email })
		} catch (error) {
			setServerError(
				handleAuthError(error, 'So‘rov yuborilmadi. Qayta urinib ko‘ring'),
			)
		}
	}

	return (
		<AuthCard
			title='Parolni tiklash'
			subtitle='Elektron pochta manzilingizni kiriting — tiklash havolasini yuboramiz'
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
						Kirish sahifasiga o‘tish
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
						label='Elektron pochta'
						type='email'
						placeholder='email@misol.uz'
						autoComplete='email'
						hint='Ro‘yxatdan o‘tgan email manzilingizni kiriting'
						disabled={isSubmitting}
						error={form.formState.errors.email?.message}
						{...form.register('email')}
					/>

					<Button
						type='submit'
						loading={isSubmitting}
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Yuborilmoqda...' : 'Havola yuborish'}
					</Button>
				</form>
			)}
		</AuthCard>
	)
}
