
import { Link } from "react-router-dom";
import { ArrowUpRight, CalendarDays, Gavel } from "lucide-react";
import type { FeaturedVehicle } from "../../types/featuredVehicle.types";

interface VehicleCardProps {
  vehicle: FeaturedVehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl border border-white/10 bg-[#171719] transition hover:border-[#c6a667]/50">
      <div className="relative h-60 overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span
          className={`absolute left-4 top-4 rounded px-3 py-1 text-xs font-semibold ${
            vehicle.status === "Live"
              ? "bg-green-500 text-white"
              : "bg-[#c6a667] text-black"
          }`}
        >
          {vehicle.status}
        </span>
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-[#c6a667]">
            {vehicle.category}
          </span>
          <span className="flex items-center gap-2 text-sm text-zinc-400">
            <CalendarDays size={15} />
            {vehicle.year}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-white">
          {vehicle.name}
        </h3>

        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-xs uppercase tracking-wider text-zinc-500">
            Starting Price
          </p>
          <p className="mt-2 text-2xl font-bold text-[#c6a667]">
            LKR {vehicle.price.toLocaleString()}
          </p>
        </div>

        <Link
          to={`/auctions/${vehicle.id}`}
          className="mt-6 flex items-center justify-center gap-2 rounded bg-[#c6a667] px-5 py-3 font-semibold text-black transition hover:bg-[#e5c785]"
        >
          <Gavel size={17} />
          View Auction
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </div>
  );
}
