# Surplus Food Rescue & Redistribution Coordination Platform

A full-stack, enterprise-grade web application designed to connect surplus food donors (restaurants, hotels, banquet halls, corporate cafeterias) with non-profit hunger relief organizations (NGOs, shelters, community kitchens) and certified volunteer dispatchers to eliminate food waste and fight hunger.

---

## 1. Architecture & Technology Stack

### Backend
* **Language & Runtime:** Java 17 LTS
* **Framework:** Spring Boot 3.3.4
* **Persistence & ORM:** Spring Data JPA, Hibernate ORM
* **Security & Auth:** Spring Security 6 with stateless JWT (`jjwt` 0.12.5), BCrypt password hashing
* **Validation:** Jakarta Bean Validation (`spring-boot-starter-validation`)
* **Build System:** Apache Maven 3.9+
* **Concurrency Control:** Pessimistic Write Locks (`@Lock(LockModeType.PESSIMISTIC_WRITE)`) and Optimistic Locking (`@Version`) for safe inventory reservations.

### Frontend
* **Core:** React 18, Vite 5.4+
* **Language:** JavaScript (ES6+)
* **HTTP Client:** Browser Fetch API with automatic JWT header injection (No Axios)
* **Styling:** Custom CSS Design System with responsive grid, glassmorphism, Outfit & Inter typography (No Tailwind, No Bootstrap, No external UI frameworks)

### Database
* **RDBMS:** MySQL 8
* **Database Name:** `food_rescue_db`
* **Port:** 3306

### Testing & Verification
* **REST Testing:** Postman Collection (`Surplus-Food-Rescue.postman_collection.json`) and Environment (`Surplus-Food-Rescue.postman_environment.json`)

---

## 2. Project Directory Structure

```text
food_rescue_platform_project/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/foodrescue/platform/
│       │   │   ├── config/             # SecurityConfig, DataInitializer
│       │   │   ├── controller/         # Auth, Profile, Category, Donation, Request, Assignment, Admin, Notification
│       │   │   ├── dto/                # Request & Response DTOs
│       │   │   ├── entity/             # JPA Entities (User, Profiles, FoodDonation, FoodRequest, etc.)
│       │   │   ├── enums/              # Role, FoodUnit, DonationStatus, RequestStatus, etc.
│       │   │   ├── exception/          # GlobalExceptionHandler (@RestControllerAdvice)
│       │   │   ├── mapper/             # EntityMapper
│       │   │   ├── repository/         # Spring Data JPA Repositories
│       │   │   ├── security/           # JwtTokenProvider, JwtAuthenticationFilter, UserPrincipal
│       │   │   └── service/            # Core Business Logic & State Machines
│       │   └── resources/
│       │       └── application.properties
│       └── test/
├── database/
│   ├── schema.sql                      # DDL for MySQL 8 schema
│   └── sample-data.sql                 # Rich seed data for all roles and workflows
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── api/apiClient.js            # Standard Fetch API client
│       ├── components/                 # Navbar, Footer, Modal, Badge, StatCard, Toast
│       ├── context/                    # AuthContext, NotificationContext
│       ├── pages/                      # Home, Login, Register, Browse, 4 Role Dashboards, Profile
│       ├── styles/index.css            # Custom responsive CSS design system
│       ├── App.jsx
│       └── main.jsx
├── postman/
│   ├── Surplus-Food-Rescue.postman_collection.json
│   └── Surplus-Food-Rescue.postman_environment.json
├── .gitignore
└── README.md
```

---

## 3. Four User Roles & Permission Matrix

| Role | Core Capabilities |
| :--- | :--- |
| **DONOR** | List surplus food batches, set pickup deadlines, edit/cancel eligible listings, receive in-app requests, approve/reject requests, track volunteer dispatch and delivery confirmation. |
| **NGO** | Search and filter food catalog, request batches (`requestedQuantity <= remainingQuantity`), track approval status, assign/coordinate volunteer pickup, confirm delivery, receive notifications. |
| **VOLUNTEER** | Manage availability (`AVAILABLE`, `BUSY`, `OFFLINE`), receive pickup dispatch runs, accept runs, mark food **Collected** with inspection notes, mark food **Delivered** with receipt notes. |
| **ADMIN** | Supervise platform stats (total food pledged vs rescued), activate/deactivate user accounts, verify Organization & Volunteer credentials, manage food categories, monitor all system transactions. |

---

## 4. Realistic Demonstration Credentials (Indian Food Rescue Network)

For testing, evaluation, and demonstration, the platform includes pre-seeded Indian partner accounts across all four distinct roles. Quick pre-fill buttons are conveniently available on the Sign-In page (`/login`):

