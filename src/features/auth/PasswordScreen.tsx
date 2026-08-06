import Logo from "@/assets/splash/zodimithra.gif";
import ZodiMithra from "@/assets/splash/ZODIMITHRA.png";
import ToastModal from "@/components/common/ToastModal";
import { useToastModal } from "@/hooks/useToastModal";
import { VerifyPasswordApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function PasswordScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { phoneNumber, setToken, setIsLoggedIn } = useAuthStore();
  const { toastState, showSuccess, showError, hideToast } = useToastModal();

  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pin.length !== 4 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await VerifyPasswordApi({
        phone: phoneNumber,
        password: pin,
      });

      if (response?.status === 200) {
        setToken(response.data.token);
        if (response?.data?.on_boarding) {
          showSuccess(
            t("auth.loginSuccess", "Login Successful"),
            t("auth.loginSuccessDesc", "You have been logged in successfully!"),
            t("common.continue", "Continue"),
            () => {
              setIsLoggedIn(true);
              navigate("/home");
            },
          );
        } else {
          navigate("/birth-details-form");
        }
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        showError(
          t("auth.invalidPin", "Invalid PIN"),
          t(
            "auth.invalidPinDesc",
            "The PIN you entered is incorrect. Please try again.",
          ),
        );
      } else {
        showError(
          t("common.error", "Error"),
          t(
            "auth.verifyPinError",
            "Unable to verify PIN. Please try again later.",
          ),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-t from-[#DEEBFF] via-[#FFF8E2] to-[#FFEEDE] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100 relative">
        {/* Header / Logo Section */}
        <div className="flex flex-col items-center pt-2">
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
            {t("auth.welcomeBack", "Welcome Back")}
          </h2>
          <p className="mt-1 font-body text-center text-sm text-text-secondary">
            {phoneNumber
              ? `${t("auth.enterPinFor", "Enter 4-digit PIN for")} ${phoneNumber}`
              : t("auth.enterPinPrompt", "Enter your 4-digit PIN to sign in.")}
          </p>
        </div>

        {/* Form Section */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* PIN Input Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-gray-400 shrink-0" />
                <span>{t("auth.fourDigitPin", "4-Digit PIN")}</span>
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

          {/* Forgot PIN Link */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => navigate("/forgot-pin")}
              className="text-xs font-semibold text-primary hover:underline focus:outline-none"
            >
              {t("auth.forgotPin", "Forgot PIN?")}
            </button>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={pin.length !== 4 || isSubmitting}
              className="flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold leading-6 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
            >
              {isSubmitting
                ? t("auth.signingIn", "Signing in...")
                : t("auth.login", "Login")}
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
