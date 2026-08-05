import starImage from "@/assets/ashrams/star.png";
import ToastModal from "@/components/common/ToastModal";
import { useToastModal } from "@/hooks/useToastModal";
import { ASHRAMS_QUERY_KEYS } from "@/queries/ashramsQueries";
import { useGetUserDetailsQuery } from "@/queries/userQueries";
import {
  createRazorpayOrderAshramaPremium,
  verifyAshramSubscriptionPayment,
} from "@/services/ashrams.api";
import { useAuthStore } from "@/store/authStore";
import { Capacitor } from "@capacitor/core";
import { useQueryClient } from "@tanstack/react-query";
import { Checkout } from "capacitor-razorpay";
import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: any;
}

const featureKeys = [
  { key: "ashrams.feature1", fallback: "Unlimited live sessions for a month" },
  { key: "ashrams.feature2", fallback: "Connect with trusted Vedic scholars faster" },
  { key: "ashrams.feature3", fallback: "Exclusive members-only insights" },
];

export default function SubscriptionModal({
  isOpen,
  onClose,
  details,
}: SubscriptionModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const phoneNumber = useAuthStore((state) => state.phoneNumber);
  const { data: userDetails } = useGetUserDetailsQuery();
  const { toastState, showSuccess, showError, hideToast } = useToastModal();

  if (!isOpen) return null;

  const subscriptionAmount = Number(details?.subscription_amount || 0);

  const handlePayNow = async ({
    plan_id,
    amount,
  }: {
    plan_id: number;
    amount: number;
  }) => {
    if (!plan_id || amount <= 0) return;

    try {
      // Create Razorpay order
      const orderData = await createRazorpayOrderAshramaPremium(plan_id);

      if (!orderData?.order_id || !orderData?.key_id) {
        console.error("Invalid order response");
        return;
      }

      if (Capacitor.isNativePlatform()) {
        try {
          const res = await Checkout.open({
            key: orderData.key_id,
            amount: orderData.amount.toString(),
            currency: orderData.currency,
            order_id: orderData.order_id,
            name: "ZodiMithra",
            description: "Ashram Premium",
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
            await verifyAshramSubscriptionPayment(plan_id, {
              razorpay_payment_id: responseData.razorpay_payment_id,
              razorpay_order_id: responseData.razorpay_order_id,
              razorpay_signature: responseData.razorpay_signature,
              amount: orderData.amount,
            });

            await queryClient.invalidateQueries({
              queryKey: [ASHRAMS_QUERY_KEYS.ashrams],
            });

            await queryClient.invalidateQueries({
              queryKey: [ASHRAMS_QUERY_KEYS.liveSessions],
            });

            await queryClient.invalidateQueries({
              queryKey: [ASHRAMS_QUERY_KEYS.ashramById, plan_id],
            });

            await queryClient.invalidateQueries({
              queryKey: [ASHRAMS_QUERY_KEYS.liveSessionId, plan_id],
            });

            showSuccess(
              t("payment.successTitle", "Payment Successful"),
              t(
                "payment.ashramSuccessDesc",
                `Your ${details?.name ?? "Ashram"} subscription has been activated successfully.`,
                { name: details?.name ?? "Ashram" },
              ),
              t("payment.done", "Done"),
              () => {
                onClose();
                navigate("/ashrams");
              },
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
          console.error("Razorpay SDK not loaded");
          return;
        }

        const options = {
          key: orderData.key_id,
          amount: orderData.amount,
          currency: orderData.currency,
          order_id: orderData.order_id,
          name: "ZodiMithra",
          description: "Ashram Premium",

          handler: async (response: any) => {
            try {
              await verifyAshramSubscriptionPayment(plan_id, {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: orderData.amount,
              });

              await queryClient.invalidateQueries({
                queryKey: [ASHRAMS_QUERY_KEYS.ashrams],
              });

              await queryClient.invalidateQueries({
                queryKey: [ASHRAMS_QUERY_KEYS.liveSessions],
              });

              await queryClient.invalidateQueries({
                queryKey: [ASHRAMS_QUERY_KEYS.ashramById, plan_id],
              });

              await queryClient.invalidateQueries({
                queryKey: [ASHRAMS_QUERY_KEYS.liveSessionId, plan_id],
              });

              showSuccess(
                t("payment.successTitle", "Payment Successful"),
                t(
                  "payment.ashramSuccessDesc",
                  `Your ${details?.name ?? "Ashram"} subscription has been activated successfully.`,
                  { name: details?.name ?? "Ashram" },
                ),
                t("payment.done", "Done"),
                () => {
                  onClose();
                  navigate("/ashrams");
                },
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
              console.log("Checkout closed");
            },
          },
        };

        const razorpay = new (window as any).Razorpay(options);

        razorpay.on("payment.failed", (error: any) => {
          console.error("Payment Failed:", error);
          showError(
            t("payment.failureTitle", "Payment Failed"),
            t(
              "payment.failureDesc",
              "Your payment could not be completed. Please try again.",
            ),
            t("payment.done", "Done"),
          );
        });

        razorpay.open();
      }
    } catch (error) {
      console.error("Create order failed:", error);
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

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="absolute inset-x-0 bottom-0 h-dvh w-full overflow-hidden rounded-t-3xl bg-white animate-slide-up">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md"
        >
          <X size={18} />
        </button>

        <div className="h-full overflow-y-auto">
          {/* Hero Image */}
          <div className="relative h-64">
            <img
              src={details?.image}
              alt="Temple"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white" />
          </div>

          {/* Content */}
          <div className="mt-6 px-6 pb-10">
            <div className="flex justify-center">
              <img
                src={starImage}
                alt="Star"
                className="h-10 w-10 object-cover"
              />
            </div>

            <h2 className="mt-4 text-center text-xl font-light text-text-primary">
              {t("ashrams.journeyAwaits", "Your spiritual journey awaits")}
            </h2>

            <p className="mt-3 text-center text-sm font-body-content text-text-secondary">
              {t(
                "ashrams.membershipDesc",
                "Continue learning and elevate your spiritual experience with a premium membership.",
              )}
            </p>

            <div className="mt-6 space-y-4">
              {featureKeys.map((item) => (
                <div key={item.key} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                    <Check size={14} className="text-amber-600" />
                  </div>

                  <p className="text-sm font-body-content text-text-secondary">
                    {t(item.key, item.fallback)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <span className="text-3xl font-semibold font-body-content">
                ₹{subscriptionAmount.toFixed(0)}
              </span>

              <span className="font-body-content text-text-secondary">
                {" "}
                {t("ashrams.perMonth", "/ month")}
              </span>
            </div>

            <button
              onClick={() =>
                handlePayNow({
                  plan_id: details?.id,
                  amount: subscriptionAmount,
                })
              }
              className="mt-6 w-full rounded-full bg-primary py-4 text-white font-semibold cursor-pointer"
            >
              {t("ashrams.subscribeFor", "Subscribe for")} ₹
              {subscriptionAmount.toFixed(0)}
            </button>

            <p className="mt-3 text-center text-xs font-body-content text-text-secondary">
              {t("ashrams.monthlyBilled", "billed monthly · cancel anytime")}
            </p>

            <button
              onClick={onClose}
              className="mt-2 w-full text-center text-sm text-[#B1976D] underline cursor-pointer"
            >
              {t("ashrams.continuePreview", "Continue watching preview")}
            </button>
          </div>
        </div>
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
