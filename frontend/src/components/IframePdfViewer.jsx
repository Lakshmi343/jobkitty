import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X, Download, ZoomIn, ZoomOut, ExternalLink, FileText } from "lucide-react";

const IframePdfViewer = ({ pdfUrl, isOpen, onClose, fileName }) => {
  const [zoom, setZoom] = useState(100);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewError, setPreviewError] = useState(false);

  // Reset zoom when opening modal
  useEffect(() => {
    if (isOpen) setZoom(100);
  }, [isOpen]);

  useEffect(() => {
    if (!pdfUrl) return;
    setPreviewError(false);

    // Prefer Google Docs Viewer for better browser support
    const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
      pdfUrl
    )}&embedded=true`;

    setPreviewUrl(googleDocsUrl);
  }, [pdfUrl]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = fileName || "resume.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {fileName || "Resume Preview"}
            </h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
                <ZoomOut size={16} />
              </Button>
              <span className="text-sm text-gray-600 min-w-[50px] text-center">{zoom}%</span>
              <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 200}>
                <ZoomIn size={16} />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.open(pdfUrl, "_blank")} className="gap-2">
              <ExternalLink size={16} /> Open in New Tab
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
              <Download size={16} /> Download
            </Button>
            <Button variant="outline" size="sm" onClick={onClose} className="gap-2">
              <X size={16} /> Close
            </Button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 bg-gray-100 p-4">
          {previewError ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded shadow-inner">
              <FileText className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-gray-700 text-lg font-medium mb-2">Unable to preview PDF</p>
              <p className="text-gray-500 mb-4 text-sm">
                This PDF cannot be displayed in the browser. Try opening in a new tab or download it.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => window.open(pdfUrl, "_blank")} className="gap-2">
                  <ExternalLink size={16} /> Open in New Tab
                </Button>
                <Button variant="outline" onClick={handleDownload} className="gap-2">
                  <Download size={16} /> Download PDF
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="w-full h-full bg-white rounded shadow-inner overflow-hidden"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
            >
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title="PDF Preview"
                onError={() => setPreviewError(true)}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-gray-50 rounded-b-lg text-center">
          <p className="text-xs text-gray-500">
            Use zoom controls or open in a new tab for a better viewing experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IframePdfViewer;
