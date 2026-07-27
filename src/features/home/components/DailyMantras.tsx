// import React, { useState, useEffect, useRef } from "react";
// import {
//   Play,
//   Pause,
//   SkipBack,
//   SkipForward,
//   Shuffle,
//   Repeat,
// } from "lucide-react";
// import { useTranslation } from "react-i18next";

// interface Mantra {
//   id: string;
//   title: string;
//   subtitle: string;
//   coverUrl: string;
//   audioUrl: string;
// }

// const DUMMY_MANTRAS: Mantra[] = [
//   {
//     id: "1",
//     title: "🕉️ Peace Mantra",
//     subtitle: "Ancient Vedic Chant",
//     coverUrl:
//       "https://images.unsplash.com/photo-1602192103300-47e66756152e?w=300&auto=format&fit=crop&q=80",
//     audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
//   },
//   {
//     id: "2",
//     title: "🕉️ Shiva Tandava",
//     subtitle: "Energy & Power Stotram",
//     coverUrl:
//       "https://images.unsplash.com/photo-1545128485-c400e7702796?w=300&auto=format&fit=crop&q=80",
//     audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
//   },
//   {
//     id: "3",
//     title: "🕉️ Gayatri Mantra",
//     subtitle: "Wisdom & Enlightenment",
//     coverUrl:
//       "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&auto=format&fit=crop&q=80",
//     audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
//   },
// ];

// const DailyMantras: React.FC = () => {
//   const { t } = useTranslation();
//   const [currentIndex, setCurrentIndex] = useState<number>(0);
//   const [isPlaying, setIsPlaying] = useState<boolean>(false);
//   const [currentTime, setCurrentTime] = useState<number>(0);
//   const [duration, setDuration] = useState<number>(0);
//   const [isShuffle, setIsShuffle] = useState<boolean>(false);
//   const [isRepeat, setIsRepeat] = useState<boolean>(false);

//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const scrollRef = useRef<HTMLDivElement | null>(null);

//   const currentMantra = DUMMY_MANTRAS[currentIndex];

//   // Boundary condition checks for UI states
//   const isFirstSong = currentIndex === 0;
//   const isLastSong = currentIndex === DUMMY_MANTRAS.length - 1;

//   useEffect(() => {
//     if (audioRef.current) {
//       audioRef.current.load();
//       if (isPlaying) {
//         audioRef.current
//           .play()
//           .catch((err) => console.log("Playback error:", err));
//       }
//     }
//   }, [currentIndex]);

//   const onTimeUpdate = () => {
//     if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
//   };

//   const onLoadedMetadata = () => {
//     if (audioRef.current) setDuration(audioRef.current.duration);
//   };

//   const onAudioEnded = () => {
//     if (isRepeat) {
//       if (audioRef.current) {
//         audioRef.current.currentTime = 0;
//         audioRef.current.play();
//       }
//     } else {
//       handleNext();
//     }
//   };

//   // Explicit Play/Pause action tied correctly to target element selection
//   const togglePlay = (targetIndex: number) => {
//     if (!audioRef.current) return;

//     if (targetIndex !== currentIndex) {
//       setCurrentIndex(targetIndex);
//       setIsPlaying(true);
//       scrollToCard(targetIndex);
//       return;
//     }

//     if (isPlaying) {
//       audioRef.current.pause();
//     } else {
//       audioRef.current.play().catch((err) => console.log(err));
//     }
//     setIsPlaying(!isPlaying);
//   };

//   const handleNext = () => {
//     if (isShuffle) {
//       const randomIndex = Math.floor(Math.random() * DUMMY_MANTRAS.length);
//       setCurrentIndex(randomIndex);
//       scrollToCard(randomIndex);
//     } else if (!isLastSong) {
//       const nextIndex = currentIndex + 1;
//       setCurrentIndex(nextIndex);
//       scrollToCard(nextIndex);
//     } else if (isRepeat || isLastSong) {
//       // Loop back to start if explicit loop is expected, otherwise do nothing
//       setCurrentIndex(0);
//       scrollToCard(0);
//     }
//   };

//   const handlePrev = () => {
//     if (!isFirstSong) {
//       const prevIndex = currentIndex - 1;
//       setCurrentIndex(prevIndex);
//       scrollToCard(prevIndex);
//     } else {
//       setCurrentIndex(DUMMY_MANTRAS.length - 1);
//       scrollToCard(DUMMY_MANTRAS.length - 1);
//     }
//   };

//   const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!audioRef.current || duration === 0) return;
//     const rect = e.currentTarget.getBoundingClientRect();
//     const clickX = e.clientX - rect.left;
//     const newTime = (clickX / rect.width) * duration;
//     audioRef.current.currentTime = newTime;
//     setCurrentTime(newTime);
//   };

