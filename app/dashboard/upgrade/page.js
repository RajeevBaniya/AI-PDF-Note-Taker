"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import React, { useState } from "react";
import { CheckCircle2, CreditCard, X } from "lucide-react";

const initialOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  currency: "USD",
  intent: "capture",
};

function UpgradePlans() {
  const userUpgradePlan = useMutation(api.user.userUpgradePlan);
  const { user } = useUser();

  const onPaymentSuccess = async () => {
    try {
      const result = await userUpgradePlan({
        userEmail: user?.primaryEmailAddress?.emailAddress,
      });
      console.log(result);
      toast.success("Plan Upgraded Successfully!");
    } catch (error) {
      console.error("Payment success handling error:", error);
      toast.error("Error processing payment success");
    }
  };

  const [selectedPlan, setSelectedPlan] = useState("free"); // Default to free plan
  const [showCardPayment, setShowCardPayment] = useState(false);

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: "9.99",
            currency_code: "USD"
          },
          description: "Unlimited Plan - One Time Payment"
        },
      ],
    });
  };

  const onApprove = async (data, actions) => {
    try {
      const order = await actions.order.capture();
      await onPaymentSuccess();
    } catch (error) {
      console.error("Payment approval error:", error);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="min-h-screen p-4 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Upgrade Plans</h2>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="rounded-3xl border-2 p-6 sm:p-8 shadow-lg bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-200">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-[#0a4a78] to-[#4ec5ff] bg-clip-text text-transparent">0</span>
                <span className="text-sm font-medium text-gray-500 ml-1">$/month</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">5 PDF Upload</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Unlimited Notes Taking</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Email support</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Help center access</span>
                </li>
              </ul>
            </div>
            
            <div className="flex justify-center mt-6">
              <button 
                className="relative overflow-hidden rounded-full border-2 border-[#0a4a78] bg-white text-[#0a4a78] px-8 py-3 text-center text-sm font-bold hover:bg-gradient-to-r hover:from-[#0a4a78] hover:to-[#4ec5ff] hover:text-white hover:border-transparent hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out min-w-[160px] focus:outline-none focus:ring-2 focus:ring-[#0a4a78] focus:ring-opacity-50 group"
                disabled
              >
                <span className="relative z-10">✓ Current Plan</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a4a78] to-[#4ec5ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="rounded-3xl border-2 p-6 sm:p-8 shadow-lg bg-gradient-to-br from-white to-blue-50 relative hover:shadow-xl transition-all duration-200">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-block bg-gradient-to-r from-[#0a4a78] to-[#4ec5ff] text-white text-xs font-semibold px-3 py-1 rounded-full">
                POPULAR
              </span>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-[#0a4a78] to-[#4ec5ff] bg-clip-text text-transparent">9.99</span>
                <span className="text-sm font-medium text-gray-500 ml-1">$/One Time</span>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Unlimited PDF Upload</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Unlimited Notes Taking</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Email support</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Help center access</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 w-full">
              <PayPalButtons
                style={{
                  layout: 'horizontal',
                  color: 'gold',
                  shape: 'rect',
                  label: 'pay',
                  height: 40
                }}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={(err) => {
                  console.error('PayPal error:', err);
                  toast.error('Payment failed. Please try again.');
                }}
              />
              <button 
                onClick={() => setShowCardPayment(true)}
                className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <CreditCard className="w-5 h-5" />
                Debit or Credit Card
              </button>
            </div>
          </div>
        </div>

        {/* Card Payment Modal */}
        {showCardPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Card Payment</h3>
                <button 
                  onClick={() => setShowCardPayment(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div id="card-payment-container"></div>
            </div>
          </div>
        )}
      </div>
    </PayPalScriptProvider>
  );
}

export default UpgradePlans;
