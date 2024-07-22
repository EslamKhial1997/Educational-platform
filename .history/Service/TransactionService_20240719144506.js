const expressAsyncHandler = require("express-async-handler");
const createUsersModel = require("../Modules/createUsers");

exports.updatePoint = expressAsyncHandler(async (req, res, next) => {
   async function updatePoints() {
  const manager = await createUsersModel.findOne();
  if (manager) {
    manager.points += 5000;
    await manager.save();
    console.log('تم إضافة 5000 نقطة للمدير');
  }
}
cron.schedule('0 0 1 * *', updatePoints);
  });