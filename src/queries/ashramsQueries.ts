import {
  getAshramamById,
  getAshramamLive,
  getAshramamLiveSessionByID,
  getAshramams,
} from "@/services/ashrams.api";
import { useQuery } from "@tanstack/react-query";

export const ASHRAMS_QUERY_KEYS = {
  liveSessions: "live-sesions",
  ashrams: "ashrams",
  ashramById: "ashram-id",
  liveSessionId: "live-session-id",
};

export const useGetAshramamLiveQuery = () => {
  return useQuery({
    queryKey: [ASHRAMS_QUERY_KEYS.liveSessions],
    queryFn: getAshramamLive,
    refetchOnWindowFocus: true,
    refetchInterval: 15 * 1000, // 15 seconds
    staleTime: 15 * 1000, // Optional: data stays fresh for 15 seconds
  });
};

export const useGetAshramamsQuery = () => {
  return useQuery({
    queryKey: [ASHRAMS_QUERY_KEYS.ashrams],
    queryFn: getAshramams,
  });
};

export const useGetAshramamByIdQuery = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: [ASHRAMS_QUERY_KEYS.ashramById, id],
    queryFn: () => getAshramamById({ id }),
  });
};

export const useGetAshramamLiveSessionByIDQuery = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: [ASHRAMS_QUERY_KEYS.liveSessionId, id],
    queryFn: () => getAshramamLiveSessionByID({ id }),
  });
};
