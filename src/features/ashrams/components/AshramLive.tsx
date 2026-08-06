import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { useGetAshramamLiveSessionByIDQuery } from "@/queries/ashramsQueries";
import { useGetUserDetailsQuery } from "@/queries/userQueries";
import type { LiveSession } from "@/types/ashrams.types";
import { Maximize, Minimize } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";

const AshramaLive = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const ashramamId = Number(id);
  const location = useLocation();
  const session = location.state?.session as LiveSession | undefined;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const { data: userDetails } = useGetUserDetailsQuery();
  const userName = userDetails?.name || "Guest";

  const { data, isLoading } = useGetAshramamLiveSessionByIDQuery({
    id: ashramamId,
    lang: i18n.language ?? "en",
  });

  const isLive = data?.start_time && new Date() >= new Date(data.start_time);

  const meetUrl = session?.meet_url || data?.meet_url;

  let liveUrl: string | undefined;
  if (meetUrl && isLive) {
    const previewUrl = meetUrl.replace("/j/", "/preview/");
    const sep = previewUrl.includes("?") ? "&" : "?";
    // embed=1 → meet app renders video-only (no header / controls / chat)
    liveUrl = `${previewUrl}${sep}name=${encodeURIComponent(userName)}&embed=1`;
  }

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // Fullscreen view: Hides all UI components and shows video only
  if (isFullscreen && liveUrl) {
    return (
      <div className="fixed inset-0 z-50 h-screen w-screen overflow-hidden bg-[#120403]">
        <iframe
          src={liveUrl}
          title="Live broadcast"
          allow="autoplay; fullscreen"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
          className="h-full w-full border-0"
        />
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label="Exit Fullscreen"
          className="absolute bottom-3 right-3 z-50 cursor-pointer rounded-lg bg-black p-4 text-white transition-colors hover:bg-black/80"
        >
          <Minimize className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <>
      <Header
        title={t("ashrams.liveNow", "Live Now")}
        subtitle={t("ashrams.joinOngoing", "join the ongoing sessions")}
        showBackButton
        redirectPath="/ashrams"
      />
      <BodyLayout>
        <div className="max-w-md rounded-lg bg-white">
          {isLoading ? (
            /* Skeleton Loading State */
            <>
              {/* Video Player Frame Skeleton */}
              <div className="mb-4 aspect-4/3 w-full animate-pulse rounded-2xl bg-gray-200" />

              {/* Title Skeleton */}
              <div className="mb-6 space-y-2">
                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
              </div>

              {/* Creator Info Row Skeleton */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="h-9 w-24 animate-pulse rounded-xl bg-gray-200" />
              </div>

              {/* About Section Skeleton */}
              <div className="space-y-2 pt-2">
                <div className="h-5 w-36 animate-pulse rounded bg-gray-200" />
                <div className="h-3.5 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-3.5 w-[90%] animate-pulse rounded bg-gray-200" />
                <div className="h-3.5 w-[65%] animate-pulse rounded bg-gray-200" />
              </div>
            </>
          ) : (
            /* Loaded Content State */
            <>
              {liveUrl ? (
                <div className="relative mb-4 aspect-4/3 w-full overflow-hidden rounded-2xl bg-[#120403]">
                  <iframe
                    src={liveUrl}
                    title="Live broadcast"
                    allow="autoplay; fullscreen"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                    className="absolute inset-0 h-full w-full border-0"
                  />
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label="Enter Fullscreen"
                    className="absolute bottom-3 right-3 z-10 cursor-pointer rounded-lg bg-black p-3 text-white transition-colors hover:bg-black/80"
                  >
                    <Maximize className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="mb-4 flex h-40 items-center justify-center rounded-2xl bg-black text-white">
                  {t("ashrams.liveNotStarted", "Live not yet started")}
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <h3 className="font-body text-lg font-normal text-text-primary">
                  {data?.title}
                </h3>
              </div>

              {/* Creator */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={data?.author?.image}
                    alt={data?.author?.user?.name || "Author"}
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <h3 className="font-body-content text-md font-semibold text-text-primary">
                    {data?.author?.user?.name}
                  </h3>
                </div>

                <button
                  type="button"
                  className="rounded-xl border border-primary bg-white px-4 py-2 font-body text-sm font-bold text-primary"
                >
                  {t("ashrams.subscribed", "Subscribed")}
                </button>
              </div>

              {/* About */}
              {data?.description && (
                <div>
                  <h3 className="font-body text-lg font-bold text-text-primary">
                    {t("ashrams.aboutSession", "About This Session")}
                  </h3>

                  <p className="font-body text-sm font-normal text-text-secondary">
                    {data?.description}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </BodyLayout>
    </>
  );
};

export default AshramaLive;
