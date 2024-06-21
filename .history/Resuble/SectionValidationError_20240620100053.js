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
      createSubCategoryModel.findById(val).then((res) => {
        if (!res) {
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