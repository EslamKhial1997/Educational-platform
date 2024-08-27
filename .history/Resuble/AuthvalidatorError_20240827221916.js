const { check } = require("express-validator");

const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");


exports.LoginValidator = [
  check("password")
    .notEmpty()
    .withMessage("is required Password")
    .withMessage("To Shoort Password To CreateUser Validator"),

  check("email").notEmpty().withMessage("الايميل مطلوب"),
  check("email").isEmail().withMessage("يوجد خطأ في الايميل"),

  MiddlewareValidator,
];
