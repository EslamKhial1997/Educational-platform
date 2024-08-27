const { check } = require("express-validator");

const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");


exports.LoginValidator = [
  check("password")
    .notEmpty()
    .withMessage("is required Password")
    .withMessage("To Shoort Password To CreateUser Validator"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("To Shoort Password To CreateUser Validator"),
  check("email").notEmpty().withMessage("is required E-mail") .custom((val) =>
    createUsersModel.findOne({ email: val }).then((user) => {
      if (user) {
        return Promise.reject(new Error("ايميل المستخدم موجود بالفعل"));
      }
    })
  ),,

  MiddlewareValidator,
];
