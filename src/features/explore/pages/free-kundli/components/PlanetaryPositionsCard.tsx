export const PlanetaryPositionsCard = ({ data }: any) => {
  return (
    <div className="w-full max-w-md font-body-content py-6">
      {/* Title */}
      <h2 className="mb-4 text-xl font-bold text-primary font-body tracking-tight">
        Planetary Positions
      </h2>

      {/* Card Container */}
      <div className="overflow-hidden rounded-2xl border border-primary bg-white shadow-xl shadow-purple-900/10">
        <table className="w-full text-left border-collapse">
          {/* Header */}
          <thead>
            <tr className="bg-primary text-white text-xs font-semibold uppercase tracking-wider">
              <th className="py-3 px-6">Planet</th>
              <th className="py-3 px-6 text-center">Sign</th>
              <th className="py-3 px-6 text-right">Degree</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-primary/15 text-text-secondary font-medium text-sm">
            {data?.map((row: any, index: number) => (
              <tr
                key={index}
                className="transition-colors hover:bg-purple-50/40"
              >
                <td className="py-3.5 px-6 whitespace-nowrap">{row.name}</td>
                <td className="py-3.5 px-6 text-center whitespace-nowrap">
                  {row.rasi_name}
                </td>
                <td className="py-3.5 px-6 text-right whitespace-nowrap font-mono text-sm tracking-wide">
                  {row.degree}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlanetaryPositionsCard;
