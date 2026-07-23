import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep cached data for 5 minutes
      staleTime: 1000 * 60 * 5,

      // Retry failed requests twice
      retry: 2,

      // Refetch when window gets focus
      refetchOnWindowFocus: false,
    },

    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});