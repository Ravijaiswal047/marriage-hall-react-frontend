# MarriageHall.com - Frontend Production Architecture Blueprint

> **Role**: Principal Staff Frontend Architect & UI/UX Engineer  
> **Repository**: `marriagehall-web`  
> **Status**: Production Foundation Established  
> **Target Backend**: Spring Boot Microservices Stack (`http://localhost:8081/api`)

---

## 1. Architectural Principles & Ownership Model

The frontend architecture strictly enforces separation of concerns, type safety, modular design, and robust state boundaries.

```
                      +---------------------------------------------------+
                      |                    USER VIEW                      |
                      |   React 19 Presentational & Feature Components    |
                      +---------------------------------------------------+
                                   /                         \
                                  /                           \
        +----------------------------------+   +----------------------------------+
        |        SERVER STATE OWNER        |   |        CLIENT STATE OWNER        |
        |      TanStack Query (v5)         |   |           Zustand (v5)           |
        |  - Async Queries & Caching       |   |  - Auth Session & JWT Token      |
        |  - Mutations & Invalidation      |   |  - Search & Filter Parameters    |
        |  - Optimistic Updates            |   |  - Active Modals & UI Flags      |
        +----------------------------------+   |  - Saved Wishlist LocalStorage   |
                         |                     +----------------------------------+
                         v
        +----------------------------------+
        |         FEATURE API MODULE       |
        |   (e.g., halls.api, auth.api)    |
        +----------------------------------+
                         |
                         v
        +----------------------------------+
        |        CORE API CLIENT           |
        |  Axios Base Instance & Filters   |
        +----------------------------------+
                         |
                         v HTTP / Bearer JWT Header
        +----------------------------------+
        |       SPRING BOOT GATEWAY        |
        |     (http://localhost:8081)      |
        +----------------------------------+
```

### State Ownership Rules:
1. **Server State (TanStack Query v5)**: Owns all asynchronous remote data fetched from microservices (Halls catalog, Hall details, Slot availability, My bookings, Vendor stats, Reviews).
2. **Client / UI State (Zustand v5)**: Owns synchronous client data (JWT token, user session, search filter selections, active modal IDs, toast notifications, wishlist IDs).
3. **No Duplicate State**: Server state MUST NEVER be copied or duplicated into Zustand stores. Components consume server state directly via feature TanStack Query hooks.
4. **No Direct Axios Calls in Components**: UI components must only call feature hooks or feature API methods. Direct `axios` calls in components are strictly prohibited.

---

## 2. Standard Directory Layout

```
src/
├── app/                        # Application bootstrap, routing entrypoint, providers
│   ├── config/
│   │   └── env.ts              # Global environment configuration (API Gateway URL)
│   ├── providers/
│   │   ├── AppProviders.tsx    # High-level wrapper (ErrorBoundary + QueryProvider)
│   │   └── QueryProvider.tsx   # TanStack QueryClient with custom retry policy
│   └── App.tsx                 # Root component rendering RouterProvider
├── routes/                     # Modular route definitions (React Router v7)
│   ├── index.tsx               # Main browser router assembly
│   ├── public.routes.tsx       # Home, Halls search, Hall details
│   ├── auth.routes.tsx         # Login & Signup routes
│   ├── customers.routes.tsx    # My Bookings, Booking details (Protected by AuthGuard)
│   ├── vendor.routes.tsx       # Vendor Overview, My Halls, Create Hall (Protected by RoleGuard)
│   └── admin.routes.tsx        # Admin Dashboard (Protected by RoleGuard)
├── features/                   # Domain-driven feature modules
│   ├── auth/                   # API, Hooks, AuthGuard, RoleGuard
│   ├── halls/                  # API (hallsApi), Hooks (useHallsCatalog, useHallDetails, useCities)
│   ├── booking/                # API (bookingApi), Hooks (useSlotAvailability, useBookedDates, etc.)
│   ├── payments/               # API (paymentsApi), Hooks (usePayments with Idempotency-Key)
│   ├── reviews/                # API (reviewsApi), Hooks (useReviews)
│   ├── vendor/                 # API (vendorApi), Hooks (useVendorDashboard)
│   ├── profile/                # Profile component shells
│   ├── favorites/              # Client-side Wishlist hook & store
│   └── admin/                  # Admin dashboard components
├── components/                 # Reusable UI component library
│   ├── ui/                     # Design System Primitives (Button, Input, Select, Badge, Card, Modal, Spinner)
│   ├── layout/                 # Page Layouts (Header, Footer, Sidebar, MainLayout)
│   └── common/                 # Global UI Helpers (LoadingOverlay, EmptyState, ErrorBoundary)
├── lib/                        # Core utilities & API layer
│   ├── api/
│   │   ├── client.ts           # Axios client instance with Bearer token & 401 interceptors
│   │   └── errors.ts           # ApiError class & error parser matching backend ErrorResponse
│   ├── constants/
│   │   └── routes.ts           # Type-safe route path constants
│   └── utils/
│       ├── cn.ts               # Classnames joiner
│       └── formatters.ts       # Currency (INR), Date (date-fns), and Slot label formatters
├── store/                      # Zustand global stores
│   ├── auth.store.ts           # JWT token, authenticated User session, login/logout
│   ├── search.store.ts         # Marketplace filter selections & pagination state
│   └── ui.store.ts             # Active modal state & Toast alerts
└── types/                      # TypeScript schemas
    ├── api.ts                  # Request/Response DTO types matching backend Spring Boot schemas
    └── common.ts               # Core domain models (Hall, Booking, User, PaymentEntity, Review)
```

---

## 3. Core Layer Specifications

### 3.1 Core API Client (`src/lib/api/client.ts`)
Targets `http://localhost:8081/api` by default. Automatically attaches `Authorization: Bearer <token>` from `useAuthStore` on every request. Automatically handles `401 Unauthorized` responses by logging out the user and clearing session storage.

### 3.2 Error Normalization (`src/lib/api/errors.ts`)
Normalizes all backend microservice error JSON payloads into an `ApiError` instance matching Spring Boot's standard `ErrorResponse`:
```json
{
  "timestamp": "2026-09-11T21:11:18.123",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/auth/signup",
  "validationErrors": {
    "email": "Email must be valid"
  }
}
```

### 3.3 Authorization & Route Protection
- **`AuthGuard`**: Redirects unauthenticated users to `/auth/login` while capturing original path in router state.
- **`RoleGuard`**: Ensures only users with authorized roles (`VENDOR`, `ADMIN`) can access restricted feature routes.

---

## 4. Quality & Compliance Checklist

- [x] **Strict TypeScript**: Enabled strict type checking without `any` overrides.
- [x] **No Fake Backend Services**: Features communicate directly with microservice endpoints defined in `frontend-backend-contract.md`.
- [x] **No Server State in Zustand**: Server state is managed exclusively by TanStack Query.
- [x] **Decoupled Components**: UI components depend on feature hooks, never directly on Axios.
- [x] **Small Modular Components**: Primitive UI components (`Button`, `Input`, `Select`, `Card`, `Badge`, `Modal`, `Spinner`) are clean and focused.

