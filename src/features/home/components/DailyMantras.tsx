import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface Mantra {
  id: string;
  title: string;
  subtitle: string;
  coverUrl: string;
  audioUrl: string;
}

const DUMMY_MANTRAS: Mantra[] = [
  {
    id: "1",
    title: "🕉️ Peace Mantra",
    subtitle: "Ancient Vedic Chant",
    coverUrl:
      "https://images.unsplash.com/photo-1602192103300-47e66756152e?w=300&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "2",
    title: "🕉️ Shiva Tandava",
    subtitle: "Energy & Power Stotram",
    coverUrl:
      "https://images.unsplash.com/photo-1545128485-c400e7702796?w=300&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "3",
    title: "🕉️ Gayatri Mantra",
    subtitle: "Wisdom & Enlightenment",
    coverUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

const DailyMantras: React.FC = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const currentMantra = DUMMY_MANTRAS[currentIndex];

  // Boundary condition checks for UI states
  const isFirstSong = currentIndex === 0;
  const isLastSong = currentIndex === DUMMY_MANTRAS.length - 1;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((err) => console.log("Playback error:", err));
      }
    }
  }, [currentIndex]);

  const onTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const onAudioEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      handleNext();
    }
  };

  // Explicit Play/Pause action tied correctly to target element selection
  const togglePlay = (targetIndex: number) => {
    if (!audioRef.current) return;

    if (targetIndex !== currentIndex) {
      setCurrentIndex(targetIndex);
      setIsPlaying(true);
      scrollToCard(targetIndex);
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.log(err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * DUMMY_MANTRAS.length);
      setCurrentIndex(randomIndex);
      scrollToCard(randomIndex);
    } else if (!isLastSong) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollToCard(nextIndex);
    } else if (isRepeat || isLastSong) {
      // Loop back to start if explicit loop is expected, otherwise do nothing
      setCurrentIndex(0);
      scrollToCard(0);
    }
  };

  const handlePrev = () => {
    if (!isFirstSong) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      scrollToCard(prevIndex);
    } else {
      setCurrentIndex(DUMMY_MANTRAS.length - 1);
      scrollToCard(DUMMY_MANTRAS.length - 1);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const scrollToCard = (index: number) => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.clientWidth;
      const cardElement = scrollRef.current.children[index] as HTMLElement;
      if (cardElement) {
        const offsetLeft =
          cardElement.offsetLeft -
          (containerWidth - cardElement.clientWidth) / 2;
        scrollRef.current.scrollTo({
          left: offsetLeft,
          behavior: "smooth",
        });
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="w-full max-w-md mx-auto select-none">
      <audio
        ref={audioRef}
        src={currentMantra.audioUrl}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onAudioEnded}
      />

      <h2 className="text-xl font-bold font-header text-linear capitalize mb-4 px-1">
        {t("home.dailyMantras")}
      </h2>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-none pb-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {DUMMY_MANTRAS.map((mantra, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={mantra.id}
              onClick={() => {
                if (!isActive) {
                  setCurrentIndex(index);
                  setIsPlaying(false);
                  scrollToCard(index);
                }
              }}
              className={`flex-none w-[88%] snap-center rounded-3xl p-4 bg-[#F8F9FA] border border-gray-100/50 flex items-center shadow-sm transition-all duration-300 ${
                isActive
                  ? "opacity-100 scale-100"
                  : "opacity-60 scale-95 cursor-pointer"
              }`}
            >
              <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 shadow-md border-2 border-white">
                <img
                  src={mantra.coverUrl}
                  alt={mantra.title}
                  className={`w-full h-full object-cover object-center ${
                    isActive && isPlaying
                      ? "animate-spin [animation-duration:20s]"
                      : ""
                  }`}
                />
              </div>

              <div className="flex-1 pl-4 flex flex-col justify-center">
                <h4 className="text-base font-bold font-body text-gray-800 tracking-tight line-clamp-1">
                  {mantra.title}
                </h4>
                <p className="text-xs text-gray-400 font-body mb-3">
                  {mantra.subtitle}
                </p>

                <div
                  className="w-full bg-[#EFECE6] h-1.5 rounded-full relative cursor-pointer mb-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isActive) handleProgressBarClick(e);
                  }}
                >
                  <div
                    className="bg-[#C59B63] h-full rounded-full transition-all duration-100 ease-linear"
                    style={{
                      width: `${isActive && duration ? (currentTime / duration) * 100 : 0}%`,
                    }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-gray-400 font-medium px-0.5 mb-2">
                  <span>{isActive ? formatTime(currentTime) : "0:00"}</span>
                  <span>{isActive ? formatTime(duration) : "0:00"}</span>
                </div>

                <div className="flex items-center justify-between px-1">
                  {/* Shuffle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsShuffle(!isShuffle);
                    }}
                    className={`p-1 transition-colors ${isShuffle ? "text-[#D1197E]" : "text-gray-400"}`}
                  >
                    <Shuffle size={16} strokeWidth={isShuffle ? 2.5 : 2} />
                  </button>

                  {/* Prev Button (Visually disabled if on the first song and shuffle/repeat are off) */}
                  <button
                    disabled={isFirstSong && !isShuffle && !isRepeat}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className={`p-1 text-gray-700 active:scale-90 transition-all ${
                      isFirstSong && !isShuffle && !isRepeat
                        ? "opacity-30 cursor-not-allowed"
                        : "opacity-100"
                    }`}
                  >
                    <SkipBack size={18} fill="currentColor" />
                  </button>

                  {/* Play Button - Passes loop target index to fix fallback errors */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay(index);
                    }}
                    className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-gray-800 active:scale-95 transition-transform border border-gray-50"
                  >
                    {isPlaying && isActive ? (
                      <Pause size={16} fill="currentColor" />
                    ) : (
                      <Play size={16} fill="currentColor" className="ml-0.5" />
                    )}
                  </button>

                  {/* Next Button (Visually disabled if on the last song and shuffle/repeat are off) */}
                  <button
                    disabled={isLastSong && !isShuffle && !isRepeat}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className={`p-1 text-gray-700 active:scale-90 transition-all ${
                      isLastSong && !isShuffle && !isRepeat
                        ? "opacity-30 cursor-not-allowed"
                        : "opacity-100"
                    }`}
                  >
                    <SkipForward size={18} fill="currentColor" />
                  </button>

                  {/* Repeat */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsRepeat(!isRepeat);
                    }}
                    className={`p-1 transition-colors ${isRepeat ? "text-[#D1197E]" : "text-gray-400"}`}
                  >
                    <Repeat size={16} strokeWidth={isRepeat ? 2.5 : 2} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <div className="flex-none w-[6%]" />
      </div>
    </div>
  );
};

export default DailyMantras;
