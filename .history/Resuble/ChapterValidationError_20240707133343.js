const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");
const createChaptersModel = require("../Modules/createChapter");
exports.createChaptersValidator = [
  check("name")
    .notEmpty()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .withMessage("Name Chapter is required"),
    check("class")
    .notEmpty()
    .withMessage("Must be at ID Chapter")
    .custom((val) =>
      createChaptersModel.findOne({ _id: val }).then((Chapter) => {
        if (!Chapter) {
          return Promise.reject(new Error("Sorry Chapter is not available"));
        }
      })
    ),
  MiddlewareValidator,
];
exports.getChapterValidator = [
    check("id").isMongoId().withMessage("Id Not Vaild To get Chapter"),
    MiddlewareValidator,
  ];
exports.updateChapterValidator = [
    check("id").isMongoId().withMessage("Id Not Vaild To Update Chapter"),
    MiddlewareValidator,
  ];
exports.deleteChapterValidator = [
    check("id").isMongoId().withMessage("Id Not Vaild To delete Chapter"),
    MiddlewareValidator,
  ];