const DayDetails = ({ data }: any) => {
  return (
    <div className="grid grid-cols-2 gap-3 py-6">
      {/* Challenging Time */}
      <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100">
        <div className="flex items-center space-x-1.5 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9A4729]" />
          <span className="text-[10px] font-bold tracking-wider text-[#9A4729] uppercase">
            Challenging
          </span>
        </div>
        <p className="text-sm font-body font-bold text-[#0C0F27]">
          {data?.rahu_kal}
        </p>
      </div>

      {/* Prosperous Time */}
      <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100">
        <div className="flex items-center space-x-1.5 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#005E26]" />
          <span className="text-[10px] font-bold tracking-wider text-[#005E26] uppercase">
            Prosperous
          </span>
        </div>
        <p className="text-sm font-body font-bold text-[#0C0F27]">
          {data?.shubha_muhurt}
        </p>
      </div>
    </div>
  );
};

export default DayDetails;
