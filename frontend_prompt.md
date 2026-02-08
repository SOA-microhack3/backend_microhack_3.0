# Comprehensive Frontend Development Prompt for Intelligent Logistics System

**Role:** You are an expert Frontend Developer and AI Agent (Gemini 1.5 Pro).
**Objective:** Build a production-ready, responsive, and robust frontend application for the **Intelligent Logistics Access Control System**.
**Tech Stack:** Next.js (App Router), Tailwind CSS, TypeScript, Axios (for API requests), React Hook Form (validation).

---

## 1. Project Context
The backend is a NestJS REST API managing maritime port truck bookings, QR code access, and logistics. You must build the client-side interface to interact with *every* endpoint provided by this API, ensuring strict adherence to role-based security and handling all edge cases.

## 2. Core Architecture & Authentication
-   **Base URL:** `http://localhost:3000/api` (or from env var).
-   **Auth Flow:**
    -   Implement a global `AuthContext` to manage User State and JWT Token.
    -   Persist the token in `localStorage` or `cookies`.
    -   Attach the Bearer token to *every* authenticated request via an Axios interceptor.
    -   **Handle 401/403:** If a token expires or is invalid, auto-logout and redirect to `/login`.
-   **Role-Based Access Control (RBAC):**
    -   Create a higher-order component or layout wrapper (e.g., `<ProtectedRoute allowedRoles={['ADMIN', 'OPERATOR']} />`) to protect pages.
    -   **Roles:** `ADMIN`, `OPERATOR`, `CARRIER`, `DRIVER`.
    -   *Crucial:* Do not just hide UI elements; prevent navigation to unauthorized routes entirely.

## 3. Detailed Feature Requirements (By Module)

### A. Authentication Module
-   **Login Page:** Clean form for Email/Password. Handle loading states and display specific error messages (e.g., "Invalid credentials", "Account locked"). Redirect users to their specific dashboard based on their Role upon success.
-   **Register Page:** Allow registration. *Edge Case:* If the user selects "Carrier", ensure validation rules specific to carriers are met.
-   **Password Management:** "Forgot Password" (step 1) and "Reset Password" (step 2 with token from email link).

### B. Dashboards (Role-Specific)
*Create separate layouts/views for each role.*
1.  **Operator Dashboard:**
    -   **Overview:** Show real-time terminal status (use `GET /dashboard/operator/realtime-status`).
    -   **Traffic:** Visualize today's traffic (`GET /dashboard/operator/today-traffic`).
    -   **Approvals:** A list of pending bookings needing confirmation. Provide "Approve" and "Reject" buttons directly in the list.
    -   **Exceptions:** Highlight issues via `GET /dashboard/operator/exceptions`.
2.  **Carrier Dashboard:**
    -   **Fleet Status:** Summary of active/idle trucks (`GET /dashboard/carrier/fleet-status`).
    -   **Upcoming Bookings:** List of future bookings.
3.  **Admin Dashboard:** Full access to all CRUD modules (Users, Ports, Terminals, etc.).

### C. Booking Management (The Core Feature)
-   **Booking List:** A powerful table with filters (Date, Status, Carrier).
    -   *Edge Case:* If the list is empty, show a helpful "No bookings found" state.
-   **Create Booking (Carrier/Admin):**
    -   Multi-step wizard or comprehensive form.
    -   **Step 1:** Select Terminal & Date.
    -   **Step 2:** Check Availability (`GET /bookings/availability`). *UI:* Visual slot picker (green=free, red=full).
    -   **Step 3:** Select Truck (dropdown filtered by availability) and Driver.
    -   **Step 4:** Submit.
-   **Booking Actions (Operator):**
    -   **Confirm/Reject:** dedicated buttons.
    -   **Reassign Slot:** Modal to pick a new time if the requested one is congested.
    -   **Manual Override:** A form requiring a "Reason" text input to force-approve a booking.

### D. QR Code Access Control
-   **Driver View:** Display the QR code for a confirmed booking (`GET /qrcodes/booking/:id`). Ensure high contrast for scanning.
-   **Operator/Gate View:**
    -   Implement a "Scanner" page (can use a webcam library or a manual input field for the token string).
    -   Call `POST /qrcodes/scan`.
    -   **Feedback:** Show a massive GREEN checkmark for success or RED X for failure (e.g., "Invalid Terminal", "Too Early").

### E. AI Integration (Helpdesk)
-   **Chat Interface:** A floating chat widget or dedicated page.
-   **Interaction:** User types a query -> Frontend calls `POST /chat`.
-   **Rendering:** Display the AI's response properly.

### F. Resource Management (CRUD)
Build standard, reusable DataTable components for the following. Include Search, Pagination, and "Add New" modals.
-   **Users:** Admin only.
-   **Trucks:** Carriers can see their own; Admins see all. *Feature:* Toggle "Status" (Active/Maintenance).
-   **Drivers:** Carriers can see their own.
-   **Ports & Terminals:** Admin only. Define capacity limits here.

## 4. UI/UX & Edge Cases
-   **Loading States:** Use skeletons (Skeleton UI) while fetching data, not just spinning wheels.
-   **Error Handling:** centralized toast notifications (e.g., `react-hot-toast`) for API errors (500s, network issues).
-   **Responsive Design:** The Carrier and Driver views **MUST** be mobile-first (they are used on the go). The Operator view is desktop-optimized (control room).
-   **Empty States:** Never leave a blank page. "No trucks found. Click here to add one."

## 5. Directory Structure Recommendation
```
/app
  /(auth)        # Login, Register (Public layout)
  /(dashboard)   # Main app (Sidebar layout, Protected)
    /operator    # Operator specific pages
    /carrier     # Carrier specific pages
    /admin       # Admin specific pages
    /bookings    # Shared booking views
    /resources   # shared lists (trucks, drivers)
  /components
    /ui          # Atomic components (Buttons, Inputs)
    /forms       # Complex forms
    /tables      # Data tables
```

## 6. Execution Strategy for You (The Agent)
1.  **Setup:** Initialize the global AuthContext and Axios instance first.
2.  **Layouts:** specific layouts for different roles.
3.  **Components:** Build the reusable UI kit (Cards, Tables, Modals).
4.  **Integration:** Connect pages one by one, ensuring the "Happy Path" works before handling errors.
5.  **Refinement:** Add the loading skeletons and empty states.

**Task:** Generate the code for this frontend application following these strict guidelines.
