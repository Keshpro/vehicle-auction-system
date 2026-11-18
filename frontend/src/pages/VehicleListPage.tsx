import { useState } from "react";
import type { Vehicle } from "../types/vehicle.types";

const sampleVehicles: Vehicle[] = [
  {
    id: 1,
    title: "Toyota Prius 2018",
    brand: "Toyota",
    model: "Prius",
    year: 2018,
    mileage: 65000,
    fuelType: "Hybrid",
    transmission: "Automatic",
    color: "White",
    description: "Well maintained vehicle",
    startingPrice: 8500000,
    status: "approved",
    images: [],
    createdAt: "2026-11-09",
  },
  {
    id: 2,
    title: "Honda Civic 2019",
    brand: "Honda",
    model: "Civic",
    year: 2019,
    mileage: 48000,
    fuelType: "Petrol",
    transmission: "Automatic",
    color: "Black",
    description: "Excellent condition",
    startingPrice: 9200000,
    status: "pending",
    images: [],
    createdAt: "2026-11-09",
  },
];

export default function VehicleListPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filteredVehicles = sampleVehicles.filter((vehicle) => {
    const matchesSearch =
      `${vehicle.title} ${vehicle.brand} ${vehicle.model}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      status === "all" || vehicle.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Vehicle Management
            </h1>
            <p className="mt-2 text-gray-500">
              Manage and monitor registered vehicles
            </p>
          </div>

          <button
            type="button"
            disabled
            title="Add Vehicle page coming soon"
            className="cursor-not-allowed rounded-lg bg-blue-600 px-5 py-3 font-medium text-white opacity-60"
          >
            + Add Vehicle
          </button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-gray-500">Total Vehicles</p>
            <h2 className="mt-2 text-3xl font-bold">
              {sampleVehicles.length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-gray-500">Approved Vehicles</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {sampleVehicles.filter((v) => v.status === "approved").length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-gray-500">Pending Vehicles</p>
            <h2 className="mt-2 text-3xl font-bold text-yellow-600">
              {sampleVehicles.filter((v) => v.status === "pending").length}
            </h2>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-4 rounded-xl bg-white p-5 shadow-sm">
          <input
            type="text"
            placeholder="Search vehicles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-3"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm"
            >
              <div className="flex h-44 items-center justify-center bg-gray-200 text-gray-500">
                No Vehicle Image
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-semibold">
                    {vehicle.title}
                  </h3>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize">
                    {vehicle.status}
                  </span>
                </div>

                <p className="mt-3 text-sm text-gray-500">
                  {vehicle.year} • {vehicle.mileage.toLocaleString()} km
                </p>

                <p className="mt-4 text-lg font-bold text-blue-600">
                  LKR {vehicle.startingPrice.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <p className="py-12 text-center text-gray-500">
            No vehicles found.
          </p>
        )}
      </div>
    </div>
  );
}
