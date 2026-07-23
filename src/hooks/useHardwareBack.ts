import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';

interface UseHardwareBackOptions {
  /** Target route path to navigate to when back is pressed (e.g., '/home') */
  route?: string;
  /** Custom callback action to execute (e.g., () => setIsModalOpen(false)) */
  action?: () => void;
  /** Whether this back handler is currently enabled. Defaults to true. */
  enabled?: boolean;
}

/**
 * Custom hook to override Android hardware back button behavior.
 * Evaluates `action` first (if provided), then `route`, falling back to standard history navigation.
 */
export const useHardwareBack = ({
  route,
  action,
  enabled = true,
}: UseHardwareBackOptions) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!enabled) return;

    const listenerPromise = CapacitorApp.addListener('backButton', () => {
      if (action) {
        // Priority 1: Execute custom function (e.g., close modal)
        action();
      } else if (route) {
        // Priority 2: Navigate to explicit route
        navigate(route, { replace: true });
      } else {
        // Priority 3: Fallback to regular back navigation
        navigate(-1);
      }
    });

    return () => {
      listenerPromise.then((handle) => handle.remove());
    };
  }, [action, route, enabled, navigate]);
};