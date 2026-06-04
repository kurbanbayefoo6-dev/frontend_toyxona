import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { FormField } from '@/components/auth/FormField'
import { BookingCalendar } from '@/components/features/venue-detail/BookingCalendar'
import { BookingDetailsModal } from '@/components/features/venue-detail/BookingDetailsModal'
import {
	OwnerSection,
	usePendingImages,
	VenueImageUploader,
	VenueStatusBadge,
} from '@/components/features/owner'
import { CustomerListSkeleton } from '@/components/features/customer'
import { VenueListError } from '@/components/features/venues'
import { Button, Modal, Select } from '@/components/ui'
import { DISTRICTS } from '@/constants/districts'
import { useOwnerVenueFull } from '@/hooks/useOwnerVenueFull'
import { useVenueBookingCalendar } from '@/hooks/useVenueBookingCalendar'
import {
	createCar,
	createKarnay,
	createMenuItem,
	createSinger,
	deleteCar,
	deleteMenuItem,
	deleteSinger,
	deleteVenueImage,
	updateCar,
	updateKarnay,
	updateMenuItem,
	updateSinger,
	uploadVenueImage,
} from '@/services/ownerCatalog.service'
import {
	createVenue,
	updateVenue,
} from '@/services/venue.service'
import { toast } from '@/stores/toastStore'
import type { BookingCalendarEntry } from '@/types/venueDetail'
import { getApiErrorMessage } from '@/utils/authErrors'
import { formatCurrency } from '@/utils/formatCurrency'
import { normalizeDateKey } from '@/utils/customerStatus'

const venueSchema = z.object({
	name: z.string().min(1, 'Nom kiriting'),
	district: z.string().min(1, 'Tumanni tanlang'),
	address: z.string().min(1, 'Manzil kiriting'),
	capacity: z.number().min(1, 'Sig‘im kamida 1'),
	pricePerSeat: z.number().min(0, 'Narx manfiy bo‘lmasin'),
	phone: z.string().min(9, 'Telefon kiriting'),
	description: z.string().optional(),
})

type VenueFormValues = z.infer<typeof venueSchema>

type VenueManagePageProps = {
	mode: 'create' | 'edit'
	venueId?: number
}

