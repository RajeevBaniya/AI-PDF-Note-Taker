"use client"

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Layout, Shield, X, Plus } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import UploadPdfDialog from './UploadPdfDialog'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { usePathname, useRouter } from 'next/navigation'

function SideBar({ onClose }) {
    const router = useRouter();
    const path = usePathname();
    const {user}=useUser();
    const fileList=useQuery(api.fileStorage.GetUserFiles,{
        userEmail:user?.primaryEmailAddress?.emailAddress
    });

    const GetUserInfo=useQuery(api.user.GetUserInfo,{
        userEmail:user?.primaryEmailAddress?.emailAddress
    });

    const handleNavigation = (href) => {
        router.push(href);
        // Close sidebar on mobile
        if (window.innerWidth < 1024) {
            onClose();
        }
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Logo Section */}
            <div className="p-4 border-b flex items-center justify-between relative">
                <Image 
                    src={'/logo.png'} 
                    alt='logo' 
                    width={130} 
                    height={40} 
                    priority 
                    className="w-[130px] h-auto" 
                />
                <button 
                    onClick={onClose} 
                    className="lg:hidden absolute top-1 right-3 p-1.5 hover:bg-gray-100 rounded-full transition-colors bg-white shadow-sm"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Upload Button */}
            <div className="p-4">
                <UploadPdfDialog isMaxFile={!GetUserInfo?.upgrade && fileList?.length >= 5}>
                    <button
                        className="w-full bg-black text-white flex gap-2 items-center justify-center py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Upload PDF File
                    </button>
                </UploadPdfDialog>
            </div>

            {/* Navigation */}
            <nav className="px-4 space-y-1">
                <button
                    onClick={() => handleNavigation('/dashboard')}
                    className={`flex gap-3 items-center p-3 w-full rounded-lg transition-colors ${
                        path === '/dashboard' 
                            ? 'bg-gray-100 text-black' 
                            : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                    }`}
                >
                    <Layout className="w-5 h-5" />
                    <span className="font-medium">Workspace</span>
                </button>

                <button
                    onClick={() => handleNavigation('/dashboard/upgrade')}
                    className={`flex gap-3 items-center p-3 w-full rounded-lg transition-colors ${
                        path === '/dashboard/upgrade' 
                            ? 'bg-gray-100 text-black' 
                            : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                    }`}
                >
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Upgrade</span>
                </button>
            </nav>

            {/* Progress Section */}
            {!GetUserInfo?.upgrade && (
                <div className="mt-auto p-4 border-t bg-white">
                    <div className="mb-3">
                        <Progress value={(fileList?.length/5)*100} className="h-2" />
                    </div>
                    <p className="text-sm font-medium">{fileList?.length} out of 5 PDF Uploaded</p>
                    <p className="text-sm text-gray-500 mt-1">Upgrade to Upload more PDF</p>
                </div>
            )}
        </div>
    )
}

export default SideBar;