import { useGetChartQuery } from "@/queries/exploreQueries";
import { useState } from "react";

const NavamsaChart = ({ userDetails, birthDate }: any) => {
  const [selected, setSelected] = useState<"north-indian" | "south-indian">(
    "south-indian",
  );

  const tabs = [
    { id: "north-indian", label: "North Indian" },
    { id: "south-indian", label: "South Indian" },
  ] as const;

  const { data: chartData, isLoading } = useGetChartQuery({
    ayanamsa: 1,
    coordinates: `${userDetails?.latitude}, ${userDetails?.longitude}`,
    datetime: birthDate,
    chart_type: "navamsa",
    chart_style: selected,
  });

  return (
    <div className="w-full max-w-md">
      <h2 className="mb-4 text-xl font-bold text-primary font-body tracking-tight">
        Navamsa Chart
      </h2>

      <div className="flex rounded-full bg-transparent gap-4 pb-4">
        {tabs.map((tab) => {
          const active = selected === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setSelected(tab.id)}
              className={`
                flex-1 rounded-full font-body-content border py-2.5 text-sm font-medium
                transition-all duration-300
                ${
                  active
                    ? "bg-[#3D1B84] text-white border-[#3D1B84]"
                    : "bg-[#E7E3F4] text-[#3D1B84] border-[#3D1B84]"
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="rounded-2xl p-4 shadow-sm border border-gray-200 flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="text-sm text-[#8C7A6B]">Loading...</div>
        ) : chartData ? (
          <div
            className="w-full flex items-center  justify-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-w-100"
            dangerouslySetInnerHTML={{ __html: chartData }}
          />
        ) : (
          <div className="text-sm text-[#8C7A6B]">No Charts Found</div>
        )}
      </div>
    </div>
  );
};

export default NavamsaChart;
