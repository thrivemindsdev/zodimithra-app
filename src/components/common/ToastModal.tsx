import type { ToastStatus } from "@/types/auth";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useEffect } from "react";

export interface ToastModalProps {
  isOpen: boolean;
  status: ToastStatus;
  title?: string;
  description?: string;
  buttonText?: string;
  onDone: () => void;
  autoCloseDuration?: number; // Optional auto-close timer in ms
}

export default function ToastModal({
  isOpen,
  status,
  title,
  description,
  buttonText = "Done",
  onDone,
  autoCloseDuration,
}: ToastModalProps) {
  // Auto close timer if specified
  useEffect(() => {
    if (!isOpen || !autoCloseDuration) return;
    const timer = setTimeout(() => {
      onDone();
    }, autoCloseDuration);
    return () => clearTimeout(timer);
  }, [isOpen, autoCloseDuration, onDone]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onDone();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onDone]);

  if (!isOpen) return null;

  // Determine variant string
  const variant: "success" | "error" | "warning" | "info" =
    typeof status === "boolean" ? (status ? "success" : "error") : status;

  // Status-based styles & icons configuration
  const config = {
    success: {
      bgIcon: "bg-emerald-100 text-emerald-600",
      icon: CheckCircle2,
      btn: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500",
    },
    error: {
      bgIcon: "bg-rose-100 text-rose-600",
      icon: XCircle,
      btn: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500",
    },
    warning: {
      bgIcon: "bg-amber-100 text-amber-600",
      icon: AlertTriangle,
      btn: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
    },
    info: {
      bgIcon: "bg-sky-100 text-sky-600",
      icon: Info,
      btn: "bg-sky-600 hover:bg-sky-700 focus:ring-sky-500",
    },
  }[variant];

  const IconComponent = config.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="toast-modal-title"
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onDone} // Close when clicking backdrop
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-white p-6 sm:p-8 shadow-2xl transition-all scale-100 animate-in zoom-in-95 duration-200 border border-gray-100"
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        {/* Close Icon Button in Top Right */}
        <button
          type="button"
          onClick={onDone}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Status Icon */}
        <div className="flex justify-center">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full shadow-inner ${config.bgIcon}`}
          >
            <IconComponent className="h-12 w-12" />
          </div>
        </div>

        {/* Title */}
        {title && (
          <h2
            id="toast-modal-title"
            className="mt-6 text-center text-xl font-bold text-gray-900 tracking-tight"
          >
            {title}
          </h2>
        )}

        {/* Description */}
        {description && (
          <p className="mt-3 text-center text-sm leading-relaxed text-gray-600">
            {description}
          </p>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={onDone}
          className={`mt-6 w-full rounded-xl py-3 font-semibold text-white transition shadow-md active:scale-98 focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.btn}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
