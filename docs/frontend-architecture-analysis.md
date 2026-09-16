# MarriageHall.com - Frontend Architecture Analysis & Production Strategy

> **Role**: Principal Staff Frontend Architect & UI/UX Engineer  
> **Target Platform**: MarriageHall.com Production Web Application  
> **Technology Stack**: React 19, TypeScript 6, Vite 8, Tailwind CSS v4, TanStack Query v5, Zustand v5, React Router v7, React Hook Form, Zod

---

## Executive Summary

This document establishes the production frontend architecture, state management model, data fetching patterns, and UI/UX design strategy for **MarriageHall.com**, aligned with the Java Spring Boot microservices backend API contract. 

Because the backend is a distributed microservices stack (`api-gateway`, `auth-service`, `hall-service`, `booking-service`, `review-service`, `notification-service`), the frontend must be architected with resilience, clean separation of concerns, strict type safety, and graceful degradation for backend features marked as `BACKEND API NOT AVAILABLE`.

---

## 1. System Architecture & Gateway Integration Blueprint

```
+-----------------------------------------------------------------------------------+
|                                 BROWSER CLIENT                                    |
|  +-------------------+  +------------------------+  +--------------------------+  |
|  |  React 19 Views   |  | Zustand Global Stores  |  | TanStack Query Cache     |  |
|  |  (UI Components)  |  | (Auth, Search, UI)     |  | (Server State Hydration) |  |
|  +-------------------+  +------------------------+  +--------------------------+  |
+-------------------------------------------|---------------------------------------+
                                            | Axios Client with Interceptors
                                            v (BaseURL: http://localhost:8081/api)
+-----------------------------------------------------------------------------------+
|                             API GATEWAY (Port 8081)                               |
|  - CORS Filter (Allowed Origins: 3000, 5173, 4200)                                |
|  - Global JWT Authentication Filter                                               |
|  - Inject Headers: X-User-Id, X-Role, X-Email                                     |
+-----------------------------------------------------------------------------------+
        |                       |                       |                       |
        v lb://AUTH-SERVICE     v lb://HALL-SERVICE     v lb://BOOKING-SERVICE  v lb://REVIEW-SERVICE
+---------------+       +---------------+       +---------------+       +---------------+
| Auth Service  |       | Hall Service  |       |Booking Service|       |Review Service |
|  (Port 9090)  |       |  (Port 8087)  |       |  (Port 8082)  |       |  (Port 8086)  |
+---------------+       +---------------+       +---------------+       +---------------+
```

### Key Gateway Integration Rules:
1. **Single Entry Point**: All API calls from the frontend MUST target `http://localhost:8081/api`. No microservice ports (9090, 8087, 8082, 8086) should ever be accessed directly by the client.
2. **Bearer Token Injection**: For protected endpoints, the Axios instance must attach `Authorization: Bearer <jwt_token>` header.
3. **Public Route Handling**: Unauthenticated users can access marketplace catalog (`GET /api/halls`), cities list (`GET /api/halls/cities`), reviews (`GET /api/reviews/{hallId}`), and slot availability (`GET /api/bookings/availability/{hallId}`).
4. **Idempotency Headers**: Payments (`POST /api/payments/advance`, `POST /api/payments/final`) require an `Idempotency-Key` UUID header to prevent double-charging on network retries.

---

## 2. Directory & Feature Architecture

The codebase follows a modular **Feature-First Architecture** inside `src/`:

