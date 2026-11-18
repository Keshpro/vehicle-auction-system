
export type AuctionStatus = "Live" | "Upcoming" | "Sold" | "Ended";

export interface AuctionVehicle {
  id: number;
  lotNumber: string;
  name: string;
  year: number;
  mileage: number;
  engine: string;
  transmission: string;
  fuel: string;
  drive: string;
  body: string;
  color: string;
  grade: string;
  location: string;
  startPrice: number;
  images: string[];
}

export interface AuctionBid {
  id: number;
  vehicleId: number;
  bidder: string;
  amount: number;
  time: string;
}

export interface AuctionLane {
  id: string;
  name: string;
  location: string;
  vehicles: AuctionVehicle[];
}
