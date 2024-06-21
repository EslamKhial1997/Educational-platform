const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");

exports.createChapterValidator = [
  check("name")
    .notEmpty()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .withMessage("Name Chapter is required"),

  MiddlewareValidator,
];
exports.getChapterValidator = [
    check("id").isMongoId().withMessage("Id Not Vaild To get product"),
    MiddlewareValidator,
  ];