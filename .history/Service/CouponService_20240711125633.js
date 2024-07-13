

const factory = require("./FactoryHandler");

const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../Resuble/ApiErrors");
const createCouponsModel = require("../Modules/createCoupon");

exports.createCoupon = expressAsyncHandler(async (req, res) => {
  const coupons = [];
  for (let i = 0; i < req.body.count; i++) {
    const code = Math.floor(Math.random() * 10 ** 10).toString();
    const newCoupon = new createCouponsModel({
      code: code,
      discount: req.body.discount,
      expires: new Date(
        new Date().getTime() + req.body.expires * 24 * 60 * 60 * 1000
      ),
      lecture: req.body.lecture,
      section: req.body.section,
      teacher: req.body.teacher,
      createdBy: req.user._id,
    });
    coupons.push(newCoupon);
  }
  if (coupons.length < 1) {
    res.status(500).json({ status: "Somthing want Error" });
  }
  // Insert Coupon 
  await createCouponsModel.insertMany(coupons);
  // Delete Coupon After Expires Date
  await createCoupons.createIndex({ expires: 1 }, { expireAfterSeconds: 0 });

  res.status(201).json({ status: "Success", data: coupons });
});
exports.getCoupons = factory.getAll(createCouponsModel);

exports.checkCoupon = async (req, res, next) => {
  const promoCodeDocument = await createCouponsModel.findOne({
    code: { $regex: new RegExp(req.query.code, "i") },
  });
  //Check 
  if (promoCodeDocument.expires < Date.now()) {
    return next(new ApiError(400, "Expires Coupon"));
  }
  res.status(200).json({
    message: "Checked Is Success",
    data: promoCodeDocument,
  });
};

exports.getCoupon = factory.getOne(createCouponsModel);
exports.updateCoupon = factory.updateOne(createCouponsModel);
exports.deleteCoupon = factory.deleteOne(createCouponsModel);
