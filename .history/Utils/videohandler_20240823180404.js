const storage = multer.memoryStorage(); // لتخزين الفيديو في الذاكرة
const upload = multer({ storage: storage });