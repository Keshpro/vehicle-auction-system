
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  CarFront,
  Gavel,
  ShieldCheck,
  Users,
  Heart,
  Clock3,
  SlidersHorizontal,
  Trophy,
  CreditCard,
  Truck,
  UserRoundPlus,
  CheckCircle2,
  MapPin,
  Fuel,
  CalendarDays,
  Gauge,
  ChevronRight,
  X,
} from "lucide-react";

type Vehicle = {
  id: number;
  name: string;
  brand: string;
  category: string;
  year: number;
  fuel: string;
  mileage: number;
  price: number;
  location: string;
  image: string;
  status: "Live" | "Ending Soon" | "Upcoming";
  endsAt: number;
};

const now = Date.now();

const vehicles: Vehicle[] = [
  {
    id: 1,
    name: "Toyota Land Cruiser Prado",
    brand: "Toyota",
    category: "SUV",
    year: 2021,
    fuel: "Diesel",
    mileage: 40000,
    price: 32500,
    location: "Colombo",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=85",
    status: "Live",
    endsAt: now + 2 * 60 * 60 * 1000,
  },
  {
    id: 2,
    name: "Honda Civic",
    brand: "Honda",
    category: "Car",
    year: 2021,
    fuel: "Petrol",
    mileage: 28500,
    price: 18200,
    location: "Kandy",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=85",
    status: "Live",
    endsAt: now + 3 * 60 * 60 * 1000,
  },
  {
    id: 3,
    name: "Nissan X-Trail",
    brand: "Nissan",
    category: "SUV",
    year: 2020,
    fuel: "Petrol",
    mileage: 36000,
    price: 21750,
    location: "Galle",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=85",
    status: "Ending Soon",
    endsAt: now + 45 * 60 * 1000,
  },
  {
    id: 4,
    name: "Suzuki Swift",
    brand: "Suzuki",
    category: "Car",
    year: 2022,
    fuel: "Petrol",
    mileage: 12800,
    price: 11600,
    location: "Matale",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85",
    status: "Live",
    endsAt: now + 90 * 60 * 1000,
  },
  {
    id: 5,
    name: "BMW 3 Series",
    brand: "BMW",
    category: "Luxury",
    year: 2020,
    fuel: "Petrol",
    mileage: 52000,
    price: 36800,
    location: "Colombo",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=85",
    status: "Upcoming",
    endsAt: now + 5 * 60 * 60 * 1000,
  },
  {
    id: 6,
    name: "Mercedes-Benz C-Class",
    brand: "Mercedes-Benz",
    category: "Luxury",
    year: 2022,
    fuel: "Petrol",
    mileage: 18000,
    price: 42500,
    location: "Negombo",
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=85",
    status: "Live",
    endsAt: now + 4 * 60 * 60 * 1000,
  },
  {
    id: 7,
    name: "Toyota Corolla",
    brand: "Toyota",
    category: "Car",
    year: 2018,
    fuel: "Petrol",
    mileage: 60000,
    price: 13900,
    location: "Kurunegala",
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=85",
    status: "Upcoming",
    endsAt: now + 6 * 60 * 60 * 1000,
  },
  {
    id: 8,
    name: "Honda Vezel",
    brand: "Honda",
    category: "Hybrid",
    year: 2020,
    fuel: "Hybrid",
    mileage: 32000,
    price: 24500,
    location: "Colombo",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=85",
    status: "Upcoming",
    endsAt: now + 8 * 60 * 60 * 1000,
  },
];

const brands = [
  "Toyota",
  "Honda",
  "Nissan",
  "Suzuki",
  "BMW",
  "Mercedes-Benz",
];

const categories = [
  { name: "All Vehicles", icon: CarFront },
  { name: "Car", icon: CarFront },
  { name: "SUV", icon: Truck },
  { name: "Luxury", icon: Trophy },
  { name: "Hybrid", icon: ShieldCheck },
];

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

function Countdown({ endsAt }: { endsAt: number }) {
  const [remaining, setRemaining] = useState(
    Math.max(0, endsAt - Date.now())
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining(Math.max(0, endsAt - Date.now()));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [endsAt]);

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  if (remaining === 0) return <span>Ended</span>;

  return (
    <span>
      {String(hours).padStart(2, "0")}h{" "}
      {String(minutes).padStart(2, "0")}m{" "}
      {String(seconds).padStart(2, "0")}s
    </span>
  );
}

