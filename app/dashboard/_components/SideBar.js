"use client"

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Layout, Shield } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import UploadPdfDialog from './UploadPdfDialog'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

function SideBar() {
    const {user}=useUser();

    const path=usePathname();
    const GetUserInfo=useQuery(api.user.GetUserInfo,{
        userEmail:user?.primaryEmailAddress?.emailAddress
    })

    console.log(GetUserInfo)

    const fileList=useQuery(api.fileStorage.GetUserFiles,{
        userEmail:user?.primaryEmailAddress?.emailAddress
    });

  return (
    <div className='shadow-md h-screen flex flex-col p-4'>
        <Image src={'/logo.png'} alt='logo' width={130} height={10} className='mb-6' />

        <div className='w-full'>
            <UploadPdfDialog isMaxFile={(fileList?.length>=5&&!GetUserInfo.upgrade)?true:false}>
                <Button
                    disabled={fileList?.length >= 5 && !GetUserInfo.upgrade}
                    className='w-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg py-3 px-4 font-medium mb-4'
                >
                    + Upload PDF File
                </Button>
            </UploadPdfDialog>
            <Link href={'/dashboard'}>
                <div className={`flex gap-3 items-center p-3 hover:bg-blue-50 rounded-lg cursor-pointer w-full mt-4
                ${path=='/dashboard'&&'bg-slate-200'}`}>
                    <Layout className='w-5 h-5' />
                    <h2 className='font-medium'>Workspace</h2>
                </div>
            </Link>

            <Link href={'/dashboard/upgrade'}>
                <div className={`flex gap-3 items-center p-3 mt-4 hover:bg-blue-50 rounded-lg cursor-pointer w-full
                ${path=='/dashboard/upgrade'&&'bg-slate-200'}
                `}>
                    <Shield className='w-5 h-5' />
                    <h2 className='font-medium'>Upgrade</h2>
                </div>
            </Link>
        </div>
        {!GetUserInfo?.upgrade && <div className="w-full mt-auto mb-16">
            <Progress value={(fileList?.length/5)*100} className="mb-3"/>
            <p className='text-sm font-medium'>{fileList?.length} out of 5 Pdf Uploaded</p>
            <p className='text-sm text-gray-500 mt-1'>Upgrade to Upload more PDF</p>
        </div>}
    </div>
  )
}

export default SideBar