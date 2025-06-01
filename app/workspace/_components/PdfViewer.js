import React from 'react'

function PdfViewer({ fileUrl }) {
  return (
    <div>
        <iframe src={fileUrl+"#toolbar=0"} height="90vh" width='100%' className='h-[90vh]'/>
    </div>

    // <div className="h-full w-full">
    //   <iframe
    //     src={fileUrl + "#toolbar=0"}
    //     width="100%"
    //     height="100%"
    //     className="h-full w-full"
    //     style={{ border: 'none' }}
    //     title="PDF Viewer"
    //   />
    // </div>
  )
}

export default PdfViewer