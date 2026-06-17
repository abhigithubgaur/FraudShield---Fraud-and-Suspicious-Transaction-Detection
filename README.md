# 🔐 Real-Time Transaction Fraud Detection System

A full-stack fintech application that evaluates every transaction against a custom fraud scoring engine — automatically approving, flagging, or rejecting it in real time.

> Built with Java 21 · Spring Boot · Spring Security · JWT · PostgreSQL · React

---
## 🚀 Live Demo

> https://fraud-shield-fraud-and-suspicious-t.vercel.app

---
## 📌 What It Does

Every transaction submitted by a user is run through a **Fraud Engine** that calculates a risk score from `0.0` to `1.0` using three weighted signals:

| Signal | Weight | Logic |
|---|---|---|
| **Amount Risk** | 60% | Large amounts score higher |
| **Velocity Risk** | 20% | Too many transactions per minute |
| **Geographic Risk** | 20% | Location differs from last transaction |

Based on the final score, the system takes automatic action:

```
Score < 0.50   →  ✅ APPROVED  — transaction goes through
Score 0.50–0.85 →  ⚠️ FLAGGED   — OTP verification challenge triggered
Score > 0.85   →  🚫 REJECTED  — transaction blocked + account auto-frozen
```

---

## ✨ Features

### User
- Register & login with JWT-based authentication
- Initiate transactions (amount, receiver, location, IP)
- Get real-time fraud alerts via **Server-Sent Events (SSE)**
- Receive OTP challenge for suspicious transactions
- Verify OTP to approve a flagged transaction
- View personal transaction history
- Self-freeze account instantly

### Admin
- Live dashboard metrics (total transactions, fraud rate, blocked accounts)
- View all fraud alerts with severity levels (HIGH / MEDIUM)
- Resolve flagged transactions (approve or reject)
- Freeze or activate any user account
- View all user risk profiles and scores
- **Update fraud rules at runtime** — change thresholds without restarting the server
- Export full fraud report as CSV

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot 4, Spring MVC |
| Security | Spring Security, JWT (jjwt 0.11.5) |
| Database | PostgreSQL (Neon) |
| ORM | Spring Data JPA / Hibernate |
| Real-time | Server-Sent Events (SSE) |
| Frontend | React |
| Build Tool | Maven |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    React Frontend                    │
└────────────────────────┬────────────────────────────┘
                         │ HTTP + JWT
┌────────────────────────▼────────────────────────────┐
│              Spring Boot REST API                    │
│                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │AuthController│  │TxController  │  │AdminControl│  │
│  └──────┬──────┘  └──────┬───────┘  └─────┬──────┘  │
│         │                │                 │          │
│  ┌──────▼────────────────▼─────────────────▼──────┐  │
│  │               Service Layer                     │  │
│  │   AuthService · TransactionService · OtpService │  │
│  └──────────────────────┬──────────────────────────┘  │
│                         │                             │
│  ┌──────────────────────▼──────────────────────────┐  │
│  │              Fraud Engine                        │  │
│  │   AmountRisk(60%) + VelocityRisk(20%) +          │  │
│  │   GeoRisk(20%)  →  Score  →  Action              │  │
│  └──────────────────────┬──────────────────────────┘  │
│                         │                             │
│  ┌──────────────────────▼──────────────────────────┐  │
│  │         PostgreSQL (via Spring Data JPA)         │  │
│  │  users · transactions · fraud_alerts · otp       │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and get JWT token |

### Transactions
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/transactions/initiate` | ROLE_USER | Submit a transaction for fraud evaluation |
| POST | `/api/transactions/{id}/verify-otp` | ROLE_USER | Verify OTP for a flagged transaction |
| GET | `/api/transactions/my-history/{userId}` | ROLE_USER | Get transaction history |

### User
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/user/freeze` | ROLE_USER | Self-freeze account |
| GET | `/api/user/all` | ROLE_USER | List all users |

### Admin
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/metrics` | ROLE_ADMIN | Dashboard metrics |
| GET | `/api/admin/alerts` | ROLE_ADMIN | All fraud alerts |
| PUT | `/api/admin/transactions/{id}/resolve` | ROLE_ADMIN | Resolve a flagged transaction |
| PUT | `/api/admin/users/{id}/status` | ROLE_ADMIN | Freeze or activate user |
| GET | `/api/admin/users/risk-profiles` | ROLE_ADMIN | All user risk scores |
| GET | `/api/admin/rules` | ROLE_ADMIN | Current fraud thresholds |
| PUT | `/api/admin/rules` | ROLE_ADMIN | Update fraud rules at runtime |
| GET | `/api/admin/reports/csv` | ROLE_ADMIN | Download fraud report CSV |

### Real-time Alerts
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/alerts/subscribe/{userId}` | Public | SSE stream for live fraud alerts |

---

## ⚙️ Setup & Running Locally

### Prerequisites
- Java 21
- Maven 3.8+
- PostgreSQL database 

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/TransactionDetection.git
cd TransactionDetection
```

### 2. Configure the database
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://<your-db-host>/<your-db-name>
spring.datasource.username=<your-username>
spring.datasource.password=<your-password>
```

### 3. Run the backend
```bash
./mvnw spring-boot:run
```
The API will be available at `http://localhost:8080`.

> Hibernate will auto-create all tables on first run (`ddl-auto=update`).

### 4. Run the frontend
```bash
cd TransactionDetectionFrontend
npm install
npm run dev
```

---

## 🔑 Default Roles

When registering, set the `role` field in the request body:
- `"ROLE_USER"` — regular user who can initiate transactions
- `"ROLE_ADMIN"` — admin who can manage the system

---

## 💡 Key Design Decisions

**Runtime fraud rule updates** — The `FraudEngine` exposes setters for its thresholds. The `AdminService` calls these directly, meaning an admin can tighten or loosen fraud sensitivity without a redeployment. This mirrors how real fraud platforms work.

**SSE for real-time alerts** — Instead of polling, the frontend subscribes to a Server-Sent Events stream per user. When a fraud event fires, the alert is pushed instantly.

**Account auto-freeze** — If a transaction scores above 0.85, the sender's account is frozen immediately and their risk score is incremented. This prevents rapid successive fraudulent transactions.

**OTP as a middle ground** — Rather than binary approve/reject, medium-risk transactions (0.50–0.85) trigger an OTP challenge. The user can still complete the transaction if they verify their identity.

---

## 📂 Project Structure

```
src/main/java/com/project/TransactionDetection/
├── config/          # Security, CORS, Web client configuration
├── controller/      # REST endpoints (Auth, Transaction, Admin, User, Notification)
├── dto/             # Request/Response data transfer objects
├── entity/          # JPA entities (User, Transaction, FraudAlert, TransactionOtp)
├── fraud/           # FraudEngine — core scoring logic
├── repository/      # Spring Data JPA repositories
├── security/        # JWT filter and utilities
└── service/         # Business logic (Auth, Transaction, Admin, OTP)
```

---

## 🤝 Connect

If you found this project interesting or have feedback, feel free to connect on [LinkedIn] https://www.linkedin.com/in/abhishek-kumar-71a424295/.

---

> ⭐ Star this repo if you found it useful!
