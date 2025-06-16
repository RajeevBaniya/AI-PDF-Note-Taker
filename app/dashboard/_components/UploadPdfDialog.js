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
            <DialogContent className="sm:max-w-[425px] md:max-w-[500px] p-4 sm:p-6">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-semibold text-center sm:text-left">Upload PDF File</DialogTitle>
                    <DialogDescription asChild>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h2 className="text-sm font-medium">Select a file to Upload</h2>
                                <div className="flex flex-col items-center justify-center w-full">
                                    <label 
                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 hover:bg-gray-100"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                                            <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                            <p className="mb-2 text-sm text-gray-500 text-center">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 text-center">PDF files only</p>
                                            {file && (
                                                <p className="text-xs text-green-600 mt-2 font-medium">
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
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">File Name</label>
                                <Input 
                                    placeholder="Enter file name" 
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 mt-6">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" className="w-full sm:w-auto">
                            Close
                        </Button>
                    </DialogClose>
                    <Button 
                        onClick={OnUpload} 
                        disabled={loading} 
                        className="w-full sm:w-auto"
                    >
                        {loading ? (
                            <>
                                <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                                Uploading...
                            </>
                        ) : 'Upload'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UploadPdfDialog