import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ImagePlus, Pencil, Plus, Trash2, X } from 'lucide-react'
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
import { useAdminOwners } from '@/hooks/useAdminOwners'
import {
	createVenue,
	deleteVenue,
	updateVenue,
} from '@/services/venue.service'
import { toast } from '@/stores/toastStore'
import type { BookingCalendarEntry } from '@/types/venueDetail'
import { getApiErrorMessage } from '@/utils/authErrors'
import { formatCurrency } from '@/utils/formatCurrency'
import { normalizeDateKey } from '@/utils/customerStatus'
import { resolveImageUrl } from '@/utils/imageUrl'

const venueSchema = z.object({
	name: z.string().min(1, 'Nom kiriting'),
	district: z.string().min(1, 'Tumanni tanlang'),
	address: z.string().min(1, 'Manzil kiriting'),
	capacity: z.number().min(1, 'SigвЂim kamida 1'),
	pricePerSeat: z.number().min(0, 'Narx manfiy boвЂlmasin'),
	phone: z.string().min(9, 'Telefon kiriting'),
	description: z.string().optional(),
})

type VenueFormValues = z.infer<typeof venueSchema>

type VenueManagePageProps = {
	mode: 'create' | 'edit'
	venueId?: number
	adminMode?: boolean
}

export default function VenueManagePage({
	mode,
	venueId = 0,
	adminMode = false,
}: VenueManagePageProps) {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const isEdit = mode === 'edit' && venueId > 0
	const venuesListPath = adminMode ? '/admin/venues' : '/owner/venues'
	const [ownerId, setOwnerId] = useState<number | ''>('')
	const ownersQuery = useAdminOwners({ page: 1, limit: 200 })

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
		if (adminMode) {
			setOwnerId(v.ownerId)
		}
	}, [fullQuery.data, form, adminMode])

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
				...(adminMode && ownerId
					? { ownerId: Number(ownerId) }
					: {}),
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
			void queryClient.invalidateQueries({ queryKey: ['admin', 'venues'] })
			toast.success(isEdit ? 'To‘yxona yangilandi' : 'To‘yxona yaratildi')
			if (!isEdit) {
				const editPath = adminMode
					? `/admin/venues/${id}/edit`
					: `/owner/venues/${id}/edit`
				navigate(editPath, { replace: true })
			}
		},
		onError: err => {
			toast.error(getApiErrorMessage(err, 'Server bilan bogвЂlanib boвЂlmadi'))
		},
	})

	const deleteVenueMutation = useMutation({
		mutationFn: () => deleteVenue(venueId),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['owner'] })
			void queryClient.invalidateQueries({ queryKey: ['admin', 'venues'] })
			toast.success('To‘yxona oвЂchirildi')
			navigate(venuesListPath)
		},
		onError: err => {
			toast.error(getApiErrorMessage(err, 'To‘yxonani oвЂchirib boвЂlmadi'))
		},
	})

	async function handleDeleteImage(imageId: number) {
		try {
			await deleteVenueImage(imageId)
			void queryClient.invalidateQueries({
				queryKey: ['owner', 'venue', venueId, 'full'],
			})
			toast.success('Rasm oвЂchirildi')
		} catch (err) {
			toast.error(getApiErrorMessage(err, 'Server bilan bogвЂlanib boвЂlmadi'))
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
				<h1 className='mb-6 text-2xl font-semibold'>To‘yxona</h1>
				<CustomerListSkeleton rows={4} />
			</div>
		)
	}

	if (isEdit && (fullQuery.isError || !fullQuery.data)) {
		return (
			<div>
				<VenueListError
					message={getApiErrorMessage(fullQuery.error, 'To‘yxona yuklanmadi')}
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
					to={venuesListPath}
					className='text-sm'
					style={{ color: 'var(--color-brand)' }}
				>
					в†ђ To‘yxonalar
				</Link>
				<h1
					className='text-2xl font-semibold'
					style={{ color: 'var(--color-text-primary)' }}
				>
					{isEdit ? data?.venue.name ?? 'Tahrirlash' : 'Yangi To‘yxona'}
				</h1>
				{isEdit && data && <VenueStatusBadge status={data.venue.status} />}
			</div>

			<form
				onSubmit={form.handleSubmit(values => {
					if (adminMode && !ownerId) {
						toast.error('Eganni tanlang')
						return
					}
					saveVenueMutation.mutate(values)
				})}
				className='flex flex-col gap-6'
				noValidate
			>
				<OwnerSection title='Asosiy maвЂ™lumotlar'>
					{adminMode ? (
						<div className='mb-4 flex flex-col gap-1.5'>
							<label className='text-sm font-medium'>Egasi</label>
							<Select
								value={ownerId === '' ? '' : String(ownerId)}
								onChange={e =>
									setOwnerId(e.target.value ? Number(e.target.value) : '')
								}
							>
								<option value=''>Eganni tanlang</option>
								{(ownersQuery.data?.items ?? []).map(owner => (
									<option key={owner.id} value={owner.id}>
										{owner.firstName} {owner.lastName} (@{owner.username})
									</option>
								))}
							</Select>
						</div>
					) : null}
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
							label='SigвЂim'
							type='number'
							error={form.formState.errors.capacity?.message}
							{...form.register('capacity', { valueAsNumber: true })}
						/>
						<FormField
							label='OвЂrin narxi'
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
							placeholder='To‘yxona haqida qisqa maвЂ™lumot'
							{...form.register('description')}
						/>
						<span
							className='text-xs'
							style={{ color: 'var(--color-text-hint)' }}
						>
							Tavsif hozircha faqat shaklda koвЂrsatiladi
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
							Rasmlar To‘yxona yaratilgandan keyin yuklanadi
						</p>
					)}
				</OwnerSection>

				<div className='flex flex-wrap gap-3'>
					<Button type='submit' loading={saveVenueMutation.isPending}>
						{isEdit ? 'Saqlash' : 'Yaratish va davom etish'}
					</Button>
					{isEdit ? (
						<Button
							type='button'
							variant='ghost'
							className='!w-auto'
							loading={deleteVenueMutation.isPending}
							onClick={() => {
								if (
									window.confirm(
										'To‘yxonani oвЂchirishni tasdiqlaysizmi? Bu amalni qaytarib boвЂlmaydi.',
									)
								) {
									deleteVenueMutation.mutate()
								}
							}}
						>
							To‘yxonani oвЂchirish
						</Button>
					) : null}
				</div>
			</form>

			{isEdit && data && (
				<div className='mt-6 flex flex-col gap-6'>
					<CatalogSection
						title='Xonandalar'
						items={data.singers.map(s => ({
							id: s.id,
							primary: s.name,
							secondary: formatCurrency(s.price),
							imageUrl: s.imageUrl,
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
							imageUrl: c.imageUrl,
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
							imageUrl: m.imageUrl,
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
							bookedDetailsByDate={calendarByDate}
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
	items: Array<{
		id: number
		primary: string
		secondary: string
		imageUrl?: string | null
	}>
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
					QoвЂshish
				</Button>
			}
		>
			{items.length === 0 ? (
				<p className='text-sm' style={{ color: 'var(--color-text-hint)' }}>
					RoвЂyxat boвЂsh
				</p>
			) : (
				<ul className='divide-y' style={{ borderColor: 'var(--color-border)' }}>
					{items.map(item => (
						<li
							key={item.id}
							className='flex items-center justify-between gap-2 py-3 first:pt-0'
						>
							<div className='flex min-w-0 items-center gap-3'>
								<CatalogThumb imageUrl={item.imageUrl} label={item.primary} />
								<div className='min-w-0'>
									<p className='truncate font-medium'>{item.primary}</p>
									{item.secondary && (
										<p className='text-sm' style={{ color: 'var(--color-text-secondary)' }}>
											{item.secondary}
										</p>
									)}
								</div>
							</div>
							<div className='flex gap-1'>
								<button type='button' onClick={() => onEdit(item.id)} aria-label='Tahrirlash'>
									<Pencil className='size-4' />
								</button>
								<button type='button' onClick={() => onDelete(item.id)} aria-label='OвЂchirish'>
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

function CatalogThumb({
	imageUrl,
	label,
}: {
	imageUrl?: string | null
	label: string
}) {
	const src = resolveImageUrl(imageUrl)

	return (
		<div
			className='grid size-12 shrink-0 place-items-center overflow-hidden rounded-[var(--radius-md)] border'
			style={{
				borderColor: 'var(--color-border)',
				backgroundColor: 'var(--color-surface-secondary)',
			}}
		>
			{src ? (
				<img src={src} alt={label} className='size-full object-cover' />
			) : (
				<ImagePlus className='size-5' style={{ color: 'var(--color-text-hint)' }} />
			)}
		</div>
	)
}

function ImagePicker({
	file,
	existingUrl,
	onFileChange,
}: {
	file: File | null
	existingUrl?: string | null
	onFileChange: (file: File | null) => void
}) {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const imageSrc = previewUrl ?? resolveImageUrl(existingUrl)

	useEffect(() => {
		if (!file) {
			setPreviewUrl(null)
			return
		}

		const nextPreview = URL.createObjectURL(file)
		setPreviewUrl(nextPreview)

		return () => URL.revokeObjectURL(nextPreview)
	}, [file])

	return (
		<div className='flex items-center gap-3'>
			<div
				className='grid size-20 place-items-center overflow-hidden rounded-[var(--radius-md)] border'
				style={{
					borderColor: 'var(--color-border)',
					backgroundColor: 'var(--color-surface-secondary)',
				}}
			>
				{imageSrc ? (
					<img src={imageSrc} alt='' className='size-full object-cover' />
				) : (
					<ImagePlus className='size-6' style={{ color: 'var(--color-text-hint)' }} />
				)}
			</div>
			<div className='flex flex-wrap gap-2'>
				<label>
					<input
						type='file'
						accept='image/*'
						className='hidden'
						onChange={e => onFileChange(e.target.files?.[0] ?? null)}
					/>
					<span
						className='inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium'
						style={{
							borderColor: 'var(--color-border)',
							color: 'var(--color-text-primary)',
						}}
					>
						<ImagePlus className='size-4' />
						Rasm tanlash
					</span>
				</label>
				{file ? (
					<button
						type='button'
						className='inline-flex items-center gap-2 rounded-[var(--radius-md)] border px-3 py-2 text-sm'
						style={{
							borderColor: 'var(--color-border)',
							color: 'var(--color-text-secondary)',
						}}
						onClick={() => onFileChange(null)}
					>
						<X className='size-4' />
						Bekor qilish
					</button>
				) : null}
			</div>
		</div>
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
			toast.error(getApiErrorMessage(err, 'Server bilan bogвЂlanib boвЂlmadi'))
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
		toast.success('OвЂchirildi')
	} catch (err) {
		toast.error(getApiErrorMessage(err, 'Server bilan bogвЂlanib boвЂlmadi'))
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
		toast.success('OвЂchirildi')
	} catch (err) {
		toast.error(getApiErrorMessage(err, 'Server bilan bogвЂlanib boвЂlmadi'))
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
		toast.success('OвЂchirildi')
	} catch (err) {
		toast.error(getApiErrorMessage(err, 'Server bilan bogвЂlanib boвЂlmadi'))
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
	singer?: { id: number; name: string; price: number; imageUrl: string | null }
	onSaved: () => void
}) {
	const [name, setName] = useState('')
	const [price, setPrice] = useState('')
	const [imageFile, setImageFile] = useState<File | null>(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (open) {
			setName(singer?.name ?? '')
			setPrice(singer ? String(singer.price) : '')
			setImageFile(null)
		}
	}, [open, singer])

	async function submit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		try {
			if (singer) {
				await updateSinger(singer.id, {
					name,
					price: Number(price),
					imageFile,
				})
			} else {
				await createSinger({ venueId, name, price: Number(price), imageFile })
			}
			toast.success('Saqlandi')
			onSaved()
		} catch (err) {
			toast.error(getApiErrorMessage(err, 'Server bilan bogвЂlanib boвЂlmadi'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal open={open} onClose={onClose} title={singer ? 'Xonandani tahrirlash' : 'Xonanda qoвЂshish'}>
			<form onSubmit={e => void submit(e)} className='flex flex-col gap-3'>
				<FormField label='Ism' value={name} onChange={e => setName(e.target.value)} required />
				<FormField label='Narxi' type='number' value={price} onChange={e => setPrice(e.target.value)} required />
				<ImagePicker
					file={imageFile}
					existingUrl={singer?.imageUrl}
					onFileChange={setImageFile}
				/>
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
	car?: { id: number; brand: string; price: number; imageUrl: string | null }
	onSaved: () => void
}) {
	const [brand, setBrand] = useState('')
	const [price, setPrice] = useState('')
	const [imageFile, setImageFile] = useState<File | null>(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (open) {
			setBrand(car?.brand ?? '')
			setPrice(car ? String(car.price) : '')
			setImageFile(null)
		}
	}, [open, car])

	async function submit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		try {
			if (car) {
				await updateCar(car.id, { brand, price: Number(price), imageFile })
			} else {
				await createCar({ venueId, brand, price: Number(price), imageFile })
			}
			toast.success('Saqlandi')
			onSaved()
		} catch (err) {
			toast.error(getApiErrorMessage(err, 'Server bilan bogвЂlanib boвЂlmadi'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal open={open} onClose={onClose} title={car ? 'Avtomobilni tahrirlash' : 'Avtomobil qoвЂshish'}>
			<form onSubmit={e => void submit(e)} className='flex flex-col gap-3'>
				<FormField label='Marka' value={brand} onChange={e => setBrand(e.target.value)} required />
				<FormField label='Narxi' type='number' value={price} onChange={e => setPrice(e.target.value)} required />
				<ImagePicker
					file={imageFile}
					existingUrl={car?.imageUrl}
					onFileChange={setImageFile}
				/>
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
	item?: { id: number; name: string; imageUrl: string | null }
	onSaved: () => void
}) {
	const [name, setName] = useState('')
	const [imageFile, setImageFile] = useState<File | null>(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (open) {
			setName(item?.name ?? '')
			setImageFile(null)
		}
	}, [open, item])

	async function submit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		try {
			if (item) {
				await updateMenuItem(item.id, { name, imageFile })
			} else {
				await createMenuItem({ venueId, name, imageFile })
			}
			toast.success('Saqlandi')
			onSaved()
		} catch (err) {
			toast.error(getApiErrorMessage(err, 'Server bilan bogвЂlanib boвЂlmadi'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal open={open} onClose={onClose} title={item ? 'Menyu tahrirlash' : 'Menyu qoвЂshish'}>
			<form onSubmit={e => void submit(e)} className='flex flex-col gap-3'>
				<FormField label='Nomi' value={name} onChange={e => setName(e.target.value)} required />
				<ImagePicker
					file={imageFile}
					existingUrl={item?.imageUrl}
					onFileChange={setImageFile}
				/>
				<Button type='submit' loading={loading}>Saqlash</Button>
			</form>
		</Modal>
	)
}
