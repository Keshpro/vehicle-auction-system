
import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useParams,
} from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Fuel,
  Gauge,
  Settings2,
  Palette,
  Tag,
  CarFront,
  LoaderCircle,
  AlertCircle,
  Hash,
  MapPin,
  UserRound,
  ImageOff,
  Pencil,
  CheckCircle2,
} from "lucide-react";

import AddVehiclePhotoForm from "../components/vehicles/AddVehiclePhotoForm";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

// ==========================================
// VEHICLE MODEL
// ==========================================
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

// ==========================================
// VEHICLE PHOTO MODEL
// ==========================================
interface VehiclePhoto {
  photoId: number;
  vehicleId: number;
  photoUrl: string;
  isCover: boolean;
  displayOrder: number;
}

interface NavigationState {
  success?: string;
}

export default function VehicleDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const location = useLocation();
  const navigationState =
    location.state as NavigationState | null;

  // VEHICLE STATES
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PHOTO GALLERY STATES
  const [photos, setPhotos] = useState<VehiclePhoto[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [photosError, setPhotosError] = useState<string | null>(
    null
  );

  // REFRESH PHOTOS AFTER NEW PHOTO IS ADDED
  const [photoRefreshKey, setPhotoRefreshKey] = useState(0);

  // ==========================================
  // LOAD VEHICLE DETAILS FROM API
  // ==========================================
  useEffect(() => {
    const controller = new AbortController();

    async function loadVehicle() {
      setLoading(true);
      setError(null);
      setVehicle(null);

      if (!id || !/^[1-9]\d*$/.test(id)) {
        setError("Invalid vehicle ID.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/vehicles/${id}`,
          {
            headers: {
              Accept: "application/json",
            },
            credentials: "include",
            signal: controller.signal,
          }
        );

        if (response.status === 404) {
          if (!controller.signal.aborted) {
            setError("Vehicle not found.");
          }
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Failed to load vehicle (${response.status}).`
          );
        }

        const data: Vehicle = await response.json();

        if (!controller.signal.aborted) {
          setVehicle(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load vehicle."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadVehicle();

    return () => controller.abort();
  }, [id]);

  // ==========================================
  // LOAD VEHICLE PHOTOS FROM API
  // ==========================================
  useEffect(() => {
    const controller = new AbortController();

    setPhotos([]);
    setSelectedImage(0);
    setPhotosError(null);

    if (!id || !/^[1-9]\d*$/.test(id)) {
      setPhotosLoading(false);
      return () => controller.abort();
    }

    async function loadPhotos() {
      setPhotosLoading(true);

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/vehicles/${id}/photos`,
          {
            headers: {
              Accept: "application/json",
            },
            credentials: "include",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load photos (${response.status}).`
          );
        }

        const data: VehiclePhoto[] =
          await response.json();

        if (!controller.signal.aborted) {
          const sortedPhotos = [...data].sort((a, b) => {
            if (a.isCover !== b.isCover) {
              return a.isCover ? -1 : 1;
            }

            if (a.displayOrder !== b.displayOrder) {
              return a.displayOrder - b.displayOrder;
            }

            return a.photoId - b.photoId;
          });

          setPhotos(sortedPhotos);
          setSelectedImage(0);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setPhotos([]);
          setPhotosError(
            err instanceof Error
              ? err.message
              : "Unable to load vehicle photos."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setPhotosLoading(false);
        }
      }
    }

    void loadPhotos();

    return () => controller.abort();
  }, [id, photoRefreshKey]);

  // ==========================================
  // REFRESH GALLERY AFTER PHOTO ADD
  // ==========================================
  function handlePhotoAdded() {
    setPhotoRefreshKey((previous) => previous + 1);
  }

  // ==========================================
  // LOADING SCREEN
  // ==========================================
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0b0b0d] text-white">
        <LoaderCircle
          size={42}
          className="animate-spin text-[#c6a667]"
        />

        <p className="text-zinc-400">
          Loading vehicle details...
        </p>
      </main>
    );
  }

  // ==========================================
  // ERROR SCREEN
  // ==========================================
  if (error || !vehicle) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#0b0b0d] px-6 text-center text-white">
        <AlertCircle
          size={48}
          className="text-[#c6a667]"
        />

        <h1 className="mt-5 text-3xl font-bold">
          Vehicle Details Unavailable
        </h1>

        <p className="mt-3 max-w-md text-zinc-400">
          {error || "Vehicle not found."}
        </p>

        <Link
          to="/vehicles/browse"
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#c6a667] px-6 py-3 font-semibold text-black transition hover:bg-[#e5c785]"
        >
          <ArrowLeft size={18} />
          Back to Browse Vehicles
        </Link>
      </main>
    );
  }

  const vehicleTitle =
    `${vehicle.make} ${vehicle.model} ${vehicle.manufactureYear}`;

  // ==========================================
  // VEHICLE SPECIFICATIONS
  // ==========================================
  const specifications = [
    {
      label: "Brand",
      value: vehicle.make,
      icon: CarFront,
    },
    {
      label: "Model",
      value: vehicle.model,
      icon: Tag,
    },
    {
      label: "Manufacture Year",
      value: String(vehicle.manufactureYear),
      icon: CalendarDays,
    },
    {
      label: "Mileage",
      value:
        vehicle.mileageKm == null
          ? "Not specified"
          : `${vehicle.mileageKm.toLocaleString()} km`,
      icon: Gauge,
    },
    {
      label: "Fuel Type",
      value: vehicle.fuelType || "Not specified",
      icon: Fuel,
    },
    {
      label: "Transmission",
      value: vehicle.transmission || "Not specified",
      icon: Settings2,
    },
    {
      label: "Colour",
      value: vehicle.colour || "Not specified",
      icon: Palette,
    },
    {
      label: "Registration Number",
      value:
        vehicle.registrationNumber || "Not specified",
      icon: Hash,
    },
    {
      label: "Chassis Number",
      value: vehicle.chassisNumber,
      icon: Hash,
    },
    {
      label: "Yard Location ID",
      value: String(vehicle.yardLocationId),
      icon: MapPin,
    },
    {
      label: "Consignor ID",
      value: String(vehicle.consignorId),
      icon: UserRound,
    },
  ];

  const createdDate = vehicle.createdAt
    ? new Date(vehicle.createdAt)
    : null;

  return (
    <main className="min-h-screen bg-[#0b0b0d] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">

        {/* BACK TO VEHICLE MANAGEMENT */}
        <Link
          to="/vehicles/manage"
          className="mb-8 inline-flex items-center gap-2 text-zinc-400 transition hover:text-[#c6a667]"
        >
          <ArrowLeft size={18} />
          Back to Vehicle Management
        </Link>

        {/* SUCCESS MESSAGE AFTER EDIT */}
        {navigationState?.success && (
          <div
            role="status"
            className="mb-8 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400"
          >
            <CheckCircle2
              size={20}
              className="shrink-0"
            />
            {navigationState.success}
          </div>
        )}

        {/* ================================== */}
        {/* PAGE HEADER */}
        {/* ================================== */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#c6a667]">
              Vehicle Management
            </p>

            <h1 className="mt-3 text-4xl font-semibold">
              {vehicleTitle}
            </h1>

            <p className="mt-3 text-zinc-400">
              Vehicle ID: #{vehicle.vehicleId}
            </p>
          </div>

          {/* EDIT VEHICLE BUTTON */}
          <Link
            to={`/vehicles/${vehicle.vehicleId}/edit`}
            className="inline-flex items-center gap-2 rounded-lg bg-[#c6a667] px-6 py-3 font-semibold text-black transition hover:bg-[#e5c785]"
          >
            <Pencil size={18} />
            Edit Vehicle
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* ================================== */}
          {/* LEFT CONTENT */}
          {/* ================================== */}
          <div className="space-y-6 lg:col-span-2">

            {/* VEHICLE PHOTO GALLERY */}
            <section className="space-y-4">
              {photosLoading ? (
                <div className="flex h-[360px] flex-col items-center justify-center rounded-xl border border-white/10 bg-[#171719]">
                  <LoaderCircle
                    size={38}
                    className="animate-spin text-[#c6a667]"
                  />

                  <p className="mt-4 text-sm text-zinc-400">
                    Loading vehicle photos...
                  </p>
                </div>
              ) : photos.length > 0 ? (
                <>
                  {/* MAIN PHOTO */}
                  <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#171719]">
                    <img
                      src={photos[selectedImage]?.photoUrl}
                      alt={vehicleTitle}
                      className="h-[420px] w-full object-cover"
                    />

                    {photos[selectedImage]?.isCover && (
                      <span className="absolute left-5 top-5 rounded-md bg-[#c6a667] px-4 py-2 text-xs font-bold uppercase tracking-wider text-black">
                        Cover Photo
                      </span>
                    )}

                    <div className="absolute bottom-5 right-5 rounded-md bg-black/70 px-4 py-2 text-sm text-white">
                      {selectedImage + 1} / {photos.length}
                    </div>
                  </div>

                  {/* PHOTO THUMBNAILS */}
                  {photos.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {photos.map((photo, index) => (
                        <button
                          key={photo.photoId}
                          type="button"
                          onClick={() =>
                            setSelectedImage(index)
                          }
                          aria-label={`View photo ${index + 1}`}
                          className={`shrink-0 overflow-hidden rounded-lg border-2 transition ${
                            selectedImage === index
                              ? "border-[#c6a667]"
                              : "border-white/10 hover:border-white/30"
                          }`}
                        >
                          <img
                            src={photo.photoUrl}
                            alt={`${vehicleTitle} photo ${index + 1}`}
                            className="h-24 w-32 object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-[360px] flex-col items-center justify-center rounded-xl border border-white/10 bg-[#171719] px-5 text-center">
                  <ImageOff
                    size={64}
                    className="text-[#c6a667]/60"
                  />

                  <h3 className="mt-5 text-lg font-semibold">
                    No Vehicle Photos Available
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">
                    {photosError
                      ? "Vehicle photos could not be loaded."
                      : "Photos have not been added for this vehicle yet."}
                  </p>

                  {photosError && (
                    <p className="mt-3 text-xs text-red-400">
                      {photosError}
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* ================================== */}
            {/* ADD VEHICLE PHOTO FORM */}
            {/* ================================== */}
            <AddVehiclePhotoForm
              vehicleId={vehicle.vehicleId}
              onPhotoAdded={handlePhotoAdded}
            />

            {/* ================================== */}
            {/* VEHICLE SPECIFICATIONS */}
            {/* ================================== */}
            <section className="rounded-xl border border-white/10 bg-[#171719] p-7">
              <h2 className="mb-6 text-2xl font-semibold">
                Vehicle Specifications
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                {specifications.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-4 rounded-lg bg-white/5 p-4"
                    >
                      <Icon
                        size={22}
                        className="shrink-0 text-[#c6a667]"
                      />

                      <div className="min-w-0">
                        <p className="text-sm text-zinc-400">
                          {item.label}
                        </p>

                        <p className="mt-1 break-words font-medium">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ================================== */}
            {/* VEHICLE DESCRIPTION */}
            {/* ================================== */}
            <section className="rounded-xl border border-white/10 bg-[#171719] p-7">
              <h2 className="mb-4 text-2xl font-semibold">
                Description
              </h2>

              <p className="whitespace-pre-wrap leading-8 text-zinc-400">
                {vehicle.description ||
                  "No vehicle description available."}
              </p>
            </section>
          </div>

          {/* ================================== */}
          {/* RIGHT SIDEBAR */}
          {/* ================================== */}
          <aside>
            <div className="rounded-xl border border-[#c6a667]/30 bg-[#171719] p-7">
              <p className="text-sm uppercase tracking-wider text-zinc-400">
                Vehicle Information
              </p>

              <p className="mt-3 text-3xl font-bold text-[#c6a667]">
                #{vehicle.vehicleId}
              </p>

              <div className="my-7 border-t border-white/10" />

              <p className="text-sm text-zinc-400">
                Registration Number
              </p>

              <p className="mt-2 font-semibold">
                {vehicle.registrationNumber ||
                  "Not specified"}
              </p>

              <div className="my-6 border-t border-white/10" />

              <p className="text-sm text-zinc-400">
                Record Created
              </p>

              <p className="mt-2 font-semibold">
                {createdDate &&
                !Number.isNaN(createdDate.getTime())
                  ? createdDate.toLocaleDateString()
                  : "Not available"}
              </p>

              <div className="my-6 border-t border-white/10" />

              <p className="text-sm leading-6 text-zinc-500">
                Vehicle information is retrieved from
                the Vehicle Auction API. Auction pricing
                and status will appear after auction
                module integration.
              </p>

              {/* EDIT BUTTON IN SIDEBAR */}
              <Link
                to={`/vehicles/${vehicle.vehicleId}/edit`}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-[#c6a667] px-5 py-3 font-semibold text-black transition hover:bg-[#e5c785]"
              >
                <Pencil size={18} />
                Edit Vehicle
              </Link>

              <Link
                to="/vehicles/manage"
                className="mt-3 flex w-full items-center justify-center rounded-lg border border-white/20 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                All Vehicles
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
