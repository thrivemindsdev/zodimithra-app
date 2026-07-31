import Logo from "@/assets/splash/zodimithra.gif";
import ZodiMithra from "@/assets/splash/ZODIMITHRA.png";
import { useHardwareBack } from "@/hooks/useHardwareBack";
import { SendOtpApi, VerifyOtpApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";
import { Dialog } from "@capacitor/dialog";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function OtpScreen() {
  const navigate = useNavigate();
  useHardwareBack({ route: "/login" });
  const phoneNumber = useAuthStore((state) => state.phoneNumber);
  const setTemporayToken = useAuthStore((state) => state.setTemporayToken);
  const [otpValue, setOtpValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting) return;

    if (otpValue.length < 4) {
      await Dialog.alert({
        title: "Invalid OTP",
        message: "Please enter all 4 digits of the OTP.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await VerifyOtpApi({
        phone: phoneNumber,
        otp: otpValue,
      });

      if (response?.status === 201 || response?.status === 200) {
        setTemporayToken(response.data?.token);
        navigate("/create-password");
      } else {
        await Dialog.alert({
          title: "Verification Failed",
          message: response?.data?.message || "Invalid OTP. Please try again.",
        });
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      await Dialog.alert({
        title: "Error",
        message: "Something went wrong. Please check your network connection.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!phoneNumber) return;

    try {
      const response = await SendOtpApi({ phone: phoneNumber });
      if (response?.status === 200) {
        await Dialog.alert({
          title: "Success",
          message: "OTP resent successfully!",
        });
      } else {
        await Dialog.alert({
          title: "Failed",
          message: "Failed to resend OTP. Please try again.",
        });
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      await Dialog.alert({
        title: "Error",
        message: "Could not resend OTP. Please try again later.",
      });
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
            We sent a 4-digit code to{" "}
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
              // Automatically triggers mobile SMS code suggestion
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
              {isSubmitting ? "Verifying OTP..." : "Verify & Proceed"}
            </button>

            <div className="text-center text-sm text-gray-500">
              Didn't receive code?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                className="font-semibold text-primary hover:text-indigo-500 underline transition-colors"
              >
                Resend OTP
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// import { useState, useEffect, useRef, type SubmitEvent } from "react";
// import Logo from "@/assets/splash/zodimithra.gif";
// import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
// import { App } from "@capacitor/app"; // Install via: npm install @capacitor/app

// interface OtpScreenProps {
//   phoneNumber?: string;
//   onVerify?: (otp: string) => void;
//   onResend?: () => void;
// }

// const TIMER_DURATION = 180; // 3 minutes in seconds

// export default function OtpScreen({
//   phoneNumber = "+91 98765 49870",
//   onVerify,
//   onResend,
// }: OtpScreenProps) {
//   const [otpValue, setOtpValue] = useState("");
//   const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);

//   // Store the target end timestamp so it stays accurate regardless of background throttling
//   const endTimeRef = useRef<number | null>(null);

//   const startTimer = () => {
//     endTimeRef.current = Date.now() + TIMER_DURATION * 1000;
//     setTimeLeft(TIMER_DURATION);
//   };

//   useEffect(() => {
//     // Start the timer on mount
//     startTimer();

//     const updateTimer = () => {
//       if (!endTimeRef.current) return;

//       const totalMilisecondsLeft = endTimeRef.current - Date.now();
//       const secondsLeft = Math.max(0, Math.floor(totalMilisecondsLeft / 1000));

//       setTimeLeft(secondsLeft);

//       if (secondsLeft <= 0) {
//         clearInterval(intervalId);
//       }
//     };

//     // Standard tick interval for foreground execution
//     const intervalId = setInterval(updateTimer, 1000);

//     // Capacitor Native Lifecycle Listener
//     // Forces an immediate sync when the user brings the app back to the foreground
//     const appStateListener = App.addListener("appStateChange", (state) => {
//       if (state.isActive) {
//         updateTimer();
//       }
//     });

//     return () => {
//       clearInterval(intervalId);
//       appStateListener.then((listener) => listener.remove());
//     };
//   }, []);

//   const handleResendClick = () => {
//     if (timeLeft > 0) return;

//     if (onResend) onResend();
//     startTimer(); // Reset the 3-minute window
//   };

//   const handleSubmit = (e: SubmitEvent) => {
//     e.preventDefault();

//     if (otpValue.length < 4) {
//       return alert("Please enter all 4 digits of the OTP.");
//     }

//     if (onVerify) onVerify(otpValue);
//     alert(`Verifying OTP: ${otpValue}`);
//   };

//   // Format seconds into MM:SS format
//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
//       <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
//         <div className="flex flex-col items-center">
//           <img
//             src={Logo}
//             alt="Zodimithra Logo"
//             className="mx-auto w-1/2 max-w-xs"
//             loading="eager"
//           />
//           <h2 className="text-center font-body text-2xl font-bold tracking-tight text-text-primary">
//             Verify OTP
//           </h2>
//           <p className="mt-2 font-body text-center text-sm text-text-secondary">
//             We sent a 4-digit code to{" "}
//             <span className="font-semibold text-gray-900">{phoneNumber}</span>
//           </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="flex justify-center">
//             <OTPInput
//               maxLength={4}
//               value={otpValue}
//               onChange={setOtpValue}
//               pattern={REGEXP_ONLY_DIGITS}
//               containerClassName="group flex items-center gap-4"
//               autoComplete="one-time-code"
//               autoFocus
//               render={({ slots }) => (
//                 <>
//                   {slots.map((slot, index) => (
//                     <div
//                       key={index}
//                       className={`w-14 h-14 flex items-center justify-center text-xl font-bold border rounded-xl transition-all text-gray-900 outline-none
//                         ${
//                           slot.isActive
//                             ? "bg-white border-primary ring-2 ring-indigo-100"
//                             : "bg-gray-50 border-gray-300"
//                         }`}
//                     >
//                       {slot.char}
//                     </div>
//                   ))}
//                 </>
//               )}
//             />
//           </div>

//           <div className="space-y-4">
//             <button
//               type="submit"
//               className="flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
//             >
//               Verify & Proceed
//             </button>

//             <div className="text-center text-sm text-gray-500">
//               {timeLeft > 0 ? (
//                 <span>Resend code in <span className="font-mono font-semibold text-gray-700">{formatTime(timeLeft)}</span></span>
//               ) : (
//                 <>
//                   Didn't receive code?{" "}
//                   <button
//                     type="button"
//                     onClick={handleResendClick}
//                     className="font-semibold text-primary hover:text-indigo-500 underline transition-colors"
//                   >
//                     Resend OTP
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
