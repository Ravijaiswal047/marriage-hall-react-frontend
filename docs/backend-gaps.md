# MarriageHall.com - Backend Functional Gaps & Technical Debt Audit

> **Document Status**: Production Architectural Gap Analysis  
> **Backend Implementation**: Java Spring Boot Microservices Stack (`api-gateway`, `auth-service`, `hall-service`, `booking-service`, `review-service`, `notification-service`)  
> **Purpose**: Categorization of missing backend functionality requiring client-side mitigations or future backend roadmap priorities.

---

## Executive Summary & Priority Classification

The Spring Boot backend architecture provides 26 core REST endpoints across 5 active services. Functionality required for a full-scale marketplace that is **BACKEND API NOT AVAILABLE** has been audited, categorized, and documented below with corresponding frontend mitigations.

---

## P0: Production Blockers

### 1. Token Refresh Endpoint (`POST /api/auth/refresh`)
- **Service**: `auth-service`
- **Impact**: JWT tokens issued by `auth-service` expire after 1 hour (3,600,000 ms). Because no refresh token API exists, expired tokens result in `401 Unauthorized` responses on subsequent API calls without seamless background renewal.
- **Frontend Mitigation**: Auth state monitors token expiration timestamp; upon receiving a `401 Unauthorized` error from API Gateway, the application clears stored session state and redirects the user to `/login` with return location preserved.

### 2. Image & File Upload API (`POST /api/upload` / Multipart Form Data)
- **Service**: `hall-service` / `auth-service`
- **Impact**: Backend entities (`Hall`, `User`, `Review`) store image references strictly as string URLs (`coverImageUrl`, `images: string[]`, `avatarUrl`). No multipart form endpoints or cloud storage integrations (AWS S3 / Cloudinary) exist.
- **Frontend Mitigation**: Form components (`HallForm.tsx`, `ReviewFormModal.tsx`) accept valid image URL strings with live image preview tiles and removal controls.

---

## P1: High Priority Features

### 3. User Profile Update & Password Change (`PUT /api/auth/profile`, `PUT /api/auth/password`)
- **Service**: `auth-service`
- **Impact**: `auth-service` exposes `POST /api/auth/signup`, `POST /api/auth/login`, and `GET /api/auth/me`. Endpoints to update name, phone number, avatar URL, or change password do not exist.
- **Frontend Mitigation**: Profile views (`CustomerProfilePage.tsx`, `VendorProfilePage.tsx`) display read-only user attributes retrieved from `/api/auth/me` with informative notices explaining support request workflows.

### 4. User Favorites / Wishlist Persistence (`GET/POST/DELETE /api/favorites`)
- **Service**: `hall-service` / `auth-service`
- **Impact**: Server-side persistence of saved/favorite halls per user is unavailable in the microservices database schemas.
- **Frontend Mitigation**: Wishlist management is powered by Zustand client-side LocalStorage persistence (`marriagehall-favorites-storage`) in `useFavorites.ts`, featuring optimistic updates and error rollback capability.

### 5. Review Editing & Deletion (`PUT /api/reviews/{id}`, `DELETE /api/reviews/{id}`)
- **Service**: `review-service`
- **Impact**: `review-service` supports `POST /api/reviews/add`, `GET /api/reviews/{hallId}`, and `GET /api/reviews/{hallId}/average`. Endpoints to modify or delete existing reviews are missing.
- **Frontend Mitigation**: The frontend UI suppresses edit/delete controls on review cards and displays informative backend boundary notes.

---

## P2: Medium Priority Features

### 6. Live Payment Gateway Integration & Refund Processing (`POST /api/payments/refund`)
- **Service**: `booking-service` (`PaymentController.java`)
- **Impact**: Payment APIs support internal advance (`POST /api/payments/advance`) and final (`POST /api/payments/final`) ledger entries. Standalone payment gateway webhooks (Stripe / Razorpay) and refund processing APIs are unsupported.
- **Frontend Mitigation**: Payment modal simulates payment authorization before sending idempotent requests to `/api/payments/advance` or `/api/payments/final`.

### 7. Pagination on Bookings & Reviews (`GET /api/bookings`, `GET /api/reviews`)
- **Service**: `booking-service` / `review-service`
- **Impact**: Spring Data pagination (`SpringPage<T>`) is implemented ONLY on `GET /api/halls`. Bookings lists (`/api/bookings/my-bookings`, `/api/vendor/dashboard/bookings`) and reviews (`/api/reviews/{hallId}`) return unpaginated raw arrays.
- **Frontend Mitigation**: Client-side filtering and pagination are applied over full response arrays.

### 8. Admin User Directory & Vendor Approval Workflow
- **Service**: `auth-service` / `hall-service`
- **Impact**: Dedicated admin endpoints for user search, user role modification, or vendor listing approval (`PUT /api/admin/halls/{id}/approve`) are not exposed.
- **Frontend Mitigation**: `AdminUsersPage.tsx` displays active admin credentials and customer contact records extracted from active booking entities.

---

## P3: Future Enhancements

### 9. Notification Inbox REST Endpoints (`GET /api/notifications`)
- **Service**: `notification-service`
- **Impact**: `notification-service` listens asynchronously to RabbitMQ queue `booking.queue` for `BookingCreatedEvent`. No REST controllers are exposed for frontend notification feeds.
- **Frontend Mitigation**: In-app toast alerts provide immediate feedback upon successful booking creation.

### 10. Multi-Amenity Array Catalog Filtering
- **Service**: `hall-service`
- **Impact**: `GET /api/halls` accepts parameters `city`, `minPrice`, `maxPrice`, `minCapacity`, `hasAc`, `hasParking`. Complex array-based multi-amenity filtering is unsupported by backend JPA specifications.
- **Frontend Mitigation**: Secondary client-side filtering refines catalog view contents.

