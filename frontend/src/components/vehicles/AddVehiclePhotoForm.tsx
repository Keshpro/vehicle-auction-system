
import { useState, type FormEvent } from "react";
import { ImagePlus, LoaderCircle, CheckCircle2, AlertCircle } from "lucide-react";

interface AddVehiclePhotoFormProps {
  vehicleId: number;
  onPhotoAdded?: () => void;
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

export default function AddVehiclePhotoForm({
  vehicleId,
  onPhotoAdded,
}: AddVehiclePhotoFormProps) {
  const [photoUrl, setPhotoUrl] = useState("");
  const [isCover, setIsCover] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    const trimmedUrl = photoUrl.trim();

    if (!/^https?:\/\//i.test(trimmedUrl) || trimmedUrl.length > 500) {
      setError("Enter a valid HTTP/HTTPS image URL (maximum 500 characters).");
      return;
    }

    if (!Number.isInteger(displayOrder) || displayOrder < 0) {
      setError("Display order must be a non-negative whole number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/vehicles/${vehicleId}/photos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            photoUrl: trimmedUrl,
            isCover,
            displayOrder,
          }),
        }
      );

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
          typeof result?.message === "string"
            ? result.message
            : `Failed to add photo (${response.status}).`
        );
      }

      setSuccess("Photo added successfully.");
      setPhotoUrl("");
      setIsCover(false);
      setDisplayOrder(0);

      onPhotoAdded?.();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to add photo."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-white/10 bg-[#171719] p-7 text-white">
      <div className="mb-6 flex items-center gap-3">
        <ImagePlus size={24} className="text-[#c6a667]" />
        <h2 className="text-xl font-semibold">
          Add Vehicle Photo
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="vehicle-photo-url"
            className="mb-2 block text-sm text-zinc-300"
          >
            Photo URL
          </label>

          <input
            id="vehicle-photo-url"
            type="url"
            required
            maxLength={500}
            value={photoUrl}
            onChange={(event) => setPhotoUrl(event.target.value)}
            placeholder="https://example.com/vehicle.jpg"
            className="w-full rounded-lg border border-white/10 bg-[#0b0b0d] px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#c6a667]"
          />
        </div>

        <div>
          <label
            htmlFor="vehicle-photo-order"
            className="mb-2 block text-sm text-zinc-300"
          >
            Display Order
          </label>

          <input
            id="vehicle-photo-order"
            type="number"
            min={0}
            step={1}
            value={displayOrder}
            onChange={(event) =>
              setDisplayOrder(event.target.valueAsNumber)
            }
            className="w-full rounded-lg border border-white/10 bg-[#0b0b0d] px-4 py-3 text-white outline-none focus:border-[#c6a667]"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={isCover}
            onChange={(event) => setIsCover(event.target.checked)}
            className="h-4 w-4 accent-[#c6a667]"
          />
          Set as cover photo
        </label>

        {success && (
          <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-400">
            <CheckCircle2 size={18} />
            {success}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#c6a667] px-5 py-3 font-semibold text-black transition hover:bg-[#e5c785] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <LoaderCircle size={19} className="animate-spin" />
          ) : (
            <ImagePlus size={19} />
          )}

          {loading ? "Adding Photo..." : "Add Photo"}
        </button>
      </form>
    </section>
  );
}
