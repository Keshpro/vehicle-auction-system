
import { ArrowRight, MapPin } from "lucide-react";
import type { VehicleBrand } from "../../data/vehicleBrands";

interface Props {
  brand: VehicleBrand;
  onSelect: (brand: string) => void;
}

export default function BrandCard({ brand, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(brand.name)}
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-500 hover:shadow-xl"
    >
      <div className="flex items-center gap-3 px-4 pt-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-50 p-2">
          <img
            src={brand.logo}
            alt={`${brand.name} logo`}
            loading="lazy"
            className="max-h-full max-w-full object-contain"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-lg font-black text-slate-900">
            {brand.name}
          </h3>

          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <MapPin size={12} />
            {brand.country}
          </p>
        </div>
      </div>

      <div className="mt-3 h-36 overflow-hidden bg-slate-100">
        <img
          src={brand.image}
          alt={`${brand.name} vehicle`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="flex items-center justify-between px-4 py-4">
        <span className="text-sm font-bold text-red-600">
          View Vehicles
        </span>

        <ArrowRight
          size={18}
          className="text-red-600 transition-transform group-hover:translate-x-1"
        />
      </div>
    </button>
  );
}
