const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");


exports.ChapterValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name Chapter is required"),
  MiddlewareValidator,
];
