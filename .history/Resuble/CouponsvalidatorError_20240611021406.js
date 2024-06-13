const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const bcrypt = require("bcrypt");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");
const createUsersModel = require("../Modules/createUsers");


exports.UpdateUserPassword = [
  check("currentPasword")
    .notEmpty()
    .withMessage("you Must enter Old password "),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("you Must enter belong password "),
  check("password")
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
