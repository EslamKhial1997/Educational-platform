// const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendCode = require("../Utils/SendCodeEmail");
const jwt = require("jsonwebtoken");
const factory = require("./FactoryHandler");

const createUsersModel = require("../Modules/createUsers");
const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../Resuble/ApiErrors");
const createCouponsModel = require("../Modules/createCoupon");
const createSectionModel = require("../Modules/createSection");


exports.createChapters = factory.createOne(createChaModel);
exports.getSections = factory.getAll(createSectionModel);
// exports.getCoupon = expressAsyncHandler(async (req, res, next) => {
//   const coupon = await createCouponsModel.findOne({
//     _id: req.params.id,
//     expires: { $gt: Date.now() },
//   });
//   const couponNumber = await coupon.coupon.filter(
//     (e) => e.number === req.body.code
//   );
//   if (couponNumber.length === 0) {
//     return next(
//       res
//         .status(200)
//         .json({ status: "Error", message: "Code is Invalid Or Expired" })
//     );
//   }

//   res.status(200).json({ status: "success", data: couponNumber });
// });
// exports.deleteCoupon = factory.deleteOne(createCouponsModel);

