import { format } from "date-fns";

const BirthDetails = ({ data, panchangData }: any) => {
  const details = [
    { label: "Name", value: data?.name },
    { label: "Date", value: data?.date_of_birth },
    { label: "Time", value: data?.birth_time },
    { label: "Place", value: data?.birth_place?.split(",")[0] },
    { label: "Latitude", value: data?.latitude },
    { label: "Longitude", value: data?.longitude },
    { label: "Sunrise", value: format(panchangData?.sunrise, "h:mm a") },
    { label: "Sunset", value: format(panchangData?.sunset, "h:mm a") },
  ];

  return (
    <div className="w-full max-w-md py-6 font-body-content">
      <h2 className="mb-4 text-xl font-bold text-primary font-body tracking-tight">
        Birth Details
      </h2>

      <div className="overflow-hidden rounded-3xl border border-[#5A3AAE] bg-white shadow-md">
        {details.map((item, index) => (
          <div
            key={item.label}
            className={`flex items-center justify-between px-5 py-4 ${
              index !== details.length - 1 ? "border-b border-[#5A3AAE]" : ""
            }`}
          >
            <span className="text-sm font-medium text-text-secondary">
              {item.label}
            </span>

            <span className="max-w-[60%] text-right text-sm font-semibold text-text-secondary">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BirthDetails;
