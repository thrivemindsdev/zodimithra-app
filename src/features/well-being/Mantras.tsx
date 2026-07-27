import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { useGetMantrasQuery } from "@/queries/mantraQueries";
import {
  Headphones,
  Loader2,
  MoreVertical,
  Music,
  Pause,
  Play,
} from "lucide-react";
import React, { useRef, useState } from "react";

// --- TypeScript Interfaces matching API Response ---
interface Pivot {
  mantra_id: number;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  pivot?: Pivot;
}

interface AstrologerUser {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  image: string | null;
  app_language: string;
  current_location: string;
}

interface Astrologer {
  id: number;
  role: string;
  is_popular: boolean;
  is_verified: boolean;
  is_online: boolean;
  user_id: number;
  bio: string;
  gender: string;
  experience: string;
  rating: string;
  availability_status: string;
  total_sessions: number;
  price_per_minute: string;
  name: string;
  image: string | null;
  user?: AstrologerUser;
}

export interface MantraItem {
  id: number;
  title: string;
  subtitle: string;
  duration: number;
  audio_file: string;
  thumbnail: string | null;
  play_count: number;
  language: string;
  is_popular: number;
  status: number;
  created_at: string;
  updated_at: string;
  astrologer_id: number;
  astrologer: Astrologer;
  categories: Category[];
}

// Fixed Storage Base URL
const STORAGE_BASE_URL = "https://backend.zodimithra.com/storage";

const Mantras: React.FC = () => {
  const { data = [], isLoading } = useGetMantrasQuery();
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Dynamic Audio Play / Pause Handler
  const togglePlay = (id: number, audioPath: string) => {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audioUrl = `${STORAGE_BASE_URL}/${audioPath}`;
      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;
      newAudio
        .play()
        .catch((err) => console.error("Audio playback error:", err));
      setPlayingId(id);

      newAudio.onended = () => {
        setPlayingId(null);
      };
    }
  };

  // Helper to format play counts (e.g., 1000 -> 1.0K)
  const formatPlayCount = (count: number) => {
    if (!count) return "0";
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <>
      <Header
        title="Mantras"
        subtitle="Sacred sounds for your soul"
        showBackButton
        redirectPath="/wellbeing"
      />
      <BodyLayout>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-75">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((item: MantraItem) => {
              const isPlaying = playingId === item.id;

              const categoryName =
                item.categories?.[0]?.name || item.subtitle || "";
              const subtext = [item.language, categoryName]
                .filter(Boolean)
                .join(" • ");

              // Construct Storage Image URLs
              const thumbnailUrl = item.thumbnail
                ? `${STORAGE_BASE_URL}/${item.thumbnail.replace(/^\//, "")}`
                : null;

              const rawAstrologerImage =
                item.astrologer?.image || item.astrologer?.user?.image;
              const astrologerImageUrl = rawAstrologerImage
                ? `${STORAGE_BASE_URL}/${rawAstrologerImage.replace(/^\//, "")}`
                : null;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-white rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md"
                >
                  {/* Left: Main Thumbnail */}
                  <div className="relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden bg-amber-50 flex items-center justify-center">
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Hide image and show icon on load error
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <Music className="w-8 h-8 text-amber-400" />
                    )}
                  </div>

                  {/* Middle: Details */}
                  <div className="flex-1 min-w-0 mx-3 space-y-1">
                    <h3 className="text-base font-bold text-gray-900 truncate capitalize">
                      {item.title}
                    </h3>

                    <p className="text-xs text-gray-500 font-medium truncate capitalize">
                      {subtext || "Healing Mantra"}
                    </p>

                    <div className="flex items-center space-x-1.5 pt-0.5">
                      <div className="w-5 h-5 rounded-full overflow-hidden bg-amber-200 shrink-0 flex items-center justify-center">
                        {astrologerImageUrl ? (
                          <img
                            src={astrologerImageUrl}
                            alt={item.astrologer?.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <span className="text-amber-800 text-[10px] font-bold uppercase">
                            {item.astrologer?.name?.charAt(0) || "A"}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-600 font-medium truncate">
                        {item.astrologer?.name}
                        {item.astrologer?.role
                          ? `, ${item.astrologer.role}`
                          : ""}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions & Play Count */}
                  <div className="flex flex-col items-end justify-between self-stretch py-0.5 pl-1">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => togglePlay(item.id, item.audio_file)}
                        className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors focus:outline-none"
                        aria-label={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current translate-x-0.5" />
                        )}
                      </button>

                      <button
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                        aria-label="More options"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-1 text-gray-500 text-xs font-medium">
                      <Headphones className="w-3.5 h-3.5" />
                      <span>{formatPlayCount(item.play_count)} plays</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </BodyLayout>
    </>
  );
};

export default Mantras;
