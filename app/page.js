"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaBolt, FaHeart, FaTag, FaRobot, FaFilePdf, FaStar } from "react-icons/fa";

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
      <header className="flex items-center justify-between w-full px-4 sm:px-12 py-1 sm:py-1 bg-white/60 shadow-md fixed z-20 backdrop-blur-md border-b border-transparent"
        style={{
          borderImage: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%) 1",
          borderBottomWidth: "3px"
        }}>
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
          onClick={() => router.push('/sign-in')}
        >
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center min-h-[90vh] pt-32 sm:pt-40 relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -z-10 w-[700px] h-[700px] bg-gradient-to-tr from-blue-400 via-indigo-300 to-purple-200 opacity-20 rounded-full blur-3xl"></div>
        
        {/* AI Icon */}
        <div className="mb-4 flex items-center justify-center">
          <span className="bg-white/70 rounded-full p-4 shadow-lg border border-blue-100">
            <FaRobot className="text-4xl sm:text-5xl text-indigo-500" />
          </span>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-5xl sm:text-7xl font-extrabold mb-4 leading-tight drop-shadow-lg mt-2">
          <span className="text-blue-600">AI-</span>
          <span className="text-indigo-500">Powered</span>
          <span className="text-black"> PDF </span>
          <span className="text-red-500">Note</span>
          <span className="text-black">Taking</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mb-6 mt-1">
          Effortlessly extract insights, summaries, and annotations from any PDF.<br />
          Your smarter, faster and more organized study companion.
        </p>
        
        {/* Quick Benefits Row */}
        <div className="flex flex-wrap gap-4 justify-center mb-8 mt-1">
          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm shadow">Instant Summaries</span>
          <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-semibold text-sm shadow">Smart Notes</span>
          <span className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full font-semibold text-sm shadow">Export to PDF</span>
        </div>
        
        {/* CTA Button */}
        <button
          className="mt-1 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-full font-bold text-lg shadow-xl hover:scale-105 hover:from-indigo-500 hover:to-blue-600 transition-all duration-200 mb-6"
          onClick={() => router.push('/sign-in')}
        >
          Get started
        </button>
        
        {/* Animated PDF Icon (unchanged) */}
        <div className="flex justify-center mb-2 mt-6">
          <FaFilePdf className="text-6xl text-red-400 drop-shadow-lg animate-bounce" />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-10 sm:py-16 px-2 sm:px-4">
        <div className="bg-white/80 rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform duration-200 backdrop-blur-md border border-blue-100">
          <FaTag className="text-4xl text-blue-500 mb-4" />
          <h3 className="font-bold text-xl mb-2">Affordable</h3>
          <p className="text-gray-600 text-center">
            Flexible plans for all. Start free, upgrade anytime.
          </p>
        </div>
        <div className="bg-white/80 rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform duration-200 backdrop-blur-md border border-indigo-100">
          <FaBolt className="text-4xl text-yellow-500 mb-4" />
          <h3 className="font-bold text-xl mb-2">Lightning Fast</h3>
          <p className="text-gray-600 text-center">
            Instantly process and summarize PDFs with AI. No waiting, just results.
          </p>
        </div>
        <div className="bg-white/80 rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform duration-200 backdrop-blur-md border border-pink-100">
          <FaHeart className="text-4xl text-pink-500 mb-4" />
          <h3 className="font-bold text-xl mb-2">Loved by Users</h3>
          <p className="text-gray-600 text-center">
            Trusted by thousands of students and researchers worldwide.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto py-16 px-4">
  <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-indigo-700">How it works</h2>
  <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative mt-8">
    {/* Step 1 */}
    <div className="relative z-10 flex flex-col items-center w-full md:w-1/4">
      <div className="bg-white shadow-lg rounded-full w-20 h-20 flex items-center justify-center mb-4 border-4 border-blue-400">
        <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <h3 className="font-bold text-lg mb-2 text-blue-600">Upload</h3>
      <p className="text-gray-600 text-center">Upload your PDF</p>
    </div>
    {/* Arrow */}
    <div className="hidden md:flex items-center justify-center w-24 h-12">
      <svg width="48" height="32" fill="none" stroke="currentColor" strokeWidth="3" className="text-blue-400">
        <line x1="8" y1="16" x2="40" y2="16" />
        <polyline points="32,8 40,16 32,24" />
      </svg>
    </div>
    {/* Step 2 */}
    <div className="relative z-10 flex flex-col items-center w-full md:w-1/4">
      <div className="bg-white shadow-lg rounded-full w-20 h-20 flex items-center justify-center mb-4 border-4 border-indigo-400">
        <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8M12 8v8" />
        </svg>
      </div>
      <h3 className="font-bold text-lg mb-2 text-indigo-600">Analyze</h3>
      <p className="text-gray-600 text-center">AI analyzes and summarizes</p>
    </div>
    {/* Arrow */}
    <div className="hidden md:flex items-center justify-center w-24 h-12">
      <svg width="48" height="32" fill="none" stroke="currentColor" strokeWidth="3" className="text-blue-400">
        <line x1="8" y1="16" x2="40" y2="16" />
        <polyline points="32,8 40,16 32,24" />
      </svg>
    </div>
    {/* Step 3 */}
    <div className="relative z-10 flex flex-col items-center w-full md:w-1/4">
      <div className="bg-white shadow-lg rounded-full w-20 h-20 flex items-center justify-center mb-4 border-4 border-pink-400">
        <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="font-bold text-lg mb-2 text-pink-600">Take Notes</h3>
      <p className="text-gray-600 text-center">Take notes & export</p>
    </div>
    {/* Arrow */}
    <div className="hidden md:flex items-center justify-center w-24 h-12">
      <svg width="48" height="32" fill="none" stroke="currentColor" strokeWidth="3" className="text-blue-400">
        <line x1="8" y1="16" x2="40" y2="16" />
        <polyline points="32,8 40,16 32,24" />
      </svg>
    </div>
    {/* Step 4 */}
    <div className="relative z-10 flex flex-col items-center w-full md:w-1/4">
      <div className="bg-white shadow-lg rounded-full w-20 h-20 flex items-center justify-center mb-4 border-4 border-green-400">
        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M17 16l4-4m0 0l-4-4m4 4H7" />
        </svg>
      </div>
      <h3 className="font-bold text-lg mb-2 text-green-600">Share</h3>
      <p className="text-gray-600 text-center">Share or sync to your notes app</p>
    </div>
  </div>
</section>

<section className="max-w-5xl mx-auto py-16 px-4">
  <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-8">How NoteAI Can Help You</h2>
  <div className="flex flex-col md:flex-row gap-8 justify-center">
    <div className="bg-white rounded-xl shadow-lg p-8 flex-1 text-center border border-blue-100">
      <h3 className="font-bold text-lg mb-2 text-blue-700">For Students</h3>
      <p className="text-gray-600">Summarize textbooks and take smart notes for exams.</p>
    </div>
    <div className="bg-white rounded-xl shadow-lg p-8 flex-1 text-center border border-indigo-100">
      <h3 className="font-bold text-lg mb-2 text-indigo-700">For Researchers</h3>
      <p className="text-gray-600">Extract key findings from academic papers in seconds.</p>
    </div>
    <div className="bg-white rounded-xl shadow-lg p-8 flex-1 text-center border border-pink-100">
      <h3 className="font-bold text-lg mb-2 text-pink-700">For Professionals</h3>
      <p className="text-gray-600">Quickly review business reports and highlight action items.</p>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="w-full py-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 text-center text-gray-500 text-sm mt-10">
        &copy; {new Date().getFullYear()} NoteAI. All rights reserved.
      </footer>
    </div>
  );
}