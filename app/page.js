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
    <div className="min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f5f6fa] to-[#c7d2fe]">
      {/* Header */}
      <header
        className="flex items-center justify-between w-full px-4 sm:px-12 py-1 sm:py-1 bg-white/60 shadow-md fixed z-20 backdrop-blur-md border-b border-transparent"
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
            className="w-[130px] h-auto"
          />
        </div>
        <button
          className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-full font-semibold shadow hover:from-indigo-500 hover:to-blue-600 transition text-base sm:text-lg"
          onClick={() => router.push("/sign-in")}
        >
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col lg:flex-row items-center justify-center min-h-[90vh] pt-10 sm:pt-16 lg:pt-24 relative overflow-visible max-w-7xl mx-auto px-2 sm:px-4 gap-y-10 lg:gap-x-40"
      >
        {/* Decorative background blob */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -z-10 w-[700px] h-[700px] bg-gradient-to-tr from-blue-400 via-indigo-300 to-purple-200 opacity-20 rounded-full blur-3xl"></div>

        {/* Left Side: Text and Buttons */}
        <div className="flex-1 flex flex-col items-center lg:items-start justify-center gap-4 w-full max-w-2xl mx-auto px-2 sm:px-4 mt-8 sm:mt-12 lg:mt-0">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold mb-2 sm:mb-4 leading-tight drop-shadow-lg mt-5 text-center lg:text-left whitespace-normal">
            <span className="whitespace-nowrap">
              <span className="text-blue-600">AI-Powered </span>
              <span className="text-red-500">PDF</span>
            </span>
            <br />
            <span className="text-indigo-500 mx-auto lg:ml-12 lg:mx-0 block w-fit">Note Taking</span>
          </h1>
          {/* Subtitle and Quick Benefits Row Centered */}
          <h2 className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-2xl mb-4 sm:mb-6 text-center mx-auto">
            Effortlessly extract insights and summaries from any PDF.<br />
            Your smarter, faster and more organized study companion.
          </h2>
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start mb-6 sm:mb-8 text-sm sm:text-base md:text-lg max-w-xl w-full ml-0 lg:ml-24">
            <span className="bg-blue-100 text-blue-700 px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm shadow">
              Instant Summaries
            </span>
            <span className="bg-indigo-100 text-indigo-700 px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm shadow">
              Smart Notes
            </span>
            <span className="bg-pink-100 text-pink-700 px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm shadow">
              Export to PDF
            </span>
          </div>
        </div>
        {/* Right Side: Animated PDF Icon in Circle with Red-Circled PDF Icons in a Ring */}
        <div className="flex-1 flex justify-center items-center lg:justify-end lg:items-center w-full h-full min-h-[180px] sm:min-h-[220px] md:min-h-[300px]">
          <div className="hidden lg:block" style={{ height: "60px" }}></div>
          <div
            className="relative flex justify-center items-center w-full h-full pr-0 sm:pr-4 lg:pr-12 ring-pdf-responsive"
          >
            {/* Main Bouncing PDF Icon in Circle */}
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-2xl border-4 border-red-100 flex items-center justify-center z-10 ring-pdf-center"
            >
              <FaFilePdf
                className="text-red-400 drop-shadow-lg animate-bounce"
                style={{ fontSize: 'var(--center-icon-size)' }}
              />
            </span>
          </div>
        </div>
        <style jsx>{`
          .ring-pdf-responsive {
            --ring-radius: 200px;
            --icon-size: 48px;
            --center-icon-size: 240px;
            width: 400px;
            height: 400px;
          }
          .ring-pdf-center {
            width: 400px;
            height: 400px;
          }
          @media (max-width: 1024px) {
            .ring-pdf-responsive {
              --ring-radius: 160px;
              --icon-size: 40px;
              --center-icon-size: 180px;
              width: 300px;
              height: 300px;
            }
            .ring-pdf-center {
              width: 300px;
              height: 300px;
            }
          }
          @media (max-width: 640px) {
            .ring-pdf-responsive {
              --ring-radius: 100px;
              --icon-size: 28px;
              --center-icon-size: 130px;
              width: 200px;
              height: 200px;
            }
            .ring-pdf-center {
              width: 200px;
              height: 200px;
            }
          }
        `}</style>
      </motion.section>


      {/* Features Section */}
      <section className="max-w-6xl mt-5 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 py-6 sm:py-10 lg:py-16 px-2 sm:px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/80 rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center hover:scale-105 transition-transform duration-200 backdrop-blur-md border border-blue-100"
        >
          <FaTag className="text-4xl text-blue-500 mb-4" />
          <h3 className="font-bold text-xl mb-2">Affordable</h3>
          <p className="text-gray-600 text-center">
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
          <FaBolt className="text-4xl text-yellow-500 mb-4" />
          <h3 className="font-bold text-xl mb-2">Lightning Fast</h3>
          <p className="text-gray-600 text-center">
            Instantly process and summarize PDFs with AI. No waiting, just
            results.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/80 rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center hover:scale-105 transition-transform duration-200 backdrop-blur-md border border-pink-100"
        >
          <FaHeart className="text-4xl text-pink-500 mb-4" />
          <h3 className="font-bold text-xl mb-2">Loved by Users</h3>
          <p className="text-gray-600 text-center">
            Helpfull for students and researchers.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full py-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 text-center text-gray-500 text-sm mt-10">
        &copy; {new Date().getFullYear()} NoteAI. All rights reserved.
      </footer>
    </div>
  );
}
