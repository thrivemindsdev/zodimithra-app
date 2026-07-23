const PanchangDetails = ({ data, birthDate }: any) => {
  const getActiveItem = (items?: any[], targetDateInput?: Date | string) => {
    if (!items || items.length === 0 || !targetDateInput) return undefined;

    const targetTime = new Date(targetDateInput).getTime();

    return items.find((item: any) => {
      if (!item.start || !item.end) return false;

      const start = new Date(item.start).getTime();
      const end = new Date(item.end).getTime();

      return start <= targetTime && targetTime <= end;
    });
  };

  const activeTithi = getActiveItem(data?.tithi, birthDate);
  const activeKarana = getActiveItem(data?.karana, birthDate);
  const activeNakshatra = getActiveItem(data?.nakshatra, birthDate);
  const activeYoga = getActiveItem(data?.yoga, birthDate);

  const details = [
    {
      label: "Tithi",
      value: activeTithi?.name || "-",
    },
    {
      label: "Karan",
      value: activeKarana?.name || "-",
    },
    {
      label: "Yog",
      value: activeYoga?.name || "-",
    },
    {
      label: "Nakshatra",
      value: activeNakshatra?.name || "-",
    },
  ];

  return (
    <div className="w-full max-w-md font-body-content">
      <h2 className="mb-4 text-xl font-bold text-primary font-body tracking-tight">
        Panchang Details
      </h2>

      <div className="overflow-hidden rounded-3xl border border-[#5A3AAE] bg-white shadow-md">
        {details.map((item, index) => (
          <div
            key={item.label}
            className={`flex items-center justify-between px-5 py-4 ${
              index !== details.length - 1
                ? "border-b border-[#5A3AAE]"
                : ""
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

export default PanchangDetails;