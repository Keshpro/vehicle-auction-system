
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

interface Props {
  images: string[];
  name: string;
}

export default function VehicleGallery({ images, name }: Props) {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    setSelected(0);
  }, [images]);

  const next = () => {
    setSelected((previous) => (previous + 1) % images.length);
  };

  const previous = () => {
    setSelected(
      (previous) => (previous - 1 + images.length) % images.length
    );
  };

  if (!images.length) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl bg-slate-100">
        <ImageOff size={36} className="text-slate-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-64 overflow-hidden rounded-xl bg-slate-100 sm:h-80 lg:h-[350px]">
        <img
          src={images[selected]}
          alt={`${name} - Photo ${selected + 1}`}
          className="h-full w-full object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={previous}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white hover:bg-red-600"
            >
              <ChevronLeft />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white hover:bg-red-600"
            >
              <ChevronRight />
            </button>
          </>
        )}

        <span className="absolute bottom-3 right-3 rounded bg-black/70 px-3 py-1 text-xs text-white">
          {selected + 1} / {images.length}
        </span>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setSelected(index)}
            className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${
              selected === index
                ? "border-red-600"
                : "border-transparent"
            }`}
          >
            <img
              src={image}
              alt={`${name} thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
