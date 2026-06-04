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

const registerSchema = z.object({
	firstName: z.string().min(1, 'Ism majburiy'),
	lastName: z.string().min(1, 'Familiya majburiy'),
	username: z.string().min(1, 'Foydalanuvchi nomi majburiy'),
	email: z.string().email('Elektron pochta noto‘g‘ri'),
	phone: z.string().min(1, 'Telefon raqami majburiy'),
	password: z
		.string()
		.min(8, 'Parol kamida 8 ta belgidan iborat bo‘lsin'),
})

type RegisterFormValues = z.infer<typeof registerSchema>

type RegisterResponse = ApiSuccessResponse<{
	user: { email: string }
}>

export default function RegisterOwnerPage() {
	const navigate = useNavigate()
	const [serverError, setServerError] = useState<string | null>(null)

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			username: '',
			email: '',
			phone: '',
			password: '',
		},
	})

	const isSubmitting = form.formState.isSubmitting

	async function onSubmit(values: RegisterFormValues) {
		setServerError(null)

		try {
			const res = await apiClient.post<RegisterResponse>(
				'/api/auth/register/owner',
				values,
			)

			if (!res.data.success) {
				const msg = 'Ro‘yxatdan o‘tishda xatolik yuz berdi'
				setServerError(msg)
				toast.error(msg)
				return
			}

			toast.success(AUTH_TOAST.registerSuccess)
			navigate(`/verify-otp?email=${encodeURIComponent(values.email)}`)
		} catch (error) {
			setServerError(
				handleAuthError(error, 'Ro‘yxatdan o‘tishda xatolik yuz berdi'),
			)
		}
	}

	return (
		<AuthCard
			title='Maskan egasi sifatida ro‘yxatdan o‘tish'
			subtitle='O‘yin maskaningizni platformaga qo‘shing'
			size='wide'
			footer={
				<p style={{ color: 'var(--color-text-secondary)' }}>
					Mijozmisiz?{' '}
					<Link to='/register' style={{ color: 'var(--color-brand)' }}>
						Mijoz ro‘yxati
					</Link>
					{' · '}
					<Link to='/login' style={{ color: 'var(--color-brand)' }}>
						Kirish
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

				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
					<FormField
						label='Ism'
						placeholder='Ismingiz'
						disabled={isSubmitting}
						error={form.formState.errors.firstName?.message}
						{...form.register('firstName')}
					/>
					<FormField
						label='Familiya'
						placeholder='Familiyangiz'
						disabled={isSubmitting}
						error={form.formState.errors.lastName?.message}
						{...form.register('lastName')}
					/>
				</div>

				<FormField
					label='Foydalanuvchi nomi'
					placeholder='foydalanuvchi nomi'
					disabled={isSubmitting}
					error={form.formState.errors.username?.message}
					{...form.register('username')}
				/>

				<FormField
					label='Elektron pochta'
					type='email'
					placeholder='email@misol.uz'
					autoComplete='email'
					disabled={isSubmitting}
					error={form.formState.errors.email?.message}
					{...form.register('email')}
				/>

				<FormField
					label='Telefon'
					type='tel'
					placeholder='+998 90 123 45 67'
					disabled={isSubmitting}
					error={form.formState.errors.phone?.message}
					{...form.register('phone')}
				/>

				<FormField
					label='Parol'
					type='password'
					placeholder='Kamida 8 ta belgi'
					autoComplete='new-password'
					disabled={isSubmitting}
					error={form.formState.errors.password?.message}
					{...form.register('password')}
				/>

				<Button
					type='submit'
					loading={isSubmitting}
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Yuborilmoqda...' : 'Ro‘yxatdan o‘tish'}
				</Button>
			</form>
		</AuthCard>
	)
}
