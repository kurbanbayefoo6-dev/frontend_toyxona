import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import {
	AdminLayout,
	CustomerLayout,
	OwnerLayout,
	PublicLayout,
} from '@/layouts'
import AdminGuard from '@/routes/guards/AdminGuard'
import CustomerGuard from '@/routes/guards/CustomerGuard'
import OwnerGuard from '@/routes/guards/OwnerGuard'

const AdminBookingsPage = lazy(() => import('@/pages/admin/BookingsPage'))
const AdminDashboardPage = lazy(() => import('@/pages/admin/DashboardPage'))
const AdminOwnersPage = lazy(() => import('@/pages/admin/OwnersPage'))
const AdminPaymentsPage = lazy(() => import('@/pages/admin/PaymentsPage'))
const AdminSettingsPage = lazy(() => import('@/pages/admin/SettingsPage'))
const AdminUsersPage = lazy(() => import('@/pages/admin/UsersPage'))
const AdminVenueEditPage = lazy(() => import('@/pages/admin/VenueEditPage'))
const AdminVenueNewPage = lazy(() => import('@/pages/admin/VenueNewPage'))
const AdminVenuesPage = lazy(() => import('@/pages/admin/VenuesPage'))
const CustomerBookingsPage = lazy(() => import('@/pages/customer/BookingsPage'))
const CustomerDashboardPage = lazy(() => import('@/pages/customer/DashboardPage'))
const CustomerFavoritesPage = lazy(() => import('@/pages/customer/FavoritesPage'))
const CustomerPaymentsPage = lazy(() => import('@/pages/customer/PaymentsPage'))
const CustomerProfilePage = lazy(() => import('@/pages/customer/ProfilePage'))
const CustomerReviewsPage = lazy(() => import('@/pages/customer/ReviewsPage'))
const OwnerBookingsPage = lazy(() => import('@/pages/owner/BookingsPage'))
const OwnerDashboardPage = lazy(() => import('@/pages/owner/DashboardPage'))
const OwnerVenueEditPage = lazy(() => import('@/pages/owner/VenueEditPage'))
const OwnerVenueNewPage = lazy(() => import('@/pages/owner/VenueNewPage'))
const OwnerVenuesPage = lazy(() => import('@/pages/owner/VenuesPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/public/ForgotPasswordPage'))
const HomePage = lazy(() => import('@/pages/public/HomePage'))
const LoginPage = lazy(() => import('@/pages/public/LoginPage'))
const RegisterOwnerPage = lazy(() => import('@/pages/public/RegisterOwnerPage'))
const RegisterPage = lazy(() => import('@/pages/public/RegisterPage'))
const ResetPasswordPage = lazy(() => import('@/pages/public/ResetPasswordPage'))
const VenueDetailsPage = lazy(() => import('@/pages/public/VenueDetailsPage'))
const VerifyOtpPage = lazy(() => import('@/pages/public/VerifyOtpPage'))

function RouteFallback() {
	return (
		<div className='flex min-h-[50vh] items-center justify-center p-6'>
			<div className='product-card flex items-center gap-3 px-5 py-4 text-sm font-bold text-[var(--color-text-secondary)]'>
				<span className='size-4 animate-spin rounded-full border-2 border-[var(--color-brand)] border-t-transparent' />
				Yuklanmoqda...
			</div>
		</div>
	)
}

export function AppRouter() {
	return (
		<BrowserRouter>
			<Suspense fallback={<RouteFallback />}>
			<Routes>
				<Route element={<PublicLayout />}>
					<Route path='/' element={<HomePage />} />
					<Route path='/login' element={<LoginPage />} />
					<Route path='/register' element={<RegisterPage />} />
					<Route path='/register/owner' element={<RegisterOwnerPage />} />
					<Route path='/verify-otp' element={<VerifyOtpPage />} />
					<Route path='/forgot-password' element={<ForgotPasswordPage />} />
					<Route path='/reset-password' element={<ResetPasswordPage />} />
					<Route path='/venues/:id' element={<VenueDetailsPage />} />
				</Route>

				<Route
					element={
						<CustomerGuard>
							<CustomerLayout />
						</CustomerGuard>
					}
				>
					<Route
						path='/customer'
						element={<Navigate to='/customer/dashboard' replace />}
					/>
					<Route
						path='/customer/dashboard'
						element={<CustomerDashboardPage />}
					/>
					<Route
						path='/customer/bookings'
						element={<CustomerBookingsPage />}
					/>
					<Route
						path='/customer/payments'
						element={<CustomerPaymentsPage />}
					/>
					<Route
						path='/customer/favorites'
						element={<CustomerFavoritesPage />}
					/>
					<Route
						path='/customer/reviews'
						element={<CustomerReviewsPage />}
					/>
					<Route path='/customer/profile' element={<CustomerProfilePage />} />
				</Route>

				<Route
					element={
						<OwnerGuard>
							<OwnerLayout />
						</OwnerGuard>
					}
				>
					<Route
						path='/owner'
						element={<Navigate to='/owner/dashboard' replace />}
					/>
					<Route path='/owner/dashboard' element={<OwnerDashboardPage />} />
					<Route path='/owner/venues' element={<OwnerVenuesPage />} />
					<Route path='/owner/venues/new' element={<OwnerVenueNewPage />} />
					<Route
						path='/owner/venues/:id/edit'
						element={<OwnerVenueEditPage />}
					/>
					<Route path='/owner/bookings' element={<OwnerBookingsPage />} />
				</Route>

				<Route
					element={
						<AdminGuard>
							<AdminLayout />
						</AdminGuard>
					}
				>
					<Route
						path='/admin'
						element={<Navigate to='/admin/dashboard' replace />}
					/>
					<Route path='/admin/dashboard' element={<AdminDashboardPage />} />
					<Route path='/admin/users' element={<AdminUsersPage />} />
					<Route path='/admin/owners' element={<AdminOwnersPage />} />
					<Route path='/admin/venues' element={<AdminVenuesPage />} />
					<Route path='/admin/venues/new' element={<AdminVenueNewPage />} />
					<Route
						path='/admin/venues/:id/edit'
						element={<AdminVenueEditPage />}
					/>
					<Route path='/admin/bookings' element={<AdminBookingsPage />} />
					<Route path='/admin/payments' element={<AdminPaymentsPage />} />
					<Route path='/admin/settings' element={<AdminSettingsPage />} />
				</Route>

				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
			</Suspense>
		</BrowserRouter>
	)
}