```
src/
├── app/                      # App-wide initialization, routes, providers & config
│   ├── config/               # Env configuration (API_BASE_URL)
│   └── providers/            # QueryClientProvider, AuthProvider, ToastProvider
├── assets/                   # Static images, icons, and vector graphics
├── components/               # Shared reusable UI & layout components
│   ├── common/               # Loading spinners, Empty states, Error boundaries
│   ├── layout/               # Header, Navbar, Footer, Sidebar layouts
│   └── ui/                   # Primitive design system (Buttons, Cards, Inputs, Modals, Badges)
├── features/                 # Domain-driven feature modules
│   ├── admin/                # Platform management views
│   ├── auth/                 # Login, Signup, AuthGuard, ProtectedRoute
│   ├── booking/              # Booking workflow, Slot selector, Calendar view, Booking Details
│   ├── favorites/            # Client-side Wishlist & Saved Halls
│   ├── halls/                # Marketplace catalog, Filters, Search, Hall Detail, Review list
│   ├── payments/             # Advance & Final Payment Sheet Modals
│   ├── profile/              # User Profile View & My Bookings tab
│   ├── reviews/              # Rating stars component, Review submission form
│   └── vendor/               # Vendor Dashboard, Hall Creation/Edit forms, Vendor Bookings list
├── lib/                      # Core infrastructure utilities
│   ├── api/                  # Axios instance, Interceptors, API Error normalization
│   ├── constants/            # Route paths, Enums, Default constants
│   └── utils/                # Date formatters (date-fns), Currency formatters, Classnames (clsx/twMerge)
├── routes/                   # React Router v7 configuration
│   ├── admin.routes.tsx
│   ├── auth.routes.tsx
│   ├── customers.routes.tsx
│   ├── public.routes.tsx
│   └── vendor.routes.tsx
├── store/                    # Zustand global stores
│   ├── auth.store.ts         # User session, JWT token, Auth state
│   ├── search.store.ts       # Marketplace search filters & pagination state
│   └── ui.store.ts           # Modals, Drawers, Toast notifications
└── types/                    # TypeScript interfaces & DTO schemas
    ├── api.ts                # Request & Response DTO types matching backend
    └── common.ts             # Domain models (Hall, Booking, User, Review)
```

---

## 3. Auth & Session Management Strategy

### Backend Constraints:
- JWT Token expiration is **1 hour** (`3600` seconds).
- **`BACKEND API NOT AVAILABLE`** for Refresh Token (`POST /api/auth/refresh`).
- Auth payload returns: `token`, `userId`, `name`, `email`, `role`, `phone`, `avatarUrl`.

### Frontend Architectural Solution:
1. **Persistent State Storage**:
   - Store JWT token and User info in `zustand` with `persist` middleware (backed by `localStorage` or `sessionStorage`).
2. **Proactive Token Expiration Tracking**:
   - Calculate expiration timestamp (`Date.now() + 3600 * 1000`) upon successful login/signup.
   - Set up an in-memory session timer to warn users 5 minutes before expiration.
3. **Axios Response Interceptor for 401 Unauthorized**:
   - Intercept any `401 Unauthorized` response from API Gateway.
   - Automatically clear Zustand auth store, purge cached query data, display a toast notification ("Session expired. Please log in again"), and redirect the user to `/auth/login` with `returnUrl`.

---

## 4. State Management & Data Fetching Design

### Server State (TanStack Query v5):
- Manage all server data fetching, caching, background revalidation, and optimistic updates.
- **Key Query Keys**:
  - `['halls', filters, page, sortBy]`: Marketplace catalog (paginated).
  - `['hall', hallId]`: Single hall details.
  - `['cities']`: Distinct city options for dropdowns.
  - `['slotAvailability', hallId, date]`: Real-time availability for a single date.
  - `['bookedDates', hallId, startDate, endDate]`: Range availability for interactive calendar.
  - `['myBookings']`: User booking history.
  - `['vendorStats']`: Vendor dashboard statistics.
  - `['vendorBookings']`: Vendor bookings list.
  - `['reviews', hallId]`: Reviews for a specific hall.
  - `['averageRating', hallId]`: Hall average rating and review count.

### Client State (Zustand v5):
- **`useAuthStore`**: User identity, JWT token, active role (`USER`, `VENDOR`, `ADMIN`), login/logout methods.
- **`useSearchStore`**: Active marketplace filters (`city`, `minPrice`, `maxPrice`, `minCapacity`, `hasAc`, `hasParking`, `page`, `sortBy`), reset filters.
- **`useFavoritesStore`**: Array of saved hall IDs persisted in `localStorage` (Mitigates `BACKEND API NOT AVAILABLE` for user wishlist).
- **`useUIStore`**: Active modal dialogs (Login modal, Booking sheet, Payment modal, Image lightbox), Toast alerts.

---

## 5. Client-Side Resilience Strategy for Missing Backend APIs

