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


const Routes = Router();

Routes.route("/")
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadPDF,
    createLectureValidator,
    resizeImage,
  
    createLectures
  )
  .get(getLectures);
Routes.route("/:id")
  .get(getLectureValidator, getLecture)
  .put(
    protect,
    allowedTo("admin", "manager"),
    uploadPDF,
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
