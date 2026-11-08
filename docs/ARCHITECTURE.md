# Architecture
Browser (Next.js) -> REST API (Express) -> relational database (TBD). Socket.IO will be integrated for real-time bidding by Pair 04.

## Modules
1. Users, roles, bidder profiles
2. Vehicles, photos, consignors, yard locations
3. Auctions, lots, participation
4. Bids and results
5. Notifications, audit logs, outbox events and reporting

## Decisions pending
- Database engine and version
- Authentication method
- API response/error conventions
- SQL migration process
- Real-time event names
