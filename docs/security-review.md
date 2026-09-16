# Security Audit & Backend Security Dependencies

## Executive Summary
A comprehensive security review was performed across the MarriageHall Web frontend application. The frontend enforces strict client-side controls while maintaining the principle that **backend authorization remains authoritative**.

---

## 1. Frontend Security Audit Findings & Enhancements

### A. Secret & Credential Scanning
* **Zero Hardcoded Secrets**: Verified zero hardcoded API keys, private keys, JWT tokens, or credentials in source code.
* **Environment Variables**:
  * `.gitignore` updated and verified to ignore all `.env`, `.env.local`, and build artifacts.
  * `.env` is **not tracked** in Git.
  * Created clean `.env.example` template without sensitive credentials.

### B. Authentication & Authorization Scoping
* **Token Storage & Transport**: JWT access tokens are stored in `zustand` state with `persist` middleware and injected strictly via `Bearer` authorization headers in Axios request interceptors (`src/lib/api/client.ts`).
* **Session Lifecycle**: Automatically intercepts HTTP `401 Unauthorized` responses to purge stored JWT tokens and clear sensitive user state (`logout()`).
* **Route Protection**: Protected routes (`/account/*`, `/vendor/*`, `/admin/*`) use explicit role verification guards. Authorization assumptions are never trusted client-side alone; all actions are validated against Spring Boot backend endpoints.

### C. Input Handling & XSS Prevention
* **Safe DOM Rendering**: Verified zero instances of `dangerouslySetInnerHTML` across `src/`. All text nodes are dynamically rendered via standard React JSX auto-escaping.
* **Safe Navigations**: Zero unvalidated `window.location` redirects or open-redirect vulnerabilities. All routing is controlled via `react-router-dom` `<Link>` and `useNavigate()`.

### D. Error Handling & Information Leakage
* **Safe Error Normalization**: Sanitized error responses via `parseApiError()`. Internal stack traces or raw backend system details are never exposed to end users.
* **Logging Controls**: Verified zero active `console.log` statements dumping PII or sensitive request data in production code.

---

## 2. Mandatory Backend Security Dependencies

To achieve end-to-end security compliance, the backend Spring Boot system MUST implement and enforce the following security controls:

1. **HttpOnly & Secure Cookies**: Transition JWT tokens from client storage to `HttpOnly`, `Secure`, `SameSite=Strict` cookies to mitigate XSS-based token theft risks.
2. **Authoritative RBAC Enforcement**: Enforce `@PreAuthorize("hasRole('ADMIN')")` and `@PreAuthorize("hasRole('VENDOR')")` annotations at the API controller layer for every endpoint.
3. **Strict CORS Policy**: Restrict CORS origins strictly to authorized web domains (`https://marriagehall.com`). Avoid `Access-Control-Allow-Origin: *`.
4. **Input Sanitization & Injection Prevention**: Enforce strict server-side validation using `jakarta.validation` on all incoming request DTOs to prevent SQL Injection (SQLi) and Remote Code Execution (RCE).
5. **Rate Limiting**: Implement rate-limiting buckets (e.g., Spring Security / Bucket4j) on `/api/v1/auth/login` and `/api/v1/auth/register` endpoints to prevent brute-force attacks.

