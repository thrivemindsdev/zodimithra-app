import Langa from "@/assets/home/langa.png";
import Moon from "@/assets/home/moon.png";
import Sun from "@/assets/home/sun.png";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { memo, useState } from "react";

const CosmicEnergy = ({ data }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cards = [
    { label: "Sun", value: data?.sun, img: Sun },
    { label: "Moon", value: data?.moon, img: Moon },
    { label: "Nakshatra", value: data?.nakshatra, img: Langa },
  ];

  return (
    <section className="shadow-md mt-4 rounded-2xl p-4">
      <h3 className="capitalize font-header text-xl text-center pb-2 font-medium text-gradient">
        Cosmic Energy
      </h3>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? "auto" : 70 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden"
      >
        <p className="text-sm font-body text-justify text-text-secondary font-bold leading-[1.6]">
          {data?.prediction}
        </p>
      </motion.div>

      {/* Toggle Button */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-center w-full gap-1 mb-2 cursor-pointer"
      >
        <h1 className="text-sm text-secondary font-semibold font-body">
          {isExpanded ? "Read Less" : "Read More"}
        </h1>
        <ArrowRight
          size={16}
          color="#D1197E"
          className={`transition-transform ${isExpanded ? "-rotate-90" : ""}`}
        />
      </div>

      {/* Cards Layout */}
      <div className="flex justify-between items-stretch w-full mt-12 gap-2">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center shadow-sm w-[32%] rounded-4xl p-4 pt-10 relative text-center justify-start border border-gray-100"
          >
            <img
              src={card.img}
              alt={card.label}
              className="w-16 h-16 rounded-full absolute -top-8 left-1/2 -translate-x-1/2"
              style={{ boxShadow: "0 8px 8px rgba(0, 0, 0, 0.1)" }}
            />
            <p className="text-[#be6e40] font-header text-xs font-semibold mb-1">
              {card.label}
            </p>
            <p className="text-text-primary text-sm font-body font-semibold wrap-break w-full leading-tight">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default memo(CosmicEnergy);
