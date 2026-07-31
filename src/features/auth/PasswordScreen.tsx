import Logo from "@/assets/splash/zodimithra.gif";
import ZodiMithra from "@/assets/splash/ZODIMITHRA.png";
import { VerifyPasswordApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";
import { Dialog } from "@capacitor/dialog";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function PasswordScreen() {
  const navigate = useNavigate();

  // Retrieve stored phone number from Auth store (if applicable)
  const phoneNumber = useAuthStore((state) => state.phoneNumber);
  const setToken = useAuthStore((state) => state.setToken); // Adjust store action as needed
  const setTemporayToken = useAuthStore((state) => state.setTemporayToken);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    // 1. Validation check
    if (!password.trim()) {
      await Dialog.alert({
        title: "Missing Information",
        message: "Please enter your password.",
      });
      return;
    }

    // 2. API Submission
    setIsSubmitting(true);
    try {
      const response = await VerifyPasswordApi({
        phone: phoneNumber,
        password: password,
      });

      if (response?.status === 200) {
        if (response?.data?.on_boarding) {
          setToken(response.data.token);
          navigate("/home");
        } else {
          setTemporayToken(response.data.token);
          navigate("/birth-details-form");
        }
      } else {
        await Dialog.alert({
          title: "Login Failed",
          message:
            response?.data?.message ||
            "Incorrect password. Please try again or reset your password.",
        });
      }
    } catch (error) {
      console.error("Password Login Error:", error);
      await Dialog.alert({
        title: "Network Error",
        message:
          "Unable to reach the server. Please check your internet connection.",
      });
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
          <h2 className="mt-4 text-xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-1 font-body text-center text-sm text-text-secondary">
            {phoneNumber
              ? `Enter password for ${phoneNumber}`
              : "Enter your password to sign in."}
          </p>
        </div>

        {/* Form Section */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Password Input Field */}
          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative rounded-lg border border-input-border px-4 py-3 bg-input-bg flex items-center transition-all focus-within:ring-2 focus-within:ring-primary/20">
              <Lock className="h-4 w-4 text-gray-400 mr-2.5 shrink-0" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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

          {/* Forgot Password Link */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              // onClick={() => navigate("/forgot-password")}
              className="text-xs font-semibold text-primary hover:underline focus:outline-none"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={!password.trim() || isSubmitting}
              className="flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold leading-6 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
