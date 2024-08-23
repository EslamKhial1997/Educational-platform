// استيراد المكتبات
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();  // لتحميل متغيرات البيئة من ملف .env

// إنشاء تطبيق Express
const app = express();

// الحصول على الـ URI من ملف .env
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('Error: MONGO_URI is not defined in the environment variables');
  process.exit(1);  // إيقاف التطبيق إذا لم يتم تحديد الـ URI
}

// الاتصال بقاعدة البيانات MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// إعداد راوت للاختبار
app.get('/', (req, res) => {
  res.send('MongoDB connection is working!');
});

// بدء تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
