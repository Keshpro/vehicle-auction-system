
import type { AuctionBid } from "../../types/auction.types";
import { formatYen } from "../../data/auctionData";
import { History } from "lucide-react";

interface Props {
  bids: AuctionBid[];
}

export default function BidHistory({ bids }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-200 p-5">
        <History size={20} className="text-red-600" />
        <h3 className="font-bold">Previous Bids</h3>
      </div>

      {bids.length === 0 ? (
        <p className="p-8 text-center text-sm text-slate-500">
          No bids have been placed for this vehicle yet.
        </p>
      ) : (
        <div className="divide-y divide-slate-100">
          {[...bids].reverse().map((bid) => (
            <div
              key={bid.id}
              className="flex items-center justify-between gap-3 p-4"
            >
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {bid.bidder}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {bid.time}
                </p>
              </div>

              <span className="font-black text-red-600">
                {formatYen(bid.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
