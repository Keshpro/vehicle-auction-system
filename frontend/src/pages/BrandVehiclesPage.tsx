
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CarFront,
  CalendarDays,
  Fuel,
  Gauge,
  Search,
  SlidersHorizontal,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import {
  getVehicles,
  type Vehicle,
} from "../services/vehicleService";

export default function BrandVehiclesPage() {
  const { brand } = useParams<{ brand: string }>();

  const selectedBrand = brand
    ? decodeURIComponent(brand)
    : "";

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [model, setModel] = useState("all");
  const [fuelType, setFuelType] = useState("all");
  const [transmission, setTransmission] = useState("all");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");

  useEffect(() => {
    let active = true;

    async function loadVehicles() {
      try {
        setLoading(true);
        setError("");

        const data = await getVehicles();

        if (active) {
          setVehicles(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load vehicles."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadVehicles();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setSearch("");
    setModel("all");
    setFuelType("all");
    setTransmission("all");
    setYearFrom("");
    setYearTo("");
  }, [selectedBrand]);

  // ONLY VEHICLES BELONGING TO SELECTED BRAND
  const brandVehicles = useMemo(() => {
    return vehicles.filter(
      (vehicle) =>
        vehicle.make.trim().toLowerCase() ===
        selectedBrand.trim().toLowerCase()
    );
  }, [vehicles, selectedBrand]);

  const models = useMemo(
    () =>
      [...new Set(brandVehicles.map((v) => v.model))]
        .sort(),
    [brandVehicles]
  );

  const fuelTypes = useMemo(
    () =>
      [
        ...new Set(
          brandVehicles
            .map((v) => v.fuelType)
            .filter((v): v is string => Boolean(v))
        ),
      ].sort(),
    [brandVehicles]
  );

  const transmissions = useMemo(
    () =>
      [
        ...new Set(
          brandVehicles
            .map((v) => v.transmission)
            .filter((v): v is string => Boolean(v))
        ),
      ].sort(),
    [brandVehicles]
  );

  const filteredVehicles = useMemo(() => {
    return brandVehicles.filter((vehicle) => {
      const matchesSearch =
        !search.trim() ||
        `${vehicle.make} ${vehicle.model} ${
          vehicle.registrationNumber || ""
        }`
          .toLowerCase()
          .includes(search.trim().toLowerCase());

      const matchesModel =
        model === "all" || vehicle.model === model;

      const matchesFuel =
        fuelType === "all" ||
        vehicle.fuelType === fuelType;

      const matchesTransmission =
        transmission === "all" ||
        vehicle.transmission === transmission;

      const matchesYearFrom =
        !yearFrom ||
        vehicle.manufactureYear >= Number(yearFrom);

      const matchesYearTo =
        !yearTo ||
        vehicle.manufactureYear <= Number(yearTo);

      return (
        matchesSearch &&
        matchesModel &&
        matchesFuel &&
        matchesTransmission &&
        matchesYearFrom &&
        matchesYearTo
      );
    });
  }, [
    brandVehicles,
    search,
    model,
    fuelType,
    transmission,
    yearFrom,
    yearTo,
  ]);

  const clearFilters = () => {
    setSearch("");
    setModel("all");
    setFuelType("all");
    setTransmission("all");
    setYearFrom("");
    setYearTo("");
  };

  const selectClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-red-500";

  return (
    <main className="min-h-screen bg-[#f7f8fb]">
      {/* HEADER */}
      <section className="bg-[#101827] px-5 py-12 text-white md:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/vehicles"
            className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-red-400"
          >
            <ArrowLeft size={17} />
            All Vehicle Brands
          </Link>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600">
              <CarFront size={34} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                Schokman &amp; Samerawickreme
              </p>

              <h1 className="mt-2 text-3xl font-black capitalize md:text-4xl">
                {selectedBrand} Vehicles
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Explore available {selectedBrand} models
                and vehicle varieties.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        {/* SEARCH AND FILTERS */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <SlidersHorizontal
              size={20}
              className="text-red-600"
            />

            <h2 className="text-lg font-bold text-slate-900">
              Search &amp; Filter Vehicles
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vehicle model..."
                className={`${selectClass} pl-11`}
              />
            </div>

            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className={selectClass}
            >
              <option value="all">All Models</option>

              {models.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              className={selectClass}
            >
              <option value="all">All Fuel Types</option>

              {fuelTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className={selectClass}
            >
              <option value="all">All Transmissions</option>

              {transmissions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1886"
              placeholder="Year From"
              value={yearFrom}
              onChange={(e) => setYearFrom(e.target.value)}
              className={selectClass}
            />

            <input
              type="number"
              min="1886"
              placeholder="Year To"
              value={yearTo}
              onChange={(e) => setYearTo(e.target.value)}
              className={selectClass}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-900">
                {filteredVehicles.length}
              </span>{" "}
              of {brandVehicles.length} vehicles
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-red-600 hover:text-red-700"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
          >
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <RefreshCw
              size={34}
              className="animate-spin text-red-600"
            />

            <p className="mt-4 text-sm text-slate-500">
              Loading {selectedBrand} vehicles...
            </p>
          </div>
        ) : error ? null : filteredVehicles.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-20 text-center shadow-sm">
            <CarFront
              size={55}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No {selectedBrand} Vehicles Found
            </h3>

            <p className="mt-3 text-sm text-slate-500">
              No matching vehicles are currently available.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 text-sm font-bold text-red-600"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* VEHICLE CARDS */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.vehicleId}
                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* IMAGE PLACEHOLDER */}
                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                  <CarFront
                    size={70}
                    className="text-slate-400"
                    strokeWidth={1.2}
                  />
                </div>

                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                    {vehicle.make}
                  </p>

                  <h3 className="mt-2 text-xl font-black text-slate-900">
                    {vehicle.make} {vehicle.model}
                  </h3>

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
                      <CarFront
                        size={16}
                        className="text-red-500"
                      />
                      {vehicle.transmission || "N/A"}
                    </div>
                  </div>

                  <Link
                    to={`/vehicles/${vehicle.vehicleId}`}
                    className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                  >
                    View Vehicle Details
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
