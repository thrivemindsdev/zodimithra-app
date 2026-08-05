import Logo from "@/assets/splash/zodimithra.gif";
import ZodiMithra from "@/assets/splash/ZODIMITHRA.png";
import ToastModal from "@/components/common/ToastModal";
import { useHardwareBack } from "@/hooks/useHardwareBack";
import { useToastModal } from "@/hooks/useToastModal";
import { SendOtpApi, VerifyOtpApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function OtpScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  useHardwareBack({ route: "/login" });
  const { phoneNumber, setToken } = useAuthStore();
  const [otpValue, setOtpValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toastState, showSuccess, showError, hideToast } = useToastModal();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otpValue.length < 4 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await VerifyOtpApi({
        phone: phoneNumber,
        otp: otpValue,
      });

      if (response?.status === 201 || response?.status === 200) {
        setToken(response.data?.token);
        if (response?.data?.is_registered) {
          navigate("/reset-pin");
        } else {
          navigate("/create-pin");
        }
      }
    } catch (error: unknown) {
      const axiosErr = error as { response?: { status?: number } };
      if (axiosErr?.response?.status === 400) {
        showError(
          t("common.invalidOtp", "Invalid OTP"),
          t(
            "common.invalidOtpDesc",
            "The OTP you entered is incorrect. Please check the code and try again.",
          ),
        );
      } else {
        showError(
          t("common.networkError", "Network Error"),
          t(
            "common.networkErrorDesc",
            "Could not verify OTP. Please check your internet connection and try again.",
          ),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!phoneNumber) return;

    try {
      const response = await SendOtpApi({ phone: phoneNumber });
      if (response?.status === 200) {
        showSuccess(
          t("common.success", "Success"),
          t("auth.otpResent", "OTP resent successfully!"),
        );
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      showError(
        t("common.networkError", "Network Error"),
        t(
          "common.networkErrorDesc",
          "Unable to resend OTP. Please check your internet connection.",
        ),
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-t from-[#DEEBFF] via-[#FFF8E2] to-[#FFEEDE] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100">
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
          <p className="mt-3 font-body text-center text-sm text-text-secondary">
            {t("auth.sentOtpTo", "We sent a 4-digit code to")}{" "}
            <span className="font-semibold text-gray-900">{phoneNumber}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <OTPInput
              maxLength={4}
              value={otpValue}
              onChange={setOtpValue}
              pattern={REGEXP_ONLY_DIGITS}
              containerClassName="group flex items-center gap-4"
              autoComplete="one-time-code"
              autoFocus
              render={({ slots }) => (
                <>
                  {slots.map((slot, index) => (
                    <div
                      key={index}
                      className={`w-14 h-14 flex items-center justify-center text-xl font-bold border rounded-xl transition-all text-gray-900 outline-none
                        ${
                          slot.isActive
                            ? "bg-white border-primary ring-2 ring-indigo-100"
                            : "bg-gray-50 border-gray-300"
                        }`}
                    >
                      {slot.char}
                    </div>
                  ))}
                </>
              )}
            />
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={otpValue.length < 4 || isSubmitting}
              className="flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting
                ? t("auth.verifyingOtp", "Verifying OTP...")
                : t("auth.verifyProceed", "Verify & Proceed")}
            </button>

            <div className="text-center text-sm text-gray-500">
              {t("auth.didntReceiveOtp", "Didn't receive code?")}{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                className="font-semibold text-primary hover:text-indigo-500 underline transition-colors"
              >
                {t("auth.resendOtp", "Resend OTP")}
              </button>
            </div>
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
