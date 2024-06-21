const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");


exports.SectionValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name Chapter is required").custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),,
  check("chapter")
    .notEmpty()
    .withMessage("is required Password")
    .withMessage("To Shoort Password To CreateUser Validator"),
 

  MiddlewareValidator,
];
const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");

exports.createChaptersValidator = [
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
    check("id").isMongoId().withMessage("Id Not Vaild To get Chapter"),
    MiddlewareValidator,
  ];
exports.deleteChapterValidator = [
    check("id").isMongoId().withMessage("Id Not Vaild To delete Chapter"),
    MiddlewareValidator,
  ];