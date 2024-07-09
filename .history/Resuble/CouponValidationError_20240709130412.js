const { check } = require("express-validator");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");


exports.createCouponValidator = [
  check("lecture").isMongoId().withMessage("Id Not Vaild To create lecture"),
  check("section").isMongoId().withMessage("Id Not Vaild To create section"),
  MiddlewareValidator,
];
exports.getCouponValidator = [
  check("id").isMongoId().withMessage("Id Not Vaild To get Coupon"),
  MiddlewareValidator,
];
