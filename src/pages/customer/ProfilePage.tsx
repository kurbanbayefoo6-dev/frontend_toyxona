import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { FormField } from '@/components/auth/FormField'
import {
	CustomerListSkeleton,
} from '@/components/features/customer'
import { VenueListError } from '@/components/features/venues'
import { Alert, Button } from '@/components/ui'
import { useCustomerProfile } from '@/hooks/useCustomerProfile'
import { changePassword, updateProfile } from '@/services/user.service'
import { toast } from '@/stores/toastStore'
import { useAuthStore } from '@/stores/authStore'
import type { AuthUser } from '@/types/auth'
import { getApiErrorMessage } from '@/utils/authErrors'

const profileSchema = z.object({
	firstName: z.string().min(1, 'Ism kiriting'),
	lastName: z.string().min(1, 'Familiya kiriting'),
	phone: z.string().min(9, 'Telefon raqamini kiriting'),
})

const passwordSchema = z
	.object({
		currentPassword: z.string().min(1, 'Joriy parolni kiriting'),
		newPassword: z
			.string()
			.min(6, 'Yangi parol kamida 6 ta belgidan iborat bo‘lsin'),
		confirmPassword: z.string().min(1, 'Parolni tasdiqlang'),
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: 'Parollar mos kelmaydi',
		path: ['confirmPassword'],
	})

type ProfileFormValues = z.infer<typeof profileSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

export default function CustomerProfilePage() {
	const queryClient = useQueryClient()
	const setUser = useAuthStore(s => s.setUser)
	const { data, isLoading, isError, error, refetch, isFetching } =
		useCustomerProfile()

	const profileForm = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			phone: '',
		},
	})

	const passwordForm = useForm<PasswordFormValues>({
		resolver: zodResolver(passwordSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	})

	useEffect(() => {
		if (!data) return
		profileForm.reset({
			firstName: data.firstName,
			lastName: data.lastName,
			phone: data.phone,
		})
	}, [data, profileForm])

	const profileMutation = useMutation({
		mutationFn: updateProfile,
		onSuccess: updated => {
			void queryClient.invalidateQueries({ queryKey: ['customer', 'profile'] })
			const authUser: AuthUser = {
				id: String(updated.id),
				firstName: updated.firstName,
				lastName: updated.lastName,
				username: updated.username,
				email: updated.email,
				phone: updated.phone,
				role: 'customer',
				isVerified: updated.isVerified,
			}
			setUser(authUser)
			toast.success('Profil yangilandi')
		},
		onError: err => {
			toast.error(getApiErrorMessage(err, 'Server bilan bog‘lanib bo‘lmadi'))
		},
	})

	const passwordMutation = useMutation({
		mutationFn: changePassword,
		onSuccess: () => {
			passwordForm.reset()
			toast.success('Parol muvaffaqiyatli yangilandi')
		},
		onError: err => {
			toast.error(getApiErrorMessage(err, 'Server bilan bog‘lanib bo‘lmadi'))
		},
	})

	if (isLoading) {
		return (
			<div>
				<h1
					className='mb-6 text-2xl font-semibold'
					style={{ color: 'var(--color-text-primary)' }}
				>
					Profil
				</h1>
				<CustomerListSkeleton rows={3} />
			</div>
		)
	}

	if (isError || !data) {
		return (
			<div>
				<h1
					className='mb-6 text-2xl font-semibold'
					style={{ color: 'var(--color-text-primary)' }}
				>
					Profil
				</h1>
				<VenueListError
					message={getApiErrorMessage(error, 'Profil yuklanmadi')}
					onRetry={() => void refetch()}
					isRetrying={isFetching}
				/>
			</div>
		)
	}

	return (
		<div className='mx-auto max-w-lg'>
			<h1
				className='mb-6 text-2xl font-semibold'
				style={{ color: 'var(--color-text-primary)' }}
			>
				Profil
			</h1>

			<section
				className='mb-6 rounded-[var(--radius-lg)] border p-4 sm:p-6'
				style={{
					backgroundColor: 'var(--color-card-bg)',
					borderColor: 'var(--color-border)',
				}}
			>
				<h2
					className='mb-4 text-lg font-semibold'
					style={{ color: 'var(--color-text-primary)' }}
				>
					Shaxsiy ma’lumotlar
				</h2>
				<p
					className='mb-4 text-sm'
					style={{ color: 'var(--color-text-hint)' }}
				>
					{data.email} · @{data.username}
				</p>

				<form
					onSubmit={profileForm.handleSubmit(values =>
						profileMutation.mutate(values),
					)}
					className='flex flex-col gap-4'
					noValidate
				>
					<FormField
						label='Ism'
						disabled={profileMutation.isPending}
						error={profileForm.formState.errors.firstName?.message}
						{...profileForm.register('firstName')}
					/>
					<FormField
						label='Familiya'
						disabled={profileMutation.isPending}
						error={profileForm.formState.errors.lastName?.message}
						{...profileForm.register('lastName')}
					/>
					<FormField
						label='Telefon'
						disabled={profileMutation.isPending}
						error={profileForm.formState.errors.phone?.message}
						{...profileForm.register('phone')}
					/>
					<Button
						type='submit'
						loading={profileMutation.isPending}
						disabled={profileMutation.isPending}
					>
						Saqlash
					</Button>
				</form>
			</section>

			<section
				className='rounded-[var(--radius-lg)] border p-4 sm:p-6'
				style={{
					backgroundColor: 'var(--color-card-bg)',
					borderColor: 'var(--color-border)',
				}}
			>
				<h2
					className='mb-4 text-lg font-semibold'
					style={{ color: 'var(--color-text-primary)' }}
				>
					Parolni o‘zgartirish
				</h2>

				<form
					onSubmit={passwordForm.handleSubmit(values =>
						passwordMutation.mutate({
							currentPassword: values.currentPassword,
							newPassword: values.newPassword,
						}),
					)}
					className='flex flex-col gap-4'
					noValidate
				>
					{passwordMutation.isError && (
						<Alert variant='error'>
							{getApiErrorMessage(
								passwordMutation.error,
								'Parol yangilanmadi',
							)}
						</Alert>
					)}
					<FormField
						label='Joriy parol'
						type='password'
						disabled={passwordMutation.isPending}
						error={passwordForm.formState.errors.currentPassword?.message}
						{...passwordForm.register('currentPassword')}
					/>
					<FormField
						label='Yangi parol'
						type='password'
						disabled={passwordMutation.isPending}
						error={passwordForm.formState.errors.newPassword?.message}
						{...passwordForm.register('newPassword')}
					/>
					<FormField
						label='Yangi parolni tasdiqlang'
						type='password'
						disabled={passwordMutation.isPending}
						error={passwordForm.formState.errors.confirmPassword?.message}
						{...passwordForm.register('confirmPassword')}
					/>
					<Button
						type='submit'
						variant='secondary'
						loading={passwordMutation.isPending}
						disabled={passwordMutation.isPending}
					>
						Parolni yangilash
					</Button>
				</form>
			</section>
		</div>
	)
}
