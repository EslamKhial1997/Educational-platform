const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");


exports.ChapterValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name Chapter is required").custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      }),,
  MiddlewareValidator,
];
