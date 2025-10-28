import multer from "multer";

const storage = multer.memoryStorage();


const multiSingleUpload = multer({ storage }).fields([
  { name: "file", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 },
]);

export const singleUpload = (req, res, next) => {

  if (!req.is('multipart/form-data')) {
    return next();
  }
  multiSingleUpload(req, res, (err) => {
    if (err) return next(err);

    const files = req.files || {};
    req.file = (files.file && files.file[0]) || (files.profilePhoto && files.profilePhoto[0]) || undefined;
    return next();
  });
};

export const resumeUpload = multer({ storage }).single("resume");
