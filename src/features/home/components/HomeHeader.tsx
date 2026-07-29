import { Bell, Languages } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/home/logo.png";

interface HomeHeaderProps {
  loading?: boolean;
  data?: {
    name?: string;
    image_url?: string;
  };
}

const HomeHeader = ({ loading }: HomeHeaderProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="z-50 flex items-center justify-between bg-white pb-4">
      {/* Avatar / Skeleton */}
      {loading ? (
        <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-gray-200" />
      ) : (
        <button
          type="button"
          aria-label="View Profile"
          onClick={() => navigate("/profile")}
          className="relative flex h-12 w-12 shrink-0 items-center justify-between overflow-hidden rounded-full shadow-sm"
        >
          <img
            src={Logo}
            alt="zodimithra"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </button>
      )}

      {/* Right Actions / Skeleton */}
      {loading ? (
        <div className="flex items-center gap-2">
          {/* Badge Skeleton */}
          <div className="h-7 w-16 animate-pulse rounded-full bg-gray-200" />
          {/* Bell Skeleton */}
          <div className="h-10 w-10 animate-pulse rounded-md bg-gray-200" />
          {/* Language Skeleton */}
          <div className="h-10 w-10 animate-pulse rounded-md bg-gray-200" />
        </div>
      ) : (
        <div className="flex items-center gap-1">
          {/* Live Badge */}
          <button
            onClick={() => navigate("/ashrams")}
            type="button"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-red-600"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
            </span>

            <span className="text-xs font-semibold tracking-wide uppercase">
              {t("home.live")}
            </span>
          </button>

          {/* Notifications Button */}
          <button
            type="button"
            aria-label="Notifications"
            className="rounded-md p-2"
          >
            <Bell className="h-6 w-6 text-black" strokeWidth={1.8} />
          </button>

          {/* Language Button */}
          <button
            type="button"
            aria-label="Language"
            onClick={() => navigate("/languages")}
            className="rounded-md p-2"
          >
            <Languages className="h-6 w-6 text-black" strokeWidth={1.8} />
          </button>
        </div>
      )}
    </header>
  );
};

export default memo(HomeHeader);
