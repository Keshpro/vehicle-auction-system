
import { useEffect, useState } from "react";
import {
  Gavel,
  Minus,
  Plus,
  AlertCircle,
} from "lucide-react";
import AuctionCountdown from "./AuctionCountdown";
import { formatYen } from "../../data/auctionData";

interface Props {
  currentBid: number;
  seconds: number;
  duration: number;
  onBid: (amount: number) => void;
  disabled: boolean;
}

const INCREMENT = 10000;

export default function BiddingPanel({
  currentBid,
  seconds,
  duration,
  onBid,
  disabled,
}: Props) {
  const [bidAmount, setBidAmount] = useState(
    currentBid + INCREMENT
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    setBidAmount(currentBid + INCREMENT);
    setMessage("");
  }, [currentBid]);

  const placeBid = () => {
    if (disabled || seconds <= 0) return;

    if (bidAmount <= currentBid) {
      setMessage("Your bid must be higher than the current bid.");
      return;
    }

    onBid(bidAmount);
    setMessage("Demo bid recorded successfully!");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <AuctionCountdown
        seconds={seconds}
        duration={duration}
      />

      <div className="mt-6 text-center">
        <p className="text-sm font-semibold text-slate-500">
          Current Bid
        </p>

        <p className="mt-2 text-3xl font-black text-red-600 lg:text-4xl">
          {formatYen(currentBid)}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          Demo Auction • Japanese Yen (JPY)
        </p>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Your Bid Amount
        </label>

        <div className="flex gap-2">
          <div className="flex min-w-0 flex-1 items-center rounded-lg border border-slate-300 px-3">
            <span className="font-bold">¥</span>
            <input
              type="number"
              min={currentBid + INCREMENT}
              step={INCREMENT}
              value={bidAmount}
              onChange={(e) =>
                setBidAmount(Number(e.target.value))
              }
              className="w-full min-w-0 px-2 py-3 outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() =>
              setBidAmount((previous) =>
                Math.max(currentBid + INCREMENT, previous - INCREMENT)
              )
            }
            className="rounded-lg bg-slate-100 px-3 hover:bg-slate-200"
          >
            <Minus size={18} />
          </button>

          <button
            type="button"
            onClick={() =>
              setBidAmount((previous) => previous + INCREMENT)
            }
            className="rounded-lg bg-slate-800 px-3 text-white hover:bg-slate-700"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={placeBid}
        disabled={disabled || seconds <= 0}
        className="mt-5 flex w-full items-center justify-center gap-3 rounded-lg bg-red-600 py-4 text-lg font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        <Gavel size={22} />
        {disabled ? "Auction Finished" : "Place Demo Bid"}
      </button>

      {message && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
          <AlertCircle size={18} className="shrink-0" />
          {message}
        </div>
      )}

      <p className="mt-4 text-center text-xs leading-5 text-slate-400">
        Demo mode only. No real payment or live auction
        transaction will be processed.
      </p>
    </div>
  );
}
