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
    check("chapter")
    .notEmpty()
    .isMongoId()
    .withMessage("Chapter To Mongo is not Invalid ID")
    .custom((val) =>
      createChaptersModel.findById(val).then((res) => {
        if (!res) {
          return Promise.reject(
            new Error(`Can't find This Chapter ${res}`)
          );
        }
      })
    ),
  MiddlewareValidator,
];
exports.getClassValidator = [
    check("id").isMongoId().withMessage("Id Not Vaild To get Section"),
    MiddlewareValidator,
  ];

