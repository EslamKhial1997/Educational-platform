const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");
const createChaptersModel = require("../Modules/createChapter");
const createTeachersModel = require("../Modules/createTeacher");

exports.createCoValidator = [
  check("Co")
    .notEmpty()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .withMessage("Name Co is required"),
  check("teacher")
    .notEmpty()
    .withMessage("Must be at E-mail Address")
    .custom((val) =>
      createTeachersModel.findOne({ _id: val }).then((teacher) => {
        if (!teacher) {
          return Promise.reject(new Error("Sorry Teacher is not available"));
        }
      })
    ),
  MiddlewareValidator,
];
exports.getCoValidator = [
  check("id").isMongoId().withMessage("Id Not Vaild To get Co"),
  MiddlewareValidator,
];
