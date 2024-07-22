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

  const { managerId, adminId, points } = req.body;
  const manager = await createUsersModel.findById(managerId);
  const admin = await createUsersModel.findById(adminId);
console.log(manager.email, admin.email);
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
  await manager.save();

  const transaction = new createTransactionModel({
    managerId: manager._id,
    adminId: admin._id,
    pointsSent: points,
  });

  await transaction.save();
  res.send("تم إرسال النقاط بنجاح");
});

exports.getTransactionsDat = expressAsyncHandler(async (req, res, next) => {
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
