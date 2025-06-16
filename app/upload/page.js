"use client"

import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useAction, useMutation, useQuery } from 'convex/react';
import { Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';
import uuid4 from 'uuid4';
import Image from 'next/image';

export default function UploadPage() {
  const router = useRouter();
  const { user } = useUser();
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFileEntry = useMutation(api.fileStorage.AddFileEntryToDb);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const embeddDocument = useAction(api.myAction.ingest);
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  // Get user info to check upgrade status
  const GetUserInfo = useQuery(api.user.GetUserInfo, {
    userEmail: user?.primaryEmailAddress?.emailAddress
  });

  // Get current file count
  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress
  });

  const isMaxFile = !GetUserInfo?.upgrade && fileList?.length >= 5;

  const onFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Set filename from the file if not already set
      if (!fileName) {
        setFileName(selectedFile.name.replace('.pdf', ''));
      }
    }
  };

  const onUpload = async () => {
    if (!file) {
      toast.error('Please select a PDF file to upload');
      return;
    }

    if (!fileName.trim()) {
      toast.error('Please enter a file name');
      return;
    }

    if (isMaxFile) {
      toast.error('You have reached the maximum number of files. Please upgrade to upload more.');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Get upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: Upload the file
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file?.type },
        body: file,
      });
      const { storageId } = await result.json();

      // Step 3: Get the file URL
      const fileUrl = await getFileUrl({ storageId: storageId });
      const fileId = uuid4();

      // Step 4: Save to database
      await addFileEntry({
        fileId: fileId,
        storageId: storageId,
        fileName: fileName.trim(),
        fileUrl: fileUrl,
        createdBy: user?.primaryEmailAddress?.emailAddress
      });

      // Step 5: Process the PDF
      const ApiResp = await fetch('/api/pdf-loader?pdfUrl=' + fileUrl);
      if (!ApiResp.ok) throw new Error('Failed to process PDF');
      const data = await ApiResp.json();

      // Step 6: Save the processed data
      await embeddDocument({
        splitText: data.result,
        fileId: fileId
      });

      toast.success('File uploaded successfully!');
      router.push('/workspace/' + fileId);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f5f6fa] to-[#c7d2fe] p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Upload PDF</h1>
            {!GetUserInfo?.upgrade && (
              <div className="text-sm text-gray-500">
                {fileList?.length || 0}/5 files used
              </div>
            )}
          </div>

          {isMaxFile ? (
            <div className="text-center py-8">
              <Image 
                src="/upgrade.png" 
                alt="Upgrade" 
                width={200} 
                height={200} 
                className="mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">Storage Full</h2>
              <p className="text-gray-600 mb-4">
                You've reached the maximum number of files (5) for the free plan.
              </p>
              <button
                onClick={() => router.push('/dashboard/upgrade')}
                className="px-6 py-2 bg-gradient-to-r from-[#0a4a78] to-[#4ec5ff] text-white rounded-full font-medium shadow hover:shadow-md hover:opacity-90 transition-all duration-200"
              >
                Upgrade Now
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select PDF File
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="application/pdf"
                            onChange={onFileSelect}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF up to 10MB</p>
                    </div>
                  </div>
                  {file && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {file.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File Name
                  </label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Enter file name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => router.back()}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onUpload}
                    disabled={loading || !file}
                    className="px-6 py-2 bg-gradient-to-r from-[#0a4a78] to-[#4ec5ff] text-white rounded-lg font-medium shadow hover:shadow-md hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2Icon className="animate-spin w-4 h-4" />
                        Uploading...
                      </>
                    ) : (
                      'Upload'
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 