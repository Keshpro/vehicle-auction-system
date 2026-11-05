# 🚗 Vehicle Auction and Bidding Management System

### Real-Time Web Application for Schokman & Samerawickreme

<p align="center">
  <img src="https://img.shields.io/badge/Project-Academic%20Project-blue" alt="Academic Project"/>
  <img src="https://img.shields.io/badge/Batch-25.1-orange" alt="Batch 25.1"/>
  <img src="https://img.shields.io/badge/Database-PostgreSQL-316192" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Status-In%20Development-yellow" alt="In Development"/>
</p>

## 📌 Project Overview

The **Vehicle Auction and Bidding Management System** is a real-time web application designed to support vehicle auction operations at Schokman & Samerawickreme.

The system provides an integrated platform for managing vehicle listings, approved bidder participation, live bidding, auction closure, and result reporting.

The primary focus of this project is to ensure reliable bid processing, maintain data integrity during concurrent bidding, and provide traceable auction records through advanced database management techniques.

This project is developed as an academic project for **CS304.3 – Advanced Database Management Systems** at NSBM Green University.

## 🎯 Project Aim

To develop and evaluate a secure, integrated vehicle auction web application that supports the selected company workflow through reliable bid processing and traceable results.

## ✨ Key Features

### Buyer Features
- User registration and authentication
- Browse and search vehicle listings
- View vehicle details and auction terms
- Participate in approved auctions
- Submit bids in real time
- View bid history and auction results
- Receive in-application notifications

### Staff Features
- Manage vehicle listings and photos
- Manage auctions and vehicle lots
- Approve bidder participation
- Monitor live bidding activities
- Review auction results
- Generate reports by auction, lot, or consigning client
- Export reports as CSV files

### Advanced Database Features
- Entity-Relationship (EER) modeling
- Database normalization up to Third Normal Form (3NF)
- Transactions and row-level locking
- Stored functions for bid validation
- Triggers and audit logging
- Database constraints and indexes
- Views for reporting
- Role-based database privileges
- Backup and recovery procedures
- Concurrency control for real-time bidding

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL 18 |
| Real-Time Communication | Socket.IO |
| Authentication | Server-managed sessions, secure cookies |
| Testing | API Testing, Database Testing, k6 |
| Version Control | Git, GitHub |
| Containerization | Docker Compose |

## 🏗️ System Architecture

```mermaid
flowchart TD
    A[Buyer / Staff] --> B[React Frontend]
    B --> C[Node.js + Express API]
    C --> D[Authentication & Authorization]
    D --> E[PostgreSQL Database]

    E --> F[Bid Processing Functions]
    F --> G[Transactions & Row Locks]
    G --> H[Accepted Bids & Auction Results]

    H --> I[Outbox Events]
    I --> J[Background Workers]
    J --> K[Socket.IO Live Updates]

    E --> L[Reports & Audit Logs]
```

## 🗄️ Core Database Entities

The preliminary database design includes:

- `user_account`
- `role`
- `user_role`
- `bidder_profile`
- `consignor`
- `yard_location`
- `vehicle`
- `vehicle_photo`
- `auction`
- `vehicle_lot`
- `auction_participation`
- `bid`
- `lot_result`
- `notification`
- `audit_log`
- `outbox_event`

The database is designed to maintain relationships between vehicles, auctions, lots, bidders, bids, and auction results while preserving historical records.

## ⚙️ Core Bidding Logic

The system uses PostgreSQL as the authoritative source for bid acceptance and auction outcomes.

When a bidder submits an offer:

1. The system validates the bidder's authentication and auction participation.
2. The database locks the relevant vehicle lot.
3. The bid is validated against the current highest bid, minimum increment, and auction deadline.
4. The accepted bid, updated lot state, and event are committed within a transaction.
5. Live updates are published to connected clients.
6. At the closing deadline, the lot is locked and its result is recorded.

This approach helps prevent conflicting bids, duplicate requests, and inconsistent auction results.

