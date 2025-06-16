"use client"

import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function DeleteConfirmationDialog({ isOpen, onClose, onConfirm, fileName, isDeleting }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[300px] sm:w-[340px] md:w-[360px] p-3.5 mx-auto rounded-2xl" showCloseButton={false}>
        <DialogHeader className="space-y-2">
          <div className="flex justify-center">
            <div className="text-red-500">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <DialogTitle className="text-red-500 text-base font-medium text-center">
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-sm leading-normal text-center">
            Are you sure you want to delete <span className="font-medium text-gray-700">{fileName}</span>?
            <br />
            <span className="block mt-1">
              This action is permanent and will delete the file along with all related notes.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full bg-red-500 text-white rounded-xl py-2 font-medium text-sm hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-white text-gray-600 hover:bg-gray-50 transition-colors duration-200 font-medium text-sm border-2 border-gray-200"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Dashboard() {
  const {user}=useUser();
  const deleteFile = useMutation(api.fileStorage.DeleteFile);
  const [deletingFileId, setDeletingFileId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const fileList=useQuery(api.fileStorage.GetUserFiles,{
    userEmail:user?.primaryEmailAddress?.emailAddress
  });

  // Add state to track if the browser has been refreshed
  const [showPlaceholders, setShowPlaceholders] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('hasRefreshed')) {
      setShowPlaceholders(true);
      // Hide placeholders after 2.5 seconds
      const timer = setTimeout(() => {
        setShowPlaceholders(false);
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      sessionStorage.setItem('hasRefreshed', 'true');
      setShowPlaceholders(false);
    }
  }, []);

  const handleDeleteClick = (e, file) => {
    e.preventDefault(); // Prevent navigation
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;
    
    setDeletingFileId(fileToDelete.fileId);
    try {
      await deleteFile({
        fileId: fileToDelete.fileId,
        storageId: fileToDelete.storageId
      });
      toast.success('File deleted successfully');
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete file. Please try again.');
    } finally {
      setDeletingFileId(null);
    }
  };

  return (
    <div>
      <h2 className='font-medium text-3xl'>Workspace</h2>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-10'>
        {fileList?.length>0?fileList?.map((file,index)=>(
          <div key={file.fileId || index} className="relative group">
            <Link href={'/workspace/'+file.fileId}>
              <div className='flex p-5 shadow-md rounded-md flex-col items-center justify-center border cursor-pointer hover:scale-105 transition-all bg-white'>
                <Image src={'/pdf.png'} alt='file' width={50} height={50}/>
                <h2 className='mt-3 font-medium text-lg'>{file?.fileName}</h2>
              </div>
            </Link>
            <button
              onClick={(e) => handleDeleteClick(e, file)}
              disabled={deletingFileId === file.fileId}
              className="absolute -top-2 -right-2 p-2.5 bg-white border border-gray-200 hover:border-red-300 text-gray-500 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-110 shadow-lg hover:shadow-xl"
              title="Delete file"
            >
              {deletingFileId === file.fileId ? (
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        ))
        : showPlaceholders ? [1,2,3,4,5,6,7].map((item,index)=>(
          <div key={index} className='bg-slate-200 rounded-md h-[150px] animate-pulse'></div>
        )) : null}
      </div>

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setFileToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        fileName={fileToDelete?.fileName}
        isDeleting={deletingFileId === fileToDelete?.fileId}
      />
    </div>
  );
}

export default Dashboard