import React from 'react';

const PdfViewer = ({ fileUrl }: { fileUrl: string }) => {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <iframe
        src={fileUrl}
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        title="PDF Viewer"
      />
    </div>
  );
};

export default PdfViewer;
