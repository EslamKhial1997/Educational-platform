const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");
const createChaptersModel = require("../Modules/createChapter");

exports.createClassValidator = [
  check("class")
    .notEmpty()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .withMessage("Name Class is required"),
  MiddlewareValidator,
];
exports.getClassValidator = [
  check("id").isMongoId().withMessage("Id Not Vaild To get Section"),
  MiddlewareValidator,
];

