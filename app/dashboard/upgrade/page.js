"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import React, { useState } from "react";

function UpgradePlans() {
  const userUpgradePlan = useMutation(api.user.userUpgradePlan);
  const { user } = useUser();

  const onPaymentSuccess = async () => {
    const result = await userUpgradePlan({
      userEmail: user?.primaryEmailAddress?.emailAddress,
    });
    console.log(result);
    toast("Plan Upgraded Successfully!");
  };

  const [selectedPlan, setSelectedPlan] = useState("free"); // Default to free plan

  return (
    <div>
      <h2 className="font-medium text-3xl">Plans</h2>
      <p className="text-gray-600 mt-2">
        Upgrade your plan to upload more PDFs
      </p>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center items-start">

          {/* Unlimited Plan Card */}
          <div
            className={`rounded-3xl border-2 p-8 shadow-lg bg-gradient-to-br from-white to-blue-50 sm:order-last cursor-pointer transition-all duration-200 w-full sm:w-[420px] hover:shadow-xl hover:scale-102 ${
              selectedPlan === "unlimited"
                ? "border-[#0a4a78] shadow-2xl ring-2 ring-[#0a4a78] ring-opacity-20 bg-gradient-to-br from-blue-50 to-white"
                : "border-gray-200 hover:border-[#4ec5ff]"
            }`}
            onClick={() =>
              setSelectedPlan(selectedPlan === "unlimited" ? null : "unlimited")
            }
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Unlimited
              </h2>
              <div className="inline-block bg-gradient-to-r from-[#0a4a78] to-[#4ec5ff] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                POPULAR
              </div>

              <p className="mb-6">
                <strong className="text-4xl font-bold bg-gradient-to-r from-[#0a4a78] to-[#4ec5ff] bg-clip-text text-transparent">
                  9.99$
                </strong>
                <span className="text-sm font-medium text-gray-500 ml-1">
                  /One Time
                </span>
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className={`w-5 h-5 ${selectedPlan === "unlimited" ? "text-green-500" : "text-gray-400"}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                <span className="text-gray-700"> Unlimited PDF Upload </span>
              </li>

              <li className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className={`w-5 h-5 ${selectedPlan === "unlimited" ? "text-green-500" : "text-gray-400"}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                <span className="text-gray-700"> Unlimited Notes Taking </span>
              </li>

              <li className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className={`w-5 h-5 ${selectedPlan === "unlimited" ? "text-green-500" : "text-gray-400"}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                <span className="text-gray-700"> Email support </span>
              </li>

              <li className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className={`w-5 h-5 ${selectedPlan === "unlimited" ? "text-green-500" : "text-gray-400"}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                <span className="text-gray-700"> Help center access </span>
              </li>
            </ul>

            <div className="mt-3">
              {" "}
              <PayPalScriptProvider                options={{
                  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                  components: "buttons",
                  intent: "capture",
                  vault: false,
                  dataPopup: {
                    size: "small",
                  },
                }}
              >
                <PayPalButtons
                  onApprove={() => onPaymentSuccess()}
                  onCancel={() => console.log("Payment Cancel")}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: "9.99",
                            currency_code: "USD",
                          },
                        },
                      ],
                    });
                  }}
                />
              </PayPalScriptProvider>
            </div>
          </div>

          {/* Free Plan Card */}
          <div
            className={`rounded-3xl border-2 p-6 pb-4 shadow-lg bg-gradient-to-br from-white to-gray-50 cursor-pointer transition-all duration-200 w-full sm:w-[380px] hover:shadow-xl hover:scale-102 ${
              selectedPlan === "free"
                ? "border-[#0a4a78] shadow-2xl ring-2 ring-[#0a4a78] ring-opacity-20"
                : "border-gray-200 hover:border-[#4ec5ff]"
            }`}
            onClick={() =>
              setSelectedPlan(selectedPlan === "free" ? null : "free")
            }
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Free</h2>

              <p className="mb-6">
                <strong className="text-4xl font-bold bg-gradient-to-r from-[#0a4a78] to-[#4ec5ff] bg-clip-text text-transparent">
                  0$
                </strong>
                <span className="text-sm font-medium text-gray-500 ml-1">
                  /month
                </span>
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className={`w-5 h-5 ${selectedPlan === "free" ? "text-green-500" : "text-gray-400"}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                <span className="text-gray-700"> 5 PDF Upload </span>
              </li>

              <li className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className={`w-5 h-5 ${selectedPlan === "free" ? "text-green-500" : "text-gray-400"}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                <span className="text-gray-700"> Unlimited Notes Taking </span>
              </li>

              <li className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className={`w-5 h-5 ${selectedPlan === "free" ? "text-green-500" : "text-gray-400"}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                <span className="text-gray-700"> Email support </span>
              </li>

              <li className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className={`w-5 h-5 ${selectedPlan === "free" ? "text-green-500" : "text-gray-400"}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                <span className="text-gray-700"> Help center access </span>
              </li>
            </ul>

            <div className="flex justify-center mt-6 mb-4">
              <button className="relative overflow-hidden rounded-full border-2 border-[#0a4a78] bg-white text-[#0a4a78] px-8 py-3 text-center text-sm font-bold hover:bg-gradient-to-r hover:from-[#0a4a78] hover:to-[#4ec5ff] hover:text-white hover:border-transparent hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out min-w-[160px] focus:outline-none focus:ring-2 focus:ring-[#0a4a78] focus:ring-opacity-50 group">
                <span className="relative z-10">✓ Current Plan</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a4a78] to-[#4ec5ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpgradePlans;
