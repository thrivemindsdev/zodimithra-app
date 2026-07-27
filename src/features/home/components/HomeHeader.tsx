// // components/HomeHeader.tsx

// import { memo, useCallback, useState } from "react";
// import MemberAvatar, { members } from "./MemberAvatar";
// import AddMemberButton from "./AddMemberButton";

// interface Props {
//   userName: string;
//   date: string;
//   profileImage: string;
// }

// const HomeHeader = ({ userName, date, profileImage }: Props) => {
//   const [selectedMemberId, setSelectedMemberId] = useState(1);

//   const handleSelectMember = useCallback((id: number) => {
//     setSelectedMemberId(id);
//   }, []);
//   return (
//     <>
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm text-text-secondary font-body">{date}</p>

//           <h3 className="mt-1 text-lg font-light font-header text-text-primary">
//             Good Morning <span className="text-text-gold">{userName}</span>,
//           </h3>
//         </div>

//         <img
//           src={profileImage}
//           alt={userName}
//           loading="lazy"
//           className="h-14 w-14 rounded-full object-cover ring-4 ring-emerald-100 shadow-md"
//         />
//       </div>

//       <div className="p-2 flex items-center gap-5 overflow-x-auto whitespace-nowrap">
//         {members.map((member) => (
//           <MemberAvatar
//             key={member.id}
//             member={member}
//             active={member.id === selectedMemberId}
//             onClick={handleSelectMember}
//           />
//         ))}

//         <AddMemberButton />
//       </div>
//     </>
//   );
// };

// export default memo(HomeHeader);

import { Bell, Languages } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface HomeHeaderProps {
  loading?: boolean;
  data?: {
    name?: string;
    image_url?: string;
  };
}

const HomeHeader = ({ loading, data }: HomeHeaderProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const userInitial = data?.name ? data.name.charAt(0).toUpperCase() : "?";

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
          className="relative flex h-12 w-12 shrink-0 items-center justify-between overflow-hidden rounded-full bg-black shadow-sm"
        >
          {data?.image_url ? (
            <img
              src={data?.image_url}
              alt={`${data?.name || "User"}'s avatar`}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-body-content text-lg font-extrabold text-white">
              {userInitial}
            </div>
          )}
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
            className="rounded-md p-2 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <Bell className="h-6 w-6 text-black" strokeWidth={1.8} />
          </button>

          {/* Language Button */}
          <button
            type="button"
            aria-label="Language"
            onClick={() => navigate("/languages")}
            className="rounded-md p-2 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <Languages className="h-6 w-6 text-black" strokeWidth={1.8} />
          </button>
        </div>
      )}
    </header>
  );
};

export default memo(HomeHeader);
