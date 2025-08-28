import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = ({ fileUrl }) => {
  return (
    <div className="w-full flex justify-center">
      <Document file={fileUrl}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
};

export default PdfViewer;
