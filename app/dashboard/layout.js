"use client"

import React, { useState, useEffect } from 'react'
import SideBar from './_components/SideBar'
import Header from './_components/Header'

function DashboardLayout({children}) {
  const [showSidebar, setShowSidebar] = useState(true);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex">
      {/* Overlay for mobile */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/20 lg:hidden z-30"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-screen w-[280px] bg-white lg:sticky z-40 transform transition-transform duration-200 ease-in-out ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <SideBar onClose={() => setShowSidebar(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 min-h-screen bg-[#F3F4FF]">
        {/* Header */}
        <Header onMenuClick={() => setShowSidebar(true)} />

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout