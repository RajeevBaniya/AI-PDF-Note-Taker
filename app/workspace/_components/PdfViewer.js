import React, { useEffect, useState } from 'react'

function PdfViewer({ file }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (file) {
      // Check if the file is accessible
      fetch(file)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to load PDF');
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error('PDF loading error:', err);
          setError('Failed to load PDF. Please try again.');
          setIsLoading(false);
        });
    }
  }, [file]);

  if (!file) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-gray-500">No PDF file available</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Mobile/Tablet zoom hint */}
      <div className="lg:hidden text-xs text-center py-2 text-gray-500 bg-gray-50 border-b">
        Pinch to zoom • Double tap to fit • Scroll to navigate
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 relative">
        <object
          data={`${file}#view=FitH`}
          type="application/pdf"
          className="absolute inset-0 w-full h-full"
          style={{ 
            border: 'none',
            backgroundColor: 'white'
          }}
        >
          <div className="flex items-center justify-center h-full bg-gray-50">
            <a 
              href={file} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Open PDF in new tab
            </a>
          </div>
        </object>
      </div>
    </div>
  )
}

export default PdfViewer