export default function VenueManagePage({ mode, venueId = 0 }: VenueManagePageProps) {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const isEdit = mode === 'edit' && venueId > 0

	const fullQuery = useOwnerVenueFull(isEdit ? venueId : 0)
	const calendarQuery = useVenueBookingCalendar(venueId, isEdit)
	const { pending, addFiles, removePending, clearPending } = usePendingImages()

	const [calendarDate, setCalendarDate] = useState<string | null>(null)
	const [calendarModal, setCalendarModal] = useState(false)
	const [calendarBooking, setCalendarBooking] =
		useState<BookingCalendarEntry | null>(null)

	const [singerModal, setSingerModal] = useState(false)
	const [carModal, setCarModal] = useState(false)
	const [menuModal, setMenuModal] = useState(false)
	const [editingSinger, setEditingSinger] = useState<number | null>(null)
	const [editingCar, setEditingCar] = useState<number | null>(null)
	const [editingMenu, setEditingMenu] = useState<number | null>(null)

	const form = useForm<VenueFormValues>({
		resolver: zodResolver(venueSchema),
		defaultValues: {
			name: '',
			district: DISTRICTS[0],
			address: '',
			capacity: 50,
			pricePerSeat: 0,
			phone: '',
			description: '',
		},
	})

	useEffect(() => {
		if (!fullQuery.data) return
		const v = fullQuery.data.venue
		form.reset({
			name: v.name,
			district: v.district,
			address: v.address,
			capacity: v.capacity,
			pricePerSeat: v.pricePerSeat,
			phone: v.phone,
			description: '',
		})
	}, [fullQuery.data, form])

	const calendarByDate = useMemo(() => {
		const map = new Map<string, BookingCalendarEntry>()
		calendarQuery.data?.forEach(entry => {
			map.set(normalizeDateKey(entry.bookingDate), entry)
		})
		return map
	}, [calendarQuery.data])

	const saveVenueMutation = useMutation({
		mutationFn: async (values: VenueFormValues) => {
			const payload = {
				name: values.name,
				district: values.district,
				address: values.address,
				capacity: values.capacity,
				pricePerSeat: values.pricePerSeat,
				phone: values.phone,
			}
			if (isEdit) {
				return updateVenue(venueId, payload)
			}
			return createVenue(payload)
		},
		onSuccess: async venue => {
			const id = venue.id
			for (const p of pending) {
				await uploadVenueImage(id, p.file)
			}
			clearPending()
			void queryClient.invalidateQueries({ queryKey: ['owner'] })
			toast.success(isEdit ? 'Maskan yangilandi' : 'Maskan yaratildi')
			if (!isEdit) {
				navigate(`/owner/venues/${id}/edit`, { replace: true })
			}
		},
		onError: err => {
			toast.error(getApiErrorMessage(err, 'Server bilan bog‘lanib bo‘lmadi'))
		},
	})

	async function handleDeleteImage(imageId: number) {
		try {
			await deleteVenueImage(imageId)
			void queryClient.invalidateQueries({
				queryKey: ['owner', 'venue', venueId, 'full'],
			})
			toast.success('Rasm o‘chirildi')
		} catch (err) {
			toast.error(getApiErrorMessage(err, 'Server bilan bog‘lanib bo‘lmadi'))
		}
	}

	function handleBookedClick(date: string) {
		setCalendarDate(date)
		setCalendarBooking(calendarByDate.get(date) ?? null)
		setCalendarModal(true)
	}

	if (isEdit && fullQuery.isLoading) {
		return (
			<div>
				<h1 className='mb-6 text-2xl font-semibold'>Maskan</h1>
				<CustomerListSkeleton rows={4} />
			</div>
		)
	}

	if (isEdit && (fullQuery.isError || !fullQuery.data)) {
		return (
			<div>
				<VenueListError
					message={getApiErrorMessage(fullQuery.error, 'Maskan yuklanmadi')}
					onRetry={() => void fullQuery.refetch()}
					isRetrying={fullQuery.isFetching}
				/>
			</div>
		)
	}

	const data = fullQuery.data
	const images = data?.images ?? []

	return (
		<div className='mx-auto max-w-4xl'>
			<div className='mb-6 flex flex-wrap items-center gap-3'>
				<Link
					to='/owner/venues'
					className='text-sm'
					style={{ color: 'var(--color-brand)' }}
				>
					← Maskanlar
				</Link>
				<h1
					className='text-2xl font-semibold'
					style={{ color: 'var(--color-text-primary)' }}
				>
					{isEdit ? data?.venue.name ?? 'Tahrirlash' : 'Yangi maskan'}
				</h1>
				{isEdit && data && <VenueStatusBadge status={data.venue.status} />}
			</div>

			<form
				onSubmit={form.handleSubmit(values => {
					saveVenueMutation.mutate(values)
				})}
				className='flex flex-col gap-6'
				noValidate
			>
				<OwnerSection title='Asosiy ma’lumotlar'>
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
						<FormField
							label='Nom'
							error={form.formState.errors.name?.message}
							{...form.register('name')}
						/>
						<div className='flex flex-col gap-1.5'>
							<label className='text-sm font-medium'>Tuman</label>
							<Select {...form.register('district')}>
								{DISTRICTS.map(d => (
									<option key={d} value={d}>
										{d}
									</option>
								))}
							</Select>
						</div>
						<div className='sm:col-span-2'>
							<FormField
								label='Manzil'
								error={form.formState.errors.address?.message}
								{...form.register('address')}
							/>
						</div>
						<FormField
							label='Sig‘im'
							type='number'
							error={form.formState.errors.capacity?.message}
							{...form.register('capacity', { valueAsNumber: true })}
						/>
						<FormField
							label='O‘rin narxi'
							type='number'
							error={form.formState.errors.pricePerSeat?.message}
							{...form.register('pricePerSeat', { valueAsNumber: true })}
						/>
						<FormField
							label='Telefon'
							error={form.formState.errors.phone?.message}
							{...form.register('phone')}
						/>
					</div>
					<label className='mt-4 flex flex-col gap-1.5'>
						<span className='text-sm font-medium'>Tavsif</span>
						<textarea
							rows={3}
							className='w-full rounded-[var(--radius-md)] border px-3 py-2.5 text-sm'
							style={{
								borderColor: 'var(--color-border)',
								backgroundColor: 'var(--color-card-bg)',
							}}
							placeholder='Maskan haqida qisqa ma’lumot'
							{...form.register('description')}
						/>
						<span
							className='text-xs'
							style={{ color: 'var(--color-text-hint)' }}
						>
							Tavsif hozircha faqat shaklda ko‘rsatiladi
						</span>
					</label>
				</OwnerSection>

				<OwnerSection title='Rasmlar'>
					<VenueImageUploader
						existing={images}
						pending={pending}
						onAddPending={addFiles}
						onRemovePending={removePending}
						onDeleteExisting={id => void handleDeleteImage(id)}
						disabled={saveVenueMutation.isPending}
					/>
					{!isEdit && pending.length > 0 && (
						<p
							className='mt-2 text-xs'
							style={{ color: 'var(--color-text-hint)' }}
						>
							Rasmlar maskan yaratilgandan keyin yuklanadi
						</p>
					)}
				</OwnerSection>

				<Button type='submit' loading={saveVenueMutation.isPending}>
					{isEdit ? 'Saqlash' : 'Yaratish va davom etish'}
				</Button>
			</form>

			{isEdit && data && (
				<div className='mt-6 flex flex-col gap-6'>
					<CatalogSection
						title='Xonandalar'
						items={data.singers.map(s => ({
							id: s.id,
							primary: s.name,
							secondary: formatCurrency(s.price),
						}))}
						onAdd={() => {
							setEditingSinger(null)
							setSingerModal(true)
						}}
						onEdit={id => {
							setEditingSinger(id)
							setSingerModal(true)
						}}
						onDelete={id => void handleDeleteSinger(id, venueId, queryClient)}
					/>
					<CatalogSection
						title='Avtomobillar'
						items={data.cars.map(c => ({
							id: c.id,
							primary: c.brand,
							secondary: formatCurrency(c.price),
						}))}
						onAdd={() => {
							setEditingCar(null)
							setCarModal(true)
						}}
						onEdit={id => {
							setEditingCar(id)
							setCarModal(true)
						}}
						onDelete={id => void handleDeleteCar(id, venueId, queryClient)}
					/>
					<CatalogSection
						title='Menyu'
						items={data.menuItems.map(m => ({
							id: m.id,
							primary: m.name,
							secondary: '',
						}))}
						onAdd={() => {
							setEditingMenu(null)
							setMenuModal(true)
						}}
						onEdit={id => {
							setEditingMenu(id)
							setMenuModal(true)
						}}
						onDelete={id => void handleDeleteMenu(id, venueId, queryClient)}
					/>

					<KarnaySection venueId={venueId} items={data.karnaySurnay} />

					<OwnerSection title='Bandlov kalendari'>
						<BookingCalendar
							availability={data.availability}
							selectedDate={calendarDate}
							onSelectDate={setCalendarDate}
							onBookedDateClick={handleBookedClick}
							canViewBookingDetails
						/>
					</OwnerSection>
				</div>
			)}

			{isEdit && (
				<>
					<SingerModal
						open={singerModal}
						venueId={venueId}
						singer={
							editingSinger
								? data?.singers.find(s => s.id === editingSinger)
								: undefined
						}
						onClose={() => setSingerModal(false)}
						onSaved={() => {
							setSingerModal(false)
							void queryClient.invalidateQueries({
								queryKey: ['owner', 'venue', venueId, 'full'],
							})
						}}
					/>
					<CarModal
						open={carModal}
						venueId={venueId}
						car={editingCar ? data?.cars.find(c => c.id === editingCar) : undefined}
						onClose={() => setCarModal(false)}
						onSaved={() => {
							setCarModal(false)
							void queryClient.invalidateQueries({
								queryKey: ['owner', 'venue', venueId, 'full'],
							})
						}}
					/>
					<MenuModal
						open={menuModal}
						venueId={venueId}
						item={
							editingMenu
								? data?.menuItems.find(m => m.id === editingMenu)
								: undefined
						}
						onClose={() => setMenuModal(false)}
						onSaved={() => {
							setMenuModal(false)
							void queryClient.invalidateQueries({
								queryKey: ['owner', 'venue', venueId, 'full'],
							})
						}}
					/>
					<BookingDetailsModal
						open={calendarModal}
						onClose={() => setCalendarModal(false)}
						booking={calendarBooking}
						date={calendarDate}
					/>
				</>
			)}
		</div>
	)
}

