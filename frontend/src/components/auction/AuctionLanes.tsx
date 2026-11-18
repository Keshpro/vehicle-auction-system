
import { Radio, MapPin, Users, CarFront } from "lucide-react";
import { auctionLanes } from "../../data/auctionData";

interface Props {
  activeLane: string;
  onLaneChange: (lane: string) => void;
}

export default function AuctionLanes({
  activeLane,
  onLaneChange,
}: Props) {
  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-slate-900 px-5 py-4 font-bold text-white">
          Auction Lanes
        </div>

        <div className="p-2">
          {auctionLanes.map((lane) => (
            <button
              key={lane.id}
              type="button"
              onClick={() => onLaneChange(lane.id)}
              className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold ${
                activeLane === lane.id
                  ? "bg-red-600 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <Radio size={16} />
                {lane.name}
              </span>

              <span>{lane.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-slate-900 px-5 py-4 font-bold text-white">
          Auction Information
        </div>

        <div className="space-y-4 p-5 text-sm">
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-red-600" />
            Tokyo, Japan
          </div>

          <div className="flex items-center gap-3">
            <CarFront size={18} className="text-red-600" />
            Demo Vehicle Auction
          </div>

          <div className="flex items-center gap-3">
            <Users size={18} className="text-red-600" />
            Participants: Demo Mode
          </div>

          <div className="flex items-center gap-3">
            <Radio size={18} className="text-red-600" />
            Current Lane: {activeLane}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
        <h3 className="text-xl font-black">
          JAPAN VEHICLE AUCTIONS
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          Explore a Japanese-style vehicle auction experience
          with timed bidding and automatic vehicle rotation.
        </p>

        <div className="mt-5 rounded-lg bg-white/10 p-3 text-xs">
          Educational simulation — not connected to a Japanese
          auction house.
        </div>
      </div>
    </div>
  );
}
