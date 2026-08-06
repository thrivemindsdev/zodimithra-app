import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useGetAshramamLiveQuery } from "@/queries/ashramsQueries";
import SessionCarousel from "./SessionCarousel";
import SubscriptionModal from "./SubscriptionModal";

interface SelectedSession {
  id: number;
  image: string;
  subscription_amount: number;
}

const AshramsBanner = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [selectedSession, setSelectedSession] =
    useState<SelectedSession | null>(null);

  const { data, isLoading } = useGetAshramamLiveQuery();

  const handleSessionClick = (session: any) => {
    if (session.is_subscribed) {
      navigate(`/ashram-live/${session.id}`, {
        state: {
          session,
          type: "live",
        },
      });
      return;
    }

    setSelectedSession({
      id: session.author.id,
      image: session.author.image,
      subscription_amount: session.price,
    });

    setOpen(true);
  };

  return (
    <>
      <SessionCarousel
        title={t("ashrams.live", "Live")}
        type="live"
        sessions={data?.livesessions ?? []}
        loading={isLoading}
        onSessionClick={handleSessionClick}
      />

      <SessionCarousel
        title={t("ashrams.upcoming", "Upcoming")}
        type="upcoming"
        sessions={data?.upcomingsessios ?? []}
        loading={isLoading}
        onSessionClick={handleSessionClick}
      />

      <SubscriptionModal
        isOpen={open}
        onClose={() => setOpen(false)}
        details={selectedSession}
      />
    </>
  );
};

export default AshramsBanner;
