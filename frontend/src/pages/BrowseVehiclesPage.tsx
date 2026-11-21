
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  CarFront,
  ArrowRight,
  SlidersHorizontal,
  X,
  Grid3X3,
  Gavel,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Globe2,
  LoaderCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import BrandCard from "../components/vehicles/BrandCard";
import { vehicleBrands, vehicleCategories } from "../data/vehicleBrands";

const INITIAL_VISIBLE_BRANDS = 18;
const DISPLAY = "[font-family:'Barlow_Condensed',sans-serif]";
const CLIP_SM =
  "[clip-path:polygon(0_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,0_100%)]";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

interface Vehicle {
  vehicleId: number;
  consignorId: number;
  yardLocationId: number;
  registrationNumber: string | null;
  chassisNumber: string;
  make: string;
  model: string;
  manufactureYear: number;
  colour: string | null;
  mileageKm: number | null;
  fuelType: string | null;
  transmission: string | null;
  description: string | null;
  createdAt: string;
}

export default function BrowseVehiclesPage() {
  const navigate = useNavigate();
  const listingsRef = useRef<HTMLDivElement>(null);

  // Brand catalogue state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [showAll, setShowAll] = useState(false);

  // Database vehicle state
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Vehicle filters
  const [modelFilter, setModelFilter] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");

  // Filter brand catalogue
  const filteredBrands = useMemo(() => {
    const term = search.trim().toLowerCase();

    let result = vehicleBrands.filter((brand) => {
      const matchesSearch =
        brand.name.toLowerCase().includes(term) ||
        brand.country.toLowerCase().includes(term);

      const matchesCategory =
        category === "All" || brand.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "az") {
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sort === "za") {
      result = [...result].sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    }

    return result;
  }, [search, category, sort]);

  const visibleBrands = showAll
    ? filteredBrands
    : filteredBrands.slice(0, INITIAL_VISIBLE_BRANDS);

  const remainingBrands = Math.max(
    0,
    filteredBrands.length - INITIAL_VISIBLE_BRANDS
  );

  // Load real vehicles from ASP.NET Core API
  useEffect(() => {
    if (!selectedBrand) {
      return;
    }

    const controller = new AbortController();

    async function loadVehicles() {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      params.set("make", selectedBrand!);

      if (modelFilter.trim()) {
        params.set("model", modelFilter.trim());
      }

      if (fuelFilter) {
        params.set("fuelType", fuelFilter);
      }

      if (minYear) {
        params.set("minYear", minYear);
      }

      if (maxYear) {
        params.set("maxYear", maxYear);
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/vehicles/search?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            credentials: "include",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Vehicle API request failed (${response.status})`
          );
        }

        const data: Vehicle[] = await response.json();

        if (!controller.signal.aborted) {
          setVehicles(data);
        }
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        setVehicles([]);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load vehicles."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadVehicles();

    return () => controller.abort();
  }, [
    selectedBrand,
    modelFilter,
    fuelFilter,
    minYear,
    maxYear,
    reloadKey,
  ]);

  // Select brand and show database results
  const selectBrand = (brand: string) => {
    setSelectedBrand(brand);
    setVehicles([]);
    setModelFilter("");
    setFuelFilter("");
    setMinYear("");
    setMaxYear("");
    setError(null);

    requestAnimationFrame(() => {
      listingsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const changeCategory = (value: string) => {
    setCategory(value);
    setShowAll(false);
  };

  const changeSearch = (value: string) => {
    setSearch(value);
    setShowAll(false);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("default");
    setShowAll(false);
  };

  const clearVehicleFilters = () => {
    setModelFilter("");
    setFuelFilter("");
    setMinYear("");
    setMaxYear("");
  };

  return (
    <div className="min-h-screen bg-[#7f7f7f] text-white">
      <link
        href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,800;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
      />

      {/* HERO */}
      <section
        className="relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg,rgba(11,16,32,.98),rgba(11,16,32,.85),rgba(11,16,32,.35)),url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1800&q=85')",
        }}
      >
        <div className="pointer-events-none absolute -right-24 top-0 hidden h-full w-40 -skew-x-12 bg-yellow-400/90 md:block" />
        <div className="pointer-events-none absolute -right-4 top-0 hidden h-full w-6 -skew-x-12 bg-red-600 md:block" />

        <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
          <div className="max-w-3xl">
            <div className="mb-4 inline-block -skew-x-12 bg-yellow-400 px-4 py-1">
              <span className="inline-block skew-x-12 text-xs font-black uppercase tracking-[0.2em] text-slate-900">
                Explore Our Marketplace
              </span>
            </div>

            <h1
              className={`${DISPLAY} text-5xl font-black italic uppercase leading-[0.9] md:text-7xl`}
            >
              Browse Vehicles
              <span className="block text-yellow-400">
                By Brand
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
              Discover vehicles from leading Japanese, European,
              American, Korean, Chinese and international
              automotive manufacturers.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <div className="flex items-center gap-3 border-l-4 border-yellow-400 bg-white/5 py-2 pl-3 pr-6">
                <CarFront size={26} className="text-yellow-400" />
                <div>
                  <p
                    className={`${DISPLAY} text-3xl font-black italic leading-none`}
                  >
                    {vehicleBrands.length}+
                  </p>
                  <p className="text-[11px] uppercase tracking-widest text-slate-400">
                    Vehicle Brands
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 border-l-4 border-red-600 bg-white/5 py-2 pl-3 pr-6">
                <Globe2 size={26} className="text-red-500" />
                <div>
                  <p
                    className={`${DISPLAY} text-3xl font-black italic leading-none`}
                  >
                    Global
                  </p>
                  <p className="text-[11px] uppercase tracking-widest text-slate-400">
                    Manufacturers
                  </p>
                </div>
              </div>
            </div>

            {/* BRAND SEARCH */}
            <div
              className={`mt-8 flex max-w-2xl items-center gap-2 bg-slate-900/90 p-2 ring-1 ring-white/10 ${CLIP_SM}`}
            >
              <Search
                size={21}
                className="ml-3 shrink-0 text-yellow-400"
              />

              <input
                type="search"
                value={search}
                onChange={(e) => changeSearch(e.target.value)}
                placeholder="Search Toyota, Honda, BMW..."
                aria-label="Search vehicle brands"
                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-slate-500"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => changeSearch("")}
                  className="p-2 text-slate-400 hover:text-yellow-400"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}

              <a
                href="#vehicle-brands"
                className="flex shrink-0 -skew-x-12 items-center gap-2 bg-yellow-400 px-5 py-3 text-sm font-black uppercase text-slate-900 transition hover:bg-red-600 hover:text-white"
              >
                <Search size={17} className="skew-x-12" />
                <span className="hidden skew-x-12 sm:inline">
                  Search
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND CATALOGUE */}
      <section
        id="vehicle-brands"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 py-12 md:px-8"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-10 w-2 -skew-x-12 bg-yellow-400" />
              <h2
                className={`${DISPLAY} text-4xl font-black italic uppercase md:text-5xl`}
              >
                Explore Vehicle Brands
              </h2>
            </div>

            <p className="mt-3 text-sm text-slate-200">
              Choose a brand to browse available vehicles from
              our database.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <SlidersHorizontal
              size={18}
              className="text-yellow-400"
            />

            <select
              aria-label="Sort vehicle brands"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setShowAll(false);
              }}
              className="border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-white outline-none focus:border-yellow-400"
            >
              <option value="default">Popular Brands First</option>
              <option value="az">Brand Name: A - Z</option>
              <option value="za">Brand Name: Z - A</option>
            </select>
          </div>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="mb-7 flex flex-wrap gap-2">
          {vehicleCategories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => changeCategory(item)}
              className={`-skew-x-12 px-5 py-2.5 text-xs font-black uppercase tracking-wider transition sm:text-sm ${
                category === item
                  ? "bg-yellow-400 text-slate-900"
                  : "border border-slate-700 bg-slate-900 text-slate-300 hover:border-yellow-400 hover:text-yellow-400"
              }`}
            >
              <span className="inline-block skew-x-12">
                {item}
              </span>
            </button>
          ))}
        </div>

        {/* RESULTS TOOLBAR */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-l-4 border-yellow-400 bg-slate-900 px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Grid3X3 size={18} className="text-yellow-400" />
            <span>Showing</span>
            <span className="font-black text-yellow-400">
              {visibleBrands.length}
            </span>
            <span>of</span>
            <span className="font-bold text-white">
              {filteredBrands.length}
            </span>
            <span>brands</span>
          </div>

          {(search || category !== "All" || sort !== "default") && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300"
            >
              <X size={16} />
              Clear All Filters
            </button>
          )}
        </div>

        {/* BRAND GRID */}
        {filteredBrands.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleBrands.map((brand) => (
                <BrandCard
                  key={brand.id}
                  brand={brand}
                  onSelect={selectBrand}
                />
              ))}
            </div>

            {filteredBrands.length > INITIAL_VISIBLE_BRANDS && (
              <div className="mt-10 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  className="flex -skew-x-12 items-center justify-center gap-3 bg-yellow-400 px-9 py-4 text-sm font-black uppercase tracking-wider text-slate-900 transition hover:bg-red-600 hover:text-white"
                >
                  <span className="skew-x-12">
                    {showAll
                      ? "Show Less Brands"
                      : `View All ${filteredBrands.length} Brands`}
                  </span>

                  {showAll ? (
                    <ChevronUp size={19} className="skew-x-12" />
                  ) : (
                    <ChevronDown size={19} className="skew-x-12" />
                  )}
                </button>

                {!showAll && (
                  <p className="text-xs text-slate-200">
                    {remainingBrands} more brands available
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="bg-slate-900 px-6 py-16 text-center">
            <Search
              size={40}
              className="mx-auto text-yellow-400"
            />

            <h3
              className={`${DISPLAY} mt-5 text-3xl font-black italic uppercase`}
            >
              No Vehicle Brands Found
            </h3>

            <p className="mt-3 text-slate-400">
              Try another brand name or category.
            </p>

            <button
              onClick={clearFilters}
              className="mt-6 bg-yellow-400 px-7 py-3 font-black text-slate-900"
            >
              Show All Brands
            </button>
          </div>
        )}
      </section>

      {/* REAL DATABASE VEHICLE RESULTS */}
      {selectedBrand && (
        <section
          ref={listingsRef}
          id="brand-listings"
          className="scroll-mt-20 border-t border-slate-800 bg-[#0b1020] py-14"
        >
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
                  Vehicle Inventory
                </p>

                <h2
                  className={`${DISPLAY} mt-2 text-4xl font-black italic uppercase md:text-5xl`}
                >
                  {selectedBrand} Vehicles
                </h2>

                <p className="mt-3 text-sm text-slate-400">
                  Vehicle listings from our MySQL database.
                </p>
              </div>

              <button
                onClick={() => setSelectedBrand(null)}
                className="flex items-center gap-2 border border-slate-700 px-4 py-2 text-sm hover:border-red-500"
              >
                <X size={16} />
                Close Results
              </button>
            </div>

            {/* VEHICLE FILTER PANEL */}
            <div className="mb-8 grid gap-4 bg-slate-900 p-5 md:grid-cols-5">
              <input
                value={modelFilter}
                onChange={(e) => setModelFilter(e.target.value)}
                placeholder="Vehicle Model"
                aria-label="Vehicle model"
                className="bg-slate-800 px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-yellow-400"
              />

              <select
                value={fuelFilter}
                onChange={(e) => setFuelFilter(e.target.value)}
                aria-label="Fuel type"
                className="bg-slate-800 px-4 py-3 text-sm outline-none"
              >
                <option value="">All Fuel Types</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>

              <input
                type="number"
                min="1886"
                max="2100"
                value={minYear}
                onChange={(e) => setMinYear(e.target.value)}
                placeholder="Minimum Year"
                aria-label="Minimum manufacture year"
                className="bg-slate-800 px-4 py-3 text-sm outline-none"
              />

              <input
                type="number"
                min="1886"
                max="2100"
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value)}
                placeholder="Maximum Year"
                aria-label="Maximum manufacture year"
                className="bg-slate-800 px-4 py-3 text-sm outline-none"
              />

              <button
                onClick={clearVehicleFilters}
                className="bg-yellow-400 px-4 py-3 text-sm font-black uppercase text-slate-900 hover:bg-yellow-300"
              >
                Clear Filters
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center gap-3 py-20 text-slate-300">
                <LoaderCircle
                  size={38}
                  className="animate-spin text-yellow-400"
                />
                <p>Loading vehicles...</p>
              </div>
            ) : error ? (
              <div className="border border-red-800 bg-red-950/40 p-8 text-center">
                <AlertCircle
                  size={32}
                  className="mx-auto text-red-400"
                />

                <h3 className="mt-3 text-xl font-bold">
                  Unable to Load Vehicles
                </h3>

                <p className="mt-2 text-sm text-slate-300">
                  {error}
                </p>

                <button
                  onClick={() => setReloadKey((key) => key + 1)}
                  className="mt-5 inline-flex items-center gap-2 bg-yellow-400 px-6 py-3 font-bold text-slate-900"
                >
                  <RefreshCw size={17} />
                  Retry
                </button>
              </div>
            ) : (
              <>
                <p className="mb-5 text-sm text-slate-400">
                  <span className="font-bold text-yellow-400">
                    {vehicles.length}
                  </span>{" "}
                  vehicles found
                </p>

                {vehicles.length === 0 ? (
                  <div className="bg-slate-900 px-6 py-14 text-center">
                    <CarFront
                      size={42}
                      className="mx-auto text-yellow-400"
                    />

                    <h3
                      className={`${DISPLAY} mt-4 text-3xl font-black italic uppercase`}
                    >
                      No Vehicles Available
                    </h3>

                    <p className="mt-2 text-sm text-slate-400">
                      No matching {selectedBrand} vehicles were found
                      in the database.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {vehicles.map((vehicle) => (
                      <div
                        key={vehicle.vehicleId}
                        className="group overflow-hidden border border-slate-800 bg-slate-900 transition hover:border-yellow-400"
                      >
                        <div className="flex h-40 items-center justify-center bg-slate-800">
                          <CarFront
                            size={70}
                            className="text-slate-600 transition group-hover:text-yellow-400"
                          />
                        </div>

                        <div className="p-6">
                          <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">
                            {vehicle.manufactureYear}
                          </span>

                          <h3
                            className={`${DISPLAY} mt-2 text-3xl font-black uppercase`}
                          >
                            {vehicle.make} {vehicle.model}
                          </h3>

                          <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-300">
                            <p>
                              Fuel: {vehicle.fuelType || "N/A"}
                            </p>

                            <p>
                              {vehicle.mileageKm == null
                                ? "Mileage: N/A"
                                : `${vehicle.mileageKm.toLocaleString()} km`}
                            </p>

                            <p>
                              Transmission:{" "}
                              {vehicle.transmission || "N/A"}
                            </p>

                            <p>
                              Colour: {vehicle.colour || "N/A"}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              navigate(
                                `/vehicles/${vehicle.vehicleId}`
                              )
                            }
                            className="mt-6 flex w-full items-center justify-center gap-2 bg-yellow-400 px-5 py-3 text-sm font-black uppercase text-slate-900 transition hover:bg-red-600 hover:text-white"
                          >
                            View Vehicle Details
                            <ArrowRight size={17} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="border-t border-slate-800 bg-[#0e1428] py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-10 text-center">
            <h2
              className={`${DISPLAY} text-4xl font-black italic uppercase md:text-5xl`}
            >
              A Better Way to Explore Vehicles
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
              Browse manufacturers, discover available vehicles and
              explore online auction listings.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: CarFront,
                title: "Explore Global Brands",
                description:
                  "Browse Japanese, European, American, Korean and international vehicle manufacturers.",
              },
              {
                icon: Gavel,
                title: "Auction Experience",
                description:
                  "Discover vehicle listings and explore timed online auctions.",
              },
              {
                icon: ShieldCheck,
                title: "Detailed Vehicle Information",
                description:
                  "Review vehicle specifications and listing details before bidding.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className={`group relative bg-slate-900 p-7 transition hover:-translate-y-1 ${CLIP_SM}`}
              >
                <div className="absolute left-0 top-0 h-[3px] w-0 bg-yellow-400 transition-all duration-500 group-hover:w-full" />

                <div className="flex h-14 w-14 -skew-x-12 items-center justify-center bg-yellow-400 text-slate-900">
                  <Icon size={27} className="skew-x-12" />
                </div>

                <h3
                  className={`${DISPLAY} mt-5 text-2xl font-black italic uppercase`}
                >
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-red-600 py-14">
        <div className="pointer-events-none absolute -right-10 top-0 hidden h-full w-48 -skew-x-12 bg-yellow-400 md:block" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 md:flex-row md:items-center md:px-8">
          <div>
            <h2
              className={`${DISPLAY} text-4xl font-black italic uppercase md:text-5xl`}
            >
              Ready to Join a Vehicle Auction?
            </h2>

            <p className="mt-3 max-w-xl text-sm text-red-50">
              Explore live auctions and discover the bidding experience.
            </p>
          </div>

          <Link
            to="/auctions"
            className="flex shrink-0 -skew-x-12 items-center gap-3 bg-slate-900 px-8 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-slate-900"
          >
            Explore Live Auctions
            <ArrowRight size={19} className="skew-x-12" />
          </Link>
        </div>
      </section>

      <div className="border-t border-slate-800 bg-[#080c19] px-5 py-4 text-center text-xs text-slate-500">
        Vehicle Auction & Bidding Management System —
        University Project Demo.
      </div>
    </div>
  );
}
