import React, { useState } from 'react';
import { Button } from './ui/button';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';

const IframePdfViewer = ({ pdfUrl, isOpen, onClose, fileName }) => {
  const [zoom, setZoom] = useState(100);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName || 'resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {fileName || 'Resume Preview'}
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
              >
                <ZoomOut size={16} />
              </Button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center">
                {zoom}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
              >
                <ZoomIn size={16} />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download size={16} />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="gap-2"
            >
              <X size={16} />
              Close
            </Button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 p-4 bg-gray-100">
          <div 
            className="w-full h-full bg-white rounded shadow-inner overflow-auto"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
          >
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
              className="w-full h-full border-0"
              title="PDF Preview"
              style={{
                width: zoom <= 100 ? '100%' : `${100 * (100 / zoom)}%`,
                height: zoom <= 100 ? '100%' : `${100 * (100 / zoom)}%`,
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-gray-50 rounded-b-lg">
          <p className="text-xs text-gray-500 text-center">
            Use browser controls for additional PDF features. Some PDFs may require direct download to view properly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IframePdfViewer;
