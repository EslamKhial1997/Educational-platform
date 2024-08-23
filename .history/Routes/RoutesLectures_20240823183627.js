const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");

const {
  createLectures,
  getLectures,
  getLecture,
  updateLecture,
  deleteLecture,
  resizeImage,
} = require("../Service/LectureService");
const {
  createLectureValidator,
  getLectureValidator,
  updateLectureValidator,
  deleteLectureValidator,
} = require("../Resuble/LectureValidationError");
const { uploadPDF } = require("../Utils/imagesHandler");
const { upload } = require("../Utils/videohandler");

const Routes = Router();

Routes.route("/")
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadPDF,
    createLectureValidator,
    // resizeImage,
    // upload.single('video'),
    createLectures
  )
  .get(getLectures);
Routes.route("/:id")
  .get(getLectureValidator, getLecture)
  .put(
    protect,
    allowedTo("admin", "manager"),
    updateLectureValidator,
    updateLecture
  )
  .delete(
    protect,
    allowedTo("admin", "manager"),
    deleteLectureValidator,
    deleteLecture
  );
module.exports = Routes;
