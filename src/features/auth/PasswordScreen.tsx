import Logo from "@/assets/splash/zodimithra.gif";
import ZodiMithra from "@/assets/splash/ZODIMITHRA.png";
import ToastModal from "@/components/common/ToastModal";
import { useToastModal } from "@/hooks/useToastModal";
import { VerifyPasswordApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
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

  const handlePinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Allow digits only
    if (value.length <= 4) {
      setPin(value);
    }
  };

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
      if (error.response.status === 400) {
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
            <label
              htmlFor="login-pin"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("auth.fourDigitPin", "4-Digit PIN")}
            </label>
            <div className="relative rounded-lg border border-input-border px-4 py-3 bg-input-bg flex items-center transition-all focus-within:ring-2 focus-within:ring-primary/20">
              <Lock className="h-4 w-4 text-gray-400 mr-2.5 shrink-0" />
              <input
                id="login-pin"
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                placeholder={t("auth.enterPin", "Enter 4-digit PIN")}
                value={pin}
                onChange={handlePinChange}
                autoComplete="current-password"
                required
                className="w-full bg-transparent border-0 p-0 text-sm tracking-widest text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0 placeholder:tracking-normal"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                aria-label={showPin ? "Hide PIN" : "Show PIN"}
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
