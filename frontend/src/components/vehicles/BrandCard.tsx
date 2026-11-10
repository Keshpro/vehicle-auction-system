import { useState } from "react";
import { ArrowUpRight, CarFront, MapPin } from "lucide-react";
import type { VehicleBrand } from "../../data/vehicleBrands";

interface Props {
  brand: VehicleBrand & { vehicleCount?: number };
  onSelect: (brand: string) => void;
}

const DISPLAY = "[font-family:'Barlow_Condensed',sans-serif]";

const CLASS_STYLES: Record<string, string> = {
  Japanese: "bg-red-600 text-white",
  Luxury: "bg-purple-600 text-white",
  European: "bg-sky-500 text-white",
  American: "bg-blue-700 text-white",
  Korean: "bg-teal-500 text-white",
  Chinese: "bg-orange-500 text-white",
  Indian: "bg-emerald-500 text-white",
  Others: "bg-slate-500 text-white",
};

const CLIP =
  "[clip-path:polygon(0_0,100%_0,100%_calc(100%-22px),calc(100%-22px)_100%,0_100%)]";

export default function BrandCard({ brand, onSelect }: Props) {
  const [imageError, setImageError] = useState(false);
  const classStyle = CLASS_STYLES[brand.category] ?? CLASS_STYLES.Others;
  const filled = Math.min(10, Math.ceil((brand.vehicleCount ?? 0) / 5));

  return (
    <button
      type="button"
      onClick={() => onSelect(brand.name)}
      className={`group relative block h-full w-full overflow-hidden bg-slate-900 text-left transition-all duration-300 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${CLIP}`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {!imageError && brand.image ? (
          <img
            src={brand.image}
            alt={`${brand.name} vehicle`}
            loading="lazy"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-600">
            <CarFront size={64} strokeWidth={1} />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute left-0 top-4 -skew-x-12">
          <span
            className={`block py-1 pl-4 pr-5 text-[11px] font-black uppercase tracking-widest ${classStyle}`}
          >
            <span className="inline-block skew-x-12">{brand.category}</span>
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 px-5 pb-3">
          <h3
            className={`${DISPLAY} truncate text-4xl font-black italic uppercase leading-none tracking-tight text-white drop-shadow-lg`}
          >
            {brand.name}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-slate-300">
            <MapPin size={11} className="text-yellow-400" />
            {brand.country}
          </p>
        </div>
      </div>

      <div className="relative bg-slate-900 px-5 pb-6 pt-3">
        <div className="absolute left-0 top-0 h-[3px] w-full bg-slate-800">
          <div className="h-full w-0 bg-yellow-400 transition-all duration-500 group-hover:w-full" />
        </div>

        {typeof brand.vehicleCount === "number" && (
          <div className="mb-3">
            <div className="mb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span>Listings</span>
              <span className="text-white">{brand.vehicleCount}</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 -skew-x-12 ${
                    i < filled ? "bg-yellow-400" : "bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span
            className={`${DISPLAY} text-lg font-extrabold italic uppercase tracking-wide text-white`}
          >
            View Vehicles
          </span>
          <span className="flex h-8 w-8 -skew-x-12 items-center justify-center bg-yellow-400 text-slate-900 transition-colors group-hover:bg-red-600 group-hover:text-white">
            <ArrowUpRight size={18} className="skew-x-12" />
          </span>
        </div>
      </div>
    </button>
  );
}