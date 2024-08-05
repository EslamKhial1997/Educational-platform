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
  check("chapter")
    .notEmpty()
    .isMongoId()
    .withMessage("Chapter To Mongo is not Invalid ID")
    .custom((val) =>
      createCl.findOne({ _id: val }).then((e) => {
        if (!e) {
          return Promise.reject(new Error("Sorry Chapter is not available"));
        }
      })
    ),
  MiddlewareValidator,
];
exports.getSectionValidator = [
  check("id").isMongoId().withMessage("Id Not Vaild To get Section"),
  MiddlewareValidator,
];
exports.updateSectionValidator = [
  check("id").isMongoId().withMessage("Id Not Vaild To update Section"),
  MiddlewareValidator,
];
exports.deleteSectionValidator = [
  check("id").isMongoId().withMessage("Id Not Vaild To delete Section"),
  MiddlewareValidator,
];
