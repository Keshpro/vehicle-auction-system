
import { useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, CarFront, ImagePlus, Save } from "lucide-react";
import { Link } from "react-router-dom";

interface VehicleFormData {
  title: string;
  brand: string;
  model: string;
  year: string;
  mileage: string;
  fuelType: string;
  transmission: string;
  color: string;
  startingPrice: string;
  description: string;
}

const initialForm: VehicleFormData = {
  title: "",
  brand: "",
  model: "",
  year: "",
  mileage: "",
  fuelType: "",
  transmission: "",
  color: "",
  startingPrice: "",
  description: "",
};

export default function AddVehiclePage() {
  const [form, setForm] = useState<VehicleFormData>(initialForm);
  const [images, setImages] = useState<File[]>([]);
  const [message, setMessage] = useState("");

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImages = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (selectedFiles.some((file) => !allowedTypes.includes(file.type))) {
      setMessage("Please select JPG, PNG or WebP images only.");
      setImages([]);
      event.target.value = "";
      return;
    }

    if (selectedFiles.length > 5) {
      setMessage("Maximum 5 images allowed.");
      setImages([]);
      event.target.value = "";
      return;
    }

    if (selectedFiles.some((file) => file.size > 5 * 1024 * 1024)) {
      setMessage("Each image must be 5 MB or smaller.");
      setImages([]);
      event.target.value = "";
      return;
    }

    setImages(selectedFiles);
    setMessage("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // API integration will be added in a later phase.
    setMessage(
      "Form validated. Vehicle has not been saved yet. Backend integration is pending."
    );

    console.log("Vehicle form preview:", form);
    console.log("Selected image count:", images.length);
  };

  return (
    <main className="min-h-screen bg-[#0b0b0d] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/vehicles"
          className="mb-8 inline-flex items-center gap-2 text-zinc-400 transition hover:text-[#c6a667]"
        >
          <ArrowLeft size={18} />
          Back to Vehicles
        </Link>

        <div className="mb-10 flex items-center gap-4">
          <div className="rounded-xl bg-[#c6a667]/10 p-4 text-[#c6a667]">
            <CarFront size={30} />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#c6a667]">
              Vehicle Management
            </p>
            <h1 className="mt-2 text-3xl font-semibold">
              Register New Vehicle
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Enter the vehicle information below.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-white/10 bg-[#171719] p-6 shadow-xl md:p-10"
        >
          <section>
            <h2 className="mb-6 border-b border-white/10 pb-4 text-xl font-semibold">
              Basic Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Vehicle Title">
                <input
                  required
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Toyota Prius 2018"
                  className="input-style"
                />
              </Field>

              <Field label="Brand">
                <input
                  required
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="Toyota"
                  className="input-style"
                />
              </Field>

              <Field label="Model">
                <input
                  required
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  placeholder="Prius"
                  className="input-style"
                />
              </Field>

              <Field label="Manufacture Year">
                <input
                  required
                  type="number"
                  name="year"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={form.year}
                  onChange={handleChange}
                  className="input-style"
                />
              </Field>

              <Field label="Mileage (km)">
                <input
                  required
                  type="number"
                  name="mileage"
                  min="0"
                  value={form.mileage}
                  onChange={handleChange}
                  className="input-style"
                />
              </Field>

              <Field label="Color">
                <input
                  required
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  placeholder="White"
                  className="input-style"
                />
              </Field>

              <Field label="Fuel Type">
                <select
                  required
                  name="fuelType"
                  value={form.fuelType}
                  onChange={handleChange}
                  className="input-style"
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </Field>

              <Field label="Transmission">
                <select
                  required
                  name="transmission"
                  value={form.transmission}
                  onChange={handleChange}
                  className="input-style"
                >
                  <option value="">Select Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </Field>
            </div>
          </section>

          <section>
            <h2 className="mb-6 border-b border-white/10 pb-4 text-xl font-semibold">
              Pricing & Description
            </h2>

            <div className="space-y-6">
              <Field label="Starting Price (LKR)">
                <input
                  required
                  type="number"
                  name="startingPrice"
                  min="1"
                  value={form.startingPrice}
                  onChange={handleChange}
                  placeholder="8500000"
                  className="input-style"
                />
              </Field>

              <Field label="Vehicle Description">
                <textarea
                  required
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe the vehicle condition and features..."
                  className="input-style"
                />
              </Field>
            </div>
          </section>

          <section>
            <h2 className="mb-6 border-b border-white/10 pb-4 text-xl font-semibold">
              Vehicle Images
            </h2>

            <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-white/20 p-10 text-center transition hover:border-[#c6a667]">
              <ImagePlus size={36} className="mb-4 text-[#c6a667]" />
              <span className="font-medium">
                Click to select vehicle images
              </span>
              <span className="mt-2 text-sm text-zinc-400">
                JPG, PNG, WebP • Max 5 images • 5 MB each
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImages}
                className="hidden"
              />
            </label>

            {images.length > 0 && (
              <p className="mt-4 text-sm text-[#c6a667]">
                {images.length} image(s) selected
              </p>
            )}
          </section>

          {message && (
            <p role="status" className="rounded-lg border border-[#c6a667]/30 bg-[#c6a667]/10 p-4 text-sm text-[#e5c785]">
              {message}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-4 border-t border-white/10 pt-6">
            <Link
              to="/vehicles"
              className="rounded-lg border border-white/20 px-6 py-3 text-zinc-300 transition hover:bg-white/10"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-[#c6a667] px-7 py-3 font-semibold text-black transition hover:bg-[#e5c785]"
            >
              <Save size={18} />
              Validate Vehicle
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </span>
      {children}
    </label>
  );
}
