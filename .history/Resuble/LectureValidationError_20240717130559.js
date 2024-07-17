const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");
const createTeachersModel = require("../Modules/createTeacher");

exports.createClassValidator = [
  check("name")
    .notEmpty()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .withMessage("Name Class is required"),
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
exports.getClassValidator = [
  check("id").isMongoId().withMessage("Id Not Vaild To get Class"),
  MiddlewareValidator,
];
exports.updateClassValidator = [
  check("id").isMongoId().withMessage("Id Not Vaild To update Class"),
  MiddlewareValidator,
];
exports.deleteClassValidator = [
  check("id").isMongoId().withMessage("Id Not Vaild To delete Class"),
  MiddlewareValidator,
];
