const { check } = require("express-validator");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");

const createSectionModel = require("../Modules/createSection");
const createCouponsModel = require("../Modules/createCoupon");
const createLecturesModel = require("../Modules/createAlecture");

exports.createCouresValidator = [
  check("lacture")
    .op()
    .withMessage("اسم المحاضره مطلوب")
    .custom(async (val, { req }) => {
      const couponModel = await createCouponsModel.findOne({
        code: req.body.coupon,
        expires: { $gt: Date.now() },
      });
      if (val !== couponModel.lecture._id.toString()) {
        return Promise.reject(
          new Error(`الكوبون ${req.body.coupon} لاينتمي لهذه المحاضره`)
        );
      }
    })
    .custom(async (val, { req }) => {
      const lactureModel = await createLecturesModel.findOne({
        _id: req.body.lacture,
      });
      if (lactureModel) {
        return Promise.reject(new Error(`المحاضره غير موجوده`));
      }
    }),


  MiddlewareValidator,
];
exports.getLectureValidator = [
  check("id").isMongoId().withMessage("Id Not Vaild To get Lecture"),
  MiddlewareValidator,
];
exports.updateLectureValidator = [
  check("id").isMongoId().withMessage("Id Not Vaild To update Lecture"),
  MiddlewareValidator,
];
exports.deleteLectureValidator = [
  check("id").isMongoId().withMessage("Id Not Vaild To delete Lecture"),
  MiddlewareValidator,
];
