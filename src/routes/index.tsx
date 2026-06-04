import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import {
	AdminLayout,
	CustomerLayout,
	OwnerLayout,
	PublicLayout,
} from '@/layouts'
import AdminBookingsPage from '@/pages/admin/BookingsPage'
import AdminDashboardPage from '@/pages/admin/DashboardPage'
import AdminOwnersPage from '@/pages/admin/OwnersPage'
import AdminPaymentsPage from '@/pages/admin/PaymentsPage'
import AdminSettingsPage from '@/pages/admin/SettingsPage'
import AdminUsersPage from '@/pages/admin/UsersPage'
import AdminVenuesPage from '@/pages/admin/VenuesPage'
import CustomerBookingsPage from '@/pages/customer/BookingsPage'
import CustomerDashboardPage from '@/pages/customer/DashboardPage'
import CustomerFavoritesPage from '@/pages/customer/FavoritesPage'
import CustomerPaymentsPage from '@/pages/customer/PaymentsPage'
import CustomerProfilePage from '@/pages/customer/ProfilePage'
import CustomerReviewsPage from '@/pages/customer/ReviewsPage'
import OwnerBookingsPage from '@/pages/owner/BookingsPage'
import OwnerDashboardPage from '@/pages/owner/DashboardPage'
import OwnerVenueEditPage from '@/pages/owner/VenueEditPage'
import OwnerVenueNewPage from '@/pages/owner/VenueNewPage'
import OwnerVenuesPage from '@/pages/owner/VenuesPage'
import ForgotPasswordPage from '@/pages/public/ForgotPasswordPage'
import HomePage from '@/pages/public/HomePage'
import LoginPage from '@/pages/public/LoginPage'
import RegisterOwnerPage from '@/pages/public/RegisterOwnerPage'
import RegisterPage from '@/pages/public/RegisterPage'
import ResetPasswordPage from '@/pages/public/ResetPasswordPage'
import VenueDetailsPage from '@/pages/public/VenueDetailsPage'
import VerifyOtpPage from '@/pages/public/VerifyOtpPage'
import AdminGuard from '@/routes/guards/AdminGuard'
import CustomerGuard from '@/routes/guards/CustomerGuard'
import OwnerGuard from '@/routes/guards/OwnerGuard'

export function AppRouter() {
	return (
		<BrowserRouter>
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
					<Route path='/admin/bookings' element={<AdminBookingsPage />} />
					<Route path='/admin/payments' element={<AdminPaymentsPage />} />
					<Route path='/admin/settings' element={<AdminSettingsPage />} />
				</Route>

				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
		</BrowserRouter>
	)
}
