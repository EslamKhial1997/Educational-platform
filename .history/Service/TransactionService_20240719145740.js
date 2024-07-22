const expressAsyncHandler = require("express-async-handler");
const createUsersModel = require("../Modules/createUsers");
const createTransactionModel = require("../Modules/createtransaction");
const cron = require('node-cron'); 
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

exports.get
