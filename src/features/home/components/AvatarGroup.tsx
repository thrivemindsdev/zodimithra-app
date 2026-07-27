import { useGetFamilyMembersQuery } from "@/queries/userQueries";
import { useActiveUserStore } from "@/store/useActiveUserStore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Updated type matching your actual API response structure
export interface FamilyMember {
  user_id?: number | string;
  id?: number | string;
  name?: string | null;
  image_url?: string | null;
  image?: string | null;
  [key: string]: any;
}

interface AvatarGroupProps {
  size?: "sm" | "md" | "lg";
  maxVisible?: number;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-base",
  lg: "w-16 h-16 text-xl",
};

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  size = "md",
  maxVisible = 5,
}) => {
  const navigate = useNavigate();
  const { clearActiveUser } = useActiveUserStore();
  const { data, isLoading } = useGetFamilyMembersQuery();
  const [imageErrors, setImageErrors] = useState<
    Record<string | number, boolean>
  >({});

  // 1. Extract array safely (Handles cases where API response wraps data in { data: [...] })
  const rawMembers = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];

  // 2. Filter valid objects
  const validUsers = rawMembers.filter(
    (u: any): u is FamilyMember => u !== null && u !== undefined,
  );

  const visibleUsers = validUsers.slice(0, maxVisible);
  const extraCount = validUsers.length - maxVisible;

  // Background color palette for initials
  const bgColors = [
    "bg-white text-black",
    "bg-gray-300 text-gray-800",
    "bg-gray-500 text-white",
    "bg-gray-700 text-white",
  ];

  const handleImageError = (key: string | number) => {
    setImageErrors((prev) => ({ ...prev, [key]: true }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center -space-x-4 animate-pulse">
        <div className={`rounded-full bg-gray-600 ${sizeClasses[size]}`} />
      </div>
    );
  }

  return (
    <div
      className="flex items-center -space-x-4 mt-3"
      onClick={() => {
        clearActiveUser();
        navigate("/family-members");
      }}
    >
      {visibleUsers.map((user: any, index: number) => {
        // Safe key assignment checking both `user_id` and `id`
        const userKey = user.user_id ?? user.id ?? index;

        // Extract initial or fallback to '?'
        const firstInitial = user.name?.trim()
          ? user.name.trim().charAt(0).toUpperCase()
          : "?";

        const fallbackBg = bgColors[index % bgColors.length];

        // Support both image_url and image props
        const imageUrl = user.image_url || user.image;
        const hasImageError = imageErrors[userKey];
        const showImage = imageUrl && !hasImageError;

        return (
          <div
            key={userKey}
            style={{ zIndex: visibleUsers.length - index }}
            className={`relative inline-flex items-center justify-center rounded-full font-bold border-2 border-slate-900 shadow-md overflow-hidden transition-transform hover:scale-105 ${sizeClasses[size]} ${fallbackBg}`}
            title={user.name || "User"}
          >
            {showImage ? (
              <img
                src={imageUrl}
                alt={user.name || "User Avatar"}
                className="w-full h-full object-cover"
                onError={() => handleImageError(userKey)}
              />
            ) : (
              <span>{firstInitial}</span>
            )}
          </div>
        );
      })}

      {/* Overflow Badge (+X extra users) */}
      {extraCount > 0 && (
        <div
          style={{ zIndex: 0 }}
          className={`relative inline-flex items-center justify-center rounded-full font-semibold bg-gray-800 text-white border-2 border-slate-900 shadow-md ${sizeClasses[size]}`}
        >
          +{extraCount}
        </div>
      )}
    </div>
  );
};
