# Vehicle Auction and Bidding Management System
Real-time web application for Schokman & Samerawickreme.

## Prerequisites
Node.js 20.9+ and npm. Database engine to be decided by the team.

## Getting started
```bash
git clone <YOUR_REPOSITORY_URL>
cd vehicle-auction-management-system
cd backend && npm install && cp .env.example .env && npm run dev
```
In another terminal:
```bash
cd frontend && npm install && npm run dev
```
Open http://localhost:3000 (frontend) and http://localhost:4000/api/health (backend).

## Structure
- `frontend/`: Next.js App Router + TypeScript
- `backend/`: Express + TypeScript API
- `database/`: manually authored SQL, schema, migrations, seed data (engine TBD)
- `docs/`: team workflow, database design and API notes

## Collaboration
Each student works on their own branch (`36690-keshan`, etc.) and opens a Pull Request into `main`. Keep meaningful commits and avoid squash merging when preserving individual commit authorship. Pull latest `main` changes regularly; only merge reviewed and tested PRs.

Do not commit `.env`, credentials, or personal bidder information.
