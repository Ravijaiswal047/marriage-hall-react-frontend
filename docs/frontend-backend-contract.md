# MarriageHall.com - Frontend-Backend API Contract & Service Specification

> **Document Status**: Production-Ready Architectural Source of Truth  
> **Backend Implementation**: Java Spring Boot Microservices Stack  
> **Gateway Base URL**: `http://localhost:8081`  
> **Auth Scheme**: JWT Bearer Token (`Authorization: Bearer <token>`)

---

## Executive Overview & System Architecture

The backend system of **MarriageHall.com** is implemented using a Spring Boot microservices architecture. The API Gateway acts as the single entry point for all frontend client traffic, handling CORS, JWT authentication, and routing requests to downstream services registered with the Eureka Discovery Server.

```
                  +-----------------------------------+
                  |   Vite + React Frontend Client    |
                  +-----------------------------------+
                                    |
                                    v  HTTP / CORS (Port 8081)
                  +-----------------------------------+
                  |         API Gateway (WebFlux)     |
                  |     (JWT Filter & Header Inject)  |
                  +-----------------------------------+
                                    |
        +-------------------+-------+-------+-------------------+
        |                   |               |                   |
        v                   v               v                   v
+---------------+   +---------------+   +---------------+   +---------------+
| Auth Service  |   | Hall Service  |   |Booking Service|   |Review Service |
|  (Port 9090)  |   |  (Port 8087)  |   |  (Port 8082)  |   |  (Port 8086)  |
|   auth_db     |   |    hall_db    |   |  booking_db   |   |   review_db   |
+---------------+   +---------------+   +---------------+   +---------------+
                                                |
                                                v AMQP
                                        +---------------+
                                        | Notification  |
                                        |  (Port 8085)  |
                                        +---------------+
```

---

## Section 1: System Analysis & Infrastructure Specification (Items 1-30)

### 1. API Gateway
- **Service Name**: `api-gateway` (Spring Cloud Gateway WebFlux).
- **Port**: `8081`.
- **Functionality**: Global CORS handling, JWT token validation, request routing via Eureka (`lb://`), header mutation (`X-User-Id`, `X-Role`, `X-Email`).

### 2. Eureka / Service Discovery
- **Service Name**: `discovery-server` (Spring Cloud Netflix Eureka).
- **Port**: `8761`.
- **Registered Services**: `AUTH-SERVICE`, `HALL-SERVICE`, `BOOKING-SERVICE`, `REVIEW-SERVICE`, `NOTIFICATION-SERVICE`, `API-GATEWAY`.

### 3. Auth Service
- **Service Name**: `auth-service`.
- **Port**: `9090`.
- **Database**: MySQL `auth_db`.
- **Functionality**: Registration (`/api/auth/signup`), Authentication (`/api/auth/login`), Profile Retrieval (`/api/auth/me`).

### 4. User Service
- **Status**: `BACKEND API NOT AVAILABLE` (Standalone microservice does not exist).
- **Details**: User profiles and authentication entities are embedded inside `auth-service`. Separate user management APIs (e.g. user directory, admin user management, password update) do not exist.

### 5. Hall / Venue Service
- **Service Name**: `hall-service`.
- **Port**: `8087`.
- **Database**: MySQL `hall_db`.
- **Functionality**: Marketplace catalog search with pagination & filters, city listings, hall creation, update, deletion, vendor-specific hall retrieval.

### 6. Booking Service
- **Service Name**: `booking-service`.
- **Port**: `8082`.
- **Database**: MySQL `booking_db`.
- **Functionality**: Booking creation, slot availability checks, booked dates range queries, booking details with inter-service hall lookup (`HallClient`), booking cancellation, status updates, user booking history, booking summary, vendor dashboard statistics & bookings.

### 7. Review Service
- **Service Name**: `review-service`.
- **Port**: `8086`.
- **Database**: MySQL `review_db`.
- **Functionality**: Add reviews for verified bookings, get reviews per hall, calculate average hall ratings.

### 8. Payment Service
- **Status**: Embedded inside `booking-service` (`PaymentController.java`, `PaymentService.java`).
- **Endpoints**: `/api/payments/advance`, `/api/payments/final`.
- **Details**: Payment entity stored in `booking_db`. `BACKEND API NOT AVAILABLE` for standalone payment microservice, payment gateway webhooks (Stripe/Razorpay/UPI), or refund management APIs.

