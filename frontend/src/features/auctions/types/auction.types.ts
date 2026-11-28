export interface Auction {
  auctionId: number;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string;
  status: string;
  createdBy: number;
  createdAt: string;
}

// Response of GET /api/auctions/{id}/report (sp_auction_lot_report).
// The API serialises the C# model in camelCase.
export interface AuctionReport {
  auctionId: number;
  totalLots: number;
  scheduled: number;
  openLots: number;
  closed: number;
  withdrawn: number;
  totalStartingPrice: number;
}