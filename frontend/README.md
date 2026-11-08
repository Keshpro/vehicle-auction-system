# Vehicle Auction Frontend
React + Vite + TypeScript + Tailwind CSS v4 + React Router + ESLint.

## Run
```bash
npm install
npm run dev
```

## Build / lint
```bash
npm run build
npm run lint
```

## Architecture
- `src/components`: shared reusable UI
- `src/features/<module>`: member-owned modules; each contains components/pages/services/types
- `src/pages`: public pages
- `src/routes`: central routing
- `src/services`: shared API configuration (add when backend exists)

Empty directories contain `.gitkeep` so Git tracks them. Do not commit `node_modules` or `dist`.

All vehicle data and prices are placeholders. Authentication, real-time bidding, payment and database connections are not implemented.