### 9. Notification Service
- **Service Name**: `notification-service`.
- **Port**: `8085`.
- **Functionality**: Listens asynchronously to RabbitMQ queue `booking.queue` for `BookingCreatedEvent`.
- **REST Status**: `BACKEND API NOT AVAILABLE` (No public REST controllers exposed).

### 10. Other Services Present
- **Config Server**: `config-server` (Port `8888`), serves shared properties (`jwt.secret`).
- **Config Repo**: Native repository `config-repo` holding `application.yml`.
- **Observability**: Grafana (`3000`), Loki (`3100`), Zipkin (`9411`).

### 11. REST Controllers
- `AuthController` (`com.marriagehall.auth_service.controller`)
- `HallController` (`com.marriagehall.hall_service.controller`)
- `BookingController` (`com.marriagehall.booking_service.controller`)
- `VendorDashboardController` (`com.marriagehall.booking_service.dashboard.controller`)
- `PaymentController` (`com.marriagehall.booking_service.payment`)
- `ReviewController` (`com.marriagehall.review_service.controller`)

### 12. Endpoints
- Total 26 active REST endpoints defined across services.

### 13. HTTP Methods
- `GET`, `POST`, `PUT`, `DELETE` (Gateway CORS supports `OPTIONS`, `PATCH`).

### 14. Request DTOs
- `SignupRequest`, `LoginRequest`, `HallRequest`, `BookingRequest`, `PaymentRequestDTO`, `ReviewRequest`.

### 15. Response DTOs
- `AuthResponse`, `UserProfileResponse`, `Hall` (Entity), `Booking` (Entity), `BookingDetailResponse`, `BookingSummaryResponse`, `SlotAvailabilityResponse`, `VendorDashboardResponse`, `VendorBookingResponse`, `PaymentEntity` (Entity), `Review` (Entity), `ErrorResponse`.

### 16. Entity Relationships Relevant to Frontend
- `User` (1) <---> (N) `Hall` [linked via `vendorId: UUID`]
- `User` (1) <---> (N) `Booking` [linked via `userId: UUID`]
- `Hall` (1) <---> (N) `Booking` [linked via `hallId: UUID`]
- `Booking` (1) <---> (N) `PaymentEntity` [linked via `bookingId: UUID`]
- `Hall` (1) <---> (N) `Review` [linked via `hallId: UUID`]
- `User` (1) <---> (N) `Review` [linked via `userId: UUID`]

### 17. Enums
- **`Role`**: `USER`, `ADMIN`, `VENDOR`
- **`BookingSlot`**: `MORNING`, `EVENING`, `FULL_DAY`
- **`BookingStatus`**: `PENDING`, `CONFIRMED`, `CANCELLED`
- **`EventType`**: `WEDDING`, `RECEPTION`, `ENGAGEMENT`, `BIRTHDAY`, `ANNIVERSARY`, `CORPORATE`, `OTHER`
- **`PaymentStatus`**: `SUCCESS`, `FAILED`, `PENDING`
- **`PaymentType`**: `ADVANCE`, `FINAL`, `REFUND`

### 18. Validation Rules
- **SignupRequest**: `name` (NotBlank), `email` (NotBlank, Email), `password` (NotBlank, Min 6 chars), `role` (NotNull), `phone` (optional).
- **LoginRequest**: `email` (NotBlank, Email), `password` (NotBlank).
- **HallRequest**: `name` (NotBlank), `location` (NotBlank), `price` (NotNull, Positive), `capacity` (NotNull, Min 1), `description` (Size max 3000).
- **BookingRequest**: `hallId` (NotNull), `bookingDate` (NotNull, Future date).
- **PaymentRequestDTO**: `bookingId` (NotNull), `amount` (NotNull, Positive). Requires header `Idempotency-Key`.
- **ReviewRequest**: `hallId` (NotNull), `rating` (NotNull, Min 1, Max 5), `comment` (Size max 2000).

### 19. Pagination Implementation
- Implemented ONLY on `GET /api/halls`.
- Parameters: `page` (default `0`), `size` (default `12`), `sortBy` (default `createdAt`), `direction` (default `desc`).
- Returns Spring Data `Page<Hall>` object with `content: Hall[]`, `totalElements`, `totalPages`, `number`, `size`, `first`, `last`, etc.
- `BACKEND API NOT AVAILABLE` for pagination on bookings, reviews, or vendor listings.

