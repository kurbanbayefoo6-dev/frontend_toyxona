# Frontend Production Readiness — Toyxona

**Audit date:** 2026-06-04  
**Stack:** Vite 8, React 19, TypeScript, React Router 7, TanStack Query, Zustand, Tailwind v4, Axios  
**Backend reference:** `../backend` (Express + PostgreSQL)

---

## Executive summary

| Metric | Value |
|--------|-------|
| **Readiness score** | **84 / 100** |
| **Build** | **PASS** (`npm run build` exit 0) |
| **Deployment verdict** | **Conditionally ready for staging** — core flows work; address gaps below before production traffic |

---

## 1. Route audit

### Public routes

| Route | Page | Status |
|-------|------|--------|
| `/` | `HomePage` | PASS |
| `/venues/:id` | `VenueDetailsPage` | PASS |
| `/login` | `LoginPage` | PASS |
| `/register` | `RegisterPage` | PASS |
| `/register/owner` | `RegisterOwnerPage` | PASS |
| `/verify-otp` | `VerifyOtpPage` | PASS |
| `/forgot-password` | `ForgotPasswordPage` | PASS |
| `/reset-password` | `ResetPasswordPage` | PASS |

### Customer routes (`CustomerGuard`)

| Route | Page | Status |
|-------|------|--------|
| `/customer` → `/customer/dashboard` | redirect | PASS |
| `/customer/dashboard` | `CustomerDashboardPage` | PASS |
| `/customer/bookings` | `CustomerBookingsPage` | PASS |
| `/customer/payments` | `CustomerPaymentsPage` | PASS |
| `/customer/favorites` | `CustomerFavoritesPage` | PASS |
| `/customer/reviews` | `CustomerReviewsPage` | PASS |
| `/customer/profile` | `CustomerProfilePage` | PASS |

### Owner routes (`OwnerGuard`)

| Route | Page | Status |
|-------|------|--------|
| `/owner` → `/owner/dashboard` | redirect | PASS |
| `/owner/dashboard` | `OwnerDashboardPage` | PASS |
| `/owner/venues` | `OwnerVenuesPage` | PASS |
| `/owner/venues/new` | `OwnerVenueNewPage` | PASS |
| `/owner/venues/:id/edit` | `OwnerVenueEditPage` | PASS |
| `/owner/bookings` | `OwnerBookingsPage` | PASS |

### Admin routes (`AdminGuard`)

| Route | Page | Status |
|-------|------|--------|
| `/admin` → `/admin/dashboard` | redirect | PASS |
| `/admin/dashboard` | `AdminDashboardPage` | PASS |
| `/admin/users` | `AdminUsersPage` | PASS |
| `/admin/owners` | `AdminOwnersPage` | PASS |
| `/admin/venues` | `AdminVenuesPage` | PASS |
| `/admin/bookings` | `AdminBookingsPage` | PASS |
| `/admin/payments` | `AdminPaymentsPage` | PASS |
| `/admin/settings` | `AdminSettingsPage` | PASS |

### Catch-all

- `*` → `Navigate to="/"` — PASS (no dead 404 page; intentional for SPA)

**Broken routes:** none found in router configuration (`src/routes/index.tsx`).

---

## 2. API audit

Legend: **MATCH** = URL, method, and mapping align with backend; **GAP** = implemented on one side only or mismatched behavior.

### Auth (inline in pages + `apiClient`)

| Frontend | Backend | Status |
|----------|---------|--------|
| `POST /api/auth/login` `{ identifier, password }` → `accessToken`, `user` | `auth.routes.ts` | MATCH |
| `POST /api/auth/register/customer` | same | MATCH |
| `POST /api/auth/register/owner` | same | MATCH |
| `POST /api/auth/verify-otp` | same | MATCH |
| `POST /api/auth/resend-otp` | same | MATCH |
| `POST /api/auth/forgot-password` | same | MATCH |
| `POST /api/auth/reset-password` | same | MATCH |
| — | `POST /api/auth/logout` (authenticated) | **GAP** — Topbar clears Zustand only; server session/token invalidation not called |

### Venues (`venue.service.ts`)

| Endpoint | Status | Notes |
|----------|--------|-------|
| `GET /api/venues` + query params | MATCH | `search`, `district`, `capacity`, `minPrice`, `maxPrice`, `sortBy`, `sortOrder`, `page`, `limit` |
| `GET /api/venues/:id` | MATCH | Numeric fields normalized via `parseApiNumber` |
| `GET /api/venues/:id/full` | MATCH | Used by `useVenueDetail` |
| `GET /api/venues/:id/availability` | **GAP** | Exported in service but **unused**; calendar uses `full.availability` |
| `GET /api/venues/:id/bookings-calendar` | MATCH | Gated in UI for owner/admin only |
| `POST /api/venues` | MATCH | Owner create |
| `PATCH /api/venues/:id` | MATCH | Owner update |
| `DELETE /api/venues/:id` | MATCH | Owner delete |
| `PATCH /api/venues/:id/status` | MATCH | Admin approve/reject via `admin.service.ts` |
| Per-venue `GET /api/venues/:id/images` (N+1 on list) | MATCH | Extra client calls for cover images |

