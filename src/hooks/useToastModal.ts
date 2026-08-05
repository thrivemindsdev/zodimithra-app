import type { ToastState, ToastStatus } from "@/types/auth";
import { useCallback, useState } from "react";

export function useToastModal() {
  const [toastState, setToastState] = useState<ToastState>({
    isOpen: false,
    status: true,
    title: "",
    description: "",
    buttonText: "Close",
  });

  const showToast = useCallback(
    (
      title: string,
      description: string,
      status: ToastStatus = true,
      buttonText: string = "Close",
      onDone?: () => void,
    ) => {
      setToastState({
        isOpen: true,
        status,
        title,
        description,
        buttonText,
        onDone,
      });
    },
    [],
  );

  const showSuccess = useCallback(
    (
      title: string,
      description: string,
      buttonText: string = "Continue",
      onDone?: () => void,
    ) => {
      showToast(title, description, "success", buttonText, onDone);
    },
    [showToast],
  );

  const showError = useCallback(
    (
      title: string,
      description: string,
      buttonText: string = "Close",
      onDone?: () => void,
    ) => {
      showToast(title, description, "error", buttonText, onDone);
    },
    [showToast],
  );

  const hideToast = useCallback(() => {
    setToastState((prev) => {
      if (prev.onDone) {
        prev.onDone();
      }
      return { ...prev, isOpen: false };
    });
  }, []);

  return {
    toastState,
    showToast,
    showSuccess,
    showError,
    hideToast,
  };
}
