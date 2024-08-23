// استيراد المكتبات
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config({ path: "config.env" });  // لتحميل متغيرات البيئة من ملف .env

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

// راوت لاختبار رفع الفيديو إلى سيرفر خارجي
app.post('/upload-video', async (req, res) => {
  try {
    const videoPath = './path-to-your-video/video.mp4';  // مسار الفيديو الذي تريد رفعه
    const form = new FormData();

    // قراءة ملف الفيديو كـ stream
    const videoStream = fs.createReadStream(videoPath);

    // إضافة ملف الفيديو إلى FormData
    form.append('video', videoStream, path.basename(videoPath));

    // إرسال الفيديو إلى السيرفر الخارجي باستخدام Axios
    const response = await axios.post('https://example.com/upload', form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    // طباعة الرد من السيرفر الخارجي
    console.log('File uploaded successfully:', response.data);
    res.send({ message: 'File uploaded successfully!', data: response.data });

  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).send({ error: 'Failed to upload video' });
  }
});

// إعداد راوت للاختبار
app.get('/', (req, res) => {
  res.send('MongoDB connection and video upload route are working!');
});

// بدء تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
