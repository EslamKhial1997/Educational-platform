const { Router } = require("express");
const {
  createUsersValidator,
  UpdateUserPassword,
  getOneUserValidator,
} = require("../Resuble/UsersvalidatorError");
const {
  verifyRegister,
  createUsers,
  getUsers,
  //   updateUser,
  //   deleteUser,
  getUser,

  //   uploadImage,
  //   resizeImageUsers,
  updateLoggedUserPassword,
  getLoggedUserData,
  updateUserPoint,
  //   updateLoggedUserData,

  //   updateUserRole,
  //   updateUserStatus,
} = require("../Service/UsersService");
const { protect, allowedTo } = require("../Service/AuthService");
const {
  createTeachers,
  UploadImageService,
  resizeImage,
  getTeachers,
  getTeacher,
  deleteTeacher,
  updateTeacher,
} = require("../Service/TeachersService");
const {
  createTeachersValidator,
  deleteOneTeacherValidator,
  updateTeacherValidator,
} = require("../Resuble/TeachersvalidatorError");
const createTeachersModel = require("../Modules/createTeacher");

const Routes = Router();

// Only Access the Logged Users
Routes.use(protect);
Routes.get("/getMe", getLoggedUserData, getUser);

Routes.put("/changeUserPassword", UpdateUserPassword, updateLoggedUserPassword);
Routes.route("/")
  .post(
    allowedTo("manager"),

    (req, res, next) => {
      log
      const { email } = req.body;
    
      // تحقق من وجود المستخدم في قاعدة البيانات
      const userExists = createTeachersModel.find({email}); // افترض انك عندك دالة بتعمل كده
    
      if (userExists) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    
      next();
    },
    UploadImageService,
    resizeImage,
    createTeachers
  )
  .get(getTeachers);
Routes.route("/verifycode").post(verifyRegister);
Routes.route("/addpoint/:id").put(updateUserPoint);
Routes.route("/:id")
  .get(getOneUserValidator, getTeacher)
  .delete(deleteOneTeacherValidator, deleteTeacher)
  .put(UploadImageService, resizeImage, updateTeacherValidator, updateTeacher);
module.exports = Routes;
