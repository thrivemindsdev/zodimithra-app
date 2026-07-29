import { useCallback, useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import tarotCardImg from "@/assets/tarot/tarotcard.png";
import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import GlobalLoader from "@/components/common/GlobalLoader";

import { useGetAllTarotCardsQuery } from "@/queries/homeQueries";
import { GetTarotCardResult, GetYesOrNoResult } from "@/services/home.api";

import TarotResult from "./TarotResult";
import YesOrNoResult from "./YesOrNoResult";

interface TarotCard {
  id: string | number;
  name: string;
}

const TarotCards = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { id } = useParams();

  const currentLanguage = i18n.language || "en";

  const [cardResult, setCardResult] = useState<any>(null);
  const [yesOrNoResult, setYesOrNoResult] = useState<any>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const { data: rawCards, isLoading } = useGetAllTarotCardsQuery();

  useEffect(() => {
    setCardResult(null);
    setYesOrNoResult(null);
  }, [id]);

  // 1. Shuffle the cards array completely on load (Fisher-Yates Shuffle)
  const shuffledCards = useMemo(() => {
    if (!rawCards || !Array.isArray(rawCards)) return [];
    const array = [...rawCards];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }, [rawCards]);

  // 2. Generate random initial visual offsets for the shuffled items
  const initialOffsets = useMemo(() => {
    if (!shuffledCards.length) return [];
    return shuffledCards.map(() => ({
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 400,
      rotate: (Math.random() - 0.5) * 90,
      scale: 0.5 + Math.random() * 0.5,
    }));
  }, [shuffledCards]);

  const handleSelect = useCallback(
    async (card: TarotCard) => {
      if (isSelecting) return;

      setIsSelecting(true);
      try {
        if (id === "1") {
          const response = await GetTarotCardResult({
            card_name: card.name,
            lang: currentLanguage,
          });

          if (response) {
            setCardResult(response);
          } else {
            throw new Error("Received empty response from GetTarotCardResult");
          }
        } else {
          const response = await GetYesOrNoResult({
            card_name: card.name,
            lang: currentLanguage,
          });

          if (response) {
            setYesOrNoResult(response);
          } else {
            throw new Error("Received empty response from GetYesOrNoResult");
          }
        }
      } catch (error) {
        console.error("Failed to fetch tarot result:", error);
        navigate("/tarot-reading", { replace: true });
      } finally {
        setIsSelecting(false);
      }
    },
    [currentLanguage, id, isSelecting, navigate]
  );

  if (isLoading || isSelecting) {
    return <GlobalLoader />;
  }

  return (
    <>
      <Header
        title="Tarot Reading"
        subtitle="Tarot gives you ideas for the life"
        showBackButton
        redirectPath="/tarot-reading"
      />

      <BodyLayout>
        {cardResult ? (
          <TarotResult data={cardResult} />
        ) : yesOrNoResult ? (
          <YesOrNoResult data={yesOrNoResult} />
        ) : (
          <div className="grid grid-cols-5 gap-3 p-2 overflow-hidden">
            <AnimatePresence>
              {shuffledCards.map((card: TarotCard, index: number) => {
                const offset = initialOffsets[index] || {
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 1,
                };

                return (
                  <motion.button
                    key={card.id}
                    type="button"
                    onClick={() => handleSelect(card)}
                    className="cursor-pointer focus:outline-none"
                    initial={{
                      x: offset.x,
                      y: offset.y,
                      rotate: offset.rotate,
                      scale: offset.scale,
                      opacity: 0,
                    }}
                    animate={{
                      x: 0,
                      y: 0,
                      rotate: 0,
                      scale: 1,
                      opacity: 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 80,
                      damping: 12,
                      delay: index * 0.015,
                    }}
                    whileHover={{
                      scale: 1.08,
                      zIndex: 10,
                      transition: { duration: 0.15 },
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={tarotCardImg}
                      alt={card.name}
                      className="w-full rounded-lg shadow-md"
                    />
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </BodyLayout>
    </>
  );
};

export default TarotCards;