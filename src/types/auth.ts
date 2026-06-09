export type UserRole = 'customer' | 'owner' | 'admin'

export type AuthUser = {
	id: string
	firstName: string
	lastName: string
	username: string
	email: string
	phone: string
	role: UserRole
	isVerified: boolean
}
