const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");
const createChaptersModel = require("../Modules/createChapter");
const createTeachersModel = require("../Modules/createTeacher");

exports.createCouponValidator = [
  check("lecture").isMongoId().withMessage("Id Not Vaild To get Coupon"),
  check("section").isMongoId().withMessage("Id Not Vaild To get Coupon"),
  MiddlewareValidator,
];
exports.getCouponValidator = [
  check("id").isMongoId().withMessage("Id Not Vaild To get Coupon"),
  MiddlewareValidator,
];
