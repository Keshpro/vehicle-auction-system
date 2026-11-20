
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CarFront,
  Plus,
  Search,
  RefreshCw,
  Gauge,
  Fuel,
  CalendarDays,
  MapPin,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

import {
  getVehicles,
  type Vehicle,
} from "../services/vehicleService";

export default function VehicleListPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");
  const [fuelType, setFuelType] = useState("all");
  const [transmission, setTransmission] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getVehicles();
      setVehicles(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load vehicles."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadVehicles();
  }, []);

  const fuelTypes = useMemo(
    () =>
      [...new Set(vehicles.map((v) => v.fuelType).filter(Boolean))]
        .sort() as string[],
    [vehicles]
  );

  const transmissions = useMemo(
    () =>
      [...new Set(vehicles.map((v) => v.transmission).filter(Boolean))]
        .sort() as string[],
    [vehicles]
  );

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        [
          vehicle.make,
          vehicle.model,
          vehicle.registrationNumber,
          vehicle.chassisNumber,
          vehicle.manufactureYear.toString(),
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );

      const matchesFuel =
        fuelType === "all" || vehicle.fuelType === fuelType;

      const matchesTransmission =
        transmission === "all" ||
        vehicle.transmission === transmission;

      return (
        matchesSearch &&
        matchesFuel &&
        matchesTransmission
      );
    });
  }, [vehicles, search, fuelType, transmission]);

  const totalVehicles = vehicles.length;

  const uniqueBrands = new Set(
    vehicles.map((vehicle) => vehicle.make.toLowerCase())
  ).size;

  const electricHybridCount = vehicles.filter(
    (vehicle) =>
      vehicle.fuelType?.toLowerCase() === "electric" ||
      vehicle.fuelType?.toLowerCase() === "hybrid"
  ).length;

  return (
    <div className="min-h-screen bg-[#f7f8fb]">
      {/* HEADER */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                Schokman &amp; Samerawickreme
              </p>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                Vehicle Management
              </h1>

              <p className="mt-3 text-sm text-slate-500">
                View and manage vehicles registered in the
                auction database.
              </p>
            </div>

            <Link
              to="/vehicles/add"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700"
            >
              <Plus size={18} />
              Add Vehicle
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        {/* STATISTICS */}
        <div className="mb-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <CarFront size={22} />
            </div>

            <p className="text-sm font-medium text-slate-500">
              Total Vehicles
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-900">
              {totalVehicles}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Gauge size={22} />
            </div>

            <p className="text-sm font-medium text-slate-500">
              Registered Brands
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-900">
              {uniqueBrands}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <Fuel size={22} />
            </div>

            <p className="text-sm font-medium text-slate-500">
              Electric &amp; Hybrid
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-900">
              {electricHybridCount}
            </h2>
          </div>
        </div>

        {/* SEARCH & FILTER SECTION */}
        <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Vehicle Inventory
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Search and filter registered vehicles
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadVehicles()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* SEARCH */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search brand, model, number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
              />
            </div>

            {/* FUEL TYPE */}
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-red-500"
            >
              <option value="all">All Fuel Types</option>

              {fuelTypes.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>

            {/* TRANSMISSION */}
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-red-500"
            >
              <option value="all">All Transmissions</option>

              {transmissions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-900">
                {filteredVehicles.length}
              </span>{" "}
              of {totalVehicles} vehicles
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFuelType("all");
                setTransmission("all");
              }}
              className="text-xs font-semibold text-red-600 transition hover:text-red-700"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={19} />
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-24 shadow-sm">
            <RefreshCw
              size={35}
              className="animate-spin text-red-600"
            />

            <p className="mt-4 text-sm text-slate-500">
              Loading vehicles from database...
            </p>
          </div>
        ) : (
          <>
            {/* VEHICLE CARDS */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.vehicleId}
                  className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* IMAGE PLACEHOLDER */}
                  <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                    <CarFront
                      size={66}
                      strokeWidth={1.2}
                      className="text-slate-400"
                    />

                    <span className="absolute left-4 top-4 rounded-lg bg-white/95 px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-sm">
                      ID #{vehicle.vehicleId}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="mb-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                        {vehicle.make}
                      </p>

                      <h3 className="mt-1 text-xl font-black text-slate-900">
                        {vehicle.make} {vehicle.model}
                      </h3>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4 border-y border-slate-100 py-5">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <CalendarDays
                          size={16}
                          className="text-red-500"
                        />
                        {vehicle.manufactureYear}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Gauge
                          size={16}
                          className="text-red-500"
                        />
                        {vehicle.mileageKm !== null
                          ? `${vehicle.mileageKm.toLocaleString()} km`
                          : "N/A"}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Fuel
                          size={16}
                          className="text-red-500"
                        />
                        {vehicle.fuelType || "N/A"}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <MapPin
                          size={16}
                          className="text-red-500"
                        />
                        Yard #{vehicle.yardLocationId}
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="text-xs text-slate-500">
                        {vehicle.registrationNumber ||
                          "Unregistered"}
                      </span>

                      <Link
                        to={`/vehicles/${vehicle.vehicleId}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
                      >
                        View Details
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* EMPTY STATE */}
            {!error && filteredVehicles.length === 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white px-6 py-20 text-center shadow-sm">
                <CarFront
                  size={48}
                  className="mx-auto text-slate-300"
                />

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  No Vehicles Found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try adjusting your search or filter options.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
