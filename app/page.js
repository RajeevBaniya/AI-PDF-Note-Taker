"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaBolt,
  FaHeart,
  FaTag,
  FaRobot,
  FaFilePdf
} from "react-icons/fa";
import { motion } from "framer-motion";

// Precomputed positions for 10 icons in a ring (x, y pairs)
const RING_POSITIONS = [
  { x: 0, y: -1 },
  { x: 0.5878, y: -0.8090 },
  { x: 0.9511, y: -0.3090 },
  { x: 0.9511, y: 0.3090 },
  { x: 0.5878, y: 0.8090 },
  { x: 0, y: 1 },
  { x: -0.5878, y: 0.8090 },
  { x: -0.9511, y: 0.3090 },
  { x: -0.9511, y: -0.3090 },
  { x: -0.5878, y: -0.8090 },
];

export default function Home() {
  const { user } = useUser();
  const createUser = useMutation(api.user.createUser);
  const router = useRouter();

  useEffect(() => {
    user && CheckUser();
  }, [user]);

  const CheckUser = async () => {
    const result = await createUser({
      email: user?.primaryEmailAddress?.emailAddress,
      imageUrl: user?.imageUrl,
      userName: user?.fullName,
    });
    console.log(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f5f6fa] to-[#c7d2fe] overflow-x-hidden">
      {/* Header */}
      <header
        className="flex items-center justify-between w-full px-4 sm:px-12 py-2 sm:py-3 bg-white/60 shadow-md fixed z-20 backdrop-blur-md border-b border-transparent"
        style={{
          borderImage: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%) 1",
          borderBottomWidth: "3px",
        }}
      >
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={130}
            height={40}
            priority
            className="w-[100px] sm:w-[130px] h-auto"
          />
        </div>
        <button
          className="px-4 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-[#0a4a78] to-[#4ec5ff] text-white rounded-full text-sm sm:text-base font-semibold shadow hover:shadow-md hover:opacity-90 transition-all duration-200"
          onClick={() => router.push("/sign-in")}
        >
          Sign In
        </button>
      </header>

      {/* Main Content Container */}
      <div className="pt-16 sm:pt-20 lg:pt-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] relative overflow-visible max-w-7xl mx-auto px-4 sm:px-6 gap-y-10 lg:gap-x-40 mt-8 sm:mt-12 lg:mt-4"
        >
          {/* Decorative background blob */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -z-10 w-[700px] h-[700px] bg-gradient-to-tr from-blue-400 via-indigo-300 to-purple-200 opacity-20 rounded-full blur-3xl"></div>

          {/* Left Side: Text and Buttons */}
          <div className="flex-1 flex flex-col items-center lg:items-start justify-center gap-4 w-full max-w-2xl">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight drop-shadow-lg text-center lg:text-left">
              <span className="whitespace-nowrap">
                <span className="text-blue-600">AI-Powered </span>
                <span className="text-red-500">PDF</span>
              </span>
              <br />
              <span className="text-indigo-500 mx-auto lg:ml-12 lg:mx-0 block w-fit">Note Taking</span>
            </h1>

            {/* Subtitle */}
            <div className="max-w-2xl text-center lg:text-left mt-2 sm:mt-4">
              <p className="text-[#1e293b] text-lg sm:text-xl md:text-2xl font-normal">
                Effortlessly extract insights and summaries from any PDF.
                Your smarter, faster and more organized study companion.
              </p>
            </div>

            {/* Feature Tags */}
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start mt-6 sm:mt-8">
              <span className="bg-blue-100 text-blue-700 px-4 sm:px-5 py-2 rounded-full font-semibold text-sm sm:text-base shadow">
                Instant Summaries
              </span>
              <span className="bg-indigo-100 text-indigo-700 px-4 sm:px-5 py-2 rounded-full font-semibold text-sm sm:text-base shadow">
                Smart Notes
              </span>
              <span className="bg-pink-100 text-pink-700 px-4 sm:px-5 py-2 rounded-full font-semibold text-sm sm:text-base shadow">
                Export to PDF
              </span>
            </div>
          </div>

          {/* Right Side: PDF Icon */}
          <div className="flex-1 flex justify-center items-center">
            <div className="relative w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px] flex items-center justify-center">
              <div className="absolute inset-0 bg-white rounded-full shadow-2xl border-4 border-red-100 flex items-center justify-center">
                <FaFilePdf className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 text-red-400 drop-shadow-lg animate-bounce" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 py-16 sm:py-20 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/80 rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center hover:scale-105 transition-transform duration-200 backdrop-blur-md border border-blue-100"
          >
            <FaTag className="text-3xl sm:text-4xl text-blue-500 mb-4" />
            <h3 className="font-bold text-lg sm:text-xl mb-2">Affordable</h3>
            <p className="text-gray-600 text-center text-sm sm:text-base">
              Flexible plans for all. Start free, upgrade anytime.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/80 rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center hover:scale-105 transition-transform duration-200 backdrop-blur-md border border-indigo-100"
          >
            <FaBolt className="text-3xl sm:text-4xl text-yellow-500 mb-4" />
            <h3 className="font-bold text-lg sm:text-xl mb-2">Lightning Fast</h3>
            <p className="text-gray-600 text-center text-sm sm:text-base">
              Instantly process and summarize PDFs with AI. No waiting, just results.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/80 rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center hover:scale-105 transition-transform duration-200 backdrop-blur-md border border-pink-100"
          >
            <FaHeart className="text-3xl sm:text-4xl text-pink-500 mb-4" />
            <h3 className="font-bold text-lg sm:text-xl mb-2">Loved by Users</h3>
            <p className="text-gray-600 text-center text-sm sm:text-base">
              Helpful for students and researchers.
            </p>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="w-full py-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 text-center text-gray-500 text-xs sm:text-sm">
          &copy; {new Date().getFullYear()} NoteAI. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
