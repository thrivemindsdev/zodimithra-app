import { CheckCircle2, XCircle } from "lucide-react";

type PaymentStatus = "success" | "failed";

interface PaymentStatusModalProps {
  isOpen: boolean;
  status: PaymentStatus;
  title?: string;
  description?: string;
  buttonText?: string;
  onDone: () => void;
}

export default function PaymentStatusModal({
  isOpen,
  status,
  title,
  description,
  buttonText = "Done",
  onDone,
}: PaymentStatusModalProps) {
  if (!isOpen) return null;

  const isSuccess = status === "success";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex justify-center">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full ${
              isSuccess ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            ) : (
              <XCircle className="h-12 w-12 text-red-600" />
            )}
          </div>
        </div>

        <h2 className="mt-6 text-center text-2xl font-semibold">
          {title ?? (isSuccess ? "Payment Successful" : "Payment Failed")}
        </h2>

        <p className="mt-3 text-center text-gray-500">
          {description ??
            (isSuccess
              ? "Your subscription has been activated successfully."
              : "Your payment could not be completed. Please try again.")}
        </p>

        <button
          onClick={onDone}
          className={`mt-8 w-full rounded-full py-3 font-medium text-white transition ${
            isSuccess
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
