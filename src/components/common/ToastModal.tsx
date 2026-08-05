import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface ToastModalProps {
  isOpen: boolean;
  status: boolean;
  title?: string;
  description?: string;
  buttonText?: string;
  onDone: () => void;
}

export default function ToastModal({
  isOpen,
  status,
  title,
  description,
  buttonText = "Done",
  onDone,
}: ToastModalProps) {
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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity"
      onClick={onDone} // Close when clicking backdrop
    >
      <div 
        className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl transition-all"
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        <div className="flex justify-center">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full ${
              status ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {status ? (
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            ) : (
              <XCircle className="h-12 w-12 text-red-600" />
            )}
          </div>
        </div>

        <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900">
          {title}
        </h2>

        {description && (
          <p className="mt-3 text-center text-gray-500">
            {description}
          </p>
        )}

        <button
          onClick={onDone}
          className={`mt-8 w-full rounded-full py-3 font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            status
              ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
              : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}