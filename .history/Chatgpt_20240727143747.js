const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// الاتصال بMongoDB
mongoose.connect('mongodb://localhost:27017/shop', { useNewUrlParser: true, useUnifiedTopology: true });

// تعريف الشيمات والنماذج
const couponSchema = new mongoose.Schema({
  code: String,
  discount: Number,
  valid: Boolean
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number
});

const Coupon = mongoose.model('Coupon', couponSchema);
const Product = mongoose.model('Product', productSchema);

// API للتحقق من الكوبون وإضافة المنتج للسلة
app.post('/api/addToCart', async (req, res) => {
  const { productId, couponCode } = req.body;

  try {
    // البحث عن المنتج
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ error: 'Product not found' });
    }

    // التحقق من الكوبون
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });
      if (!coupon || !coupon.valid) {
        return res.status(400).json({ error: 'Invalid coupon' });
      }
      discount = coupon.discount;
    }

    // حساب السعر النهائي بعد الخصم
    const finalPrice = product.price - (product.price * (discount / 100));

    // هنا يمكنك حفظ معلومات السلة في الداتابيز على حسب التصميم الخاص بك

    res.json({ message: 'Product added to cart', finalPrice });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// تشغيل السيرفر
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
