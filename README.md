# Skilled Service Provider Booking Platform (ProFix)

A full-stack, enterprise-grade service marketplace connecting customers with local skilled service professionals (electricians, plumbers, carpenters, painters, masons). Built from scratch for capstone/final-year evaluation demonstrating software engineering principles, OOP/SOLID patterns, concurrency control, transaction isolation, REST APIs, and modern responsive UI.

---

## 🌟 Key Features

### 1. Customer
- **Authentication**: JWT-based secure registration and login.
- **Service Exploration**: Browse categorized services (Electricians, Plumbers, Carpenters, Painters, Masons) with base pricing and real-time availability filters.
- **Service Request & Booking**: Select date, time slots, estimated labor hours, and describe problems with dynamic pricing breakdown.
- **Booking Management**: Real-time status tracking (`PENDING`, `ACCEPTED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).
- **Cancellation**: Ability to cancel non-completed bookings with reason logging.
- **Ratings & Reviews**: Leave star ratings and written reviews upon service completion, automatically recalculating provider average scores.

### 2. Service Provider
- **Onboarding & Profile**: Register with skill category, bio, city, experience, and hourly pricing.
- **Availability Toggle**: 1-click toggle to mark busy/unavailable to prevent new incoming bookings.
- **Incoming Requests**: Accept or decline incoming service requests with explanation notes.
- **Job Lifecycle Updates**: Transition booking status from `ACCEPTED` ➔ `IN_PROGRESS` ➔ `COMPLETED`.
- **Reputation**: View client reviews and ratings.

### 3. Administrator
- **Analytics Dashboard**: Gross revenue tracking, completed booking counts, total user volume.
- **Category Management**: Create, update, or remove service categories and base prices.
- **User & Booking Audit**: Complete view of all platform users and transaction histories.

### 4. Cross-Cutting Systems
- **Notification Engine**: In-app notifications + extensible Email/SMS simulation via Dependency Inversion.
- **Concurrency & Double-Booking Prevention**: Transaction isolation level `REPEATABLE_READ` and database checks ensure providers cannot be double-booked for the same timeslot.
- **Optimistic Locking**: `@Version` column prevents race-condition overwrites.

---

## 🏗️ Architecture & System Design Concepts

```text
             ┌───────────────────────────────────┐
             │       React 18 + Tailwind CSS     │
             │           (Frontend)              │
             └─────────────────┬─────────────────┘
                               │
                           REST API (JWT)
                               │
             ┌─────────────────▼─────────────────┐
             │      Spring Boot 3 (Backend)      │
             │                                   │
             │  ├── Auth & Security Filter       │
             │  ├── Booking Service              │
             │  ├── Provider Service             │
             │  ├── Pricing Strategies (Strategy)│
             │  └── Notification Senders (DIP)   │
             └─────────────────┬─────────────────┘
                               │
             ┌─────────────────▼─────────────────┐
             │ PostgreSQL / In-Memory H2 DB      │
             └───────────────────────────────────┘
```

### OOP & SOLID Design Patterns Implemented:
1. **Strategy Pattern (`PricingStrategy`)**:
   - `StandardPricingStrategy`: Category base price + (hourly rate × hours)
   - `SurgePricingStrategy`: 1.25x emergency rate multiplier
   - `PricingContext`: Encapsulates dynamic strategy resolution at runtime. Demonstrates **Open/Closed Principle (OCP)**.
2. **Dependency Inversion Principle (DIP) (`NotificationSender`)**:
   - High-level `NotificationService` depends on abstraction `NotificationSender` rather than concrete classes.
   - `EmailNotificationSender` and `SmsNotificationSender` plug into the notification pipeline without changing core business logic.
3. **State Pattern & Lifecycle Management**:
   - Booking transitions strictly guarded through lifecycle states: `PENDING` ➔ `ACCEPTED` ➔ `IN_PROGRESS` ➔ `COMPLETED` / `CANCELLED` / `REJECTED`.
4. **Inheritance & Polymorphism (`User` hierarchy)**:
   - Base `User` entity joined with `Customer` and `ServiceProvider` using JPA `InheritanceType.JOINED`.

---

## 🚀 Getting Started

### Prerequisites
- **Java 21+**
- **Maven 3.8+**
- **Node.js 18+** & **npm**

### 1. Run Backend (Spring Boot)
By default, the backend runs with an in-memory PostgreSQL-compatible H2 database loaded with initial seed data, so you don't even need to configure Postgres to run it immediately!

```bash
cd backend
mvn spring-boot:run
```
*Backend runs on `http://localhost:8080`*
*(H2 Console available at `http://localhost:8080/h2-console`)*

> To switch to a physical PostgreSQL instance, activate the `postgres` profile or set database details in `backend/src/main/resources/application-postgres.properties`.

### 2. Run Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🔑 Pre-Configured Demo Credentials

The platform comes with 1-click test credentials right on the login page:

| Role | Email | Password | Details |
|---|---|---|---|
| **Customer** | `alice@gmail.com` | `password123` | Customer with active bookings |
| **Provider** | `raj.electric@gmail.com` | `password123` | Master Electrician (Springfield) |
| **Admin** | `admin@platform.com` | `admin123` | Platform Administrator |

Other seed providers: `mike.plumb@gmail.com` (Plumber), `carlos.carpentry@gmail.com` (Carpenter), `sarah.painter@gmail.com` (Painter), `david.mason@gmail.com` (Mason).

---

## 📦 Git Push Instructions

```bash
git remote add origin https://github.com/Samyak2605/SDSE_project.git
git branch -M main
git push -u origin main
```
