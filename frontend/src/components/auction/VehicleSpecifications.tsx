
import type { AuctionVehicle } from "../../types/auction.types";

interface Props {
  vehicle: AuctionVehicle;
}

export default function VehicleSpecifications({ vehicle }: Props) {
  const specifications = [
    ["Year", vehicle.year],
    ["Mileage", `${vehicle.mileage.toLocaleString()} km`],
    ["Engine", vehicle.engine],
    ["Transmission", vehicle.transmission],
    ["Fuel", vehicle.fuel],
    ["Drive", vehicle.drive],
    ["Body Type", vehicle.body],
    ["Color", vehicle.color],
    ["Auction Grade", vehicle.grade],
    ["Location", vehicle.location],
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="rounded bg-red-600 px-3 py-1 text-xs font-bold text-white">
          LOT {vehicle.lotNumber}
        </span>

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
          Demo Listing
        </span>
      </div>

      <h2 className="mb-5 text-xl font-black uppercase text-slate-900">
        {vehicle.year} {vehicle.name}
      </h2>

      <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
        {specifications.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-3 border-b border-slate-100 py-3 text-sm"
          >
            <span className="text-slate-500">{label}</span>
            <span className="text-right font-bold text-slate-900">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