## 📂 Project Structure

```text
vehicle-auction-system/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── hooks/
│       └── types/
│
├── backend/
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       ├── middleware/
│       ├── config/
│       └── sockets/
│
├── database/
│   ├── migrations/
│   ├── functions/
│   ├── triggers/
│   ├── views/
│   └── seeds/
│
├── tests/
│   ├── api/
│   ├── database/
│   └── concurrency/
│
├── docs/
│   ├── requirements/
│   ├── diagrams/
│   └── reports/
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

*The directory structure will be updated as development progresses.*

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- PostgreSQL 18
- Git
- Docker (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/vehicle-auction-system.git
cd vehicle-auction-system
```

### 2. Install Dependencies

Once the frontend and backend projects have been initialized:

```bash
cd frontend
npm install
```

```bash
cd ../backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory.

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/vehicle_auction
SESSION_SECRET=your_secure_session_secret
```

Do not commit `.env` files or real credentials to GitHub.

### 4. Configure the Database

Create the PostgreSQL database:

```sql
CREATE DATABASE vehicle_auction;
```

Run the database migrations after they are implemented.

### 5. Run the Application

Frontend:

```bash
cd frontend
npm run dev
```

Backend:

```bash
cd backend
npm run dev
```

*The commands above represent the planned development setup and may be adjusted to match the final project configuration.*

## 🧪 Testing and Evaluation

The system will be evaluated through:

- Functional testing
- Database integrity testing
- Concurrent bidding tests
- Duplicate request testing
- Auction deadline validation
- Role-based access control testing
- Performance and load testing
- Backup and recovery testing

### Preliminary Performance Targets

| Metric | Target |
|---|---|
| Bid response time | p95 ≤ 500 ms |
| Eligible requests completing without unexpected errors | ≥ 99% |
| Concurrent user load | 50, 100, 250, 500 and up to 1,000 users |
| Bid integrity | No committed bid lost or duplicated |

These are provisional targets from the project proposal and will be evaluated under documented test conditions.

## 👥 Team Members

**Group H – Batch 25.1**

| No. | Student Name | Student ID |
|---|---|---|
| 1 | WMGSR Weerakoon | 36944 |
| 2 | AKN Alwis | 36029 |
| 3 | RWSR Rajasekara | 36416 |
| 4 | HAB Weerasiri | 36731 |
| 5 | PHD Indusara | 37258 |
| 6 | SHG Sooriyaarachchi | 36881 |
| 7 | TPT Perera | 37241 |
| 8 | SMDT Jayathilake | 36964 |
| 9 | PLRDKH Panditharathna | 36690 |
| 10 | ARKN Wickramarathne | 36071 |

## 📅 Project Timeline

| Phase | Duration |
|---|---|
| Requirements and Planning | Weeks 1–2 |
| Database Design | Week 3 |
| Core Backend and Database Development | Weeks 4–7 |
| Frontend and Real-Time Integration | Weeks 8–9 |
| Testing and Optimization | Weeks 10–11 |
| Documentation and Final Presentation | Week 12 |

## 🔒 Project Scope

### Included
- Vehicle catalogue management
- Auction scheduling
- Bidder approval
- Real-time bidding
- Auction results
- Audit history
- Notifications
- Reports and CSV exports
- Database backup and restoration

### Excluded
- Online payments
- Deposits and refunds
- Accounting
- Ownership transfer
- Government identity integrations
- Proxy bidding
- Simultaneous physical and online bidding
- Integration with the existing company portal
- Production deployment

## 📚 Academic Information

**Course:** CS304.3 – Advanced Database Management Systems  
**Institution:** NSBM Green University  
**Batch:** 25.1  
**Group:** H  
**Project Type:** Academic Final Project

---

<p align="center">
  Developed with ❤️ by <strong>Group H – Batch 25.1</strong>
  <br/>
  Vehicle Auction and Bidding Management System
</p>
