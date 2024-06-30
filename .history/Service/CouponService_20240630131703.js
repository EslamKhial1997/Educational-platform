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
  // const randomNumbers = [];
  // for (let i = 0; i < req.body.count; i++) {
  //   const randomNumber = Math.floor(Math.random() * 10 ** 10).toString();
  //   randomNumbers.push({ number: randomNumber, discount: req.body.discount });
  // }

  // const coupons = await createCouponsModel.create({
  //   coupon: randomNumbers,
  //   expires: Date.now() + req.body.expires * 24 * 60 * 60 * 1000,
  //   discount: req.body.discount,
  // });

  // res.status(201).json({
  //   status: "success",
  //   results: randomNumbers.length,
  //   data: coupons,
  // });
  const coupons = [];
  for (let i = 0; i < req.body.count; i++) {
    const code = Math.floor(Math.random() * 10 ** 10).toString(); // هنا ممكن تستخدم دالة لتوليد أكواد عشوائية
    const newCoupon = new createCouponsModel({
      code: code,
      discount: req.body.discount,
      expires: Date.now() + req.body.expires * 24 * 60 * 60 * 1000, // صلاحية لشهر مثلاً
    });
    coupons.push(newCoupon);
  }
if (coupons.length < 1) {
   resstatus(401)
        .json({ status: "Error", message: "Code is Invalid Or Expired" })
    
}
  await createCouponsModel.insertMany(coupons);
  res.status(201).json({
    status: "success",
    results: randomNumbers.length,
    data: coupons,
  });
});
exports.getCoupons = factory.getAll(createCouponsModel);
exports.checkCoupon = async (req, res, next) => {
  const promoCodeDocument = await createCouponsModel.findOne({
    coupon: {
      $elemMatch: {
        number: { $regex: `^${req.query.code ?? ""}$`, $options: "i" },
      },
    },
  });

  if (promoCodeDocument) {
    const promoCode = promoCodeDocument.coupon.find((c) =>
      new RegExp(`^${req.query.code ?? ""}$`, "i").test(c.number)
    );
    res.status(201).json({ data: promoCode });
  } else {
    res.status(404).json({ error: "Promo code not found." });
  }
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
