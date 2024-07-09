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
    check("email")
    .isEmail()
    .withMessage("Must be at E-mail Address")
    .custom((val) =>
      createUsersModel.findOne({ _id: val }).then((teacher) => {
        if (!teacher) {
          return Promise.reject(new Error("Sorry Teacher is not available"));
        }
      })
    ),
  MiddlewareValidator,
];
exports.getClassValidator = [
  check("id").isMongoId().withMessage("Id Not Vaild To get Class"),
  MiddlewareValidator,
];

