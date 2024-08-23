const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const dbCollection = require("./config/config");

dbCollection();
const app = express();
// إعداد التخزين لملفات الفيديو
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // تأكد من وجود مجلد 'uploads'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // اسم الملف الفريد
  },
});

// إعداد multer لرفع الفيديوهات
const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, // تحديد الحجم الأقصى للملف (مثال: 100MB)
  fileFilter: function (req, file, cb) {
    const filetypes = /mp4|mkv|avi/; // أنواع الفيديو المسموح بها
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Only video files are allowed!");
    }
  },
}).single("video"); // 'video' هو اسم الحقل في الطلب

// إعداد الراوت لرفع الفيديو
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err });
    } else {
      if (req.file === undefined) {
        res.status(400).send({ message: "No file selected" });
      } else {
        res.send({ message: "File uploaded successfully", file: req.file });
      }
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