| Role | Email | Password | Real-world Indian Entity & Profile |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@foodrescue.org` | `Admin@123456` | Rajesh Sharma (System Administrator, Central Command) |
| **DONOR** | `grandchola@banquets.in` | `Password@123` | Grand Chola Banquets & Catering (Chef Vikram Malhotra, Domlur, Bengaluru) |
| **DONOR** | `annapoorna@sweets.in` | `Password@123` | Sri Annapoorna Caterers & Mithai Bhavan (Sunita Narayanan, Indiranagar) |
| **NGO** | `akshayapatra@relief.org` | `Password@123` | Akshaya Seva Foundation & Community Kitchen (Ramesh Kulkarni, Koramangala) |
| **NGO** | `roti.bank@trust.org` | `Password@123` | Roti Bank & Hunger Relief Trust (Pooja Deshmukh, Whitefield) |
| **VOLUNTEER** | `arjun.patel@volunteer.in` | `Password@123` | Arjun Patel (Indiranagar & Central Bengaluru Dispatcher) |
| **VOLUNTEER** | `priya.nair@volunteer.in` | `Password@123` | Priya Nair (Koramangala & HSR Dispatcher) |

---

## 5. Setup & Running Locally

### Prerequisites
* Java 17 JDK
* Maven 3.9+
* Node.js v18+ & npm
* MySQL 8 Server running on `localhost:3306`

### Database Setup
1. Open your terminal / MySQL CLI:
   ```bash
   mysql -u root -p
   ```
2. Run the schema and sample data scripts:
   ```sql
   source /path/to/food_rescue_platform_project/database/schema.sql;
   source /path/to/food_rescue_platform_project/database/sample-data.sql;
   ```
   *(Alternatively, Hibernate `ddl-auto=update` and `DataInitializer.java` will automatically initialize tables and seeds when the Spring Boot backend boots).*

### Backend Launch
1. Open a terminal in the `backend/` folder:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
2. The Spring Boot backend starts on `http://localhost:8080`.
3. Check health and Swagger / public endpoint: `GET http://localhost:8080/api/categories`.

### Frontend Launch
1. Open another terminal in the `frontend/` folder:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. The React application will be live at `http://localhost:5173`.
3. Open `http://localhost:5173` in any browser.

---

## 6. Concurrency Control & Food Reservation Model

A critical requirement in food redistribution is preventing **oversubscription** or duplicate reservation of the same food batch.

1. **Pessimistic DB Locks**: When a Donor approves an NGO request or an NGO creates a request, `FoodDonationRepository.findByIdWithLock(id)` acquires a `SELECT ... FOR UPDATE` row lock inside an isolated transaction.
2. **Optimistic Locking**: The `FoodDonation` entity contains `@Version private Long version;` to safeguard concurrent edits.
3. **Quantity Integrity**:
   * Initial listing: `allocated_quantity = 0`, `remaining_quantity = original_quantity`.
   * On Request Approval: `allocated_quantity += requested`, `remaining_quantity -= requested`.
   * If `remaining_quantity == 0`: Donation state transitions to `FULLY_RESERVED`.
   * On Request Cancellation (before collection): `allocated_quantity -= requested`, `remaining_quantity += requested`. The reserved stock is atomically restored.
   * On Volunteer Collection: status transitions to `IN_PROGRESS`.
   * On Volunteer Delivery: status transitions to `COMPLETED`.

---

## 7. REST API Endpoints

### Authentication (`/api/auth`)
* `POST /api/auth/register`: Register new Donor, NGO, or Volunteer
* `POST /api/auth/login`: Authenticate and receive JWT token
* `GET /api/auth/me`: Current session details

### Food Categories (`/api/categories`)
* `GET /api/categories`: List all categories
* `GET /api/categories/active`: List active categories
* `POST /api/categories`: Create category (Admin)
* `PUT /api/categories/{id}`: Update category (Admin)

### Food Donations (`/api/donations`)
* `GET /api/donations`: Search donations (filter by status, category, city, vegetarian, keyword)
* `GET /api/donations/{id}`: Specific donation details
* `POST /api/donations`: List new surplus food (Donor)
* `PUT /api/donations/{id}`: Edit donation (Donor)
* `POST /api/donations/{id}/cancel`: Cancel donation (Donor)
* `GET /api/donations/my`: View own listed batches (Donor)

### Food Requests (`/api/requests`)
* `POST /api/requests`: Submit food request (NGO)
* `GET /api/requests/my`: View own food requests (NGO)
* `GET /api/requests/donor`: View requests on donor's listings (Donor)
* `POST /api/requests/{id}/approve`: Approve request and reserve inventory (Donor)
* `POST /api/requests/{id}/reject`: Reject request (Donor)
* `POST /api/requests/{id}/cancel`: Cancel request and restore stock (NGO)

### Volunteer Assignments (`/api/assignments`)
* `POST /api/assignments`: Assign volunteer to approved request (Donor / NGO / Admin)
* `GET /api/assignments/my`: View assigned pickup tasks (Volunteer)
* `POST /api/assignments/{id}/status`: Action transitions (`ACCEPT`, `COLLECT`, `DELIVER`) (Volunteer)
* `GET /api/assignments/volunteers`: List available volunteers

### Notifications (`/api/notifications`)
* `GET /api/notifications`: Get user's notifications
* `GET /api/notifications/unread-count`: Get badge counter
* `POST /api/notifications/{id}/read`: Mark notification as read
* `POST /api/notifications/read-all`: Mark all notifications read

### Administration (`/api/admin`)
* `GET /api/admin/stats`: Aggregate system metrics
* `GET /api/admin/users`: List all users
* `PATCH /api/admin/users/{id}/status`: Activate / Deactivate account
* `POST /api/admin/verify/{profileType}/{id}`: Verify or Reject profile
* `GET /api/admin/donors`, `ngos`, `volunteers`, `donations`, `requests`, `assignments`: Full surveillance

---

## 8. Postman Collection Testing

1. Launch Postman.
2. Import `postman/Surplus-Food-Rescue.postman_collection.json`.
3. Import `postman/Surplus-Food-Rescue.postman_environment.json`.
4. Select the environment **Surplus Food Rescue Local Env**.
5. Run the **1. Authentication -> Login Admin** or **Login Donor** request. Postman tests will automatically extract the bearer token and populate environment variables (`adminToken`, `donorToken`, `ngoToken`, `volunteerToken`) for subsequent requests.
