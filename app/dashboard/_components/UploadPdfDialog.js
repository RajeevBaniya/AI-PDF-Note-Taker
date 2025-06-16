"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { DialogClose } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Loader2Icon, Upload } from 'lucide-react'
import uuid4 from 'uuid4'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { toast } from 'sonner'

function UploadPdfDialog({children, isMaxFile}) {
    const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
    const addFileEntry = useMutation(api.fileStorage.AddFileEntryToDb);
    const getFileUrl = useMutation(api.fileStorage.getFileUrl);
    const embeddDocument = useAction(api.myAction.ingest);
    const {user} = useUser();
    const [file, setFile] = useState();
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const [open, setOpen] = useState(false);

    const OnFileSelect = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        if (selectedFile && !fileName) {
            setFileName(selectedFile.name.replace('.pdf', ''));
        }
    }

    const OnUpload = async () => {
        if (!file) {
            toast.error('Please select a file first!');
            return;
        }
        if (!fileName.trim()) {
            toast.error('Please enter a file name!');
            return;
        }

        setLoading(true);
        try {
            // Step 1: Get a short-lived upload URL
            const postUrl = await generateUploadUrl();

            // Step 2: POST the file to the URL
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file?.type },
                body: file,
            });
            const { storageId } = await result.json();
            const fileId = uuid4();
            const fileUrl = await getFileUrl({storageId: storageId})

            // Step 3: Save the newly allocated storage id to the database
            await addFileEntry({
                fileId: fileId,
                storageId: storageId,
                fileName: fileName.trim(),
                fileUrl: fileUrl,
                createdBy: user?.primaryEmailAddress?.emailAddress
            });

            // API call to fetch PDF process Data
            const ApiResp = await axios.get('/api/pdf-loader?pdfUrl=' + fileUrl);
            await embeddDocument({
                splitText: ApiResp.data.result,
                fileId: fileId
            });

            toast.success('File Uploaded Successfully!');
            setOpen(false);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload file. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div onClick={isMaxFile ? undefined : () => setOpen(true)}>
                    {children}
                </div>
            </DialogTrigger>
            <DialogContent className="w-[300px] sm:w-[340px] md:w-[360px] p-3 sm:p-3.5 mx-auto rounded-2xl" showCloseButton={false}>
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-base sm:text-lg font-medium text-center">Upload PDF File</DialogTitle>
                    <DialogDescription asChild>
                        <div className="space-y-2.5 sm:space-y-3">
                            <div>
                                <h2 className="text-sm font-medium mb-1.5">Select a file to Upload</h2>
                                <label 
                                    className="flex flex-col items-center justify-center w-full h-[4.5rem] sm:h-20 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex flex-col items-center justify-center px-3 sm:px-4 py-2">
                                        <Upload className="w-4 sm:w-5 h-4 sm:h-5 mb-1 text-gray-500" />
                                        <p className="text-xs sm:text-sm text-gray-500 text-center">
                                            <span className="font-medium">Click to upload</span> or drag and drop
                                        </p>
                                        {file && (
                                            <p className="text-[11px] sm:text-xs text-green-600 mt-0.5 font-medium truncate max-w-full">
                                                Selected: {file.name}
                                            </p>
                                        )}
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="application/pdf"
                                        className="hidden"
                                        onChange={OnFileSelect}
                                    />
                                </label>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium block mb-1">File Name</label>
                                <Input 
                                    placeholder="Enter file name" 
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                    className="w-full text-sm rounded-lg focus:ring-2 focus:ring-black focus:ring-offset-1"
                                />
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col gap-1.5 sm:gap-2 mt-3">
                    <Button 
                        onClick={OnUpload} 
                        disabled={loading}
                        className="w-full bg-black hover:bg-gray-800 text-sm py-1.5 sm:py-2 rounded-xl"
                    >
                        {loading ? (
                            <>
                                <Loader2Icon className="animate-spin mr-2 h-3 sm:h-4 w-3 sm:w-4" />
                                Uploading...
                            </>
                        ) : 'Upload'}
                    </Button>
                    <DialogClose asChild>
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full text-sm py-1.5 sm:py-2 rounded-xl border-2"
                        >
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UploadPdfDialog