function CatalogSection({
	title,
	items,
	onAdd,
	onEdit,
	onDelete,
}: {
	title: string
	items: Array<{ id: number; primary: string; secondary: string }>
	onAdd: () => void
	onEdit: (id: number) => void
	onDelete: (id: number) => void
}) {
	return (
		<OwnerSection
			title={title}
			action={
				<Button type='button' variant='secondary' className='!w-auto px-4' onClick={onAdd}>
					<Plus className='size-4' />
					Qo‘shish
				</Button>
			}
		>
			{items.length === 0 ? (
				<p className='text-sm' style={{ color: 'var(--color-text-hint)' }}>
					Ro‘yxat bo‘sh
				</p>
			) : (
				<ul className='divide-y' style={{ borderColor: 'var(--color-border)' }}>
					{items.map(item => (
						<li
							key={item.id}
							className='flex items-center justify-between gap-2 py-3 first:pt-0'
						>
							<div>
								<p className='font-medium'>{item.primary}</p>
								{item.secondary && (
									<p className='text-sm' style={{ color: 'var(--color-text-secondary)' }}>
										{item.secondary}
									</p>
								)}
							</div>
							<div className='flex gap-1'>
								<button type='button' onClick={() => onEdit(item.id)} aria-label='Tahrirlash'>
									<Pencil className='size-4' />
								</button>
								<button type='button' onClick={() => onDelete(item.id)} aria-label='O‘chirish'>
									<Trash2 className='size-4' style={{ color: 'var(--color-booked)' }} />
								</button>
							</div>
						</li>
					))}
				</ul>
			)}
		</OwnerSection>
	)
}

