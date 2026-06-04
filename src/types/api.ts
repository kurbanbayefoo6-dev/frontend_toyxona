export type ApiSuccessResponse<T> = {
	success: boolean
	message: string
	data: T
}

export type ApiErrorResponse = {
	success: false
	message: string
}