### 20. Search / Filter Capabilities
- Implemented on `GET /api/halls`: `city` (String), `minPrice` (Double), `maxPrice` (Double), `minCapacity` (Integer), `hasAc` (Boolean), `hasParking` (Boolean).
- Distinct cities dropdown helper: `GET /api/halls/cities`.
- `BACKEND API NOT AVAILABLE` for full-text search, multi-amenity array filtering, date range availability filtering in catalog, or multi-sort options.

### 21. Authentication Mechanism
- Stateless JWT Bearer Token passed via `Authorization: Bearer <token>` HTTP Header.
- Gateway filter parses JWT, extracts claims (`userId`, `role`, `email`), and injects custom headers `X-User-Id`, `X-Role`, `X-Email` for downstream microservices.

### 22. JWT Implementation
- Library: `io.jsonwebtoken` (jjwt 0.11.5).
- Secret Key: Configured in `jwt.secret` (Default: `mysecretkeymysecretkeymysecretkey123`).
- Token Claims: `userId` (UUID string), `role` (Role string), `sub` (email string), `iat`, `exp`.

### 23. Token Expiration / Refresh Behavior
- **Expiration**: 1 hour (`3600000` ms).
- **Refresh Token Mechanism**: `BACKEND API NOT AVAILABLE`. No refresh token endpoint exists. Upon expiration, frontend must prompt user to log in again.

### 24. Roles and Permissions
- `USER`: Browse halls, check slot availability, create bookings, make payments, leave reviews, view own bookings.
- `VENDOR`: All `USER` permissions plus hall creation (`POST /api/halls/create-hall`), update (`PUT /api/halls/{id}`), delete (`DELETE /api/halls/{id}`), vendor hall listing, and vendor dashboard stats/bookings.
- `ADMIN`: Full administrative privileges (can manage any hall or booking).

### 25. Image / File Upload APIs
- `BACKEND API NOT AVAILABLE`.
- The backend does NOT contain multipart file upload endpoints or cloud storage integration (AWS S3/Cloudinary). Image references are stored strictly as URL strings (`coverImageUrl`, `images: string[]`, `avatarUrl`). Frontend must use external image hosting or image URL inputs.

### 26. Error Response Format
Unified standard format returned by all microservices:
```json
{
  "timestamp": "2026-09-11T21:11:18.123",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/auth/signup",
  "validationErrors": {
    "email": "Email must be valid",
    "password": "Password must be at least 6 Characters"
  }
}
```

### 27. CORS Configuration
- Handled at Gateway in `CorsConfig.java`.
- **Allowed Origins**: `http://localhost:3000`, `http://localhost:5173`, `http://localhost:4200` (Overridable via `APP_CORS_ALLOWED_ORIGINS`).
- **Allowed Methods**: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`.
- **Allowed Headers**: `*`.
- **Allow Credentials**: `true`.
- **Max Age**: `3600` seconds.

### 28. API Gateway Base Path
- Host: `http://localhost:8081`.
- Global Route Prefix: `/api`.

### 29. Environment Configuration
- Default Ports:
  - API Gateway: `8081`
  - Auth Service: `9090`
  - Hall Service: `8087`
  - Booking Service: `8082`
  - Review Service: `8086`
  - Discovery Server: `8761`
  - Config Server: `8888`
  - MySQL: `3307` (Host mapped from container `3306`)
  - RabbitMQ: `5672` / `15672`

### 30. Existing API Documentation
- Springdoc OpenApi Swagger annotations exist in services.
- OpenAPI docs: `http://localhost:8081/v3/api-docs` / `http://localhost:8081/swagger-ui.html`.

---

## Section 2: Complete API Endpoint Specifications

---

### Authentication & Profile APIs (`auth-service`)

