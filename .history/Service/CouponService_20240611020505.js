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

exports.createCoupon = expressAsyncHandler(async (req, res) => {
  const randomNumbers = [];
  for (let i = 0; i < req.body.count; i++) {
    const randomNumber = Math.floor(Math.random() * 10 ** 6).toString();
    randomNumbers.push({ number: randomNumber, discount: req.body.discount });
  }
  const coupons = await createCouponsModel.create({
    coupon: randomNumbers,
    expires: Date.now() + req.body.expires * 24 * 60 * 60 * 1000
  });

  res.status(201).json({
    status: "success",
    results: randomNumbers.length,
    data: coupons,
  });
});
exports.getCoupons = expressAsyncHandler(async (req, res, next) => {
  const coupon = await createCouponsModel.findOne({
    _id: req.body.coupon,
    expires: { $gt: Date.now() },
  });
  const couponNumber =await coupon.coupon.filter((e)=>e.number === req.body.code)
  console.log(couponNumber);
  if (!couponNumber) {
    return next(res.status(200).json({ status: "success" })(""));
  }
  // user.userVerify = true;
  // user.code = undefined;
  // user.codeExpires = undefined;
  // await user.save();
  // res.status(200).json({ status: "success" });
});
// exports.getUsers = factory.getAll(createUsersModel);
exports.getUser = factory.getOne(createUsersModel);
// exports.updateUser = expressAsyncHandler(async (req, res, next) => {
//   const updateDocById = await createUsersModel.findByIdAndUpdate(
//     req.params.id,
//     {
//       name: req.body.name,
//       slug: req.body.name,
//       email: req.body.email,
//       imageProfile: req.body.imageProfile,
//       phone: req.body.phone,
//       role: req.body.role,
//       status: req.body.status,
//       passwordDB: req.body.passwordDB,
//     },
//     {
//       new: true,
//     }
//   );
//   if (!updateDocById)
//     next(
//       new ApiError(`Sorry Can't Update This ID From ID :${req.params.id}`, 404)
//     );
//   res.status(200).json({ data: updateDocById });
// });
// exports.deleteUser = factory.deleteOne(createUsersModel);

exports.getLoggedUserData = expressAsyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
exports.updateLoggedUserPassword = expressAsyncHandler(async (req, res) => {
  const user = await createUsersModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
    },
    {
      new: true,
    }
  );
  const token = jwt.sign({ userId: user._id }, process.env.DB_URL, {
    expiresIn: "90d",
  });
  console.log(user);
  res.status(200).json({ data: user, token });
});
// exports.updateLoggedUserData = expressAsyncHandler(async (req, res, next) => {
//   const updatedUser = await createUsersModel.findByIdAndUpdate(
//     req.user._id,
//     {
//       name: req.body.name,
//       phone: req.body.phone,
//       imageProfile: req.body.imageProfile,
//     },
//     { new: true }
//   );

//   res.status(200).json({ data: updatedUser });
// });
// exports.deleteLoggedUserData = expressAsyncHandler(async (req, res, next) => {
//   await createUsersModel.findByIdAndUpdate(req.user._id, { active: false });

//   res.status(204).json({ status: "Success" });
// });

// exports.updateUserRole = expressAsyncHandler(async (req, res, next) => {
//   const user = await createUsersModel.findByIdAndUpdate(
//     req.params.id,
//     {
//       role: req.body.role,
//     },
//     {
//       new: true,
//     }
//   );
//   if (!user) {
//     return next(new ApiError(`User ${req.params.id} Not Found`));
//   }

//   res.status(200).json({ data: user });
// });
// exports.updateUserStatus = expressAsyncHandler(async (req, res, next) => {
//   const user = await createUsersModel.findByIdAndUpdate(
//     req.params.id,
//     {
//       status: req.body.status,
//     },
//     {
//       new: true,
//     }
//   );
//   if (!user) {
//     return next(new ApiError(`User ${req.params.id} Not Found`));
//   }

//   res.status(200).json({ data: user });
// });
