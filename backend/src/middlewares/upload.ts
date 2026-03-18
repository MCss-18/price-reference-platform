import multer from "multer";
import path from "path";

export const createUploader = (folderName: string) => {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, `uploads/${folderName}`);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${uniqueSuffix}${ext}`);
    },
  });

  return multer({ storage });
};