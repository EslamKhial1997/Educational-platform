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
    .optional()
    .isMongoId()
    .withMessage("subCategory To Mongo is not Invalid ID")
    .custom((subCategoryId) =>
      createSubCategoryModel.findById(subCategoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`Can't find This categoryId ${subCategoryId}`)
          );
        }
      })
    ),
  MiddlewareValidator,
];
exports.getSectionValidator = [
    check("id").isMongoId().withMessage("Id Not Vaild To get Chapter"),
    MiddlewareValidator,
  ];
exports.deleteSectionValidator = [
    check("id").isMongoId().withMessage("Id Not Vaild To delete Chapter"),
    MiddlewareValidator,
  ];