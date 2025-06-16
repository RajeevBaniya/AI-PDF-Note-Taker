'use client'

import React, { useEffect, useState } from 'react'
import WorkspaceHeader from '../_components/WorkspaceHeader';
import PdfViewer from '../_components/PdfViewer';
import TextEditor from '../_components/TextEditor';
import { SaveProvider, useSave } from '../_components/SaveContext';
import { FileText, FileTextIcon } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';

// SaveButton component to handle save functionality
function SaveButton() {
  const { triggerSave, isSaving } = useSave();

  const handleSave = async () => {
    try {
      await triggerSave();
      toast.success('Notes saved successfully!', {
        id: 'save-notes', // Using an ID to prevent duplicate toasts
      });
    } catch (error) {
      toast.error('Failed to save notes. Please try again.', {
        id: 'save-notes',
      });
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={isSaving}
      className="px-5 py-1.5 bg-gradient-to-r from-[#0a4a78] to-[#4ec5ff] text-white rounded-full text-sm font-medium hover:opacity-90 transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
    >
      {isSaving ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        'Save'
      )}
    </button>
  );
}

export default function WorkspacePage({ params }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const fileId = unwrappedParams.fileId;

  // Add file name query
  const fileDetails = useQuery(api.fileStorage.GetFileRecord, {
    fileId: unwrappedParams.fileId
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPdf, setShowPdf] = useState(true);
  const [showEditor, setShowEditor] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Update isMobile for more breakpoints
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // Changed from 768 to 1024 for better tablet support
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(`/api/pdf/${fileId}`);
        if (!response.ok) throw new Error('PDF not found');
        const blob = await response.blob();
        setPdfFile(URL.createObjectURL(blob));
      } catch (error) {
        console.error('Error fetching PDF:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPdf();
  }, [fileId]);

  const togglePdf = () => setShowPdf(!showPdf);
  const toggleEditor = () => setShowEditor(!showEditor);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f5f6fa] to-[#c7d2fe]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <SaveProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f5f6fa] to-[#c7d2fe] overflow-hidden">
        {/* Header - Always visible */}
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-6 py-2.5 bg-white shadow-sm">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate max-w-[60%]">
            {fileDetails?.fileName || 'Loading...'}
          </h1>
          <SaveButton />
        </div>

        {/* Mobile/Tablet View Selector - Now positioned below header */}
        {isMobile && (
          <div className="fixed top-[3.25rem] left-0 right-0 z-40 flex justify-center gap-1 py-2 px-4 bg-white border-t border-b border-gray-200">
            <button
              onClick={() => {
                setShowEditor(true);
                setShowPdf(false);
              }}
              className={`px-6 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                showEditor 
                ? 'bg-gradient-to-r from-[#0a4a78] to-[#4ec5ff] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => {
                setShowEditor(false);
                setShowPdf(true);
              }}
              className={`px-6 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                showPdf 
                ? 'bg-gradient-to-r from-[#0a4a78] to-[#4ec5ff] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              PDF
            </button>
          </div>
        )}

        {/* Main Content - Adjust top padding to account for header */}
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} h-screen ${
          isMobile ? 'pt-[5.5rem]' : 'pt-[3.25rem]'
        }`}>
          {/* Desktop View: Always show both */}
          {!isMobile && (
            <>
              <div className="w-1/2 h-screen bg-white/80 backdrop-blur-md shadow-lg relative">
                <TextEditor fileId={fileId} />
              </div>
              <div className="w-1/2 h-screen relative">
                <PdfViewer file={pdfFile} />
              </div>
            </>
          )}
          
          {/* Mobile/Tablet View: Show only active section */}
          {isMobile && (
            <>
              {showEditor && (
                <div className="h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] bg-white/80 backdrop-blur-md shadow-lg relative">
                  <TextEditor fileId={fileId} />
                </div>
              )}
              {showPdf && (
                <div className="h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] relative">
                  <PdfViewer file={pdfFile} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </SaveProvider>
  );
}