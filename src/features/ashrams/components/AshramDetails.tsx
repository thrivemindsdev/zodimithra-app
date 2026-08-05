import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { useGetAshramamByIdQuery } from "@/queries/ashramsQueries";
import { Star } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import SubscriptionModal from "./SubscriptionModal";

export default function AshramaDetails() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { id } = useParams<{ id: string }>();

  const ashramamId = Number(id);

  const { data: ashramaDetails, isLoading } = useGetAshramamByIdQuery({
    id: ashramamId,
  });

  if (isLoading) {
    return (
      <>
        {/* Header Skeleton */}
        <Header
          title=""
          showBackButton
          redirectPath="/ashrams"
        />

        <BodyLayout>
          {/* Hero Image Skeleton */}
          <div className="h-64 w-full animate-pulse rounded-3xl bg-gray-200" />

          {/* Profile Row Skeleton */}
          <div className="my-5 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              {/* Avatar Skeleton */}
              <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-gray-200" />

              <div className="space-y-2">
                {/* Name Skeleton */}
                <div className="h-5 w-36 animate-pulse rounded bg-gray-200" />
                {/* Rating Skeleton */}
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
              </div>
            </div>

            {/* Subscribe Button Skeleton */}
            <div className="h-9 w-24 shrink-0 animate-pulse rounded-lg bg-gray-200" />
          </div>

          {/* About Section Skeleton */}
          <div className="space-y-3 pt-2">
            {/* Title Skeleton */}
            <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
            {/* Paragraph Paragraph Skeletons */}
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-[90%] animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-[60%] animate-pulse rounded bg-gray-200" />
          </div>
        </BodyLayout>
      </>
    );
  }

  return (
    <>
      <Header
        title={`${ashramaDetails?.name || ""}`}
        showBackButton
        redirectPath="/ashrams"
      />

      <BodyLayout>
        <img
          src={ashramaDetails?.image}
          alt={ashramaDetails?.name}
          className="h-64 w-full rounded-3xl object-cover"
        />

        <div className="my-5 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={ashramaDetails?.image}
              alt={ashramaDetails?.name}
              className="h-14 w-14 shrink-0 rounded-full object-cover"
            />

            <div className="min-w-0">
              <h3 className="truncate font-light text-text-primary text-lg">
                {ashramaDetails?.name}
              </h3>

              <div className="flex items-center pt-1">
                <p className="flex items-center gap-1 font-body text-sm text-text-secondary pr-2">
                  <Star size={16} className="shrink-0 fill-primary text-primary" />
                  {ashramaDetails?.rating?.split(".")[0]}
                </p>
              </div>
            </div>
          </div>

          {ashramaDetails?.is_subscribed ? (
            <button
              type="button"
              className="shrink-0 rounded-xl border border-primary bg-white px-4 py-2 font-body text-sm font-bold text-primary"
            >
              {t("ashrams.subscribed", "Subscribed")}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="shrink-0 rounded-lg bg-indigo-900 px-5 py-2 text-sm text-white"
            >
              {t("ashrams.subscribe", "Subscribe")}
            </button>
          )}
        </div>

        {ashramaDetails?.about && (
          <>
            <h2 className="mb-2 font-light text-lg text-primary">{t("ashrams.about", "About")}</h2>

            <p className="font-body text-sm leading-6 text-text-secondary">
              {ashramaDetails?.about}
            </p>
          </>
        )}
      </BodyLayout>

      {open && (
        <SubscriptionModal
          isOpen={open}
          onClose={() => setOpen(false)}
          details={ashramaDetails}
        />
      )}
    </>
  );
}