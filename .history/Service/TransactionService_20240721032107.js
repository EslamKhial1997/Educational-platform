const expressAsyncHandler = require("express-async-handler");
const createUsersModel = require("../Modules/createUsers");
const createTransactionModel = require("../Modules/createtransaction");
const cron = require("node-cron");
const { default: mongoose } = require("mongoose");
exports.updatePoint = expressAsyncHandler(async (req, res, next) => {
  async function updatePoints() {
    const manager = await createUsersModel.findOne();
    if (manager) {
      manager.point += 5000;
      await manager.save();
      console.log("تم إضافة 5000 نقطة للمدير");
    }
  }
  cron.schedule("0 0 1 * *", updatePoints);

  const { sender, receiver, points } = req.body;
  const manager = await createUsersModel.findById(sender);
  const admin = await createUsersModel.findById(receiver);

  if (!manager || manager.role !== "manager") {
    return res.status(404).send("المدير غير موجود");
  }

  if (!admin || admin.role !== "admin") {
    return res.status(404).send("الأدمن غير موجود");
  }

  if (manager.point < points) {
    return res.status(400).send("النقاط غير كافية");
  }

  manager.point -= points;
  admin.point += points;
  await manager.save();
  await admin.save();

  const transaction = new createTransactionModel({
    receiver: manager._id,
    adminId: admin._id,
    pointsSent: points,
  });

  await transaction.save();
  res.send("تم إرسال النقاط بنجاح");
});

exports.getTransactionsDate = expressAsyncHandler(async (req, res, next) => {
  const { adminId, month, year } = req.params;
  const transactions = await createTransactionModel.find({
    adminId: adminId,
    date: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) },
  });

  const totalPoints = await createTransactionModel.aggregate([
    {
      $match: {
        adminId: adminId,
        date: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1),
        },
      },
    },
    { $group: { _id: null, total: { $sum: "$pointsSent" } } },
  ]);

  res.send({
    transactions,
    totalPoints: totalPoints.length > 0 ? totalPoints[0].total : 0,
  });
});
exports.getTransactionsYear = expressAsyncHandler(async (req, res, next) => {
    const { adminId, year } = req.params;
  const transactions = await createTransactionModel.find({
    adminId:adminId,
    date: { $gte: new Date(year, 0, 1), $lt: new Date(year, 12, 31) }
  });

  const totalPoints = await createTransactionModel.aggregate([
    { $match: { adminId: adminId, date: { $gte: new Date(year, 0, 1), $lt: new Date(year, 12, 31) } } },
    { $group: { _id: null, total: { $sum: '$pointsSent' } } }
  ]);

  res.send({ transactions, totalPoints: totalPoints.length > 0 ? totalPoints[0].total : 0 });
})
exports.getAllTransactionsMonth = expressAsyncHandler(async (req, res, next) => {
    const { month, year } = req.params;
  
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
  
    const transactions = await createTransactionModel.find({
      date: { $gte: startDate, $lt: endDate }
    });
  
    const totalPoints = await createTransactionModel.aggregate([
      { $match: { date: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: null, total: { $sum: '$pointsSent' } } }
    ]);
  
    res.send({ transactions, totalPoints: totalPoints.length > 0 ? totalPoints[0].total : 0 });
  });
