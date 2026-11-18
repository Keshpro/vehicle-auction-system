
import type { AuctionVehicle } from "../../types/auction.types";
import { formatYen } from "../../data/auctionData";
import { Clock3, CarFront } from "lucide-react";

interface Props {
  vehicles: AuctionVehicle[];
  activeIndex: number;
  seconds: number;
  duration: number;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remaining
  ).padStart(2, "0")}`;
}

export default function AuctionQueue({
  vehicles,
  activeIndex,
  seconds,
  duration,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between bg-slate-900 px-5 py-4 text-white">
        <h3 className="flex items-center gap-2 font-bold">
          <CarFront size={20} />
          Auction Queue
        </h3>

        <span className="text-xs text-slate-300">
          {vehicles.length} Demo Vehicles
        </span>
      </div>

      <div className="divide-y divide-slate-200">
        {vehicles.map((vehicle, index) => {
          const isActive = index === activeIndex;
          const isFinished = index < activeIndex;

          const startsIn =
            seconds + Math.max(0, index - activeIndex - 1) * duration;

          return (
            <div
              key={vehicle.id}
              className={`flex flex-col gap-4 p-4 md:flex-row md:items-center ${
                isActive ? "bg-red-50" : "bg-white"
              }`}
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold">
                  {index + 1}
                </span>

                <img
                  src={vehicle.images[0]}
                  alt={vehicle.name}
                  className="h-20 w-28 shrink-0 rounded-lg object-cover"
                />

                <div className="min-w-0">
                  <p className="text-xs font-bold text-red-600">
                    LOT: {vehicle.lotNumber}
                  </p>

                  <h4 className="truncate font-bold uppercase text-slate-900">
                    {vehicle.year} {vehicle.name}
                  </h4>

                  <p className="mt-2 text-xs text-slate-500">
                    {vehicle.mileage.toLocaleString()} km ·{" "}
                    {vehicle.transmission} · {vehicle.body}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-5 md:w-72">
                <div>
                  <p className="text-xs text-slate-500">
                    {isActive ? "Current Bid" : "Starting Price"}
                  </p>

                  <p className="font-black text-slate-900">
                    {formatYen(vehicle.startPrice)}
                  </p>
                </div>

                <div className="text-right">
                  {isFinished ? (
                    <span className="rounded bg-slate-200 px-3 py-2 text-xs font-bold">
                      Ended
                    </span>
                  ) : isActive ? (
                    <>
                      <p className="text-xs text-red-600">
                        Bidding Ends
                      </p>
                      <p className="flex items-center gap-1 font-bold text-red-600">
                        <Clock3 size={14} />
                        {formatTime(seconds)}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-slate-500">
                        Starts In
                      </p>
                      <p className="font-bold">
                        {formatTime(startsIn)}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
