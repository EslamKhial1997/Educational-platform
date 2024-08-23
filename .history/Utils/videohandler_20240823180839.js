const storage = multer.memoryStorage(); // لتخزين الفيديو في الذاكرة
exports.upload = multe({ storage: storage });