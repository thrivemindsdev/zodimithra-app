import { Gift, Sparkles } from "lucide-react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Festival = ({ festivalData, selectedDate, selectedMonth }: any) => {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#FFDEA9] flex items-center justify-center text-[#915200]">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-body-content font-bold tracking-wider text-[#915200] uppercase">
              SPECIAL DAY
            </h3>
            <p className="text-xs font-body-content text-slate-500">
              Festivals & Vrathas - {`${months[selectedMonth]} ${selectedDate}`}
            </p>
          </div>
        </div>
        <span className="text-[11px] font-medium text-[#915200] bg-amber-50 px-2.5 py-1 rounded-full">
          {festivalData?.length} events
        </span>
      </div>

      <div className="space-y-3 pt-2">
        {festivalData && festivalData?.length > 0 ? (
          festivalData?.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-slate-700 fill-slate-700" />
                <span className="text-xs font-semibold text-[#0C0F27]">
                  {item.description}
                </span>
              </div>
              {/* <span className="text-[10px] font-bold tracking-wider text-[#000000CC] uppercase">
                    {item.name}
                  </span> */}
            </div>
          ))
        ) : (
          <p className="text-xs text-center text-slate-500 font-body-content">
            No Festivals
          </p>
        )}
      </div>
    </div>
  );
};

export default Festival;
