const { check } = require("express-validator");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");


exports.createCouponValidator = [
  check("lecture").isMongoId().withMessage("Id Not Vaild To create lecture"),
  check("Teachers").isMongoId().withMessage("Id Not Vaild To create Teachers"),
  MiddlewareValidator,
];
exports.getCouponValidator = [
  check("id").isMongoId().withMessage("Id Not Vaild To get Coupon"),
  MiddlewareValidator,
];
