import { useQuery } from "@tanstack/react-query";
import { GetFamilyMembersApi, GetUserDetailsApi } from "@/services/user.api";
import { getMillisecondsUntilTomorrow } from "@/utils/time-utils";

export const USER_QUERY_KEYS = {
  userDetails: "get-user-details",
  familyMembers: "family-members",
};

export const useGetUserDetailsQuery = () => {
  return useQuery({
    queryKey: [USER_QUERY_KEYS.userDetails],
    queryFn: GetUserDetailsApi,
    staleTime: getMillisecondsUntilTomorrow(),
    gcTime: 24 * 60 * 60 * 1000, // Keep cache for 1 day
  });
};

export const useGetFamilyMembersQuery = () => {
  return useQuery({
    queryKey: [USER_QUERY_KEYS.familyMembers],
    queryFn: GetFamilyMembersApi,
    staleTime: getMillisecondsUntilTomorrow(),
    gcTime: 24 * 60 * 60 * 1000, // Keep cache for 1 day
  });
};
