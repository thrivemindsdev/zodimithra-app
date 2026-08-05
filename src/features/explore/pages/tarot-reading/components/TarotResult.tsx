import tarotCardImg from "@/assets/tarot/tarotcard.png";
import { CheckCircle2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface TarotResultData {
  id: string;
  name: string;
  health: string;
  relationship: string;
  career: string;
  finance: string;
  card_image: {
    classic: string;
    artwork: string;
    dark: string;
    ghibli: string;
  };
}

interface TarotResultProps {
  data: TarotResultData;
}

// 1080 deg = 3 full 360-degree spins, landing perfectly back on the front face (0 deg)
const SPIN_DEG = 1080;
const SPIN_DURATION_MS = 3000;
const SPIN_DELAY_MS = 150;

const TarotResult = ({ data }: TarotResultProps) => {
  const { t } = useTranslation();
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const spinTimer = setTimeout(() => setSpinning(true), SPIN_DELAY_MS);
    return () => clearTimeout(spinTimer);
  }, []);

  const sections = [
    { title: t("tarotReading.health", "Health"), description: data.health },
    {
      title: t("tarotReading.relationship", "Relationship"),
      description: data.relationship,
    },
    { title: t("tarotReading.career", "Career"), description: data.career },
    { title: t("tarotReading.finance", "Finance"), description: data.finance },
  ];

  const bfv: React.CSSProperties = {
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  };

  return (
    <>
      {/* Perspective Container */}
      <div className="w-full p-4">
        {/* Flipping Inner Container */}
        <div
          className="relative w-full aspect-2/3 transition-transform"
          style={
            {
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
              transform: spinning
                ? `rotateY(${SPIN_DEG}deg)`
                : "rotateY(180deg)",
              transition: spinning
                ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`
                : "none",
            } as React.CSSProperties
          }
        >
          {/* Card Front (Actual Tarot Image) */}
          <img
            src={data.card_image.classic}
            alt={data.name}
            className="absolute inset-0 h-full w-full rounded-lg object-cover"
            style={{
              ...bfv,
              transform: "rotateY(0deg)",
            }}
          />

          {/* Card Back (Default Deck Back Pattern) */}
          <img
            src={tarotCardImg}
            alt="Tarot Card Back"
            className="absolute inset-0 h-full w-full rounded-lg object-cover"
            style={{
              ...bfv,
              transform: "rotateY(180deg)",
            }}
          />
        </div>
      </div>

      {/* Card Name */}
      <h1 className="pt-4 text-center text-2xl font-body font-bold text-text-primary">
        {data.name}
      </h1>

      {/* Reading */}
      <div className="mt-6 font-body">
        <div className="space-y-5">
          {sections.map(({ title, description }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2
                  size={15}
                  strokeWidth={3}
                  className="text-green-600"
                />
              </div>

              <div>
                <h3 className="text-[15px] font-semibold text-text-primary">
                  {title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TarotResult;
