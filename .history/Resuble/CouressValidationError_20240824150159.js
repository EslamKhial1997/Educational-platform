const { check } = require("express-validator");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");

const createSectionModel = require("../Modules/createSection");
const createCouponsModel = require("../Modules/createCoupon");
const createLecturesModel = require("../Modules/createAlecture");

exports.createCourseValidator = [
  check("coupon")
    .optional()
    .custom(async (val, { req }) => {
      const couponModel = await createCouponsModel.findOne({
        code: req.body.coupon,
        expires: { $gt: Date.now() },
      });
      if (!couponModel) {
        return Promise.reject(
          new Error(`الكوبون ${req.body.coupon} غير صالح أو منتهي`)
        );
      }
      req.couponModel = couponModel; // تخزين الكوبون لمرجع لاحق
    }),

  // التحقق من المحاضرة إن وجدت
  check("lacture")
    .optional()
    .custom(async (val, { req }) => {
      const lectureModel = await createLecturesModel.findOne({
        _id: req.body.lacture,
      });
      if (!lectureModel) {
        return Promise.reject(new Error(`المحاضرة غير موجودة`));
      }

      // التحقق مما إذا كان الكوبون ينتمي لهذه المحاضرة
      if (req.couponModel && val !== req.lecture._id) {
        return Promise.reject(
          new Error(`الكوبون ${req.body.coupon} لا ينتمي لهذه المحاضرة`)
        );
      }
    }),

  // التحقق من الباب (القسم) إن وجد
  check("section")
    .optional()
    .custom(async (val, { req }) => {
      const sectionModel = await createSectionModel.findOne({
        _id: req.body.section,
      });
      if (!sectionModel) {
        return Promise.reject(new Error(`الباب غير موجود`));
      }

      // التحقق مما إذا كان الكوبون ينتمي لهذا القسم
      if (req.couponModel && val !== req.body.section._id) {
        return Promise.reject(
          new Error(`الكوبون ${req.body.coupon} لا ينتمي لهذا الباب`)
        );
      }
    }),

  MiddlewareValidator, // استدعاء المدقق الوسيط للتحقق من الأخطاء
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
