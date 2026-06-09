import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { FormField } from '@/components/auth/FormField'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { createOwnerByAdmin } from '@/services/admin.service'
import { toast } from '@/stores/toastStore'
import { getApiErrorMessage } from '@/utils/authErrors'

const schema = z.object({
	firstName: z.string().min(1, 'Ism kiriting'),
	lastName: z.string().min(1, 'Familiya kiriting'),
	email: z.string().email('Elektron pochta noto‘g‘ri'),
	username: z.string().min(3, 'Foydalanuvchi nomi kamida 3 belgi'),
	password: z.string().min(6, 'Parol kamida 6 belgi'),
	phone: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

type CreateOwnerModalProps = {
	open: boolean
	onClose: () => void
	onCreated: () => void
}

export function CreateOwnerModal({
	open,
	onClose,
	onCreated,
}: CreateOwnerModalProps) {
	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			username: '',
			password: '',
			phone: '',
		},
	})

	const mutation = useMutation({
		mutationFn: (values: FormValues) => createOwnerByAdmin(values),
		onSuccess: () => {
			toast.success('Ega yaratildi. U darhol tizimga kira oladi.')
			form.reset()
			onCreated()
			onClose()
		},
		onError: err => {
			toast.error(getApiErrorMessage(err, 'Ega yaratib bo‘lmadi'))
		},
	})

	return (
		<Modal open={open} onClose={onClose} title='Yangi ega qo‘shish' size='lg'>
			<form
				onSubmit={form.handleSubmit(values => mutation.mutate(values))}
				className='flex flex-col gap-3'
				noValidate
			>
				<FormField
					label='Ism'
					error={form.formState.errors.firstName?.message}
					{...form.register('firstName')}
				/>
				<FormField
					label='Familiya'
					error={form.formState.errors.lastName?.message}
					{...form.register('lastName')}
				/>
				<FormField
					label='Elektron pochta'
					type='email'
					error={form.formState.errors.email?.message}
					{...form.register('email')}
				/>
				<FormField
					label='Foydalanuvchi nomi'
					error={form.formState.errors.username?.message}
					{...form.register('username')}
				/>
				<FormField
					label='Parol'
					type='password'
					error={form.formState.errors.password?.message}
					{...form.register('password')}
				/>
				<FormField
					label='Telefon (ixtiyoriy)'
					type='tel'
					placeholder='+998901234567'
					error={form.formState.errors.phone?.message}
					{...form.register('phone')}
				/>
				<p
					className='text-xs'
					style={{ color: 'var(--color-text-hint)' }}
				>
					Ega avtomatik tasdiqlangan hisob bilan yaratiladi va darhol kirishi mumkin.
				</p>
				<Button type='submit' loading={mutation.isPending} className='mt-2'>
					Saqlash
				</Button>
			</form>
		</Modal>
	)
}
