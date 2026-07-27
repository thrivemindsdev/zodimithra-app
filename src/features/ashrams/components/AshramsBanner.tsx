import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetAshramamLiveQuery } from "@/queries/ashramsQueries";
import SubscriptionModal from "./SubscriptionModal";
import SessionCarousel from "./SessionCarousel";

interface SelectedSession {
  id: number;
  image: string;
  subscription_amount: number;
}

const AshramsBanner = () => {
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
        title="Live"
        sessions={data?.livesessions ?? []}
        loading={isLoading}
        onSessionClick={handleSessionClick}
      />

      <SessionCarousel
        title="Upcoming"
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
