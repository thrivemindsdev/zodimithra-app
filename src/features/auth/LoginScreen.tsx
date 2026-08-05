import Logo from "@/assets/splash/zodimithra.gif";
import ZodiMithra from "@/assets/splash/ZODIMITHRA.png";
import ToastModal from "@/components/common/ToastModal";
import { useToastModal } from "@/hooks/useToastModal";
import { CheckPhoneApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";
import { useState, type FormEvent } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useNavigate } from "react-router-dom";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [phoneValue, setPhoneValue] = useState<string | undefined>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setPhoneNumber = useAuthStore((state) => state.setPhoneNumber);
  const { toastState, showError, hideToast } = useToastModal();

  // Helper boolean to cleanly check valid phone status
  const isPhoneValid = Boolean(phoneValue && isValidPhoneNumber(phoneValue));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting || !isPhoneValid || !phoneValue) return;

    setIsSubmitting(true);
    try {
      const response = await CheckPhoneApi({ phone: phoneValue });

      if (response?.status === 200) {
        setPhoneNumber(phoneValue);
        if (response?.data?.is_registered) {
          navigate("/password");
        } else {
          navigate("/otp");
        }
      }
    } catch (error) {
      console.error("Check Phone Error:", error);
      showError(
        "Network Error",
        "Unable to reach the server. Please check your internet connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
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
            Sign in safely with your phone number.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="phone-input"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number
            </label>

            <div className="phone-input-wrapper rounded-lg border border-input-border transition-all px-4 py-3 bg-input-bg">
              <PhoneInput
                international={false}
                defaultCountry="IN"
                placeholder="Enter phone number"
                value={phoneValue}
                onChange={setPhoneValue}
                countryCallingCodeEditable={false}
                className="flex items-center gap-3 text-gray-900 text-sm"
                numberInputProps={{
                  id: "phone-input",
                  className:
                    "w-full bg-transparent border-0 p-0 focus:ring-0 sm:text-sm text-gray-900 outline-none placeholder:text-gray-400",
                  required: true,
                }}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!isPhoneValid || isSubmitting}
              className="flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold leading-6 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
            >
              {isSubmitting ? "Continuing..." : "Continue"}
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
