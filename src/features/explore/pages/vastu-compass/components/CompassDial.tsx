import React, { useState, useEffect, useRef, memo } from "react";
import { DIRECTION_LABELS, getCardinalDirection } from "../utils/vastuConfig";
import type { CompassDialProps } from "../types/vastu";

export const CompassDial = memo<CompassDialProps>(
  ({ degree, onDegreeChange, onDragStateChange }) => {
    const dialRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startAngle, setStartAngle] = useState(0);

    useEffect(() => {
      onDragStateChange?.(isDragging);
    }, [isDragging, onDragStateChange]);

    const getAngleFromEvent = (
      e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent,
    ): number => {
      if (!dialRef.current) return 0;

      const rect = dialRef.current.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      const clientX =
        "touches" in e && e.touches.length > 0
          ? e.touches[0].clientX
          : (e as MouseEvent | React.MouseEvent).clientX;

      const clientY =
        "touches" in e && e.touches.length > 0
          ? e.touches[0].clientY
          : (e as MouseEvent | React.MouseEvent).clientY;

      return (
        Math.atan2(clientY - center.y, clientX - center.x) * (180 / Math.PI)
      );
    };

    const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
      setIsDragging(true);
      const angle = getAngleFromEvent(e);
      setStartAngle(angle - degree);
    };

    useEffect(() => {
      const handlePointerMove = (e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;
        if (e.cancelable) e.preventDefault();

        let newAngle = getAngleFromEvent(e) - startAngle;
        newAngle = ((newAngle % 360) + 360) % 360;
        onDegreeChange(Math.round(newAngle));
      };

      const handlePointerUp = () => setIsDragging(false);

      if (isDragging) {
        window.addEventListener("mousemove", handlePointerMove, {
          passive: false,
        });
        window.addEventListener("touchmove", handlePointerMove, {
          passive: false,
        });
        window.addEventListener("mouseup", handlePointerUp);
        window.addEventListener("touchend", handlePointerUp);
      }

      return () => {
        window.removeEventListener("mousemove", handlePointerMove);
        window.removeEventListener("touchmove", handlePointerMove);
        window.removeEventListener("mouseup", handlePointerUp);
        window.removeEventListener("touchend", handlePointerUp);
      };
    }, [isDragging, startAngle, onDegreeChange]);

    return (
      <div className="relative flex flex-col items-center justify-center my-4 select-none">
        {/* Dial Ring */}
        <div
          ref={dialRef}
          className="relative w-58 h-58 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden shrink-0 transition-none touch-none"
          style={{ transform: `rotate(${-degree}deg)` }}
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
        >
          <div className="absolute inset-0 rounded-full bg-[#FFFAF3]" />
          <div className="absolute inset-0 rounded-full border border-[#EF9F27] pointer-events-none" />
          <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-[#FAC775] pointer-events-none" />

          {/* Quadrant Shadows */}
          <div className="absolute inset-0 pointer-events-none opacity-5">
            <div className="absolute left-0 top-0 w-1/2 h-1/2 bg-[#639922]" />
            <div className="absolute right-0 top-0 w-1/2 h-1/2 bg-[#E24B4A]" />
            <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-[#BA7517]" />
            <div className="absolute left-0 bottom-0 w-1/2 h-1/2 bg-[#BA7517]" />
          </div>

          {/* Outer Ticks */}
          {Array.from({ length: 72 }).map((_, i) => {
            const isMajor = i % 9 === 0;
            const isMedium = i % 3 === 0;

            return (
              <div
                key={i}
                className="absolute left-1/2 top-0 h-full -translate-x-1/2"
                style={{ transform: `rotate(${i * 5}deg)` }}
              >
                <div
                  className={`mt-1.5 rounded-full ${
                    isMajor
                      ? "w-0.5 h-4 bg-[#3b1f0a] opacity-100"
                      : isMedium
                        ? "w-[0.8px] h-2.5 bg-[#ba7517] opacity-50"
                        : "w-[0.8px] h-1.5 bg-[#ba7517] opacity-50"
                  }`}
                />
              </div>
            );
          })}

          <div className="absolute w-[75%] h-[75%] rounded-full border border-[#EF9F27] pointer-events-none" />

          {/* Direction Labels */}
          <div className="absolute inset-0 pointer-events-none">
            {DIRECTION_LABELS.map((dir) => {
              const radius = dir.cardinal ? 76 : 82;
              const x = 115 + radius * Math.sin((dir.angle * Math.PI) / 180);
              const y = 115 - radius * Math.cos((dir.angle * Math.PI) / 180);

              return (
                <span
                  key={dir.label}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                    dir.cardinal
                      ? "font-serif font-semibold"
                      : "font-sans font-normal"
                  } ${
                    dir.label === "N"
                      ? "text-[15px] text-[#C0392B]"
                      : dir.cardinal
                        ? "text-[13px] text-[#3B1F0A]"
                        : "text-[8px] text-[#854F0B]"
                  }`}
                  style={{ left: `${x}px`, top: `${y}px` }}
                >
                  {dir.label}
                </span>
              );
            })}
          </div>

          {/* Compass Rose Needles */}
          <div className="absolute w-30 h-30 pointer-events-none">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-b-60 border-l-transparent border-r-transparent border-b-[#3B1F0A] origin-bottom -rotate-45 drop-shadow-[0_0_0.5px_#FFF8F0]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-b-60 border-l-transparent border-r-transparent border-b-[#3B1F0A] origin-bottom rotate-135 drop-shadow-[0_0_0.5px_#FFF8F0]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-b-60 border-l-transparent border-r-transparent border-b-[#3B1F0A] origin-bottom rotate-45 drop-shadow-[0_0_0.5px_#FFF8F0]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-b-60 border-l-transparent border-r-transparent border-b-[#3B1F0A] origin-bottom -rotate-135 drop-shadow-[0_0_0.5px_#FFF8F0]" />

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-b-40 border-l-transparent border-r-transparent border-b-[#EF9F27] origin-bottom rotate-90 drop-shadow-[0_0_0.5px_#FFF8F0]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-b-40 border-l-transparent border-r-transparent border-b-[#EF9F27] origin-bottom rotate-180 drop-shadow-[0_0_0.5px_#FFF8F0]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-b-40 border-l-transparent border-r-transparent border-b-[#EF9F27] origin-bottom rotate-270 drop-shadow-[0_0_0.5px_#FFF8F0]" />

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[7px] border-r-[7px] border-b-60 border-l-transparent border-r-transparent border-b-[#C0392B] origin-bottom rotate-0 drop-shadow-[0_0_0.5px_#FFF8F0]" />

            <div className="absolute w-6 h-6 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-[0.5px] border-[#FAC775]" />
            <div className="absolute w-3.5 h-3.5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.5px] border-[#EF9F27]" />
            <div className="absolute w-5.5 h-5.5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3B1F0A]" />
            <div className="absolute w-2.5 h-2.5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FAC775] border border-[#3B1F0A] z-20" />
          </div>
        </div>

        {/* Fixed Indicator Arrow */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-58 h-58 pointer-events-none">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-25 border-l-[1.5px] border-dashed border-[#C0392B]/60" />
          <div className="absolute left-1/2 -top-4 -translate-x-1/2 mt-px w-0 h-0 border-l-[7px] border-r-[7px] border-b-12 border-l-transparent border-r-transparent border-b-[#C0392B]" />
        </div>

        {/* Readout Display */}
        <div className="mt-6 flex items-center justify-center gap-3 w-32 h-13 bg-[#FFFAF3] border border-[#EF9F27] rounded-[30px] shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-serif font-medium text-[26.6px] leading-10 text-[#2C1A08]">
              {degree}°
            </span>
            <span className="font-sans font-semibold text-[13px] leading-4 text-[#D1197E] tracking-widest mt-1">
              {getCardinalDirection(degree)}
            </span>
          </div>
        </div>
      </div>
    );
  },
);

CompassDial.displayName = "CompassDial";
