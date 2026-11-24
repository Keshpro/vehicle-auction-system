
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Pencil,
  Trash2,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";

import {
  getVehicles,
  type Vehicle,
} from "../services/vehicleService";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

interface NavigationState {
  success?: string;
}

export default function VehicleListPage() {
  const location = useLocation();
  const navigationState =
    location.state as NavigationState | null;

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");
  const [fuelType, setFuelType] = useState("all");
  const [transmission, setTransmission] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(
    navigationState?.success ?? null
  );

  const [deleteTarget, setDeleteTarget] =
    useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] =
    useState<string | null>(null);

  // LOAD VEHICLES
  const loadVehicles = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    void loadVehicles();
  }, [loadVehicles]);

  // FILTER OPTIONS
  const fuelTypes = useMemo(
    () =>
      [
        ...new Set(
          vehicles.map((v) => v.fuelType).filter(Boolean)
        ),
      ].sort() as string[],
    [vehicles]
  );

  const transmissions = useMemo(
    () =>
      [
        ...new Set(
          vehicles.map((v) => v.transmission).filter(Boolean)
        ),
      ].sort() as string[],
    [vehicles]
  );

  // SEARCH AND FILTER
  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      const matchesSearch =
        !query ||
        [
          vehicle.make,
          vehicle.model,
          vehicle.registrationNumber,
          vehicle.chassisNumber,
          String(vehicle.manufactureYear),
          String(vehicle.vehicleId),
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );

      const matchesFuel =
        fuelType === "all" ||
        vehicle.fuelType === fuelType;

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

  // STATISTICS
  const totalVehicles = vehicles.length;

  const uniqueBrands = new Set(
    vehicles.map((vehicle) => vehicle.make.toLowerCase())
  ).size;

  const electricHybridCount = vehicles.filter(
    (vehicle) =>
      vehicle.fuelType?.toLowerCase() === "electric" ||
      vehicle.fuelType?.toLowerCase() === "hybrid"
  ).length;

  // DELETE VEHICLE
  async function handleDelete() {
    if (!deleteTarget || deleting) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/vehicles/${deleteTarget.vehicleId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const result = await response
          .json()
          .catch(() => null);

        throw new Error(
          typeof result?.message === "string"
            ? result.message
            : `Failed to delete vehicle (${response.status}).`
        );
      }

      const deletedVehicleId = deleteTarget.vehicleId;

      setVehicles((previous) =>
        previous.filter(
          (vehicle) =>
            vehicle.vehicleId !== deletedVehicleId
        )
      );

      setSuccess(
        `Vehicle #${deletedVehicleId} deleted successfully.`
      );

      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : "Unable to delete vehicle."
      );
    } finally {
      setDeleting(false);
    }
  }

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
                View, edit and manage vehicles registered
                in the auction database.
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
        {/* SUCCESS MESSAGE */}
        {success && (
          <div
            role="status"
            className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} />
              <span>{success}</span>
            </div>

            <button
              type="button"
              onClick={() => setSuccess(null)}
              aria-label="Dismiss success message"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* STATISTICS */}
        <div className="mb-8 grid gap-5 sm:grid-cols-3">
          <StatCard
            label="Total Vehicles"
            value={totalVehicles}
            icon={CarFront}
            iconClass="bg-red-50 text-red-600"
          />

          <StatCard
            label="Registered Brands"
            value={uniqueBrands}
            icon={Gauge}
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            label="Electric & Hybrid"
            value={electricHybridCount}
            icon={Fuel}
            iconClass="bg-green-50 text-green-600"
          />
        </div>

        {/* SEARCH & FILTER */}
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
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
              />
            </div>

            {/* FUEL TYPE */}
            <select
              value={fuelType}
              onChange={(event) =>
                setFuelType(event.target.value)
              }
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
              onChange={(event) =>
                setTransmission(event.target.value)
              }
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
              className="text-xs font-semibold text-red-600 hover:text-red-700"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* API ERROR */}
        {error && (
          <div
            role="alert"
            className="mb-8 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
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
                    <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                      {vehicle.make}
                    </p>

                    <h3 className="mt-1 text-xl font-black text-slate-900">
                      {vehicle.make} {vehicle.model}
                    </h3>

                    <div className="mt-5 grid grid-cols-2 gap-4 border-y border-slate-100 py-5">
                      <VehicleInfo
                        icon={CalendarDays}
                        value={String(
                          vehicle.manufactureYear
                        )}
                      />

                      <VehicleInfo
                        icon={Gauge}
                        value={
                          vehicle.mileageKm != null
                            ? `${vehicle.mileageKm.toLocaleString()} km`
                            : "N/A"
                        }
                      />

                      <VehicleInfo
                        icon={Fuel}
                        value={vehicle.fuelType || "N/A"}
                      />

                      <VehicleInfo
                        icon={MapPin}
                        value={`Yard #${vehicle.yardLocationId}`}
                      />
                    </div>

                    <p className="mt-4 truncate text-xs text-slate-500">
                      {vehicle.registrationNumber ||
                        "Unregistered"}
                    </p>

                    {/* ACTION BUTTONS */}
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <Link
                        to={`/vehicles/${vehicle.vehicleId}`}
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-red-600 px-2 py-3 text-xs font-bold text-white transition hover:bg-red-700"
                      >
                        View
                        <ArrowRight size={14} />
                      </Link>

                      <Link
                        to={`/vehicles/${vehicle.vehicleId}/edit`}
                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Pencil size={14} />
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setDeleteTarget(vehicle);
                          setDeleteError(null);
                        }}
                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-200 px-2 py-3 text-xs font-bold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
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

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-vehicle-title"
            className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Trash2 size={26} />
            </div>

            <h2
              id="delete-vehicle-title"
              className="text-2xl font-bold text-slate-900"
            >
              Delete Vehicle?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Are you sure you want to delete{" "}
              <strong>
                {deleteTarget.make} {deleteTarget.model}
              </strong>{" "}
              (ID #{deleteTarget.vehicleId})?
              This action cannot be undone.
            </p>

            {deleteError && (
              <div
                role="alert"
                className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {deleteError}
              </div>
            )}

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteError(null);
                }}
                className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={() => void handleDelete()}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={16} />
                )}

                {deleting
                  ? "Deleting..."
                  : "Delete Vehicle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// STATISTICS CARD
function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: number;
  icon: typeof CarFront;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon size={22} />
      </div>

      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <h2 className="mt-2 text-3xl font-black text-slate-900">
        {value}
      </h2>
    </div>
  );
}

// VEHICLE INFORMATION
function VehicleInfo({
  icon: Icon,
  value,
}: {
  icon: typeof CarFront;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-600">
      <Icon
        size={16}
        className="shrink-0 text-red-500"
      />
      <span>{value}</span>
    </div>
  );
}