//   const scrollToCard = (index: number) => {
//     if (scrollRef.current) {
//       const containerWidth = scrollRef.current.clientWidth;
//       const cardElement = scrollRef.current.children[index] as HTMLElement;
//       if (cardElement) {
//         const offsetLeft =
//           cardElement.offsetLeft -
//           (containerWidth - cardElement.clientWidth) / 2;
//         scrollRef.current.scrollTo({
//           left: offsetLeft,
//           behavior: "smooth",
//         });
//       }
//     }
//   };

//   const formatTime = (time: number) => {
//     if (isNaN(time)) return "0:00";
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//   };

//   return (
//     <div className="w-full max-w-md mx-auto select-none">
//       <audio
//         ref={audioRef}
//         src={currentmantra?.audioUrl}
//         onTimeUpdate={onTimeUpdate}
//         onLoadedMetadata={onLoadedMetadata}
//         onEnded={onAudioEnded}
//       />

//       <h2 className="text-xl font-bold font-header text-linear capitalize mb-4 px-1">
//         {t("home.dailyMantras")}
//       </h2>

//       <div
//         ref={scrollRef}
//         className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-none pb-4"
//         style={{ WebkitOverflowScrolling: "touch" }}
//       >
//         {DUMMY_MANTRAS.map((mantra, index) => {
//           const isActive = index === currentIndex;

//           return (
//             <div
//               key={mantra?.id}
//               onClick={() => {
//                 if (!isActive) {
//                   setCurrentIndex(index);
//                   setIsPlaying(false);
//                   scrollToCard(index);
//                 }
//               }}
//               className={`flex-none w-[88%] snap-center rounded-3xl p-4 bg-[#F8F9FA] border border-gray-100/50 flex items-center shadow-sm transition-all duration-300 ${
//                 isActive
//                   ? "opacity-100 scale-100"
//                   : "opacity-60 scale-95 cursor-pointer"
//               }`}
//             >
//               <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 shadow-md border-2 border-white">
//                 <img
//                   src={mantra?.coverUrl}
//                   alt={mantra?.title}
//                   className={`w-full h-full object-cover object-center ${
//                     isActive && isPlaying
//                       ? "animate-spin [animation-duration:20s]"
//                       : ""
//                   }`}
//                 />
//               </div>

//               <div className="flex-1 pl-4 flex flex-col justify-center">
//                 <h4 className="text-base font-bold font-body text-gray-800 tracking-tight line-clamp-1">
//                   {mantra?.title}
//                 </h4>
//                 <p className="text-xs text-gray-400 font-body mb-3">
//                   {mantra?.subtitle}
//                 </p>

//                 <div
//                   className="w-full bg-[#EFECE6] h-1.5 rounded-full relative cursor-pointer mb-1"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     if (isActive) handleProgressBarClick(e);
//                   }}
//                 >
//                   <div
//                     className="bg-[#C59B63] h-full rounded-full transition-all duration-100 ease-linear"
//                     style={{
//                       width: `${isActive && duration ? (currentTime / duration) * 100 : 0}%`,
//                     }}
//                   />
//                 </div>

//                 <div className="flex justify-between text-[10px] text-gray-400 font-medium px-0.5 mb-2">
//                   <span>{isActive ? formatTime(currentTime) : "0:00"}</span>
//                   <span>{isActive ? formatTime(duration) : "0:00"}</span>
//                 </div>

//                 <div className="flex items-center justify-between px-1">
//                   {/* Shuffle */}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setIsShuffle(!isShuffle);
//                     }}
//                     className={`p-1 transition-colors ${isShuffle ? "text-[#D1197E]" : "text-gray-400"}`}
//                   >
//                     <Shuffle size={16} strokeWidth={isShuffle ? 2.5 : 2} />
//                   </button>

//                   {/* Prev Button (Visually disabled if on the first song and shuffle/repeat are off) */}
//                   <button
//                     disabled={isFirstSong && !isShuffle && !isRepeat}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handlePrev();
//                     }}
//                     className={`p-1 text-gray-700 active:scale-90 transition-all ${
//                       isFirstSong && !isShuffle && !isRepeat
//                         ? "opacity-30 cursor-not-allowed"
//                         : "opacity-100"
//                     }`}
//                   >
//                     <SkipBack size={18} fill="currentColor" />
//                   </button>

//                   {/* Play Button - Passes loop target index to fix fallback errors */}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       togglePlay(index);
//                     }}
//                     className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-gray-800 active:scale-95 transition-transform border border-gray-50"
//                   >
//                     {isPlaying && isActive ? (
//                       <Pause size={16} fill="currentColor" />
//                     ) : (
//                       <Play size={16} fill="currentColor" className="ml-0.5" />
//                     )}
//                   </button>

//                   {/* Next Button (Visually disabled if on the last song and shuffle/repeat are off) */}
//                   <button
//                     disabled={isLastSong && !isShuffle && !isRepeat}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleNext();
//                     }}
//                     className={`p-1 text-gray-700 active:scale-90 transition-all ${
//                       isLastSong && !isShuffle && !isRepeat
//                         ? "opacity-30 cursor-not-allowed"
//                         : "opacity-100"
//                     }`}
//                   >
//                     <SkipForward size={18} fill="currentColor" />
//                   </button>

