import { apiClient } from '@/services/apiClient'
import type { ApiSuccessResponse } from '@/types/api'
import type {
	CarPayload,
	KarnayPayload,
	MenuItemPayload,
	SingerPayload,
} from '@/types/owner'
import type {
	VenueCar,
	VenueImage,
	VenueKarnaySurnay,
	VenueMenuItem,
	VenueSinger,
} from '@/types/venueDetail'
import { parseApiNumber } from '@/utils/parseApiNumber'

type CatalogPayloadWithImage<T> = T & { imageFile?: File | null }

function toCatalogFormData(
	payload: Record<string, string | number | boolean | File | null | undefined>,
): FormData {
	const form = new FormData()
	Object.entries(payload).forEach(([key, value]) => {
		if (value === undefined || value === null) return
		if (key === 'imageFile' && value instanceof File) {
			form.append('image', value)
			return
		}
		if (key !== 'imageFile') {
			form.append(key, String(value))
		}
	})
	return form
}

function hasImageFile(payload: { imageFile?: File | null }): boolean {
	return payload.imageFile instanceof File
}

export async function getVenueImages(venueId: number): Promise<VenueImage[]> {
	const res = await apiClient.get<ApiSuccessResponse<VenueImage[]>>(
		`/api/venues/${venueId}/images`,
	)
	return res.data.data
}

export async function uploadVenueImage(
	venueId: number,
	file: File,
): Promise<VenueImage> {
	const form = new FormData()
	form.append('image', file)
	const res = await apiClient.post<ApiSuccessResponse<VenueImage>>(
		`/api/venues/${venueId}/images`,
		form,
		{ headers: { 'Content-Type': 'multipart/form-data' } },
	)
	return res.data.data
}

export async function deleteVenueImage(imageId: number): Promise<void> {
	await apiClient.delete(`/api/venues/images/${imageId}`)
}

export async function getSingers(venueId: number): Promise<VenueSinger[]> {
	const res = await apiClient.get<
		ApiSuccessResponse<Array<Omit<VenueSinger, 'price'> & { price: number | string }>>
	>('/api/singers', { params: { venueId } })
	return res.data.data.map(s => ({ ...s, price: parseApiNumber(s.price) }))
}

export async function createSinger(
	payload: CatalogPayloadWithImage<SingerPayload>,
): Promise<VenueSinger> {
	const body = hasImageFile(payload) ? toCatalogFormData(payload) : payload
	const res = await apiClient.post<
		ApiSuccessResponse<Omit<VenueSinger, 'price'> & { price: number | string }>
	>('/api/singers', body)
	return { ...res.data.data, price: parseApiNumber(res.data.data.price) }
}

export async function updateSinger(
	id: number,
	payload: CatalogPayloadWithImage<Partial<Omit<SingerPayload, 'venueId'>>>,
): Promise<VenueSinger> {
	const body = hasImageFile(payload) ? toCatalogFormData(payload) : payload
	const res = await apiClient.patch<
		ApiSuccessResponse<Omit<VenueSinger, 'price'> & { price: number | string }>
	>(`/api/singers/${id}`, body)
	return { ...res.data.data, price: parseApiNumber(res.data.data.price) }
}

export async function deleteSinger(id: number): Promise<void> {
	await apiClient.delete(`/api/singers/${id}`)
}

export async function getCars(venueId: number): Promise<VenueCar[]> {
	const res = await apiClient.get<
		ApiSuccessResponse<Array<Omit<VenueCar, 'price'> & { price: number | string }>>
	>('/api/cars', { params: { venueId } })
	return res.data.data.map(c => ({ ...c, price: parseApiNumber(c.price) }))
}

export async function createCar(
	payload: CatalogPayloadWithImage<CarPayload>,
): Promise<VenueCar> {
	const body = hasImageFile(payload) ? toCatalogFormData(payload) : payload
	const res = await apiClient.post<
		ApiSuccessResponse<Omit<VenueCar, 'price'> & { price: number | string }>
	>('/api/cars', body)
	return { ...res.data.data, price: parseApiNumber(res.data.data.price) }
}

export async function updateCar(
	id: number,
	payload: CatalogPayloadWithImage<Partial<Omit<CarPayload, 'venueId'>>>,
): Promise<VenueCar> {
	const body = hasImageFile(payload) ? toCatalogFormData(payload) : payload
	const res = await apiClient.patch<
		ApiSuccessResponse<Omit<VenueCar, 'price'> & { price: number | string }>
	>(`/api/cars/${id}`, body)
	return { ...res.data.data, price: parseApiNumber(res.data.data.price) }
}

export async function deleteCar(id: number): Promise<void> {
	await apiClient.delete(`/api/cars/${id}`)
}

export async function getMenuItems(venueId: number): Promise<VenueMenuItem[]> {
	const res = await apiClient.get<ApiSuccessResponse<VenueMenuItem[]>>(
		'/api/menu-items',
		{ params: { venueId } },
	)
	return res.data.data
}

export async function createMenuItem(
	payload: CatalogPayloadWithImage<MenuItemPayload>,
): Promise<VenueMenuItem> {
	const body = hasImageFile(payload) ? toCatalogFormData(payload) : payload
	const res = await apiClient.post<ApiSuccessResponse<VenueMenuItem>>(
		'/api/menu-items',
		body,
	)
	return res.data.data
}

export async function updateMenuItem(
	id: number,
	payload: CatalogPayloadWithImage<Partial<Omit<MenuItemPayload, 'venueId'>>>,
): Promise<VenueMenuItem> {
	const body = hasImageFile(payload) ? toCatalogFormData(payload) : payload
	const res = await apiClient.patch<ApiSuccessResponse<VenueMenuItem>>(
		`/api/menu-items/${id}`,
		body,
	)
	return res.data.data
}

export async function deleteMenuItem(id: number): Promise<void> {
	await apiClient.delete(`/api/menu-items/${id}`)
}

export async function getKarnayItems(
	venueId: number,
): Promise<VenueKarnaySurnay[]> {
	const res = await apiClient.get<
		ApiSuccessResponse<
			Array<Omit<VenueKarnaySurnay, 'price'> & { price: number | string }>
		>
	>('/api/karnay-surnay', { params: { venueId } })
	return res.data.data.map(k => ({ ...k, price: parseApiNumber(k.price) }))
}

export async function createKarnay(payload: KarnayPayload): Promise<VenueKarnaySurnay> {
	const res = await apiClient.post<
		ApiSuccessResponse<Omit<VenueKarnaySurnay, 'price'> & { price: number | string }>
	>('/api/karnay-surnay', payload)
	return { ...res.data.data, price: parseApiNumber(res.data.data.price) }
}

export async function updateKarnay(
	id: number,
	payload: Partial<Omit<KarnayPayload, 'venueId'>>,
): Promise<VenueKarnaySurnay> {
	const res = await apiClient.patch<
		ApiSuccessResponse<Omit<VenueKarnaySurnay, 'price'> & { price: number | string }>
	>(`/api/karnay-surnay/${id}`, payload)
	return { ...res.data.data, price: parseApiNumber(res.data.data.price) }
}

export async function deleteKarnay(id: number): Promise<void> {
	await apiClient.delete(`/api/karnay-surnay/${id}`)
}
