const { body, body } = require("express-validator");
const { default: slugify } = require("slugify");
const bcrypt = require("bcrypt");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");
const createUsersModel = require("../Modules/createUsers");
const createTeachersModel = require("../Modules/createTeacher");

// const createUsersModel = require("../modules/createUsers");

exports.createTeachersValidator = [
  body("teachername")
    .notEmpty()
    .withMessage("is required teachername")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("is required Password")
    .withMessage("To Shoort Password To CreateUser Validator"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("To Shoort Password To CreateUser Validator")
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        return Promise.reject(new Error("Confirm Password No Match"));
      }
      return true;
    }),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required"),

  body("email").notEmpty().withMessage("is required E-mail"),
  body("email")
    .isEmail()
    .withMessage("Must be at E-mail Address")
    .custom((val) =>
      createTeachersModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),

  body("phone")
    .notEmpty()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .custom((val, { req }) => {
      req.body.wallet = val;
      return true;
    })
    .withMessage("Invailable phone number EG , SA Number Only accepted"),
  MiddlewareValidator,
];

exports.getOneUserValidator = [
  body("id").isMongoId().withMessage("Sorry ID Not Available To get"),
  MiddlewareValidator,
];
exports.updateTeacherValidator = [
  body("id").isMongoId().withMessage("Sorry ID Not Available To Update"),
  body("teachername")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  MiddlewareValidator,
];
exports.deleteOneTeacherValidator = [
  body("id").isMongoId().withMessage("Sorry ID Not Available To Delete"),
  MiddlewareValidator,
];
exports.UpdateUserPassword = [
  body("currentPasword")
    .notEmpty()
    .withMessage("you Must enter Old password "),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("you Must enter belong password "),
  body("password")
    .notEmpty()
    .withMessage("you Must enter password ")
    .custom(async (val, { req }) => {
      const user = await createUsersModel.findById(req.user._id);

      if (!user) {
        throw new Error("Old Password does not match");
      }
      const iscorrectPassword = await bcrypt.compare(
        req.body.currentPasword,
        user.password
      );
      if (!iscorrectPassword) {
        throw new Error("in Correct CurentPassword");
      }
      if (val !== req.body.passwordConfirm) {
        throw new Error("in Correct passwordConfirm");
      }
    }),
  MiddlewareValidator,
];

// exports.updateLoggedUserValidator = [
//   body("name")
//     .optional()
//     .custom((val, { req }) => {
//       req.body.slug = slugify(val);
//       return true;
//     }),
//   // body("email")
//   //   .optional() .isEmail()
//   //   .withMessage("Invalid email address")
//   //   .custom((val) =>
//   //     createUsersModel.findOne({ email: val }).then((user) => {
//   //       if (user) {
//   //         return Promise.reject(new Error("E-mail already in user"));
//   //       }
//   //     })
//   //   ),
//   body("phone")
//     .optional()
//     .isMobilePhone(["ar-EG", "ar-SA"])
//     .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

//   MiddlewareValidator,
// ];
// exports.LoginDashboardValidator = [
//   body("passwordDB")
//     .notEmpty()
//     .withMessage("Password Dashboard is required "),

//   MiddlewareValidator,
// ];
