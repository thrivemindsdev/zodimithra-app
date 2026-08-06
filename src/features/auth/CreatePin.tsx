import Logo from "@/assets/splash/zodimithra.gif";
import ZodiMithra from "@/assets/splash/ZODIMITHRA.png";
import ToastModal from "@/components/common/ToastModal";
import { useToastModal } from "@/hooks/useToastModal";
import { CreatePinApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function CreatePin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { phoneNumber } = useAuthStore();
  const { toastState, showSuccess, showError, hideToast } = useToastModal();

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation Rules
  const isFourDigits = /^\d{4}$/.test(pin);
  const pinsMatch = pin.length === 4 && pin === confirmPin;
  const isFormValid = isFourDigits && pinsMatch;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await CreatePinApi({
        phone: phoneNumber,
        password: pin,
      });

      if (response.status === 200 || response.status === 201) {
        showSuccess(
          t("auth.pinCreatedSuccess", "PIN Created Successfully"),
          t(
            "auth.pinCreatedDesc",
            "Your 4-digit PIN has been set up successfully!",
          ),
          t("common.continue", "Continue"),
          () => navigate("/birth-details-form"),
        );
      }
    } catch (error) {
      console.error("Create PIN Error:", error);
      showError(
        t("common.error", "Error"),
        t("auth.createPinError", "Failed to create PIN. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
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
            {t("auth.createPin", "Create 4-Digit PIN")}
          </h2>
          <p className="mt-1 font-body text-center text-sm text-text-secondary">
            {t(
              "auth.createPinDesc",
              "Set a 4-digit PIN for quick access to your account.",
            )}
          </p>
        </div>

        {/* Form Section */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* New PIN Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("auth.enterPin", "Enter 4-Digit PIN")}
              </label>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                aria-label={showPin ? "Hide PIN" : "Show PIN"}
              >
                {showPin ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span>{t("common.hide", "Hide")}</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    <span>{t("common.show", "Show")}</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex justify-center">
              <OTPInput
                maxLength={4}
                value={pin}
                onChange={(val) => setPin(val.replace(/\D/g, ""))}
                pattern={REGEXP_ONLY_DIGITS}
                containerClassName="group flex items-center gap-3"
                autoFocus
                render={({ slots }) => (
                  <div className="flex gap-3">
                    {slots.map((slot, index) => (
                      <div
                        key={index}
                        className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-xl font-bold border rounded-xl transition-all outline-none ${
                          slot.isActive
                            ? "bg-white border-primary ring-2 ring-indigo-100"
                            : "bg-gray-50 border-gray-300"
                        }`}
                      >
                        {slot.char ? (
                          showPin ? (
                            <span className="text-gray-900">{slot.char}</span>
                          ) : (
                            <span className="h-3 w-3 rounded-full bg-gray-900" />
                          )
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Confirm PIN Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("auth.confirmPin", "Confirm 4-Digit PIN")}
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPin(!showConfirmPin)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                aria-label={showConfirmPin ? "Hide PIN" : "Show PIN"}
              >
                {showConfirmPin ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span>{t("common.hide", "Hide")}</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    <span>{t("common.show", "Show")}</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex justify-center">
              <OTPInput
                maxLength={4}
                value={confirmPin}
                onChange={(val) => setConfirmPin(val.replace(/\D/g, ""))}
                pattern={REGEXP_ONLY_DIGITS}
                containerClassName="group flex items-center gap-3"
                render={({ slots }) => (
                  <div className="flex gap-3">
                    {slots.map((slot, index) => (
                      <div
                        key={index}
                        className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-xl font-bold border rounded-xl transition-all outline-none ${
                          slot.isActive
                            ? "bg-white border-primary ring-2 ring-indigo-100"
                            : "bg-gray-50 border-gray-300"
                        }`}
                      >
                        {slot.char ? (
                          showConfirmPin ? (
                            <span className="text-gray-900">{slot.char}</span>
                          ) : (
                            <span className="h-3 w-3 rounded-full bg-gray-900" />
                          )
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Real-time Validation Checklist */}
          <div className="rounded-lg bg-white p-4 border border-gray-100 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {t("auth.pinRequirements", "PIN Requirements")}
            </p>
            <ValidationRule
              label={t("auth.reqDigits", "Exactly 4 numeric digits")}
              isValid={isFourDigits}
            />
            <ValidationRule
              label={t("auth.reqMatch", "PINs match")}
              isValid={pinsMatch}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold leading-6 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
            >
              {isSubmitting
                ? t("auth.submitting", "Submitting...")
                : t("auth.submit", "Submit")}
            </button>
          </div>
        </form>
      </div>

      <ToastModal
        isOpen={toastState.isOpen}
        status={toastState.status}
        title={toastState.title}
        description={toastState.description}
        buttonText={toastState.buttonText}
        onDone={hideToast}
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
