const expressAsyncHandler = require("express-async-handler");

exports.updatePoint = expressAsyncHandler(async (req, res, next) => {
   async function updatePoints() {
  const manager = await Manager.findOne();
  if (manager) {
    manager.points += 5000;
    await manager.save();
    console.log('تم إضافة 5000 نقطة للمدير');
  }
}
  });