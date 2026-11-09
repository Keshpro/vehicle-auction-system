
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Fuel,
  Gauge,
  Settings2,
  Palette,
  Tag,
  Pencil,
  CarFront,
} from "lucide-react";

const demoVehicles = [
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
    startingPrice: 8500000,
    status: "approved",
    description:
      "Well maintained Toyota Prius with excellent fuel efficiency, comfortable interior and reliable performance.",
    images: [
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1200",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200",
    ],
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
    startingPrice: 9200000,
    status: "pending",
    description:
      "Honda Civic in excellent condition with a modern interior and smooth driving experience.",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200",
    ],
  },
];

export default function VehicleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);

  const vehicle = demoVehicles.find(
    (item) => item.id === Number(id)
  );

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#0b0b0d] p-12 text-center text-white">
        <h1 className="text-3xl font-bold">Vehicle Not Found</h1>
        <Link
          to="/vehicles"
          className="mt-6 inline-block text-[#c6a667]"
        >
          Back to Vehicles
        </Link>
      </div>
    );
  }

  const specifications = [
    { label: "Brand", value: vehicle.brand, icon: CarFront },
    { label: "Model", value: vehicle.model, icon: Tag },
    { label: "Year", value: vehicle.year, icon: CalendarDays },
    {
      label: "Mileage",
      value: `${vehicle.mileage.toLocaleString()} km`,
      icon: Gauge,
    },
    { label: "Fuel Type", value: vehicle.fuelType, icon: Fuel },
    {
      label: "Transmission",
      value: vehicle.transmission,
      icon: Settings2,
    },
    { label: "Color", value: vehicle.color, icon: Palette },
  ];

  return (
    <main className="min-h-screen bg-[#0b0b0d] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/vehicles"
          className="mb-8 inline-flex items-center gap-2 text-zinc-400 hover:text-[#c6a667]"
        >
          <ArrowLeft size={18} />
          Back to Vehicles
        </Link>

        <div className="mb-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#c6a667]">
              Vehicle Management
            </p>

            <h1 className="mt-3 text-4xl font-semibold">
              {vehicle.title}
            </h1>

            <p className="mt-3 text-zinc-400">
              Vehicle ID: #{vehicle.id}
            </p>
          </div>

          <Link
            to={`/vehicles/${vehicle.id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg bg-[#c6a667] px-6 py-3 font-semibold text-black hover:bg-[#e5c785]"
          >
            <Pencil size={18} />
            Edit Vehicle
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#171719]">
              <img
                src={vehicle.images[selectedImage]}
                alt={vehicle.title}
                className="h-[420px] w-full object-cover"
              />
            </div>

            <div className="flex gap-4 overflow-x-auto">
              {vehicle.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden rounded-lg border-2 ${
                    selectedImage === index
                      ? "border-[#c6a667]"
                      : "border-white/10"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Vehicle view ${index + 1}`}
                    className="h-24 w-32 object-cover"
                  />
                </button>
              ))}
            </div>

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
                        className="text-[#c6a667]"
                      />

                      <div>
                        <p className="text-sm text-zinc-400">
                          {item.label}
                        </p>
                        <p className="mt-1 font-medium">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-xl border border-white/10 bg-[#171719] p-7">
              <h2 className="mb-4 text-2xl font-semibold">
                Description
              </h2>

              <p className="leading-8 text-zinc-400">
                {vehicle.description}
              </p>
            </section>
          </div>

          <aside>
            <div className="rounded-xl border border-[#c6a667]/30 bg-[#171719] p-7">
              <p className="text-sm uppercase tracking-wider text-zinc-400">
                Starting Price
              </p>

              <p className="mt-3 text-3xl font-bold text-[#c6a667]">
                LKR {vehicle.startingPrice.toLocaleString()}
              </p>

              <div className="my-7 border-t border-white/10" />

              <p className="text-sm text-zinc-400">
                Vehicle Status
              </p>

              <span className="mt-3 inline-block rounded-full bg-[#c6a667]/15 px-4 py-2 text-sm font-medium capitalize text-[#c6a667]">
                {vehicle.status}
              </span>

              <p className="mt-7 text-sm leading-6 text-zinc-500">
                This is a demonstration vehicle record.
                Live information will be available after
                backend integration.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
