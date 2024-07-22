const expressAsyncHandler = require("express-async-handler");
const createUsersModel = require("../Modules/createUsers");

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
  
    if (!manager ||manager.role) {
      return res.status(404).send('المدير غير موجود');
    }
  
    if (!admin) {
      return res.status(404).send('الأدمن غير موجود');
    }
  
    if (manager.point < points) {
      return res.status(400).send('النقاط غير كافية');
    }
  
    manager.point -= points;
    await manager.save();
  
    const transaction = new Transaction({
      managerId: manager._id,
      adminId: admin._id,
      pointsSent: points
    });
  
    await transaction.save();
    res.send('تم إرسال النقاط بنجاح');
  
  
});