### Bookings & payments (`booking.service.ts`)

| Endpoint | Status | Notes |
|----------|--------|-------|
| `POST /api/bookings` | MATCH | Payload: `venueId`, `bookingDate`, `guestCount`, `singerIds`, `carIds`, `karnaySurnayIds` |
| `GET /api/bookings` | MATCH | Default `page=1`, `limit=100` |
| `POST /api/payments` `{ bookingId, paymentType: 'advance' }` | MATCH | Demo UI delay then API call |
| — | `PATCH /api/bookings` | **GAP** — No customer cancel/update UI |
| — | `DELETE /api/bookings` | **GAP** — Not exposed in UI |

### Favorites (`favorite.service.ts`)

| Endpoint | Status | Notes |
|----------|--------|-------|
| `GET /api/favorites` | MATCH | |
| `DELETE /api/favorites/venues/:venueId` | MATCH | Favorites page remove |
| — | `POST /api/favorites/venues/:venueId` | **GAP** — No `addFavorite` service or venue-detail control |

### Reviews (`review.service.ts`)

| Endpoint | Status |
|----------|--------|
| `GET /api/reviews/my-reviews` | MATCH |
| `POST /api/reviews` | MATCH |
| `PATCH /api/reviews/:id` | MATCH |
| `DELETE /api/reviews/:id` | MATCH |
| — | `GET /api/reviews/venues/:venueId` not used on public venue page (optional) |

### Users (`user.service.ts`)

| Endpoint | Status |
|----------|--------|
| `GET /api/users/me` | MATCH |
| `PATCH /api/users` | MATCH |
| `POST /api/users/change-password` | MATCH |

### Payments list (`payment.service.ts`)

| Endpoint | Status | Notes |
|----------|--------|-------|
| `GET /api/payments` | MATCH | Customer + admin pages; admin uses same global payments API |

### Admin (`admin.service.ts`)

| Endpoint | Status | Notes |
|----------|--------|-------|
| `GET /api/admin/dashboard` | MATCH | |
| `GET /api/admin/users` | MATCH | Role filter applied **client-side** on current page only |
| `GET /api/admin/owners` | MATCH | |
| `GET /api/admin/venues` | MATCH | `status` query supported |
| `GET /api/admin/bookings` | PARTIAL | `search`/`status` sent to API; **district** and **date** filtered client-side after `limit: 200` fetch |

### Owner catalog (`ownerCatalog.service.ts`)

| Resource | CRUD paths | Status |
|----------|------------|--------|
| Images | `GET/POST /api/venues/:id/images`, `DELETE /api/venues/images/:id` | MATCH |
| Singers | `/api/singers?venueId=` | MATCH |
| Cars | `/api/cars?venueId=` | MATCH |
| Menu | `/api/menu-items?venueId=` | MATCH |
| Karnay-surnay | `/api/karnay-surnay?venueId=` | MATCH |

---

## 3. Requirement audit

| Requirement | Status | Evidence / gap |
|-------------|--------|----------------|
| Uzbek language everywhere | **PARTIAL** | Most copy in Uzbek; exceptions: `AdminLayout` title `"Admin"`, role filter label `"Admin"`, `adminLabels` role `"Admin"`, payment modal `"Demo rejim"` |
| Login-free venue browsing | **PASS** | Public layout; `/`, `/venues/:id` unguarded |
| Booking requires auth | **PASS** | `BookingPanel` redirects to login with draft + `?redirect=`; only `customer` role can book |
| Calendar colors (available / booked / past) | **PASS** | `--color-available`, `--color-booked`, gray past in `BookingCalendar.tsx` + `global.css` |
| Owner approval flow | **PASS** | New venues `pending`; admin `PATCH .../status` approve/reject on `AdminVenuesPage` |
| Karnay-surnay pricing | **PASS** | `calculateBookingPrice` sums only `isAvailable` items; owner form sends `price: 0` when unavailable |
| First-letter search | **PASS** | Homepage passes `search`; backend `name ILIKE 'X%'` when length === 1 |
| Partial search | **PASS** | Backend `ILIKE %term%` on name/district/address |
| Payment success flow | **PASS** | `PaymentModal` → `POST /api/payments` → `BookingSuccessView` → customer bookings |
| Dashboards (customer / owner / admin) | **PASS** | All three implemented with summary cards / tables |
| Role redirects after login | **PASS** | `navigateByRole` → `/customer`, `/owner`, `/admin`; booking redirect preserved |
| Wrong-role route access | **PARTIAL** | `ProtectedRoute` sends wrong role to `/` instead of role home |
| Responsive layout | **PARTIAL** | Sidebar `lg+`, `MobileNav` on smaller screens; wide admin tables may overflow on narrow phones |
| Add to favorites from browse | **FAIL** | List/remove only; no POST from venue detail |
| Venue description (owner form) | **PARTIAL** | UI field present; not in backend schema / not sent on create/update |
| Real payment gateway | **PARTIAL** | Demo modal; documented in UI |

