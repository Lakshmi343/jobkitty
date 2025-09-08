import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X, Download, ZoomIn, ZoomOut, ExternalLink, FileText } from 'lucide-react';

const IframePdfViewer = ({ pdfUrl, isOpen, onClose, fileName }) => {
  const [zoom, setZoom] = useState(100);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewError, setPreviewError] = useState(false);

  if (!isOpen) return null;

  useEffect(() => {
    if (pdfUrl && isOpen) {
      setPreviewError(false);
      
      // Handle Cloudinary URLs
      if (pdfUrl.includes('cloudinary.com')) {
        if (pdfUrl.includes('/raw/upload/')) {
          // Convert raw PDF to viewable format using Google Docs viewer
          setPreviewUrl(`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`);
        } else {
          // For other Cloudinary formats, try direct view first
          setPreviewUrl(pdfUrl);
        }
      } else {
        // For non-Cloudinary URLs, use Google Docs viewer
        setPreviewUrl(`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`);
      }
    }
  }, [pdfUrl, isOpen]);

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
              onClick={() => window.open(pdfUrl, '_blank')}
              className="gap-2"
            >
              <ExternalLink size={16} />
              Open in New Tab
            </Button>
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
          {previewError ? (
            <div className="w-full h-full bg-white rounded shadow-inner flex items-center justify-center">
              <div className="text-center p-8">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to preview PDF</h3>
                <p className="text-gray-600 mb-4">This PDF cannot be displayed in the browser preview.</p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => window.open(pdfUrl, '_blank')} className="gap-2">
                    <ExternalLink size={16} />
                    Open in New Tab
                  </Button>
                  <Button variant="outline" onClick={handleDownload} className="gap-2">
                    <Download size={16} />
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="w-full h-full bg-white rounded shadow-inner overflow-auto"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
            >
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title="PDF Preview"
                style={{
                  width: zoom <= 100 ? '100%' : `${100 * (100 / zoom)}%`,
                  height: zoom <= 100 ? '100%' : `${100 * (100 / zoom)}%`,
                }}
                onError={() => setPreviewError(true)}
                onLoad={(e) => {
                  // Check if iframe loaded successfully
                  try {
                    const iframe = e.target;
                    iframe.onload = () => {
                      // If iframe is empty or has error, show fallback
                      setTimeout(() => {
                        try {
                          if (!iframe.contentDocument && !iframe.contentWindow) {
                            setPreviewError(true);
                          }
                        } catch (err) {
                          // Cross-origin error is expected, PDF is loading
                        }
                      }, 3000);
                    };
                  } catch (err) {
                    // Expected for cross-origin iframes
                  }
                }}
              />
            </div>
          )}
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
