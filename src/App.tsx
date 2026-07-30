import { AppRoutes } from "@/routes/AppRoutes";
import { useEffect, useState } from "react";
import { UpdateModal } from "./components/common/UpdateModal";
import { OfflineScreen } from "./components/common/OfflineScreen";
import { useVersionCheck } from "./hooks/useVersionCheck";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import { QueryProvider } from "./providers/QueryProvider";
import { useAuthStore } from "./store/authStore";
import { Capacitor } from "@capacitor/core";

function App() {
  const { appInfo, isOutdated, isChecking } = useVersionCheck();
  const { isOnline, isChecking: isCheckingNetwork, checkConnection } = useNetworkStatus();
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

  // 1. Show Offline Screen if device has no internet connection
  if (!isOnline) {
    return (
      <OfflineScreen
        onRetry={checkConnection}
        isRetrying={isCheckingNetwork}
      />
    );
  }

  // 2. Wait for hydration and version verification to finish
  if (!isHydrated || isChecking) {
    return null;
  }

  // 3. FORCE UPDATE: Unmount entire app tree and show ONLY the modal
  if (isOutdated && Capacitor.getPlatform() !== "web") {
    return (
      <UpdateModal
        appName={appInfo.name}
        currentVersion={appInfo.version}
        currentBuild={appInfo.build}
      />
    );
  }

  // 4. Normal App Execution
  return (
    <QueryProvider>
      <AppRoutes />
    </QueryProvider>
  );
}

export default App;