//                   {/* Repeat */}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setIsRepeat(!isRepeat);
//                     }}
//                     className={`p-1 transition-colors ${isRepeat ? "text-[#D1197E]" : "text-gray-400"}`}
//                   >
//                     <Repeat size={16} strokeWidth={isRepeat ? 2.5 : 2} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//         <div className="flex-none w-[6%]" />
//       </div>
//     </div>
//   );
// };

// export default DailyMantras;

import { useGetDailyMantraQuery } from "@/queries/homeQueries";
import { Pause, Play } from "lucide-react";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const DailyMantras: React.FC = () => {
  const { t } = useTranslation();

  const { data: mantra, isLoading } = useGetDailyMantraQuery();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressContainerRef = useRef<HTMLDivElement | null>(null);

  const onTimeUpdate = () => {
    if (audioRef.current && !isDragging) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  // Automatically restart playback when the song ends
  const onAudioEnded = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => console.log("Replay error:", err));
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((err) => console.log("Playback error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const calculateSeekTime = (clientX: number) => {
    if (!progressContainerRef.current || duration === 0) return 0;
    const rect = progressContainerRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(offsetX, rect.width));
    return (clampedX / rect.width) * duration;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    const targetTime = calculateSeekTime(e.clientX);
    setCurrentTime(targetTime);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const targetTime = calculateSeekTime(e.clientX);
    setCurrentTime(targetTime);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    const targetTime = calculateSeekTime(e.clientX);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="mx-auto w-full max-w-md select-none">
      <audio
        ref={audioRef}
        src={mantra?.audio_url}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onAudioEnded}
      />

      <h2 className="button-text-gradient font-body-content pb-2 text-lg font-bold capitalize">
        {t("home.dailyMantras")}
      </h2>

      {isLoading ? (
        /* Skeleton Container matching exact card layout & gradient */
        <div className="flex items-center rounded-3xl rounded-t-4xl border-t-15 border-t-[#71B2FC] bg-linear-to-b from-[#ACCBEE] to-[#E7F0FD] p-4 shadow-sm">
          {/* Thumbnail Skeleton */}
          <div className="h-24 w-24 shrink-0 animate-pulse rounded-xl bg-white/40 shadow-md" />

          {/* Player Info Skeleton */}
          <div className="flex flex-1 flex-col justify-center pl-4">
            {/* Title Line */}
            <div className="h-5 w-3/4 animate-pulse rounded bg-white/40" />

            {/* Description Line */}
            <div className="mt-2.5 mb-3 h-3.5 w-1/2 animate-pulse rounded bg-white/30" />

            {/* Progress Bar Skeleton */}
            <div className="flex h-4 items-center">
              <div className="h-1.5 w-full animate-pulse rounded-full bg-white/40" />
            </div>

            {/* Time Stamp Row Skeleton */}
            <div className="flex justify-between pt-2">
              <div className="h-3 w-7 animate-pulse rounded bg-white/30" />
              <div className="h-3 w-7 animate-pulse rounded bg-white/30" />
            </div>
          </div>
        </div>
      ) : (
        /* Loaded Content */
        <div className="flex items-center rounded-3xl rounded-t-4xl border-t-15 border-t-[#71B2FC] bg-linear-to-b from-[#ACCBEE] to-[#E7F0FD] p-4 shadow-sm">
          {/* Thumbnail Container with Centered Play Button */}
          <div
            onClick={togglePlay}
            className="group relative h-24 w-24 shrink-0 cursor-pointer overflow-hidden rounded-xl shadow-md"
          >
            <img
              src={mantra?.thumbnail}
              alt={mantra?.title}
              className="h-full w-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />

            <button
              type="button"
              className="absolute inset-0 m-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#CFE1F7] text-black shadow-lg transition-transform active:scale-95 group-hover:scale-105"
            >
              {isPlaying ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" className="ml-0.5" />
              )}
            </button>
          </div>

          {/* Details & Interactive Progress Bar */}
          <div className="flex flex-1 flex-col justify-center pl-4">
            <h4 className="font-body-content text-text-primary line-clamp-1 text-sm font-bold tracking-tight">
              🕉️ {mantra?.title}
            </h4>
            <p className="font-body-content text-text-primary mb-3 text-xs">
              {mantra?.description}
            </p>

            <div
              ref={progressContainerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="relative flex h-4 w-full cursor-pointer touch-none items-center"
            >
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[#00000033]">
                <div
                  className="h-full rounded-full bg-black transition-all ease-out"
                  style={{
                    width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                  }}
                />
              </div>

              <div
                className={`absolute h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-black shadow-md pointer-events-none transition-transform ${
                  isDragging ? "scale-125" : "scale-100"
                }`}
                style={{
                  left: `${duration ? (currentTime / duration) * 100 : 0}%`,
                }}
              />
            </div>

            <div className="flex justify-between px-0.5 pt-2 text-xs font-medium text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyMantras;