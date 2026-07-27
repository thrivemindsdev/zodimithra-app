import { useRef, useState } from "react";

interface SessionCarouselProps {
  title: string;
  sessions?: any[];
  loading?: boolean;
  onSessionClick?: (session: any) => void;
}

const SessionCarousel = ({
  title,
  sessions = [],
  loading,
  onSessionClick,
}: SessionCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const index = Math.round(
      scrollRef.current.scrollLeft / scrollRef.current.clientWidth
    );

    setActive(index);
  };

  const scrollTo = (index: number) => {
    scrollRef.current?.scrollTo({
      left: index * scrollRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="rounded-2xl p-4 shadow-sm">
        {/* Title Skeleton */}
        <div className="mb-4 h-5 w-36 animate-pulse rounded bg-gray-200" />

        {/* Carousel Image Skeleton */}
        <div className="h-44 w-full animate-pulse rounded-2xl bg-gray-200" />

        {/* Pagination Dots Skeleton */}
        <div className="mt-4 flex justify-center gap-2">
          <div className="h-2 w-6 animate-pulse rounded-full bg-gray-200" />
          <div className="h-2 w-2 animate-pulse rounded-full bg-gray-200" />
          <div className="h-2 w-2 animate-pulse rounded-full bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!sessions.length) return null;

  return (
    <div className="rounded-2xl p-4 shadow-sm">
      <h3 className="font-body font-bold pb-4">{title}</h3>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-hide flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
      >
        {sessions.map((session) => (
          <div key={session.id} className="min-w-full snap-center">
            <img
              src={session.author?.image}
              alt={session.title}
              onClick={() => onSessionClick?.(session)}
              className="h-44 w-full cursor-pointer rounded-2xl object-cover"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {sessions.map((session, index) => (
          <button
            key={session.id}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              active === index ? "w-6 bg-pink-500" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SessionCarousel;