import { useGetAshramamsQuery } from "@/queries/ashramsQueries";
import { useNavigate } from "react-router-dom";

interface AshramItem {
  id: string | number;
  name: string;
  image: string;
  description: string;
}

const AshramaList = () => {
  const navigate = useNavigate();
  const { data: ashramsList, isLoading } = useGetAshramamsQuery();

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="relative mb-5 h-44 w-full overflow-hidden rounded-2xl bg-gray-200 shadow-md"
          >
            {/* Card Content Skeleton */}
            <div className="absolute inset-0 flex items-end p-5">
              <div className="w-full space-y-2">
                {/* Title Skeleton */}
                <div className="h-6 w-1/2 animate-pulse rounded bg-gray-300" />
                {/* Description Line 1 Skeleton */}
                <div className="h-3 w-3/4 animate-pulse rounded bg-gray-300" />
                {/* Description Line 2 Skeleton */}
                <div className="h-3 w-1/2 animate-pulse rounded bg-gray-300" />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {ashramsList?.map((item: AshramItem) => (
        <div
          key={item.id}
          onClick={() => navigate(`/ashram/${item.id}`)}
          className="group relative mb-5 cursor-pointer overflow-hidden rounded-2xl shadow-md"
        >
          <img
            src={item.image}
            alt={item.name}
            className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-linear-to-r from-primary via-primary/50 to-transparent" />

          <div className="absolute inset-0 flex items-end p-5 text-white">
            <div>
              <h2 className="font-body-content text-xl font-semibold">
                {item.name}
              </h2>

              <p className="font-body-content mt-1 text-xs">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default AshramaList;