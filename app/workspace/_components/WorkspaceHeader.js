import { Button } from '@/components/tiptap-ui-primitive/button'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'
import { useSave } from './SaveContext'

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
        <div className='p-2 flex  justify-between shadow-md'>
          <Image src={'/logo.png'} alt='logo' width={110} height={10} />
          <h2 className='mt-5 font-bold'>{fileName}</h2>
          <div className="flex items-center pr-2 gap-3">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-[#0a4a78] to-[#4ec5ff] !text-white font-semibold px-10 py-3 text-lg rounded-xl shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 ease-in-out hover:from-[#083d63] hover:to-[#3bb8ff] border-0 min-w-[120px] h-12 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{color: 'white !important'}}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <UserButton />
          </div>
        </div>
    </div>
  )
}

export default WorkspaceHeader