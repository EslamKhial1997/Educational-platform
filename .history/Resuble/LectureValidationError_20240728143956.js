const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");
const createTeachersModel = require("../Modules/createTeacher");
const createSectionModel = require("../Modules/createSection");

exports.createLectureValidator = [
  check("lecture")
    .notEmpty()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .withMessage("Name lecture is required"),
  check("section")
    .notEmpty()
    .withMessage("Must be at Section ID")
    .custom((val) =>
      createSectionModel.findOne({ _id: val }).then((section) => {
        if (!section) {
          return Promise.reject(new Error("Sorry Section is not available"));
        }
      })
    ),
  MiddlewareValidator,
];
exports.getLectureValidator = [
  check("id").isMongoId().withMessage("Id Not Vaild To get Lecture"),
  MiddlewareValidator,
];
exports.updateLectureValidator = [
  check("id").isMongoId().withMessage("Id Not Vaild To update Lecture"),
  MiddlewareValidator,
];
exports.deleteLectureValidator = [
  check("id").isMongoId().withMessage("Id Not Vaild To delete Lecture"),
  MiddlewareValidator,
];
