
const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");



const { createLectures,getLectures ,getLecture, updateLecture, deleteLecture } = require("../Service/LectureService");
const { createLectureValidator, getLectureValidator, updateLectureValidator, deleteLectureValidator } = require("../Resuble/LectureValidationError");

const upload = require("../Utils/imagesHandler");

const Routes = Router();

Routes.route("/")
  .post(protect,allowedTo("admin", "manager"),createLectureValidator,uplo, createLectures)
  .get(getLectures);
Routes.route("/:id")
  .get(getLectureValidator, getLecture)
  .put(protect,allowedTo("admin", "manager"),updateLectureValidator, updateLecture)
  .delete(protect,allowedTo("admin", "manager"),deleteLectureValidator, deleteLecture);
module.exports = Routes;