function SectionHeading({
  title,
  subtitle,
  link,
}: {
  title: string;
  subtitle?: string;
  link?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {subtitle && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-red-600">
            {subtitle}
          </p>
        )}
        <h2 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
          {title}
        </h2>
        <div className="mt-3 h-1 w-14 rounded bg-red-600" />
      </div>

      {link && (
        <Link
          to={link}
          className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800"
        >
          View All <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}

function VehicleCard({
  vehicle,
  favorite,
  onFavorite,
  onView,
}: {
  vehicle: Vehicle;
  favorite: boolean;
  onFavorite: (id: number) => void;
  onView: (id: number) => void;
}) {
  return (
    <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span
          className={`absolute left-3 top-3 rounded px-2.5 py-1 text-xs font-bold text-white ${
            vehicle.status === "Upcoming"
              ? "bg-slate-800"
              : vehicle.status === "Ending Soon"
              ? "bg-amber-500"
              : "bg-red-600"
          }`}
        >
          {vehicle.status === "Live" ? "● LIVE" : vehicle.status}
        </span>

        <button
          type="button"
          aria-label={favorite ? "Remove favorite" : "Add favorite"}
          onClick={() => onFavorite(vehicle.id)}
          className="absolute right-3 top-3 rounded-full bg-white p-2 shadow hover:bg-red-50"
        >
          <Heart
            size={18}
            className={
              favorite
                ? "fill-red-600 text-red-600"
                : "text-slate-600"
            }
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="truncate text-base font-bold text-slate-900">
          {vehicle.name}
        </h3>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <CalendarDays size={13} /> {vehicle.year}
          </span>
          <span className="flex items-center gap-1">
            <Fuel size={13} /> {vehicle.fuel}
          </span>
          <span className="flex items-center gap-1">
            <Gauge size={13} /> {vehicle.mileage.toLocaleString()} km
          </span>
        </div>

        <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
          <MapPin size={13} /> {vehicle.location}
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-xs text-slate-500">Demo Current Bid</p>
              <p className="text-xl font-extrabold text-red-600">
                {money(vehicle.price)}
              </p>
            </div>

            <div className="text-right">
              <p className="flex items-center justify-end gap-1 text-xs text-slate-500">
                <Clock3 size={12} /> Demo Timer
              </p>
              <p className="text-xs font-bold text-slate-800">
                <Countdown endsAt={vehicle.endsAt} />
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onView(vehicle.id)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700"
          >
            View Vehicle <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}

function FilterPanel({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  maxPrice,
  setMaxPrice,
  clearFilters,
}: {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedBrand: string;
  setSelectedBrand: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  clearFilters: () => void;
}) {
  return (
    <aside className="space-y-5">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="bg-slate-900 px-5 py-4 font-bold text-white">
          Browse by Category
        </div>

        <div className="p-2">
          {categories.map(({ name, icon: Icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => setSelectedCategory(name)}
              className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm transition ${
                selectedCategory === name
                  ? "bg-red-50 font-bold text-red-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon size={17} /> {name}
              </span>
              <ChevronRight size={14} />
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="bg-red-700 px-5 py-4 font-bold text-white">
          Browse by Brand
        </div>

        <div className="p-2">
          {brands.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() =>
                setSelectedBrand(
                  selectedBrand === brand ? "All" : brand
                )
              }
              className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm ${
                selectedBrand === brand
                  ? "bg-red-50 font-bold text-red-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {brand}
              <span className="text-xs text-slate-400">
                {vehicles.filter((v) => v.brand === brand).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="bg-slate-900 px-5 py-4 font-bold text-white">
          Price Range
        </div>

        <div className="space-y-2 p-4">
          {[
            ["All", "Any Price"],
            ["15000", "Under $15,000"],
            ["25000", "Under $25,000"],
            ["40000", "Under $40,000"],
            ["50000", "Under $50,000"],
          ].map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-3 text-sm text-slate-600"
            >
              <input
                type="radio"
                name="price"
                checked={maxPrice === value}
                onChange={() => setMaxPrice(value)}
                className="accent-red-600"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={clearFilters}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
      >
        <X size={16} /> Clear Filters
      </button>
    </aside>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedCategory, setSelectedCategory] =
    useState("All Vehicles");
  const [maxPrice, setMaxPrice] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesSearch = vehicle.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesBrand =
        selectedBrand === "All" ||
        vehicle.brand === selectedBrand;

      const matchesCategory =
        selectedCategory === "All Vehicles" ||
        vehicle.category === selectedCategory;

      const matchesPrice =
        maxPrice === "All" ||
        vehicle.price <= Number(maxPrice);

      return (
        matchesSearch &&
        matchesBrand &&
        matchesCategory &&
        matchesPrice
      );
    });
  }, [search, selectedBrand, selectedCategory, maxPrice]);

  const visibleVehicles = showAll
    ? filteredVehicles
    : filteredVehicles.slice(0, 4);

  const toggleFavorite = (id: number) => {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedBrand("All");
    setSelectedCategory("All Vehicles");
    setMaxPrice("All");
    setShowAll(false);
  };

  const openVehicle = (id: number) => {
    window.location.assign(`/vehicles/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      {/* HERO */}
      <section
        className="relative min-h-[490px] bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(8,15,28,.96) 0%, rgba(8,15,28,.8) 44%, rgba(8,15,28,.18) 100%), url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=85')",
        }}
      >
        <div className="mx-auto flex min-h-[490px] max-w-7xl items-center px-5 py-16 md:px-8">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white">
              <span className="h-6 w-1 -skew-x-12 bg-red-600" />
              Online Vehicle Auctions
            </div>

            <h1 className="text-5xl font-black uppercase leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              BID. <span className="text-red-600">WIN.</span>
              <br />
              DRIVE.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-200 md:text-lg">
              Discover vehicles, explore online auctions and
              experience a smarter way to buy and sell.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/auctions"
                className="flex items-center gap-2 rounded-lg bg-red-600 px-7 py-4 text-sm font-bold text-white hover:bg-red-700"
              >
                Browse Auctions <ArrowRight size={18} />
              </Link>

              <a
                href="#how-it-works"
                className="flex items-center gap-2 rounded-lg border border-white/70 px-7 py-4 text-sm font-bold text-white hover:bg-white/10"
              >
                How It Works <ChevronRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="relative z-10 mx-auto -mt-9 max-w-7xl px-5 md:px-8">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
          <div className="mb-4 flex items-center gap-2 font-extrabold">
            <CarFront size={21} className="text-red-600" />
            Search Vehicles
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <div className="relative lg:col-span-2">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search brand or vehicle name..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none focus:border-red-500"
              />
            </div>

            <select
              aria-label="Select brand"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm"
            >
              <option value="All">All Brands</option>
              {brands.map((brand) => (
                <option key={brand}>{brand}</option>
              ))}
            </select>

            <select
              aria-label="Select category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm"
            >
              {categories.map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
            </select>

            <a
              href="#latest-auctions"
              className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
            >
              <Search size={17} /> Search Vehicles
            </a>
          </div>
        </div>
      </section>

      {/* STATS - DEMO LABELS */}
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { icon: CarFront, number: "8", label: "Demo Vehicles" },
            { icon: Gavel, number: "3", label: "Demo Live Auctions" },
            { icon: Users, number: "10", label: "Project Team Members" },
            { icon: ShieldCheck, number: "MySQL", label: "Database Technology" },
          ].map(({ icon: Icon, number, label }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <Icon size={32} className="shrink-0 text-red-600" />
              <div>
                <p className="text-xl font-black text-red-600 md:text-2xl">
                  {number}
                </p>
                <p className="text-xs text-slate-600 md:text-sm">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN VEHICLE CONTENT */}
      <section
        id="latest-auctions"
        className="mx-auto max-w-7xl px-5 pb-16 md:px-8"
      >
        <div className="grid gap-7 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <FilterPanel
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              clearFilters={clearFilters}
            />
          </div>

          <div className="min-w-0">
            <SectionHeading
              title="Latest Auctions"
              subtitle="Explore Our Collection"
              link="/auctions"
            />

            <button
              type="button"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="mb-5 flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-bold lg:hidden"
            >
              <SlidersHorizontal size={17} />
              {showMobileFilters ? "Hide Filters" : "Show Filters"}
            </button>

            {showMobileFilters && (
              <div className="mb-6 lg:hidden">
                <FilterPanel
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedBrand={selectedBrand}
                  setSelectedBrand={setSelectedBrand}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  clearFilters={clearFilters}
                />
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {visibleVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  favorite={favorites.includes(vehicle.id)}
                  onFavorite={toggleFavorite}
                  onView={openVehicle}
                />
              ))}
            </div>

            {filteredVehicles.length === 0 && (
              <div className="rounded-xl bg-white p-12 text-center">
                <Search
                  size={38}
                  className="mx-auto mb-4 text-slate-300"
                />
                <h3 className="text-lg font-bold">
                  No Vehicles Found
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-5 rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {filteredVehicles.length > 4 && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  className="rounded-lg border border-red-600 px-7 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
                >
                  {showAll ? "Show Less" : "Show More Vehicles"}
                </button>
              </div>
            )}

            {/* RECOMMENDED */}
            <div className="mt-14">
              <SectionHeading
                title="Recommended Vehicles"
                subtitle="Selected For You"
                link="/vehicles"
              />

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {vehicles.slice(4, 8).map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    favorite={favorites.includes(vehicle.id)}
                    onFavorite={toggleFavorite}
                    onView={openVehicle}
                  />
                ))}
              </div>
            </div>

            {/* RECENTLY VIEWED PLACEHOLDER */}
            <div className="mt-14">
              <SectionHeading
                title="Explore More Vehicles"
                subtitle="Popular Listings"
                link="/vehicles"
              />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {vehicles.slice(0, 4).map((vehicle) => (
                  <button
                    key={vehicle.id}
                    type="button"
                    onClick={() => openVehicle(vehicle.id)}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm hover:shadow-md"
                  >
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      loading="lazy"
                      className="h-28 w-full object-cover"
                    />
                    <div className="p-3">
                      <p className="truncate text-sm font-bold">
                        {vehicle.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {vehicle.year} | {vehicle.mileage.toLocaleString()} km
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SELL VEHICLE BANNER */}
      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
        <div
          className="relative overflow-hidden rounded-2xl bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(15,23,42,.97), rgba(15,23,42,.75), rgba(15,23,42,.15)), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1500&q=85')",
          }}
        >
          <div className="max-w-xl px-7 py-12 md:px-12">
            <p className="text-sm font-bold uppercase tracking-widest text-red-400">
              Start Selling
            </p>

            <h2 className="mt-3 text-3xl font-black uppercase text-white md:text-4xl">
              Sell Your Vehicle
              <br />
              <span className="text-red-500">Through Auction</span>
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-200">
              Create your vehicle listing and prepare it for the
              online auction process.
            </p>

            <Link
              to="/vehicles/add"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-700"
            >
              List My Vehicle <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading
            title="How It Works"
            subtitle="Five Simple Steps"
          />

          <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-5">
            {[
              {
                icon: UserRoundPlus,
                title: "Create Account",
                description: "Register to get started.",
              },
              {
                icon: Search,
                title: "Find a Vehicle",
                description: "Browse available listings.",
              },
              {
                icon: Gavel,
                title: "Place a Bid",
                description: "Join an active auction.",
              },
              {
                icon: CreditCard,
                title: "Win & Pay",
                description: "Complete the payment process.",
              },
              {
                icon: Truck,
                title: "Get Your Vehicle",
                description: "Arrange vehicle collection.",
              },
            ].map(({ icon: Icon, title, description }, index) => (
              <div
                key={title}
                className="rounded-xl border border-slate-200 p-6 text-center transition hover:border-red-300 hover:shadow-lg"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <Icon size={27} />
                </div>

                <p className="mt-4 text-xs font-bold text-red-600">
                  STEP {index + 1}
                </p>

                <h3 className="mt-2 font-bold">{title}</h3>

                <p className="mt-2 text-sm text-slate-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST FEATURES */}
      <section className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 text-center sm:grid-cols-2 lg:grid-cols-4 md:px-8">
          {[
            {
              icon: ShieldCheck,
              title: "Vehicle Verification",
              description: "Designed for verified listings.",
            },
            {
              icon: Gavel,
              title: "Online Bidding",
              description: "Auction bidding workflow.",
            },
            {
              icon: CheckCircle2,
              title: "Auction Management",
              description: "Track your auction activity.",
            },
            {
              icon: Users,
              title: "Buyer & Seller",
              description: "A platform for both user roles.",
            },
          ].map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center">
              <Icon size={28} className="text-red-600" />
              <h3 className="mt-3 font-bold">{title}</h3>
              <p className="mt-2 text-xs text-slate-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DEVELOPMENT NOTICE */}
      <div className="border-t border-slate-200 bg-white px-5 py-4 text-center text-xs text-slate-500">
        Vehicle Auction & Bidding Management System — University
        Project Demo. Listings, bids, images and countdowns are
        sample data. Real-time auctions and payment functionality
        are not yet connected.
      </div>
    </div>
  );
}
