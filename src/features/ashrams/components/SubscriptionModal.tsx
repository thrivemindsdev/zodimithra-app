import starImage from "@/assets/ashrams/star.png";
import PaymentStatusModal from "@/components/common/PaymentStatusModal";
import { ASHRAMS_QUERY_KEYS } from "@/queries/ashramsQueries";
import { useGetUserDetailsQuery } from "@/queries/userQueries";
import {
  createRazorpayOrderAshramaPremium,
  verifyAshramSubscriptionPayment,
} from "@/services/ashrams.api";
import { useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { Checkout } from "capacitor-razorpay";
import { useAuthStore } from "@/store/authStore";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: any;
}

const features = [
  "Unlimited live sessions for a month",
  "Connect with trusted Vedic scholars faster",
  "Exclusive members-only insights",
];

export default function SubscriptionModal({
  isOpen,
  onClose,
  details,
}: SubscriptionModalProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const phoneNumber = useAuthStore((state) => state.phoneNumber);
  const { data: userDetails } = useGetUserDetailsQuery();
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    status: "success" | "failed";
    redirectTo: string;
  }>({
    open: false,
    status: "success",
    redirectTo: "",
  });

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

            setPaymentModal({
              open: true,
              status: "success",
              redirectTo: "/ashrams",
            });
          } else {
            throw new Error("Invalid payment response structure");
          }
        } catch (checkoutError) {
          console.error("Native Checkout failed:", checkoutError);
          setPaymentModal({
            open: true,
            status: "failed",
            redirectTo: "",
          });
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

              setPaymentModal({
                open: true,
                status: "success",
                redirectTo: "/ashrams",
              });
            } catch (error) {
              console.error("Payment verification failed:", error);
              setPaymentModal({
                open: true,
                status: "failed",
                redirectTo: "",
              });
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
          setPaymentModal({
            open: true,
            status: "failed",
            redirectTo: "",
          });
        });

        razorpay.open();
      }
    } catch (error) {
      console.error("Create order failed:", error);
      setPaymentModal({
        open: true,
        status: "failed",
        redirectTo: "",
      });
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
              Your spiritual journey awaits
            </h2>

            <p className="mt-3 text-center text-sm font-body-content text-text-secondary">
              Continue learning and elevate your spiritual experience with a
              premium membership.
            </p>

            <div className="mt-6 space-y-4">
              {features.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                    <Check size={14} className="text-amber-600" />
                  </div>

                  <p className="text-sm font-body-content text-text-secondary">
                    {item}
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
                / month
              </span>
            </div>

            <button
              onClick={() =>
                handlePayNow({
                  plan_id: details?.id,
                  amount: subscriptionAmount,
                })
              }
              className="mt-6 w-full rounded-full bg-primary py-4 text-white"
            >
              Subscribe for ₹{subscriptionAmount.toFixed(0)}
            </button>

            <p className="mt-3 text-center text-xs font-body-content text-text-secondary">
              billed monthly · cancel anytime
            </p>

            <button
              onClick={onClose}
              className="mt-2 w-full text-center text-sm text-[#B1976D] underline"
            >
              Continue watching preview
            </button>
          </div>
        </div>
      </div>
      {paymentModal.open && (
        <PaymentStatusModal
          isOpen={paymentModal.open}
          status={paymentModal.status}
          title={
            paymentModal.status === "success"
              ? "Payment Successful"
              : "Payment Failed"
          }
          description={
            paymentModal.status === "success"
              ? `Your ${details?.name ?? "Ashram"} subscription has been activated successfully.`
              : "Your payment could not be completed. Please try again."
          }
          buttonText="Done"
          onDone={() => {
            const isSuccess = paymentModal.status === "success";
            setPaymentModal((prev) => ({
              ...prev,
              open: false,
            }));

            if (isSuccess) {
              onClose();
              navigate("/ashrams");
            }
          }}
        />
      )}
    </div>
  );
}
