import multer from "multer";

const storage = multer.memoryStorage();
export const singleUpload = multer({storage}).single("file");
export const resumeUpload = multer({ storage }).single("resume");
