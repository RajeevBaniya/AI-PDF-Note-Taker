import React from 'react'

function PdfViewer({ file }) {
  if (!file) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-gray-500">No PDF file available</div>
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
        <iframe
          src={file + "#toolbar=0&zoom=page-fit"}
          className="absolute inset-0 w-full h-full"
          style={{ 
            border: 'none',
            backgroundColor: 'white',
            WebkitOverflowScrolling: 'touch',
            overflow: 'auto'
          }}
          title="PDF Viewer"
          loading="lazy"
        />
      </div>
    </div>
  )
}

export default PdfViewer