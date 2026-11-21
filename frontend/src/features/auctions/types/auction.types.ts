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