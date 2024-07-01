const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");
const createChaptersModel = require("../Modules/createChapter");

exports.createSectionsValidator = [
  check("name")
    .notEmpty()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .withMessage("Name Chapter is required"),
   
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