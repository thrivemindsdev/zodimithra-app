import {
  getMantraCategoryById,
  getMantras,
  getMantrasCategory,
} from "@/services/mantras.api";
import { getMillisecondsUntilTomorrow } from "@/utils/time-utils";
import { useQuery } from "@tanstack/react-query";

export const MANTRAS_QUERY_KEYS = {
  mantras: "mantras",
  mantrasCategories: "mantras-categories",
  mantraCategory: "mantra-category",
};

export const useGetMantrasQuery = () => {
  return useQuery({
    queryKey: [MANTRAS_QUERY_KEYS.mantras],
    queryFn: getMantras,
    staleTime: getMillisecondsUntilTomorrow(),
    gcTime: 24 * 60 * 60 * 1000, // Keep cache for 1 day
  });
};

export const useGetMantrasCategoriesQuery = () => {
  return useQuery({
    queryKey: [MANTRAS_QUERY_KEYS.mantrasCategories],
    queryFn: getMantrasCategory,
    staleTime: getMillisecondsUntilTomorrow(),
    gcTime: 24 * 60 * 60 * 1000,
  });
};

export const useGetMantraCategoryByIdQuery = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: [MANTRAS_QUERY_KEYS.mantraCategory, id],
    queryFn: () => getMantraCategoryById({ id }),
    staleTime: getMillisecondsUntilTomorrow(),
    gcTime: 24 * 60 * 60 * 1000,
    enabled: !!id,
  });
};
