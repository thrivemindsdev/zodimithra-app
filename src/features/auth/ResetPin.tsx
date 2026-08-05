import Logo from "@/assets/splash/zodimithra.gif";
import ZodiMithra from "@/assets/splash/ZODIMITHRA.png";
import ToastModal from "@/components/common/ToastModal";
import { CreatePinApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPin() {
  const navigate = useNavigate();
  const { phoneNumber, setToken, setIsLoggedIn } = useAuthStore();

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: boolean;
    title: string;
    description: string;
  }>({
    isOpen: false,
    status: true,
    title: "",
    description: "",
  });

  // Validation Rules
  const isFourDigits = /^\d{4}$/.test(pin);
  const pinsMatch = pin.length === 4 && pin === confirmPin;

  const isFormValid = isFourDigits && pinsMatch;

  // Input Sanitizer: Allows only numeric input up to 4 digits
  const handlePinChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    setter(numericValue);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      const response = await CreatePinApi({
        phone: phoneNumber,
        password: pin, // Passing PIN as the credential parameter
      });
      if (response.status === 200 || response.status === 201) {
        setToken(response.data.token);
        if (response?.data?.on_boarding) {
          setModalState({
            isOpen: true,
            status: true,
            title: "PIN Reset Successfully",
            description: "Your PIN has been reset successfully!",
          });
        } else {
          setIsLoggedIn(false);
          navigate("/birth-details-form");
        }
      }
    } catch (error) {
      console.error("Reset PIN Error:", error);
      setModalState({
        isOpen: true,
        status: false,
        title: "Error",
        description: "Failed to reset PIN. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    if (modalState.status) {
      setIsLoggedIn(true);
      navigate("/home");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-t from-[#DEEBFF] via-[#FFF8E2] to-[#FFEEDE] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100">
        {/* Header / Logo Section */}
        <div className="flex flex-col items-center">
          <img
            src={Logo}
            alt="Zodimithra Logo"
            className="mx-auto w-1/2 max-w-xs"
            loading="eager"
          />
          <img
            src={ZodiMithra}
            alt="Zodimithra"
            className="mx-auto w-1/2 max-w-xs"
          />
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Reset 4-Digit PIN
          </h2>
          <p className="mt-1 font-body text-center text-sm text-text-secondary">
            Set a 4-digit PIN for quick access to your account.
          </p>
        </div>

        {/* Form Section */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* New PIN Input */}
          <div>
            <label
              htmlFor="new-pin"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter 4-Digit PIN
            </label>
            <div className="relative rounded-lg border border-input-border px-4 py-3 bg-input-bg flex items-center transition-all">
              <input
                id="new-pin"
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={4}
                placeholder="Enter 4-digit PIN"
                value={pin}
                onChange={(e) => handlePinChange(e.target.value, setPin)}
                required
                className="w-full bg-transparent border-0 p-0 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0 tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPin ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm PIN Input */}
          <div>
            <label
              htmlFor="confirm-pin"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm 4-Digit PIN
            </label>
            <div className="relative rounded-lg border border-input-border px-4 py-3 bg-input-bg flex items-center transition-all">
              <input
                id="confirm-pin"
                type={showConfirmPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={4}
                placeholder="Confirm 4-digit PIN"
                value={confirmPin}
                onChange={(e) => handlePinChange(e.target.value, setConfirmPin)}
                required
                className="w-full bg-transparent border-0 p-0 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0 tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPin(!showConfirmPin)}
                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPin ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Real-time Validation Checklist */}
          <div className="rounded-lg bg-white p-4 border border-gray-100 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              PIN Requirements
            </p>
            <ValidationRule
              label="Exactly 4 numeric digits"
              isValid={isFourDigits}
            />
            <ValidationRule label="PINs match" isValid={pinsMatch} />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold leading-6 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
      <ToastModal
        isOpen={modalState.isOpen}
        status={modalState.status}
        title={modalState.title}
        description={modalState.description}
        buttonText="Continue"
        onDone={handleDone}
      />
    </div>
  );
}

// Sub-component for checklist rules
interface ValidationRuleProps {
  label: string;
  isValid: boolean;
}

function ValidationRule({ label, isValid }: ValidationRuleProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-4 w-4 items-center justify-center rounded-full transition-colors ${
          isValid ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-400"
        }`}
      >
        {isValid ? (
          <Check className="h-3 w-3 stroke-3" />
        ) : (
          <X className="h-3 w-3 stroke-3" />
        )}
      </div>
      <span
        className={`text-xs ${
          isValid ? "font-medium text-gray-800" : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
