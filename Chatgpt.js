const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cron = require('node-cron');

// اتصال بقاعدة البيانات
mongoose.connect('mongodb://localhost:27017/company', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());

const managerSchema = new mongoose.Schema({
  name: String,
  points: { type: Number, default: 0 }
});

const adminSchema = new mongoose.Schema({
  name: String
});

const transactionSchema = new mongoose.Schema({
  managerId: mongoose.Schema.Types.ObjectId,
  adminId: mongoose.Schema.Types.ObjectId,
  pointsSent: Number,
  date: { type: Date, default: Date.now }
});

const Manager = mongoose.model('Manager', managerSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

// وظيفة لتحديث النقاط
async function updatePoints() {
  const manager = await Manager.findOne();
  if (manager) {
    manager.points += req.body.points;
    await manager.save();
    console.log('تم إضافة 5000 نقطة للمدير');
  }
}

// جدولة الوظيفة لتعمل في بداية كل شهر
cron.schedule('0 0 1 * *', updatePoints);

// إرسال النقاط من المانيجر للأدمن
app.post('/sendPoints', async (req, res) => {
  const { managerId, adminId, points } = req.body;
  const manager = await Manager.findById(managerId);
  const admin = await Admin.findById(adminId);

  if (!manager) {
    return res.status(404).send('المدير غير موجود');
  }

  if (!admin) {
    return res.status(404).send('الأدمن غير موجود');
  }

  if (manager.points < points) {
    return res.status(400).send('النقاط غير كافية');
  }

  manager.points -= points;
  await manager.save();

  const transaction = new Transaction({
    managerId: manager._id,
    adminId: admin._id,
    pointsSent: points
  });

  await transaction.save();
  res.send('تم إرسال النقاط بنجاح');
});

// جمع التحويلات لكل أدمن في الشهر مع التوتال بوينتس
app.get('/transactions/:adminId/:month/:year', async (req, res) => {
  const { adminId, month, year } = req.params;
  const transactions = await Transaction.find({
    adminId: mongoose.Types.ObjectId(adminId),
    date: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) }
  });

  const totalPoints = await Transaction.aggregate([
    { $match: { adminId: mongoose.Types.ObjectId(adminId), date: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) } } },
    { $group: { _id: null, total: { $sum: '$pointsSent' } } }
  ]);

  res.send({ transactions, totalPoints: totalPoints.length > 0 ? totalPoints[0].total : 0 });
});

// جمع التحويلات لكل أدمن في سنة مع التوتال بوينتس
app.get('/transactions/:adminId/:year', async (req, res) => {
  const { adminId, year } = req.params;
  const transactions = await Transaction.find({
    adminId: mongoose.Types.ObjectId(adminId),
    date: { $gte: new Date(year, 0, 1), $lt: new Date(year, 12, 31) }
  });

  const totalPoints = await Transaction.aggregate([
    { $match: { adminId: mongoose.Types.ObjectId(adminId), date: { $gte: new Date(year, 0, 1), $lt: new Date(year, 12, 31) } } },
    { $group: { _id: null, total: { $sum: '$pointsSent' } } }
  ]);

  res.send({ transactions, totalPoints: totalPoints.length > 0 ? totalPoints[0].total : 0 });
});

// جمع التحويلات لكل الأدمنز في سنة مع التوتال بوينتس
app.get('/allTransactions/:year', async (req, res) => {
  const { year } = req.params;
  const transactions = await Transaction.find({
    date: { $gte: new Date(year, 0, 1), $lt: new Date(year, 12, 31) }
  });

  const totalPoints = await Transaction.aggregate([
    { $match: { date: { $gte: new Date(year, 0, 1), $lt: new Date(year, 12, 31) } } },
    { $group: { _id: null, total: { $sum: '$pointsSent' } } }
  ]);

  res.send({ transactions, totalPoints: totalPoints.length > 0 ? totalPoints[0].total : 0 });
});

app.listen(3000, () => {
  console.log('الخادم يعمل على المنفذ 3000');
});
