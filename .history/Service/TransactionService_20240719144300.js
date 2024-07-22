const expressAsyncHandler = require("express-async-handler");
const createUsersModel = require("../Modules/createUsers");

exports.updatePoint = expressAsyncHandler(async (req, res, next) => {
    
        const manager = await createUsersModel.findOne({role: "manager"});
        if (manager) {
          manager.points += 5000;
          await manager.save();
          console.log('تم إضافة 5000 نقطة للمدير');
        }
  });