| Missing Backend API | Impact on Feature | Frontend Resilience / Architectural Solution |
| :--- | :--- | :--- |
| **Token Refresh API** | Session terminates after 1 hour | Monitor token age on client; handle 401 cleanly with redirect to `/auth/login?returnUrl=...`. |
| **User Profile Edit API** | Users cannot change name/phone/avatar | Render read-only profile view with clear badge: *"Profile managed via account provider"*. |
| **File / Image Upload API** | Vendors cannot upload raw image files | Provide clean URL input controls with live image previews and pre-seeded curated image galleries. |
| **Payment Gateway SDK Webhooks** | No live Razorpay/Stripe checkout frame | Build a pristine, realistic Client-side Payment Sheet modal (UPI / Card / NetBanking simulation) that computes advance (20%) and calls backend `/api/payments/advance`. |
| **Favorites / Saved Halls API** | Wishlist buttons fail if sent to server | Implement full Client-side Wishlist store using Zustand `persist` in `localStorage`. |
| **Bookings & Reviews Pagination** | Long lists could overflow memory | Apply client-side array chunking / virtualized pagination in UI components. |
| **Notification Inbox REST API** | Bell icon has no notification history API | Use real-time client toast notifications for booking actions and mock static event log. |

---

## 6. Recommended UI/UX & Component Specifications

1. **Marketplace Discovery & Search Experience (Airbnb / The Knot UX)**:
   - **Hero Search Bar**: Location autocomplete (backed by `GET /api/halls/cities`), event date picker, guest count input.
   - **Faceted Filters Bar**: Quick pill toggles for *AC*, *Parking*, *Price Range Slider*, *Capacity*, *Sort by Price/Rating*.
   - **Grid & Card Layout**: High-impact hall cards displaying cover image, city, capacity badge, price per day, veg/non-veg plate price, and average rating badge.

2. **Interactive Hall Booking Calendar**:
   - Color-coded date picker:
     - **Green**: Fully Available (Morning & Evening open).
     - **Yellow**: Partially Booked (Morning OR Evening booked).
     - **Red**: Fully Booked (`FULL_DAY` or both slots taken).
   - Instant calculation of estimated total cost based on slot type (`FULL_DAY`, `MORNING`, `EVENING`) and guest count.

3. **Vendor Dashboard & Management Portal**:
   - Analytics Stat Cards: Total Revenue, Received Amount, Pending Balance, Active Listings, Booking Counts.
   - Quick Action Table: Accept/Cancel pending bookings (`PUT /api/bookings/{id}/status`), view customer phone/requests.
   - Hall Builder Wizard: Multi-step form for hall details, location, pricing per plate, amenities checkboxes, and image URLs with validation via Zod.

4. **Streamlined Booking & Payment Flow**:
   - 3-Step Guided Checkout:
     1. Event Details & Slot Confirmation.
     2. Guest Contact Info & Special Requests.
     3. Advance Payment Sheet (20% mandatory advance to transition status to `CONFIRMED`).

---

## 7. Integration Risk Matrix & Mitigation

| Risk ID | Risk Description | Severity | Impact | Architectural Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **RISK-01** | CORS Preflight rejection on complex headers | High | API requests blocked in browser | Configured `CorsWebFilter` with `Ordered.HIGHEST_PRECEDENCE` at Gateway; verified origin mapping. |
| **RISK-02** | Token Expiry during booking or payment flow | Medium | Request fails mid-transaction | Cache active form state in `sessionStorage` before navigating to login on 401 error. |
| **RISK-03** | Inter-service data inconsistency (e.g. deleted hall referenced in booking) | Medium | 500 error on `GET /api/bookings/{id}` | Handle missing hall response gracefully in `BookingDetailResponse` with fallback UI ("Hall Details Unavailable"). |
| **RISK-04** | Double payment execution on network re-try | High | User charged twice for same booking | Mandatory generation of unique `Idempotency-Key` (UUIDv4) header in Axios payment requests. |
| **RISK-05** | Booking Slot Race Condition (Two users booking same hall & date simultaneously) | High | Backend throws 409 Conflict | Intercept `409 Conflict` error in UI, display clear error ("Slot just booked by another user"), and refresh availability calendar. |