function KarnaySection({
	venueId,
	items,
}: {
	venueId: number
	items: Array<{ id: number; isAvailable: boolean; price: number }>
}) {
	const queryClient = useQueryClient()
	const [isAvailable, setIsAvailable] = useState(true)
	const [price, setPrice] = useState('')

	const item = items[0]

	useEffect(() => {
		if (item) {
			setIsAvailable(item.isAvailable)
			setPrice(item.isAvailable ? String(item.price) : '')
		}
	}, [item])

	async function handleSave() {
		const payload = {
			venueId,
			isAvailable,
			price: isAvailable ? Number(price) || 0 : 0,
		}
		try {
			if (item) {
				await updateKarnay(item.id, {
					isAvailable: payload.isAvailable,
					price: payload.price,
				})
			} else {
				await createKarnay(payload)
			}
			void queryClient.invalidateQueries({
				queryKey: ['owner', 'venue', venueId, 'full'],
			})
			toast.success('Karnay-surnay saqlandi')
		} catch (err) {
			toast.error(getApiErrorMessage(err, 'Server bilan bog‘lanib bo‘lmadi'))
		}
	}

	return (
		<OwnerSection title='Karnay-surnay'>
			<label className='flex items-center gap-2 text-sm'>
				<input
					type='checkbox'
					checked={isAvailable}
					onChange={e => setIsAvailable(e.target.checked)}
				/>
				Mavjud
			</label>
			{isAvailable && (
				<div className='mt-3'>
					<FormField
						label='Narxi'
						type='number'
						min={0}
						value={price}
						onChange={e => setPrice(e.target.value)}
					/>
				</div>
			)}
			<Button type='button' className='mt-4 !w-auto px-6' onClick={() => void handleSave()}>
				Saqlash
			</Button>
		</OwnerSection>
	)
}

async function handleDeleteSinger(
	id: number,
	venueId: number,
	queryClient: ReturnType<typeof useQueryClient>,
) {
	try {
		await deleteSinger(id)
		void queryClient.invalidateQueries({ queryKey: ['owner', 'venue', venueId, 'full'] })
		toast.success('O‘chirildi')
	} catch (err) {
		toast.error(getApiErrorMessage(err, 'Server bilan bog‘lanib bo‘lmadi'))
	}
}

async function handleDeleteCar(
	id: number,
	venueId: number,
	queryClient: ReturnType<typeof useQueryClient>,
) {
	try {
		await deleteCar(id)
		void queryClient.invalidateQueries({ queryKey: ['owner', 'venue', venueId, 'full'] })
		toast.success('O‘chirildi')
	} catch (err) {
		toast.error(getApiErrorMessage(err, 'Server bilan bog‘lanib bo‘lmadi'))
	}
}

