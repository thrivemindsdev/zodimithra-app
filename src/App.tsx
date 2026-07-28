import { AppRoutes } from "@/routes/AppRoutes";
import { useEffect, useState } from "react";
import { UpdateModal } from "./components/common/UpdateModal";
import { useVersionCheck } from "./hooks/useVersionCheck";
import { QueryProvider } from "./providers/QueryProvider";
import { useAuthStore } from "./store/authStore";

function App() {
  const { appInfo, isOutdated, isChecking } = useVersionCheck();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const unsubHydrate = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return () => unsubHydrate();
  }, []);

  // 1. Wait for hydration and version verification to finish
  if (!isHydrated || isChecking) {
    return null; // Or your native splash screen
  }

  // 2. FORCE UPDATE: Unmount entire app tree and show ONLY the modal
  if (isOutdated) {
    return (
      <UpdateModal
        appName={appInfo.name}
        currentVersion={appInfo.version}
        currentBuild={appInfo.build}
      />
    );
  }

  // 3. Normal App Execution
  return (
    <QueryProvider>
      <AppRoutes />
    </QueryProvider>
  );
}

export default App;
