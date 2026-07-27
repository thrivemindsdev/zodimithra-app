import { useCallback, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
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
  const { i18n } = useTranslation();
  const { id } = useParams();

  const currentLanguage = i18n.language || "en";

  const [cardResult, setCardResult] = useState<any>(null);
  const [yesOrNoResult, setYesOrNoResult] = useState<any>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const { data: cards, isLoading } = useGetAllTarotCardsQuery();

  // Generate deterministic/random initial shuffle offsets for each card
  const initialOffsets = useMemo(() => {
    if (!cards) return [];
    return cards.map(() => ({
      x: (Math.random() - 0.5) * 200, // Random X offset (-100px to 100px)
      y: (Math.random() - 0.5) * 300, // Random Y offset (-150px to 150px)
      rotate: (Math.random() - 0.5) * 60, // Random rotation (-30 deg to 30 deg)
      scale: 0.6 + Math.random() * 0.4,
    }));
  }, [cards]);

  const handleSelect = useCallback(
    async (card: TarotCard) => {
      try {
        setIsSelecting(true);
        if (id === "1") {
          const response = await GetTarotCardResult({
            card_name: card.name,
            lang: currentLanguage,
          });
          setCardResult(response);
        } else {
          const response = await GetYesOrNoResult({
            card_name: card.name,
            lang: currentLanguage,
          });
          setYesOrNoResult(response);
        }
      } catch (error) {
        console.error("Failed to fetch tarot result:", error);
      } finally {
        setIsSelecting(false);
      }
    },
    [currentLanguage, id]
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
              {cards?.map((card: TarotCard, index: number) => {
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
                    /* 1. Start from scattered shuffle position */
                    initial={{
                      x: offset.x,
                      y: offset.y,
                      rotate: offset.rotate,
                      scale: offset.scale,
                      opacity: 0,
                    }}
                    /* 2. Animate into grid position */
                    animate={{
                      x: 0,
                      y: 0,
                      rotate: 0,
                      scale: 1,
                      opacity: 1,
                    }}
                    /* 3. Smooth transition settings */
                    transition={{
                      type: "spring",
                      stiffness: 70,
                      damping: 14,
                      delay: (index % 5) * 0.03, // Slight ripple delay
                    }}
                    /* 4. Hover effect when user interacts with a card */
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