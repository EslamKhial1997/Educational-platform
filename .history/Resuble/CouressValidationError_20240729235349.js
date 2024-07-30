const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");

const createSectionModel = require("../Modules/createSection");
const createCouponsModel = require("../Modules/createCoupon");

exports.createCouresValidator = [
  check("lacture")
    .notEmpty()
    .withMessage("Name lecture is required")
    .custom(async (val, { req }) => {
      const couponModel = await createCouponsModel.findOne({
        code: req.body.coupon,
        expires: { $gt: Date.now() },
      });
      if (val !== couponModel.lecture._id.toString()) {
        return Promise.reject(new Error(`Sorry Coupon: ${req.body.coupon} Is not bel`));
      }
    }),

  // check("section")
  //   .notEmpty()
  //   .withMessage("Must be at Section ID")
  //   .custom((val) =>
  //     createSectionModel.findOne({ _id: val }).then((section) => {
  //       if (!section) {
  //         return Promise.reject(new Error("Sorry Section is not available"));
  //       }
  //     })
  //   ),
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
