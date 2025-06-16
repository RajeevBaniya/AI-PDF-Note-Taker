import { Button } from '@/components/tiptap-ui-primitive/button'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'
import { useSave } from './SaveContext'
import { Save } from 'lucide-react'

function WorkspaceHeader({fileName}) {
  const { triggerSave, isSaving } = useSave()

  const handleSave = async () => {
    try {
      await triggerSave()
    } catch (error) {
      // Error is already handled in TextEditor, just log here
      console.error("Save button error:", error)
    }
  }

  return (
    <div>
      <div className='px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between bg-white border-b'>
        <div className='flex items-center gap-3 sm:gap-6 min-w-0'>
          <Image src={'/logo.png'} alt='logo' width={110} height={10} className='w-[90px] sm:w-[110px] h-auto' />
          <h2 className='text-base sm:text-lg font-semibold text-gray-700 truncate'>{fileName}</h2>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-[#0a4a78] to-[#4ec5ff] text-white font-medium px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg shadow hover:shadow-md hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-xs sm:text-sm"
          >
            {isSaving ? (
              <>
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="hidden sm:inline">Saving...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : (
              <>
                <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Save</span>
              </>
            )}
          </Button>
          <UserButton 
            afterSignOutUrl="/sign-in" 
            appearance={{
              elements: {
                avatarBox: "w-7 h-7 sm:w-8 sm:h-8",
                userButtonPopover: "right-0 sm:right-1 top-[120%]"
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default WorkspaceHeader