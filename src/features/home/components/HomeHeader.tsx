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
import { useNavigate } from "react-router-dom";

const HomeHeader = ({ data }: any) => {
  const navigate = useNavigate();
  
  const userInitial = data?.name ? data.name.charAt(0).toUpperCase() : "?";

  return (
    <header className="z-50 flex items-center justify-between bg-white pb-4">
      {/* Clickable Avatar Container */}
      <button
        type="button"
        aria-label="View Profile"
        onClick={() => navigate("/profile")}
        className="relative flex h-12 w-12 shrink-0 items-center justify-between overflow-hidden rounded-full shadow-sm bg-black"
      >
        {data?.image_url ? (
          <img
            src={data?.image_url}
            alt={`${data?.name || 'User'}'s avatar`}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full font-body-content items-center justify-center font-extrabold text-white text-lg">
            {userInitial}
          </div>
        )}
      </button>

      {/* Right Actions */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-md p-2 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <Bell className="h-6 w-6 text-black" strokeWidth={1.8} />
        </button>

        <button
          type="button"
          aria-label="Language"
          onClick={() => navigate('/languages')}
          className="rounded-md p-2 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <Languages className="h-6 w-6 text-black" strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
};

export default memo(HomeHeader);