#### 1. User Signup
- **METHOD**: `POST`
- **PATH**: `/api/auth/signup`
- **REQUEST**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "role": "USER",
    "phone": "+1234567890"
  }
  ```
- **RESPONSE**: `200 OK`
  ```json
  {
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "userId": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "USER",
    "phone": "+1234567890",
    "avatarUrl": null
  }
  ```
- **AUTHENTICATION**: None (Public)
- **ROLE**: Any (`USER`, `VENDOR`, `ADMIN`)
- **PAGINATION**: N/A
- **ERRORS**:
  - `400 Bad Request` (Validation errors)
  - `409 Conflict` ("Email already exists")

#### 2. User Login
- **METHOD**: `POST`
- **PATH**: `/api/auth/login`
- **REQUEST**:
  ```json
  {
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
- **RESPONSE**: `200 OK`
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "userId": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "USER",
    "phone": "+1234567890",
    "avatarUrl": null
  }
  ```
- **AUTHENTICATION**: None (Public)
- **ROLE**: N/A
- **PAGINATION**: N/A
- **ERRORS**:
  - `400 Bad Request` (Validation errors)
  - `401 Unauthorized` ("Invalid email or password")

#### 3. Get Current Authenticated User Profile
- **METHOD**: `GET`
- **PATH**: `/api/auth/me`
- **REQUEST**: Empty Body
- **RESPONSE**: `200 OK`
  ```json
  {
    "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "USER",
    "phone": "+1234567890",
    "avatarUrl": null,
    "createdAt": "2026-09-11T12:00:00"
  }
  ```
- **AUTHENTICATION**: Required (`Authorization: Bearer <token>`)
- **ROLE**: Any authenticated role
- **PAGINATION**: N/A
- **ERRORS**:
  - `401 Unauthorized` (Token missing or invalid)
  - `404 Not Found` (User not found)

---

### Hall / Marketplace Catalog APIs (`hall-service`)

#### 4. Search & Filter Halls Catalog
- **METHOD**: `GET`
- **PATH**: `/api/halls`
- **QUERY PARAMS**:
  - `city` (optional string)
  - `minPrice` (optional double)
  - `maxPrice` (optional double)
  - `minCapacity` (optional int)
  - `hasAc` (optional boolean)
  - `hasParking` (optional boolean)
  - `page` (optional int, default `0`)
  - `size` (optional int, default `12`)
  - `sortBy` (optional string, default `createdAt`)
  - `direction` (optional string, default `desc` | `asc`)
- **REQUEST**: Empty Body
- **RESPONSE**: `200 OK` (Spring Page JSON)
  ```json
  {
    "content": [
      {
        "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        "name": "Grand Imperial Palace",
        "location": "Mumbai, Maharashtra",
        "city": "Mumbai",
        "state": "Maharashtra",
        "address": "123 Marine Drive",
        "landmark": "Near Marine Lines",
        "pincode": "400002",
        "latitude": 18.9438,
        "longitude": 72.8229,
        "price": 150000.0,
        "vegPricePerPlate": 1200.0,
        "nonVegPricePerPlate": 1600.0,
        "capacity": 800,
        "floatingCapacity": 1200,
        "description": "Luxurious wedding hall with sea view.",
        "coverImageUrl": "https://images.example.com/cover.jpg",
        "images": ["https://images.example.com/1.jpg"],
        "hasAc": true,
        "hasParking": true,
        "parkingCapacity": 200,
        "roomsCount": 10,
        "outsideCateringAllowed": false,
        "djAllowed": true,
        "alcoholAllowed": false,
        "powerBackup": true,
        "vendorId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "status": "ACTIVE",
        "createdAt": "2026-09-10T10:00:00",
        "updatedAt": "2026-09-10T10:00:00"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 12,
      "sort": { "sorted": true, "unsorted": false, "empty": false }
    },
    "totalPages": 1,
    "totalElements": 1,
    "last": true,
    "first": true,
    "numberOfElements": 1,
    "size": 12,
    "number": 0,
    "empty": false
  }
  ```
- **AUTHENTICATION**: None (Public Endpoint)
- **ROLE**: Guest / Any
- **PAGINATION**: Supported (Page number, page size, total pages, total elements)
- **ERRORS**: `500 Internal Server Error`

#### 5. Get Distinct Cities List
- **METHOD**: `GET`
- **PATH**: `/api/halls/cities`
- **REQUEST**: Empty Body
- **RESPONSE**: `200 OK`
  ```json
  ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune"]
  ```
- **AUTHENTICATION**: None (Public)
- **ROLE**: Guest / Any
- **PAGINATION**: N/A
- **ERRORS**: `500 Internal Server Error`

#### 6. Create Hall Listing
- **METHOD**: `POST`
- **PATH**: `/api/halls/create-hall`
- **REQUEST**:
  ```json
  {
    "name": "Grand Imperial Palace",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "address": "123 Marine Drive",
    "landmark": "Near Marine Lines",
    "pincode": "400002",
    "latitude": 18.9438,
    "longitude": 72.8229,
    "price": 150000.0,
    "vegPricePerPlate": 1200.0,
    "nonVegPricePerPlate": 1600.0,
    "capacity": 800,
    "floatingCapacity": 1200,
    "description": "Luxurious wedding hall.",
    "coverImageUrl": "https://images.example.com/cover.jpg",
    "images": ["https://images.example.com/1.jpg"],
    "hasAc": true,
    "hasParking": true,
    "parkingCapacity": 200,
    "roomsCount": 10,
    "outsideCateringAllowed": false,
    "djAllowed": true,
    "alcoholAllowed": false,
    "powerBackup": true
  }
  ```
- **RESPONSE**: `200 OK` (Returns created `Hall` object)
- **AUTHENTICATION**: Required (`Authorization: Bearer <token>`)
- **ROLE**: `VENDOR` or `ADMIN`
- **PAGINATION**: N/A
- **ERRORS**:
  - `400 Bad Request` (Validation errors)
  - `401 Unauthorized` (Token missing)
  - `403 Forbidden` ("Only vendors can manage halls")

#### 7. Get Hall Details by ID
- **METHOD**: `GET`
- **PATH**: `/api/halls/{hallId}`
- **REQUEST**: Empty Body
- **RESPONSE**: `200 OK` (Returns single `Hall` object)
- **AUTHENTICATION**: None (Public)
- **ROLE**: Guest / Any
- **PAGINATION**: N/A
- **ERRORS**: `404 Not Found` ("Hall not found")

#### 8. Get Halls by Vendor ID
- **METHOD**: `GET`
- **PATH**: `/api/halls/vendor/{vendorId}`
- **REQUEST**: Empty Body
- **RESPONSE**: `200 OK`
  ```json
  [ { /* Hall Object */ } ]
  ```
- **AUTHENTICATION**: Required (`Authorization: Bearer <token>`)
- **ROLE**: `VENDOR` or `ADMIN`
- **PAGINATION**: None (Returns raw `List<Hall>`)
- **ERRORS**: `401 Unauthorized`

#### 9. Update Hall Listing
- **METHOD**: `PUT`
- **PATH**: `/api/halls/{hallId}`
- **REQUEST**: `HallRequest` JSON body
- **RESPONSE**: `200 OK` (Updated `Hall` object)
- **AUTHENTICATION**: Required (`Authorization: Bearer <token>`)
- **ROLE**: `VENDOR` (owner) or `ADMIN`
- **PAGINATION**: N/A
- **ERRORS**:
  - `400 Bad Request`
  - `401 Unauthorized`
  - `403 Forbidden` ("Not authorized to update this hall")
  - `404 Not Found`

#### 10. Delete Hall Listing
- **METHOD**: `DELETE`
- **PATH**: `/api/halls/{hallId}`
- **REQUEST**: Empty Body
- **RESPONSE**: `204 No Content`
- **AUTHENTICATION**: Required (`Authorization: Bearer <token>`)
- **ROLE**: `VENDOR` (owner) or `ADMIN`
- **PAGINATION**: N/A
- **ERRORS**:
  - `401 Unauthorized`
  - `403 Forbidden` ("Not authorized to delete this hall")
  - `404 Not Found`

---

### Booking APIs (`booking-service`)

#### 11. Create Booking
- **METHOD**: `POST`
- **PATH**: `/api/bookings/create`
- **REQUEST**:
  ```json
  {
    "hallId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "bookingDate": "2026-11-20",
    "slot": "FULL_DAY",
    "eventType": "WEDDING",
    "guestCount": 500,
    "customerName": "Jane Doe",
    "customerPhone": "+1234567890",
    "specialRequests": "Flower decoration needed"
  }
  ```
- **RESPONSE**: `200 OK` (Returns created `Booking` entity with `status: "PENDING"`)
- **AUTHENTICATION**: Required (`Authorization: Bearer <token>`)
- **ROLE**: `USER`, `VENDOR`, `ADMIN`
- **PAGINATION**: N/A
- **ERRORS**:
  - `400 Bad Request` (Validation errors or Date not in future)
  - `401 Unauthorized`
  - `409 Conflict` / `BusinessRuleException` ("Hall is already booked for date... and slot...")

#### 12. Check Single Date Availability
- **METHOD**: `GET`
- **PATH**: `/api/bookings/availability/{hallId}`
- **QUERY PARAMS**: `date=YYYY-MM-DD` (ISO Date format)
- **REQUEST**: Empty Body
- **RESPONSE**: `200 OK`
  ```json
  {
    "hallId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "date": "2026-11-20",
    "available": false,
    "bookedSlots": ["FULL_DAY"],
    "availableSlots": []
  }
  ```
- **AUTHENTICATION**: None (Public)
- **ROLE**: Guest / Any
- **PAGINATION**: N/A
- **ERRORS**: `400 Bad Request` (Invalid date format)

#### 13. Get Booked Dates Range (Calendar View)
- **METHOD**: `GET`
- **PATH**: `/api/bookings/booked-dates/{hallId}`
- **QUERY PARAMS**: `startDate=YYYY-MM-DD`, `endDate=YYYY-MM-DD`
- **REQUEST**: Empty Body
- **RESPONSE**: `200 OK`
  ```json
  [
    {
      "hallId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "date": "2026-11-20",
      "available": false,
      "bookedSlots": ["FULL_DAY"],
      "availableSlots": []
    }
  ]
  ```
- **AUTHENTICATION**: Required (`Authorization: Bearer <token>`)
- **ROLE**: Any
- **PAGINATION**: N/A
- **ERRORS**: `400 Bad Request`

#### 14. Get Booking Details by ID
- **METHOD**: `GET`
- **PATH**: `/api/bookings/{bookingId}`
- **REQUEST**: Empty Body
- **RESPONSE**: `200 OK`
  ```json
  {
    "booking": {
      "id": "c71a93b4-1234-4567-89ab-cdef01234567",
      "userId": "d290f1ee-6c54-4b01-90e6-d701748f0851",
      "hallId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "bookingDate": "2026-11-20",
      "slot": "FULL_DAY",
      "eventType": "WEDDING",
      "guestCount": 500,
      "customerName": "Jane Doe",
      "customerPhone": "+1234567890",
      "specialRequests": "Flower decoration needed",
      "totalAmount": 150000.0,
      "status": "PENDING",
      "createdAt": "2026-09-11T15:30:00"
    },
    "hall": {
      "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "name": "Grand Imperial Palace",
      "location": "Mumbai, Maharashtra",
      "price": 150000.0,
      "capacity": 800,
      "description": "Luxurious wedding hall."
    }
  }
  ```
- **AUTHENTICATION**: Required (`Authorization: Bearer <token>`)
- **ROLE**: Any
- **PAGINATION**: N/A
- **ERRORS**: `404 Not Found`

#### 15. Cancel Booking
- **METHOD**: `PUT`
- **PATH**: `/api/bookings/{bookingId}/cancel`
- **REQUEST**: Empty Body
- **RESPONSE**: `200 OK` (Returns updated `Booking` with `status: "CANCELLED"`)
- **AUTHENTICATION**: Required (`Authorization: Bearer <token>`)
- **ROLE**: User / Vendor / Admin
- **PAGINATION**: N/A
- **ERRORS**: `404 Not Found`

#### 16. Update Booking Status (Vendor/Admin)
- **METHOD**: `PUT`
- **PATH**: `/api/bookings/{bookingId}/status`
- **QUERY PARAMS**: `status=CONFIRMED` (`PENDING` | `CONFIRMED` | `CANCELLED`)
- **REQUEST**: Empty Body
- **RESPONSE**: `200 OK` (Updated `Booking` object)
- **AUTHENTICATION**: Required (`Authorization: Bearer <token>`)
- **ROLE**: `VENDOR` or `ADMIN`
- **PAGINATION**: N/A
- **ERRORS**: `400 Bad Request`, `404 Not Found`

#### 17. Get Bookings by User ID
- **METHOD**: `GET`
- **PATH**: `/api/bookings/user/{userId}`
- **REQUEST**: Empty Body
- **RESPONSE**: `200 OK` (`List<Booking>`)
- **AUTHENTICATION**: Required (`Authorization: Bearer <token>`)
- **ROLE**: Any
- **PAGINATION**: None (Returns raw array)
- **ERRORS**: `401 Unauthorized`

#### 18. Get My Bookings (Current Authenticated User)
- **METHOD**: `GET`
- **PATH**: `/api/bookings/my-bookings`
- **REQUEST**: Empty Body
- **RESPONSE**: `200 OK` (`List<Booking>`)
- **AUTHENTICATION**: Required (`Authorization: Bearer <token>`)
- **ROLE**: Any authenticated user
- **PAGINATION**: None (Returns raw array)
- **ERRORS**: `401 Unauthorized`

#### 19. Get Financial Booking Summary
- **METHOD**: `GET`
- **PATH**: `/api/bookings/{bookingId}/summary`
- **REQUEST**: Empty Body
- **RESPONSE**: `200 OK`
  ```json
  {
    "bookingId": "c71a93b4-1234-4567-89ab-cdef01234567",
    "totalAmount": 150000.0,
    "paidAmount": 30000.0,
    "dueAmount": 120000.0,
    "fullyPaid": false,
    "status": "CONFIRMED"
  }
  ```
- **AUTHENTICATION**: Required (`Authorization: Bearer <token>`)
- **ROLE**: Any
- **PAGINATION**: N/A
- **ERRORS**: `404 Not Found`

---

### Payment APIs (`booking-service` Payment Controller)

#### 20. Pay Advance Payment
- **METHOD**: `POST`
- **PATH**: `/api/payments/advance`
- **HEADERS**: `Idempotency-Key: <unique-uuid-or-timestamp-string>`
- **REQUEST**:
  ```json
  {
    "bookingId": "c71a93b4-1234-4567-89ab-cdef01234567",
    "amount": 30000.0
  }
  ```
- **RESPONSE**: `200 OK`
  ```json
  {
    "id": "e8812345-9876-4321-b21a-112233445566",
    "bookingId": "c71a93b4-1234-4567-89ab-cdef01234567",
    "amount": 30000.0,
    "paymentType": "ADVANCE",
    "paymentStatus": "SUCCESS",
    "idempotencyKey": "idem-key-12345",
    "paymentDate": "2026-09-11T16:00:00"
  }
  ```
- **AUTHENTICATION**: Required (`Authorization: Bearer <token>`)
- **ROLE**: `USER`
- **PAGINATION**: N/A
- **ERRORS**:
  - `400 Bad Request` (Missing Idempotency-Key header, validation errors)
  - `404 Not Found` (Booking not found)
  - `409 Conflict` (Duplicate Idempotency Key)

#### 21. Pay Final Payment
- **METHOD**: `POST`
- **PATH**: `/api/payments/final`
- **HEADERS**: `Idempotency-Key: <unique-uuid-or-timestamp-string>`
- **REQUEST**:
  ```json
  {
    "bookingId": "c71a93b4-1234-4567-89ab-cdef01234567",
    "amount": 120000.0
  }
  ```
- **RESPONSE**: `200 OK` (Returns `PaymentEntity` with `paymentType: "FINAL"`, updates booking status to `CONFIRMED`)
- **AUTHENTICATION**: Required (`Authorization: Bearer <token>`)
- **ROLE**: `USER`
- **PAGINATION**: N/A
- **ERRORS**:
  - `400 Bad Request`
  - `404 Not Found`
  - `409 Conflict`

---

### Vendor Dashboard APIs (`booking-service` Dashboard Controller)

#### 22. Get Vendor Dashboard Statistics
- **METHOD**: `GET`
- **PATH**: `/api/vendor/dashboard/stats`
- **REQUEST**: Empty Body
- **RESPONSE**: `200 OK`
  ```json
  {
    "totalHalls": 4,
    "totalBookings": 18,
    "pendingBookings": 3,
    "confirmedBookings": 14,
    "cancelledBookings": 1,
    "totalRevenue": 2700000.0,
    "receivedAmount": 1800000.0,
    "dueAmount": 900000.0
  }
  ```
- **AUTHENTICATION**: Required (`Authorization: Bearer <token>`)
- **ROLE**: `VENDOR` or `ADMIN`
- **PAGINATION**: N/A
- **ERRORS**:
  - `401 Unauthorized`
  - `403 Forbidden` ("Vendor or Admin role required")

#### 23. Get Vendor Bookings Overview
- **METHOD**: `GET`
- **PATH**: `/api/vendor/dashboard/bookings`
- **REQUEST**: Empty Body
- **RESPONSE**: `200 OK`
  ```json
  [
    {
      "bookingId": "c71a93b4-1234-4567-89ab-cdef01234567",
      "customerName": "Jane Doe",
      "customerPhone": "+1234567890",
      "hallName": "Grand Imperial Palace",
      "bookingDate": "2026-11-20",
      "slot": "FULL_DAY",
      "eventType": "WEDDING",
      "guestCount": 500,
      "totalAmount": 150000.0,
      "paidAmount": 30000.0,
      "dueAmount": 120000.0,
      "status": "CONFIRMED"
    }
  ]
  ```
- **AUTHENTICATION**: Required (`Authorization: Bearer <token>`)
- **ROLE**: `VENDOR` or `ADMIN`
- **PAGINATION**: None (Returns raw array)
- **ERRORS**: `401 Unauthorized`, `403 Forbidden`

---

### Review & Rating APIs (`review-service`)

#### 24. Submit Hall Review
- **METHOD**: `POST`
- **PATH**: `/api/reviews/add`
- **REQUEST**:
  ```json
  {
    "hallId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "reviewerName": "Jane Doe",
    "reviewerAvatar": "https://example.com/avatar.jpg",
    "rating": 5,
    "comment": "Exceptional service and beautiful ambiance!"
  }
  ```
- **RESPONSE**: `200 OK`
  ```json
  {
    "id": "b1122334-4455-6677-8899-aabbccddeeff",
    "userId": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "hallId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "reviewerName": "Jane Doe",
    "reviewerAvatar": "https://example.com/avatar.jpg",
    "rating": 5,
    "comment": "Exceptional service and beautiful ambiance!",
    "isVerifiedBooking": true,
    "createdAt": "2026-09-11T17:00:00"
  }
  ```
- **AUTHENTICATION**: Required (`Authorization: Bearer <token>`)
- **ROLE**: `USER`
- **PAGINATION**: N/A
- **ERRORS**:
  - `400 Bad Request` (Rating out of range 1-5, missing hallId)
  - `401 Unauthorized`

#### 25. Get Reviews for Hall
- **METHOD**: `GET`
- **PATH**: `/api/reviews/{hallId}`
- **REQUEST**: Empty Body
- **RESPONSE**: `200 OK` (`List<Review>`)
- **AUTHENTICATION**: None (Public)
- **ROLE**: Guest / Any
- **PAGINATION**: None (Returns raw array)
- **ERRORS**: `500 Internal Server Error`

#### 26. Get Average Rating & Review Count for Hall
- **METHOD**: `GET`
- **PATH**: `/api/reviews/{hallId}/average`
- **REQUEST**: Empty Body
- **RESPONSE**: `200 OK`
  ```json
  {
    "hallId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "averageRating": 4.8,
    "totalReviews": 24
  }
  ```
- **AUTHENTICATION**: None (Public)
- **ROLE**: Guest / Any
- **PAGINATION**: N/A
- **ERRORS**: `500 Internal Server Error`

---

## Section 3: Missing APIs & Backend Deficits

The following table explicitly details functionality required for a complete production wedding marketplace frontend where the **BACKEND API IS NOT AVAILABLE**:

| Feature Area | Missing Functionality | Backend Status | Required Frontend Fallback / Mitigation |
| :--- | :--- | :--- | :--- |
| **Auth & Security** | Token Refresh Endpoint (`POST /api/auth/refresh`) | `BACKEND API NOT AVAILABLE` | Store expiration timestamp; redirect to login upon 401 error. |
| **User Profile** | Update Profile / Edit Avatar / Change Password | `BACKEND API NOT AVAILABLE` | Show read-only profile modal; prompt user for feedback. |
| **File Management** | Image / File Upload API (`POST /api/upload`) | `BACKEND API NOT AVAILABLE` | Use external image hosting (Cloudinary/S3 direct upload or URL input fields). |
| **Payment Gateway** | Live Gateway Integration (Stripe / Razorpay SDK Webhooks) | `BACKEND API NOT AVAILABLE` | Mock payment sheet modal on client, then trigger `/api/payments/advance` or `/api/payments/final`. |
| **Payment Refunds** | Refund Payment API (`POST /api/payments/refund`) | `BACKEND API NOT AVAILABLE` | Hide refund action button or mark as offline request. |
| **Favorites / Saved** | User Wishlist / Favorite Halls Persistence | `BACKEND API NOT AVAILABLE` | Implement Client-side LocalStorage wishlist persistence in Zustand. |
| **Notifications** | User Notification Inbox / Preference Settings | `BACKEND API NOT AVAILABLE` | Suppress notification bell inbox counter or use toast alerts. |
| **Admin Panel** | Platform User Directory & Vendor Approval Workflow | `BACKEND API NOT AVAILABLE` | Limit Admin UI view to Hall catalog and Vendor stats overview. |
| **Catalog Search** | Multi-amenity filtering array & Date range availability search in single API | `BACKEND API NOT AVAILABLE` | Perform secondary client-side filtering on returned page contents. |
| **Pagination** | Pagination on Bookings list & Reviews list | `BACKEND API NOT AVAILABLE` | Implement client-side pagination over full array responses. |

