import { UserButton } from '@clerk/nextjs'
import { Menu } from 'lucide-react'
import React from 'react'

function Header({ onMenuClick }) {
  return (
    <div className='sticky top-0 right-0 w-full flex items-center min-h-[48px] xs:min-h-[56px] sm:min-h-[64px] px-2 xs:px-3 sm:px-4 md:px-6 shadow-sm bg-white/80 backdrop-blur-sm z-10'>
      <div className="flex-1 flex items-center">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <div className="flex items-center">
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10",
              userButtonPopover: "right-0 sm:right-1 top-[120%]",
              userButtonTrigger: "rounded-full hover:opacity-80 transition-opacity"
            }
          }}
        />
      </div>
    </div>
  )
}

export default Header