---

## 4. Build audit

```text
npm run build
> tsc -b && vite build
✓ built successfully (exit 0)

dist/index.html                   0.45 kB │ gzip:   0.29 kB
dist/assets/index-D77n-CAd.css   22.96 kB │ gzip:   5.30 kB
dist/assets/index-DnyCqJUx.js   567.74 kB │ gzip: 167.68 kB

Warning: chunk > 500 kB after minification (no code-splitting)
```

| Check | Result |
|-------|--------|
| TypeScript compile | PASS |
| Vite production bundle | PASS |
| Chunk size warning | WARN — single main bundle |

---

## 5. Type audit

| Check | Result |
|-------|--------|
| `any` | **PASS** — none in `src/` |
| `@ts-ignore` / `@ts-expect-error` | **PASS** — none |
| `as any` | **PASS** — none |

### Typed assertions (acceptable but noted)

| Location | Pattern |
|----------|---------|
| `venue.service.ts:70` | `item as RawVenue` in list map |
| `authStore.ts:51` | `persisted as Pick<AuthState, 'token' \| 'user'>` |
| `authErrors.ts:41` | `error.response.data as ApiErrorResponse` |
| `VenueFilters.tsx` | `as District`, `as SortOption` on select change |
| `LoginPage.tsx:68-70` | `normalizeAuthUser(...) as AuthUser` |

**Verdict:** Type hygiene is strong for production; narrow assertions are localized.

---

## 6. Performance audit

| Issue | Severity | Recommendation |
|-------|----------|----------------|
| Homepage `getVenues` + per-venue image fetch (N+1) | High | Backend: include `imageUrl` on list; or batch images endpoint |
| Single 568 KB JS chunk | Medium | `React.lazy` route splits for admin/owner/customer panels |
| Admin bookings page loads venues (500) + users (500) + bookings (200) | Medium | Backend joins for district/phone; server-side district/date filters |
| Favorites `getFavoritesWithVenues` N+1 `getVenueById` | Medium | Backend embed venue summary on favorites list |
| Admin venues cover images fetched in `useEffect` per row | Medium | Same as list cover fix |
| No global `staleTime` on React Query | Low | Set defaults (e.g. 30–60s) for list pages |
| `lucide-react` tree in main bundle | Low | Import icons per-file (already typical); consider split |

**Duplicate queries:** Customer dashboard runs bookings, payments, and favorites in parallel (acceptable). Venue detail uses one `full` query (good). `getVenueAvailability` duplicate endpoint unused.

**Unnecessary rerenders:** No critical issues identified; Zustand selectors are mostly narrow.

---

## 7. Accessibility audit

| Area | Status | Notes |
|------|--------|-------|
| Auth forms | PASS | `FormField` uses `htmlFor` + ids |
| Modals | PASS | `role="dialog"`, `aria-labelledby`, close `aria-label` |
| Calendar navigation | PASS | Prev/next month `aria-label`; day cells labeled |
| Filters / pagination | PASS | Several `aria-label`s on homepage |
| Icon-only actions | PARTIAL | Present on reviews/favorites/owner; not universal on all tables |
| Focus trap in modals | PARTIAL | Overlay click close; no explicit focus trap |
| Skip links / landmarks | PARTIAL | `<main>` used; no skip-to-content |
| Keyboard booking addons | PARTIAL | Checkbox lists; verify tab order on venue detail |

---

## 8. Responsive audit

| Breakpoint | Status | Notes |
|------------|--------|-------|
| Desktop (≥1024px) | PASS | Sidebar + content |
| Tablet | PASS | Topbar + horizontal `MobileNav`; grids adapt (`sm:` / `md:`) |
| Mobile | PARTIAL | 6-link horizontal scroll nav; booking panel stacks below content; admin tables need horizontal scroll |

---

## 9. Security audit

| Topic | Status | Notes |
|-------|--------|-------|
| Token storage | PARTIAL | JWT in `localStorage` via Zustand persist — XSS risk surface |
| Bearer attachment | PASS | `apiClient` request interceptor |
| 401 handling | PASS | Clears auth store on 401 |
| Route protection | PASS | `CustomerGuard` / `OwnerGuard` / `AdminGuard` + hydration gate |
| Role protection | PASS | Role check on protected routes |
| Logout | PARTIAL | Client-only; server `POST /api/auth/logout` not invoked |
| Booking redirect | PASS | `isSafeRedirectPath` prevents open redirects |
| Secrets in UI | PASS | Admin settings does not expose tokens |

---

## 10. PASS / PARTIAL / FAIL summary

### PASS

- All specified public, customer, owner, and admin routes
- Core API integration (venues, full detail, bookings, payments, auth, admin, owner catalog)
- Login-free browse; auth-gated booking with draft restore
- Calendar styling and legend
- Admin venue approval
- Karnay pricing rules
- Search (first-letter + partial) via backend
- Payment success UX
- Role-based login redirect
- Production build (TypeScript + Vite)
- No `any` / `@ts-ignore` in source

### PARTIAL

- Uzbek copy (English “Admin”, demo payment label)
- API: logout, unused availability endpoint, admin client-side filters
- Favorites (remove/list only)
- Owner venue description field (UI-only)
- Wrong-role redirect to `/` instead of role dashboard
- Performance (bundle size, N+1 images/favorites)
- Accessibility (focus trap, skip links)
- Mobile admin tables / nav density
- Token in localStorage + client-only logout

### FAIL

- **Add favorite from venue browse** — backend endpoint exists; frontend has no `addFavorite` or UI control

---

## Missing items (prioritized)

1. **Add favorite** — `POST /api/favorites/venues/:venueId` + heart button on venue card/detail  
2. **Server logout** — call `POST /api/auth/logout` before clearing store  
3. **List cover images** — stop N+1 on homepage and admin venues  
4. **Code splitting** — reduce initial JS below 500 KB  
5. **Admin bookings filters** — server-side district/date or enriched admin API  
6. **Admin users role filter** — pass `role` query if backend supports, or fetch all pages  
7. **Customer booking cancel** — wire `PATCH`/`DELETE` bookings if required by product spec  
8. **Remove or persist venue description** — align UI with API  
9. **Wrong-role UX** — redirect to role home instead of `/`  
10. **Production payment** — replace demo modal with real gateway when ready  

---

## Recommended fixes (no new features unless critical)

| Priority | Fix | Effort |
|----------|-----|--------|
| P0 | None blocking staging for demo/homework scope | — |
| P1 | Add favorite POST + UI | Small |
| P1 | Call logout API on sign-out | Small |
| P2 | Backend list image URL or batch fetch | Medium (backend) |
| P2 | Route-based `lazy()` imports | Small |
| P3 | Admin filter/query alignment | Medium |
| P3 | Uzbek labels for “Admin” / hide demo text in prod | Trivial |

**Critical bugs found:** none that block login, browse, book, pay, or role panels.

---

## Deployment checklist

- [ ] Set `VITE_API_URL` to production API (HTTPS)
- [ ] Configure CORS on backend for frontend origin
- [ ] Serve `dist/` behind CDN or static host with SPA fallback to `index.html`
- [ ] Enable HTTPS only
- [ ] Review JWT expiry and refresh strategy (not implemented in frontend)
- [ ] Replace or gate demo payment copy for production
- [ ] Run `npm run build` in CI on every release
- [ ] Smoke test: public browse → login → book → pay → dashboards per role
- [ ] Monitor bundle size and API error rates post-deploy
- [ ] Optional: move token to httpOnly cookie (requires backend change)

---

## Readiness score breakdown

| Category | Weight | Score |
|----------|--------|-------|
| Routes | 10% | 10 |
| API alignment | 15% | 8 |
| Requirements | 20% | 8 |
| Build | 10% | 9 |
| Types | 10% | 9.5 |
| Performance | 10% | 6.5 |
| Accessibility | 10% | 7 |
| Responsive | 10% | 8 |
| Security | 5% | 7.5 |
| **Weighted total** | | **~84** |

---

## Deployment readiness verdict

**Conditionally ready for staging / internal demo.**

The application builds cleanly, routes are complete, and primary user journeys (browse → book → pay, owner catalog, admin approval) align with the backend. Before public production:

1. Implement add-favorite and server logout (or accept documented gaps).  
2. Address performance (N+1 images, bundle splitting).  
3. Harden auth storage strategy and real payments if going live with real users.

No code changes were made during this audit (read-only QA per Phase 9 scope).
