import GlobalLoader from "@/components/common/GlobalLoader";
import ToastModal from "@/components/common/ToastModal";
import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { useToastModal } from "@/hooks/useToastModal";
import { useGetPremiumPlansQuery } from "@/queries/premiumQueries";
import { useGetUserDetailsQuery, USER_QUERY_KEYS } from "@/queries/userQueries";
import {
  createRazorpayOrder,
  verifyRazorpayOrder,
} from "@/services/premium.api";
import { useAuthStore } from "@/store/authStore";
import { Capacitor } from "@capacitor/core";
import { useQueryClient } from "@tanstack/react-query";
import { Checkout } from "capacitor-razorpay";
import {
  CalendarDays,
  FileText,
  Flower2,
  Grid2x2,
  Heart,
  Layers3,
  Music4,
  Orbit,
  Star,
  Sun,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: CalendarDays,
    title: "Monthly forecast",
  },
  {
    icon: Orbit,
    title: "Yearly planetary path",
  },
  {
    icon: FileText,
    title: "Fortune Report (personalised)",
  },
];

const benefits = [
  {
    title: "Tarot",
    subtitle: "Daily card pulls",
    badge: "Daily",
    icon: Grid2x2,
  },
  {
    title: "Mantras",
    subtitle: "Unlimited audio",
    badge: "Unlimited",
    icon: Music4,
  },
  {
    title: "Dhyanam",
    subtitle: "Meditation session",
    badge: "Guided",
    icon: Flower2,
  },
  {
    title: "Muhurtham",
    subtitle: "Sacred & auspicious timings",
    badge: "Accurate",
    icon: Layers3,
  },
  {
    title: "Live Session",
    subtitle: "Expert consultation",
    badge: "Monthly",
    icon: Users,
  },
];

const PremiumScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const phoneNumber = useAuthStore((state) => state.phoneNumber);
  const { toastState, showSuccess, showError, hideToast } = useToastModal();

  const { data: userDetails, isLoading: isUserLoading } =
    useGetUserDetailsQuery();
  const { data: premiumPlans, isLoading: isPremiumLoading } =
    useGetPremiumPlansQuery();

  const selectedPlan = premiumPlans?.plans?.[0];

  const planAmount = Number(selectedPlan?.price) || 0;
  const planDuration = selectedPlan?.duration_days || 0;
  const planId = selectedPlan?.id;

  const handlePayNow = async () => {
    if (!planId || planAmount <= 0) {
      console.error("Invalid plan details");
      return;
    }

    try {
      // Step 1: Create Razorpay order
      const order = await createRazorpayOrder({
        plan_id: planId,
      });

      if (Capacitor.isNativePlatform()) {
        try {
          const res = await Checkout.open({
            key: order.key_id,
            amount: order.amount.toString(),
            currency: order.currency,
            order_id: order.order_id,
            name: "ZodiMithra",
            description: "Premium Recharge",
            prefill: {
              name: userDetails?.name ?? "",
              email: "zodimithra@gmail.com",
              contact: phoneNumber,
            },
            theme: {
              color: "#2A0B07",
            },
          } as any);

          const responseData =
            typeof res.response === "string"
              ? JSON.parse(res.response)
              : res.response;

          if (responseData && responseData.razorpay_payment_id) {
            await verifyRazorpayOrder({
              razorpay_payment_id: responseData.razorpay_payment_id,
              razorpay_order_id: responseData.razorpay_order_id,
              razorpay_signature: responseData.razorpay_signature,
              amount: order.amount,
            });

            await queryClient.invalidateQueries({
              queryKey: [USER_QUERY_KEYS.userDetails],
            });

            showSuccess(
              t("payment.successTitle", "Payment Successful"),
              t(
                "payment.premiumSuccessDesc",
                "Your premium subscription has been activated successfully.",
              ),
              t("payment.done", "Done"),
              () => navigate("/home"),
            );
          } else {
            throw new Error("Invalid payment response structure");
          }
        } catch (checkoutError) {
          console.error("Native Checkout failed:", checkoutError);
          showError(
            t("payment.failureTitle", "Payment Failed"),
            t(
              "payment.failureDesc",
              "Your payment could not be completed. Please try again.",
            ),
            t("payment.done", "Done"),
          );
        }
      } else {
        // Web flow
        if (!(window as any).Razorpay) {
          throw new Error("Razorpay SDK not loaded");
        }

        const options = {
          key: order.key_id,
          amount: order.amount,
          currency: order.currency,
          order_id: order.order_id,
          name: "ZodiMithra",
          description: "Premium Recharge",

          prefill: {
            name: userDetails?.name ?? "",
            email: "zodimithra@gmail.com",
            contact: phoneNumber,
          },

          theme: {
            color: "#2A0B07",
          },

          modal: {
            ondismiss: () => {
              console.log("Payment popup closed");
              showError(
                t("payment.failureTitle", "Payment Failed"),
                t(
                  "payment.failureDesc",
                  "Your payment could not be completed. Please try again.",
                ),
                t("payment.done", "Done"),
              );
            },
          },

          handler: async (response: any) => {
            try {
              await verifyRazorpayOrder({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: order.amount,
              });

              await queryClient.invalidateQueries({
                queryKey: [USER_QUERY_KEYS.userDetails],
              });

              showSuccess(
                t("payment.successTitle", "Payment Successful"),
                t(
                  "payment.premiumSuccessDesc",
                  "Your premium subscription has been activated successfully.",
                ),
                t("payment.done", "Done"),
                () => navigate("/home"),
              );
            } catch (error) {
              console.error("Payment verification failed:", error);
              showError(
                t("payment.failureTitle", "Payment Failed"),
                t(
                  "payment.failureDesc",
                  "Your payment could not be completed. Please try again.",
                ),
                t("payment.done", "Done"),
              );
            }
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      console.error("Unable to initiate payment:", error);

      showError(
        t("payment.failureTitle", "Payment Failed"),
        t(
          "payment.failureDesc",
          "Your payment could not be completed. Please try again.",
        ),
        t("payment.done", "Done"),
      );
    }
  };

  if (isUserLoading || isPremiumLoading) {
    return <GlobalLoader />;
  }

  return (
    <>
      <Header title="Premium" showBackButton />
      <BodyLayout>
        {/* Premium Banner */}
        <div className="rounded-3xl bg-linear-to-br from-[#2A221B] via-[#1F1915] to-[#3B2E1D] text-white p-6 shadow-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[#3A2F22] border border-[#6E5730] px-3 py-1 text-xs uppercase tracking-wider text-[#D8B24A]">
            <span className="h-2 w-2 rounded-full bg-[#D8B24A]" />
            Mithra Premium
          </div>

          {/* Heading */}
          <h2 className="mt-5 text-2xl font-light leading-tight">
            Your Cosmic Journey,
            <br />
            Elevated.
          </h2>

          {/* Description */}
          <p className="mt-4 text-sm text-gray-300 leading-6">
            Become a Zodi Mithra Premium member and unlock a lifetime of
            spiritual clarity.
          </p>

          {/* Price */}
          <div className="mt-6 flex items-end gap-2">
            <span className="text-lg text-[#D8B24A]">₹</span>

            <span className="text-4xl font-light leading-none">
              {planAmount}
            </span>

            <span className="pb-2 text-gray-400">/ {planDuration} days</span>
          </div>

          {/* Button */}
          <button
            onClick={handlePayNow}
            className="mt-6 w-full rounded-xl bg-[#D8B24A] py-3 text-sm font-semibold tracking-wide text-black transition hover:brightness-110"
          >
            UPGRADE TO PREMIUM
          </button>
        </div>

        {/* Included */}
        <div className="mt-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            What's Included
          </p>

          <div className="rounded-3xl bg-linear-to-br from-[#2A221B] via-[#1F1915] to-[#32271B] p-5 text-white shadow-lg">
            {/* Top Feature */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3A2F22] text-[#D8B24A]">
                <Sun size={22} />
              </div>

              <div>
                <h3 className="text-xl font-medium">Complete Horoscope</h3>

                <p className="mt-2 text-sm leading-6 text-gray-300">
                  Monthly & yearly planetary guide — your full cosmic map,
                  always accessible.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="my-5 border-t border-[#5C4B39]" />

            {/* Features */}
            <div className="space-y-4">
              {features.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3A2F22] text-[#D8B24A]">
                      <Icon size={15} />
                    </div>

                    <span className="text-sm text-gray-200">{item.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-[#E5D8C5] bg-[#FAF8F5] p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2ECE3] text-[#9C8A70]">
                  <Icon size={18} />
                </div>

                <h3 className="mt-5 text-lg font-medium text-[#2B2B2B]">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs text-gray-500">{item.subtitle}</p>

                <span className="mt-3 inline-flex rounded-full bg-[#EFE7DA] px-3 py-1 text-[10px] font-medium text-[#8A775C]">
                  {item.badge}
                </span>
              </div>
            );
          })}
        </div>

        {/* Review */}
        <div className="mt-6">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8F887F]">
            {t("premium.whatMembersSay", "What Members Say")}
          </p>

          <div className="rounded-2xl border border-[#E5D8C5] bg-[#FAF8F5] p-4">
            <div className="flex gap-1 text-[#D4A937]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
              ))}
            </div>

            <p className="mt-3 text-xs leading-6 text-[#555]">
              "The Fortune Report felt like someone finally understood my chart.
              <br />
              The Muhurtham feature alone was worth it for my daughter's
              wedding."
            </p>

            <p className="mt-3 text-xs font-medium text-[#666]">
              — Lakshmi P, Thrissur
            </p>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-6">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8F887F]">
            {t("premium.comingSoonSection", "Well-being · Coming Soon")}
          </p>

          <div className="rounded-2xl border border-[#E5D8C5] bg-[#FAF8F5] p-4 opacity-60">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2ECE3] text-[#B7A88D]">
              <Heart size={18} />
            </div>

            <h3 className="mt-4 text-lg font-medium text-[#444]">
              {t("wellbeing.healing", "Healing")}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {t(
                "premium.notPartOfPlan",
                "This section is not part of the current plan",
              )}
            </p>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="mt-auto pt-6">
          <button
            onClick={handlePayNow}
            className="w-full rounded-xl bg-[#D7AF3A] py-4 text-sm font-semibold tracking-wide text-black transition hover:brightness-105 cursor-pointer"
          >
            {t("premium.upgrade", "UPGRADE TO PREMIUM")} — ₹{planAmount}
          </button>
        </div>
      </BodyLayout>

      <ToastModal
        isOpen={toastState.isOpen}
        status={toastState.status}
        title={toastState.title}
        description={toastState.description}
        buttonText={toastState.buttonText}
        onDone={hideToast}
      />
    </>
  );
};

export default PremiumScreen;
