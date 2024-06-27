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
    expires: Date.now() + req.body.expires * 24 * 60 * 60 * 1000,
    discount:req.body.discount
  });

  res.status(201).json({
    status: "success",
    results: randomNumbers.length,
    data: coupons,
  });
});
// exports.getCoupons = factory.getAll(createCouponsModel);
exports.getCoupons = async (req, res, next) => {
  const promoCode = await createCouponsModel.findOne({
    code: { $regex: `^${req.query.code ?? ""}$`, $options: "i" },
  });
  if (!promoCode) return next(new AppError("الكود غير موجود", 404));
  if (!promoCode.active) return next(new AppError("الكود غير مفعل", 404));
  if (promoCode.expiryDate < Date.now())
    return next(new AppError("انتهت صلاحية الكود", 404));
  res.status(200).json({
    isError: false,
    message: "تم التحقق من الكود بنجاح",
    data: promoCode,
  });
};

exports.getCoupon = expressAsyncHandler(async (req, res, next) => {
  const coupon = await createCouponsModel.findAll();
  
  const couponNumber = await coupon.coupon.filter(
    (e) => e.number === req.body.code
  );
  if (couponNumber.length === 0) {
    return next(
      res
        .status(401)
        .json({ status: "Error", message: "Code is Invalid Or Expired" })
    );
  }

  res.status(200).json({ status: "success", data: couponNumber });
});
exports.deleteCoupon = factory.deleteOne(createCouponsModel);

