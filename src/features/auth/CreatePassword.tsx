import Logo from "@/assets/splash/zodimithra.gif";
import ZodiMithra from "@/assets/splash/ZODIMITHRA.png";
import { CreatePasswordApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";
import { Dialog } from "@capacitor/dialog";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePassword() {
  const navigate = useNavigate();
  const phone = useAuthStore((state) => state.phoneNumber);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation Rules
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const isFormValid =
    hasMinLength && hasNumber && hasSpecialChar && passwordsMatch;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!isFormValid) {
      await Dialog.alert({
        title: "Validation Error",
        message: "Please fulfill all password requirements before continuing.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await CreatePasswordApi({ phone, password });
      if (response.status === 200 || response.status === 201) {
        navigate("/birth-details-form");
      }
    } catch (error) {
      console.error("Create Password Error:", error);
      await Dialog.alert({
        title: "Error",
        message: "Unable to update password. Please try again.",
      });
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
            Create Password
          </h2>
          <p className="mt-1 font-body text-center text-sm text-text-secondary">
            Set a strong password for your account.
          </p>
        </div>

        {/* Form Section */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* New Password Input */}
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password
            </label>
            <div className="relative rounded-lg border border-input-border px-4 py-3 bg-input-bg flex items-center transition-all">
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border-0 p-0 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative rounded-lg border border-input-border px-4 py-3 bg-input-bg flex items-center transition-all">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-transparent border-0 p-0 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? (
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
              Password Requirements
            </p>
            <ValidationRule
              label="At least 8 characters"
              isValid={hasMinLength}
            />
            <ValidationRule
              label="Contains at least one number"
              isValid={hasNumber}
            />
            <ValidationRule
              label="Contains a special character (!@#$%^&*)"
              isValid={hasSpecialChar}
            />
            <ValidationRule label="Passwords match" isValid={passwordsMatch} />
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
    </div>
  );
}

// Sub-component for checklist rules using Lucide React icons
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
