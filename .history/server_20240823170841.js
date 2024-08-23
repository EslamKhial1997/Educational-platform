// استيراد المكتبات
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();  // لتحميل متغيرات البيئة من ملف .env

// إنشاء تطبيق Express
const app = express();


// إعداد راوت للاختبار
app.get('/', (req, res) => {
  res.send('MongoDB connection is working!');
});

// بدء تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
