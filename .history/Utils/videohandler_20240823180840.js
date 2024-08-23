const multer = require("multer");

const storage = multer.memoryStorage(); // لتخزين الفيديو في الذاكرة
exports.upload = multer({ storage: storage });