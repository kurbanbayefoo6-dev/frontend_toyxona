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
	email: z.string().email('Email noto‘g‘ri'),
	username: z.string().min(3, 'Login kamida 3 belgi'),
	password: z.string().min(6, 'Parol kamida 6 belgi'),
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
		},
	})

	const mutation = useMutation({
		mutationFn: (values: FormValues) => createOwnerByAdmin(values),
		onSuccess: () => {
			toast.success('Owner yaratildi. U darhol tizimga kira oladi.')
			form.reset()
			onCreated()
			onClose()
		},
		onError: err => {
			toast.error(getApiErrorMessage(err, 'Owner yaratib bo‘lmadi'))
		},
	})

	return (
		<Modal open={open} onClose={onClose} title='Yangi owner qo‘shish' size='lg'>
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
					label='Email'
					type='email'
					error={form.formState.errors.email?.message}
					{...form.register('email')}
				/>
				<FormField
					label='Login (username)'
					error={form.formState.errors.username?.message}
					{...form.register('username')}
				/>
				<FormField
					label='Parol'
					type='password'
					error={form.formState.errors.password?.message}
					{...form.register('password')}
				/>
				<p
					className='text-xs'
					style={{ color: 'var(--color-text-hint)' }}
				>
					Owner avtomatik tasdiqlangan hisob bilan yaratiladi va login qilishi mumkin.
				</p>
				<Button type='submit' loading={mutation.isPending} className='mt-2'>
					Saqlash
				</Button>
			</form>
		</Modal>
	)
}
