
import { Clock3 } from "lucide-react";

interface Props {
  seconds: number;
  duration: number;
}

export default function AuctionCountdown({
  seconds,
  duration,
}: Props) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;

  const progress = Math.max(
    0,
    Math.min(100, (seconds / duration) * 100)
  );

  return (
    <div className="rounded-xl bg-gradient-to-br from-red-700 to-red-950 p-5 text-center text-white shadow-lg">
      <div className="flex items-center justify-center gap-2 font-semibold">
        <Clock3 size={20} />
        Bidding Ends In
      </div>

      <div className="my-3 text-5xl font-black tracking-wider">
        {formattedTime}
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-red-300 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>

      {seconds <= 10 && seconds > 0 && (
        <p className="mt-3 animate-pulse text-sm font-bold text-yellow-300">
          Final seconds! Place your bid now!
        </p>
      )}

      {seconds === 0 && (
        <p className="mt-3 text-sm font-bold">
          Auction Ended
        </p>
      )}
    </div>
  );
}
