import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure uploads folder exists
const uploadPath = path.join("public/uploads/");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "track" && file.mimetype !== "audio/mpeg") {
    return cb(new Error("Invalid file type for track. Only MP3 is allowed."), false);
  }
  if (
    file.fieldname === "thumbnail" &&
    !["image/jpeg", "image/png"].includes(file.mimetype)
  ) {
    return cb(new Error("Invalid file type for thumbnail. Only JPG or PNG are allowed."), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});
