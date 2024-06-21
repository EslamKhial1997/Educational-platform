const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");


exports.ChapterValidator = [
  check("name")
    .notEmpty()
    .withMessage("is required Password"),
  check("chapter")
    .notEmpty()
    .withMessage("is required Password")
    .withMessage("To Shoort Password To CreateUser Validator"),
 

  MiddlewareValidator,
];
