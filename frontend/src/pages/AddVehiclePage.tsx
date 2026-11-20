
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CarFront,
  Save,
  AlertCircle,
  Loader2,
  Info,
  MapPin,
} from "lucide-react";

import {
  createVehicle,
  type VehicleRequest,
} from "../services/vehicleService";

interface VehicleFormData {
  consignorId: string;
  yardLocationId: string;
  registrationNumber: string;
  chassisNumber: string;
  make: string;
  model: string;
  manufactureYear: string;
  mileageKm: string;
  colour: string;
  fuelType: string;
  transmission: string;
  description: string;
}

interface YardLocation {
  yardLocationId: number;
  locationName: string;
  address: string | null;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

const initialForm: VehicleFormData = {
  consignorId: "",
  yardLocationId: "",
  registrationNumber: "",
  chassisNumber: "",
  make: "",
  model: "",
  manufactureYear: "",
  mileageKm: "",
  colour: "",
  fuelType: "",
  transmission: "",
  description: "",
};

const inputClass =
  "w-full rounded-xl border border-white/15 bg-[#222226] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:opacity-50";

export default function AddVehiclePage() {
  const navigate = useNavigate();

  const [form, setForm] =
    useState<VehicleFormData>(initialForm);

  const [yardLocations, setYardLocations] =
    useState<YardLocation[]>([]);

  const [yardLoading, setYardLoading] = useState(true);
  const [yardError, setYardError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // LOAD YARD LOCATIONS FROM MYSQL
  useEffect(() => {
    const controller = new AbortController();

    async function loadYardLocations() {
      try {
        setYardLoading(true);
        setYardError("");

        const response = await fetch(
          `${API_BASE_URL}/api/yard-locations`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load yard locations."
          );
        }

        const data: YardLocation[] =
          await response.json();

        if (!controller.signal.aborted) {
          setYardLocations(data);
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        setYardError(
          err instanceof Error
            ? err.message
            : "Unable to load yard locations."
        );
      } finally {
        if (!controller.signal.aborted) {
          setYardLoading(false);
        }
      }
    }

    void loadYardLocations();

    return () => controller.abort();
  }, []);

  // HANDLE INPUT CHANGES
  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // SAVE VEHICLE TO DATABASE
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (loading) return;

    setError("");

    const consignorId = Number(form.consignorId);
    const yardLocationId = Number(form.yardLocationId);
    const manufactureYear = Number(form.manufactureYear);

    if (
      !Number.isInteger(consignorId) ||
      consignorId <= 0
    ) {
      setError("Please enter a valid Consignor ID.");
      return;
    }

    const yardExists = yardLocations.some(
      (yard) => yard.yardLocationId === yardLocationId
    );

    if (
      !Number.isInteger(yardLocationId) ||
      !yardExists
    ) {
      setError("Please select a valid Yard Location.");
      return;
    }

    if (
      !Number.isInteger(manufactureYear) ||
      manufactureYear < 1886 ||
      manufactureYear > new Date().getFullYear() + 1
    ) {
      setError("Please enter a valid manufacture year.");
      return;
    }

    const mileageKm =
      form.mileageKm.trim() === ""
        ? null
        : Number(form.mileageKm);

    if (
      mileageKm !== null &&
      (
        !Number.isInteger(mileageKm) ||
        mileageKm < 0 ||
        mileageKm > 2147483647
      )
    ) {
      setError("Please enter a valid mileage.");
      return;
    }

    if (
      !form.chassisNumber.trim() ||
      !form.make.trim() ||
      !form.model.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    const request: VehicleRequest = {
      consignorId,
      yardLocationId,

      registrationNumber:
        form.registrationNumber.trim() || null,

      chassisNumber: form.chassisNumber.trim(),
      make: form.make.trim(),
      model: form.model.trim(),
      manufactureYear,
      mileageKm,

      colour: form.colour.trim() || null,
      fuelType: form.fuelType || null,
      transmission: form.transmission || null,
      description: form.description.trim() || null,
    };

    try {
      setLoading(true);

      const response = await createVehicle(request);

      navigate("/vehicles/manage", {
        replace: true,
        state: {
          success:
            `Vehicle #${response.vehicleId} created successfully.`,
        },
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to register vehicle."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0b0d] px-5 py-12 text-white">
      <div className="mx-auto max-w-5xl">

        {/* BACK BUTTON */}
        <Link
          to="/vehicles/manage"
          className="mb-8 inline-flex items-center gap-2 text-zinc-400 transition hover:text-red-400"
        >
          <ArrowLeft size={18} />
          Back to Vehicle Management
        </Link>

        {/* PAGE HEADER */}
        <div className="mb-10 flex items-center gap-4">

          <div className="rounded-xl bg-red-600/10 p-4 text-red-500">
            <CarFront size={30} />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
              Schokman &amp; Samerawickreme
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Register New Vehicle
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Register vehicles directly into the auction database.
            </p>
          </div>
        </div>

        {/* INFORMATION */}
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
          <Info
            size={20}
            className="mt-0.5 shrink-0 text-blue-400"
          />

          <div>
            <p className="text-sm font-semibold text-blue-300">
              Vehicle Registration Information
            </p>

            <p className="mt-1 text-xs leading-6 text-zinc-400">
              Select the vehicle storage location from the
              database. A valid consignor must already exist.
              Vehicle images and auction pricing are managed
              separately.
            </p>
          </div>
        </div>

        {/* VEHICLE REGISTRATION FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-9 rounded-2xl border border-white/10 bg-[#171719] p-6 shadow-xl md:p-10"
        >

          {/* OWNERSHIP & LOCATION */}
          <section>
            <h2 className="mb-6 border-b border-white/10 pb-4 text-xl font-semibold">
              Ownership &amp; Location
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              {/* CONSIGNOR */}
              <Field label="Consignor ID" required>
                <input
                  required
                  type="number"
                  min="1"
                  step="1"
                  name="consignorId"
                  value={form.consignorId}
                  onChange={handleChange}
                  placeholder="Enter Consignor ID"
                  className={inputClass}
                />
              </Field>

              {/* YARD LOCATION DROPDOWN */}
              <Field label="Yard Location" required>
                <div className="relative">
                  <MapPin
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-red-500"
                  />

                  <select
                    required
                    name="yardLocationId"
                    value={form.yardLocationId}
                    onChange={handleChange}
                    disabled={
                      yardLoading ||
                      yardLocations.length === 0
                    }
                    className={`${inputClass} pl-10`}
                  >
                    <option value="">
                      {yardLoading
                        ? "Loading locations..."
                        : yardLocations.length === 0
                        ? "No locations available"
                        : "Select Yard Location"}
                    </option>

                    {yardLocations.map((yard) => (
                      <option
                        key={yard.yardLocationId}
                        value={yard.yardLocationId}
                      >
                        {yard.locationName}
                        {yard.address
                          ? ` — ${yard.address}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {yardError && (
                  <p
                    role="alert"
                    className="mt-2 text-xs text-red-400"
                  >
                    {yardError}
                  </p>
                )}
              </Field>
            </div>
          </section>

          {/* VEHICLE IDENTIFICATION */}
          <section>
            <h2 className="mb-6 border-b border-white/10 pb-4 text-xl font-semibold">
              Vehicle Identification
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <Field label="Registration Number">
                <input
                  name="registrationNumber"
                  maxLength={30}
                  value={form.registrationNumber}
                  onChange={handleChange}
                  placeholder="WP CAB-1234"
                  className={inputClass}
                />
              </Field>

              <Field label="Chassis Number" required>
                <input
                  required
                  name="chassisNumber"
                  maxLength={50}
                  value={form.chassisNumber}
                  onChange={handleChange}
                  placeholder="Enter unique chassis number"
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          {/* BASIC VEHICLE DETAILS */}
          <section>
            <h2 className="mb-6 border-b border-white/10 pb-4 text-xl font-semibold">
              Basic Vehicle Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <Field label="Vehicle Brand" required>
                <input
                  required
                  name="make"
                  maxLength={50}
                  value={form.make}
                  onChange={handleChange}
                  placeholder="Toyota"
                  className={inputClass}
                />
              </Field>

              <Field label="Vehicle Model" required>
                <input
                  required
                  name="model"
                  maxLength={50}
                  value={form.model}
                  onChange={handleChange}
                  placeholder="Prius"
                  className={inputClass}
                />
              </Field>

              <Field label="Manufacture Year" required>
                <input
                  required
                  type="number"
                  name="manufactureYear"
                  min="1886"
                  max={new Date().getFullYear() + 1}
                  step="1"
                  value={form.manufactureYear}
                  onChange={handleChange}
                  placeholder="2020"
                  className={inputClass}
                />
              </Field>

              <Field label="Mileage (km)">
                <input
                  type="number"
                  name="mileageKm"
                  min="0"
                  step="1"
                  value={form.mileageKm}
                  onChange={handleChange}
                  placeholder="45000"
                  className={inputClass}
                />
              </Field>

              <Field label="Colour">
                <input
                  name="colour"
                  maxLength={30}
                  value={form.colour}
                  onChange={handleChange}
                  placeholder="White"
                  className={inputClass}
                />
              </Field>

              <Field label="Fuel Type">
                <select
                  name="fuelType"
                  value={form.fuelType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                  <option value="Other">Other</option>
                </select>
              </Field>

              <Field label="Transmission">
                <select
                  name="transmission"
                  value={form.transmission}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                  <option value="Semi-Automatic">
                    Semi-Automatic
                  </option>
                </select>
              </Field>
            </div>
          </section>

          {/* DESCRIPTION */}
          <section>
            <h2 className="mb-6 border-b border-white/10 pb-4 text-xl font-semibold">
              Additional Information
            </h2>

            <Field label="Vehicle Description">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe the vehicle condition and features..."
                className={inputClass}
              />
            </Field>
          </section>

          {/* ERROR MESSAGE */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
            >
              <AlertCircle
                size={19}
                className="shrink-0"
              />
              {error}
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap justify-end gap-4 border-t border-white/10 pt-6">
            <Link
              to="/vehicles/manage"
              className="rounded-lg border border-white/20 px-6 py-3 text-zinc-300 transition hover:bg-white/10"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={
                loading ||
                yardLoading ||
                yardLocations.length === 0
              }
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-7 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Saving Vehicle...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Register Vehicle
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

// REUSABLE FORM FIELD
function Field({
  label,
  children,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-300">
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </span>

      {children}
    </label>
  );
}
