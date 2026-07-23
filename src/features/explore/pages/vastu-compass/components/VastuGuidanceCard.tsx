import { memo } from 'react';
import type { RoomType, VastuData } from '../types/vastu';

interface VastuGuidanceCardProps {
  selectedRoom: RoomType;
  vastuInfo: VastuData;
}

export const VastuGuidanceCard = memo<VastuGuidanceCardProps>(({ selectedRoom, vastuInfo }) => {
  return (
    <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-[#F2E8DC] shadow-lg flex flex-col gap-4 mt-2">
      {/* Status Header */}
      <div
        className={`w-full py-2.5 px-3 rounded-2xl text-center font-sans transition-colors ${
          vastuInfo.statusType === 'auspicious'
            ? 'bg-[#EAF5DF] text-[#2D5A12]'
            : vastuInfo.statusType === 'neutral'
            ? 'bg-[#FEF5E7] text-[#854F0B]'
            : 'bg-[#FDE8E8] text-[#9B1C1C]'
        }`}
      >
        <div className="font-bold text-sm">{vastuInfo.statusText}</div>
        <p className="text-[11px] opacity-85 mt-0.5">{vastuInfo.subText}</p>
      </div>

      {/* Interaction Hint */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#A08875] font-sans">
        <span>↺</span> Drag compass or rotate device to adjust
      </div>

      {/* Ranges & Badges */}
      <div className="font-sans space-y-2.5 pt-1">
        <h3 className="font-serif font-bold text-[#311B0B] text-sm flex items-center gap-1.5">
          <span className="text-[#6B3BA7]">✦</span> Direction Guide — {selectedRoom}
        </h3>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-[#3F721B] font-semibold flex items-center gap-1">✓ Auspicious</span>
            <span className="text-[#5C4533] font-mono text-[11px]">{vastuInfo.auspiciousRange}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#B36B00] font-semibold flex items-center gap-1">~ Neutral</span>
            <span className="text-[#5C4533] font-mono text-[11px]">{vastuInfo.neutralRange}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#C0392B] font-semibold flex items-center gap-1">✕ Avoid</span>
            <span className="text-[#5C4533] font-mono text-[11px]">{vastuInfo.avoidRange}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-[#EAF5DF] text-[#2D5A12] text-[10px] font-bold py-1.5 rounded-lg text-center">
            {vastuInfo.badges.auspicious}
          </div>
          <div className="bg-[#FEF5E7] text-[#854F0B] text-[10px] font-bold py-1.5 rounded-lg text-center">
            {vastuInfo.badges.neutral}
          </div>
          <div className="bg-[#FDE8E8] text-[#9B1C1C] text-[10px] font-bold py-1.5 rounded-lg text-center">
            {vastuInfo.badges.avoid}
          </div>
        </div>
      </div>

      {/* Tip Section */}
      <div className="pt-2 border-t border-[#F5EFE6]">
        <h4 className="font-serif font-bold text-[#3B1F0A] flex items-center gap-1.5 text-xs mb-1">
          <span className="text-[#D1197E] text-sm">💡</span> Vastu Tip
        </h4>
        <p className="text-[11px] text-[#6E5948] leading-relaxed font-sans">{vastuInfo.tip}</p>
      </div>
    </div>
  );
});

VastuGuidanceCard.displayName = 'VastuGuidanceCard';