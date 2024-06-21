const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");

exports.createSectionsValidator = [
  check("name")
    .notEmpty()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .withMessage("Name Chapter is required"),

  MiddlewareValidator,
];
exports.getSectionValidator = [
    check("id").isMongoId().withMessage("Id Not Vaild To get Chapter"),
    MiddlewareValidator,
  ];
exports.deleteChapterValidator = [
    check("id").isMongoId().withMessage("Id Not Vaild To delete Chapter"),
    MiddlewareValidator,
  ];