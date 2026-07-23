import { Clock3, Hash } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function LuckyInfo({ data }: any) {
  const { t } = useTranslation();
  const isWhite = data?.lucky?.color === "White";

  const luckyDatas = [
    {
      id: 1,
      title: t("home.luckyColor"),
      value: data?.lucky?.color,
      type: "color",
      color: isWhite ? "#000000" : data?.lucky?.colour_code,
    },
    {
      id: 2,
      title: t("home.luckyNumber"),
      value: data?.lucky?.number,
      type: "number",
    },
    {
      id: 3,
      title: t("home.auspiciousTime"),
      value: data?.muhurta?.abhijit_muhurta?.split("-")[0],
      type: "time",
    },
  ];

  return (
    <div className="py-8 w-full">
      <h6 className="font-body-content text-xs text-text-primary">
        {t("home.todayFortune")}
      </h6>

      <h2 className="font-body-content text-xl font-extrabold text-linear pb-4">
        {t("home.luckySigns")}
      </h2>

      <section className="rounded-3xl bg-[#EBEBEB33] p-4 border border-gray-200 shadow-[0_2px_0_rgba(0,0,0,0.12)]">
        <div className="flex items-center gap-2">
          {luckyDatas.map((item) => (
            <div
              key={item.id}
              className="w-[32%] py-4 flex flex-col items-center justify-center rounded-2xl bg-[#F5F5F5] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Icon */}
              {item.type === "color" && (
                <div
                  className="h-6 w-6 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              )}

              {item.type === "number" && (
                <div className="flex justify-center items-center h-6 w-6 rounded-full bg-[#D9D9D9]">
                  <Hash size={12} className="text-gray-700" strokeWidth={2.5} />
                </div>
              )}

              {item.type === "time" && (
                <Clock3 size={24} className="text-gray-700" strokeWidth={2.2} />
              )}

              {/* Title */}
              <h3
                className="pt-2 text-center font-body-content text-xs font-semibold text-text-primary w-full px-1 truncate"
                title={item.title}
              >
                {item.title}
              </h3>

              {/* Value */}
              <p
                className="pt-2 text-md font-header font-light"
                style={{
                  color: item.type === "color" ? item.color : undefined,
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
