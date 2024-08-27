const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const bcrypt = require("bcryptjs");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");
const createUsersModel = require("../Modules/createUsers");
const createTeachersModel = require("../Modules/createTeacher");

// const createUsersModel = require("../modules/createUsers");

exports.createUsersValidator = [
  check("name")
    .notEmpty()
    .withMessage("is required Name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("password")
    .notEmpty()
    .withMessage("is required Password")
    .withMessage("To Shoort Password To CreateUser Validator"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("To Shoort Password To CreateUser Validator")
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        return Promise.reject(new Error("Confirm Password No Match"));
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required"),

  check("email").notEmpty().withMessage("is required E-mail"),
  check("email")
    .isEmail()
    .withMessage("Must be at E-mail Address")
    .custom((val) =>
      createUsersModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("ايميل المستخدم موجود بالفعل"));
        }
      })
    ),
  check("email")
    .isEmail()
    .withMessage("Must be at E-mail Address")
    .custom((val) =>
      createTeachersModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("ايميل المستخدم موجود بالفعل"));
        }
      })
    ),

  check("phone")
    .notEmpty()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .custom((val, { req }) => {
      req.body.wallet = val;
      return true;
    })
    .withMessage("Invailable phone number EG , SA Number Only accepted")
    .custom((val) =>
      createUsersModel.findOne({ phone: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("رقم الموبايل مستخدم"));
        }
      })
    )
,
  MiddlewareValidator,
];

exports.getOneUserValidator = [
  check("id").isMongoId().withMessage("Sorry ID Not Available To get"),
  MiddlewareValidator,
];
exports.deleteOneUserValidator = [
  check("id").isMongoId().withMessage("Sorry ID Not Available To delete"),
  MiddlewareValidator,
];
exports.updateOneUserValidator = [
  check("id").isMongoId().withMessage("Sorry ID Not Available To Update"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("image").optional(),
  MiddlewareValidator,
];
exports.deleteOneUserValidator = [
  check("id").isMongoId().withMessage("Sorry ID Not Available To Delete"),
  MiddlewareValidator,
];
exports.UpdateUserPassword = [
  check("currentPasword")
    .notEmpty()
    .withMessage("you Must enter Old password "),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("you Must enter belong password "),
  check("password")
    .notEmpty()
    .withMessage("you Must enter password "),
  MiddlewareValidator,
];
exports.UpdatePaidToTeacherValidation = [
  // التحقق من أن المعرف هو معرف Mongo صالح
  check("id")
    .isMongoId()
    .withMessage("Sorry ID Not Available To Update")
    .custom((val) =>
      createTeachersModel.findOne({ _id: val }).then((teacher) => {
        if (!teacher) {
          return Promise.reject(new Error("المدرس غير موجود"));
        }
      })
    ),

  // التحقق من صحة قيمة النقاط
  check("point")
    .isNumeric()
    .withMessage("يجب أن تكون النقاط رقمية")
    .custom(async (val, { req }) => {
      const teacher = await createTeachersModel.findOne({ _id: req.params.id });
      if (!teacher) {
        return Promise.reject(new Error("المدرس غير موجود"));
      }

      // التحقق مما إذا كانت النقاط المطلوب خصمها أكبر من نقاط المعلم
      if (val > teacher.point) {
        return Promise.reject(
          new Error("النقاط المطلوب خصمها أكبر من نقاط المدرس الحالية")
        );
      }

      return true;
    }),

  // استدعاء MiddlewareValidator للتحقق من الأخطاء
  MiddlewareValidator,
];
