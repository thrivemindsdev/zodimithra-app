import { Eye, ThumbsUp } from "lucide-react";
import { useState } from "react";

interface Thumbnail {
  id: number;
  url: string;
  alt: string;
}

const thumbnails: Thumbnail[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=300&q=80",
    alt: "Comet and Planets",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=300&q=80",
    alt: "Eclipse phases",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=300&q=80",
    alt: "Starry night sky",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80",
    alt: "Milky way horizon",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80",
    alt: "Night landscape bridge",
  },
];

export const AstroVlogCard = () => {
  const [activeThumb, setActiveThumb] = useState<number>(1);

  return (
    <div className="relative w-full max-w-xl h-75 rounded-3xl overflow-hidden shadow-2xl bg-black text-white p-6 justify-between font-body">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500 z-0"
        style={{
          backgroundImage: `url(${thumbnails.find((t) => t.id === activeThumb)?.url})`,
        }}
      >
        {/* Dark overlay gradient to make text readable */}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-black/30" />
      </div>

      {/* Content Top & Middle */}
      <div className="relative z-10 flex flex-col items-start gap-3">
        {/* Tag Pill */}
        <span className="px-4 py-1 text-xs tracking-wide rounded-full border border-white/40 bg-black/20 backdrop-blur-md text-white font-sans">
          Astro Vlog
        </span>

        {/* Title */}
        <h2 className="text-3xl font-bold tracking-wide mt-1">
          Cosmic Transits
        </h2>

        {/* Stats */}
        <div className="flex items-center gap-5 text-sm font-sans text-gray-200 mt-1">
          <div className="flex items-center gap-1.5">
            <ThumbsUp className="w-4 h-4 stroke-[1.5]" />
            <span>10k</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 stroke-[1.5]" />
            <span>221000 view</span>
          </div>
        </div>

        {/* Watch Now Button */}
        <button className="mt-2 px-6 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-sans text-sm font-medium rounded-full shadow-lg transition-all duration-200">
          Watch now
        </button>
      </div>

      {/* Thumbnails Carousel / Selector at Bottom */}
      <div className="relative z-10 flex items-center gap-2 mt-auto pt-8 overflow-x-auto no-scrollbar">
        {thumbnails.map((thumb) => {
          const isActive = activeThumb === thumb.id;
          return (
            <button
              key={thumb.id}
              onClick={() => setActiveThumb(thumb.id)}
              className={`relative shrink-0 w-20 h-12 rounded-xl overflow-hidden transition-all duration-300 focus:outline-none ${
                isActive
                  ? "ring-2 ring-white scale-105"
                  : "opacity-50 hover:opacity-100"
              }`}
            >
              <img
                src={thumb.url}
                alt={thumb.alt}
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AstroVlogCard;
