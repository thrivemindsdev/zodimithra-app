import { Moon, Sun } from "lucide-react";

const PlanetCard = ({planetData}: any) => {
  return (
    <div className="my-6 rounded-3xl p-4 shadow-sm flex items-center justify-between border border-slate-100">
      {/* Sun */}
      <div className="flex items-center space-x-3 flex-1">
        <div className="w-10 h-10 rounded-full bg-[#FFDEA9] flex items-center justify-center text-[#915200]">
          <Sun className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-body-content font-bold tracking-wider text-[#0C0F2799] uppercase">
            Sun
          </p>
          <p className="text-sm font-serif font-bold text-text-primary">
            in {planetData?.sun}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-slate-100" />

      {/* Moon */}
      <div className="flex items-center space-x-3 flex-1">
        <div className="w-10 h-10 rounded-full bg-[#E5EBF9] flex items-center justify-center text-[#384768]">
          <Moon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-body-content font-bold tracking-wider text-[#0C0F2799] uppercase">
            Moon
          </p>
          <p className="text-sm font-serif font-bold text-text-primary">
            in {planetData?.moon}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanetCard;