async function handleDeleteMenu(
	id: number,
	venueId: number,
	queryClient: ReturnType<typeof useQueryClient>,
) {
	try {
		await deleteMenuItem(id)
		void queryClient.invalidateQueries({ queryKey: ['owner', 'venue', venueId, 'full'] })
		toast.success('O‘chirildi')
	} catch (err) {
		toast.error(getApiErrorMessage(err, 'Server bilan bog‘lanib bo‘lmadi'))
	}
}

function SingerModal({
	open,
	onClose,
	venueId,
	singer,
	onSaved,
}: {
	open: boolean
	onClose: () => void
	venueId: number
	singer?: { id: number; name: string; price: number }
	onSaved: () => void
}) {
	const [name, setName] = useState('')
	const [price, setPrice] = useState('')
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (open) {
			setName(singer?.name ?? '')
			setPrice(singer ? String(singer.price) : '')
		}
	}, [open, singer])

	async function submit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		try {
			if (singer) {
				await updateSinger(singer.id, { name, price: Number(price) })
			} else {
				await createSinger({ venueId, name, price: Number(price) })
			}
			toast.success('Saqlandi')
			onSaved()
		} catch (err) {
			toast.error(getApiErrorMessage(err, 'Server bilan bog‘lanib bo‘lmadi'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal open={open} onClose={onClose} title={singer ? 'Xonandani tahrirlash' : 'Xonanda qo‘shish'}>
			<form onSubmit={e => void submit(e)} className='flex flex-col gap-3'>
				<FormField label='Ism' value={name} onChange={e => setName(e.target.value)} required />
				<FormField label='Narxi' type='number' value={price} onChange={e => setPrice(e.target.value)} required />
				<Button type='submit' loading={loading}>Saqlash</Button>
			</form>
		</Modal>
	)
}

function CarModal({
	open,
	onClose,
	venueId,
	car,
	onSaved,
}: {
	open: boolean
	onClose: () => void
	venueId: number
	car?: { id: number; brand: string; price: number }
	onSaved: () => void
}) {
	const [brand, setBrand] = useState('')
	const [price, setPrice] = useState('')
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (open) {
			setBrand(car?.brand ?? '')
			setPrice(car ? String(car.price) : '')
		}
	}, [open, car])

	async function submit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		try {
			if (car) {
				await updateCar(car.id, { brand, price: Number(price) })
			} else {
				await createCar({ venueId, brand, price: Number(price) })
			}
			toast.success('Saqlandi')
			onSaved()
		} catch (err) {
			toast.error(getApiErrorMessage(err, 'Server bilan bog‘lanib bo‘lmadi'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal open={open} onClose={onClose} title={car ? 'Avtomobilni tahrirlash' : 'Avtomobil qo‘shish'}>
			<form onSubmit={e => void submit(e)} className='flex flex-col gap-3'>
				<FormField label='Marka' value={brand} onChange={e => setBrand(e.target.value)} required />
				<FormField label='Narxi' type='number' value={price} onChange={e => setPrice(e.target.value)} required />
				<Button type='submit' loading={loading}>Saqlash</Button>
			</form>
		</Modal>
	)
}

function MenuModal({
	open,
	onClose,
	venueId,
	item,
	onSaved,
}: {
	open: boolean
	onClose: () => void
	venueId: number
	item?: { id: number; name: string }
	onSaved: () => void
}) {
	const [name, setName] = useState('')
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (open) setName(item?.name ?? '')
	}, [open, item])

	async function submit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		try {
			if (item) {
				await updateMenuItem(item.id, { name })
			} else {
				await createMenuItem({ venueId, name })
			}
			toast.success('Saqlandi')
			onSaved()
		} catch (err) {
			toast.error(getApiErrorMessage(err, 'Server bilan bog‘lanib bo‘lmadi'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal open={open} onClose={onClose} title={item ? 'Menyu tahrirlash' : 'Menyu qo‘shish'}>
			<form onSubmit={e => void submit(e)} className='flex flex-col gap-3'>
				<FormField label='Nomi' value={name} onChange={e => setName(e.target.value)} required />
				<Button type='submit' loading={loading}>Saqlash</Button>
			</form>
		</Modal>
	)
}
