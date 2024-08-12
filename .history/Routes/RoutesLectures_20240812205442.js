
const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");

const {
  createSections,
  getSections,
  getSection,
  updateSection,
  deleteSection,
} = require("../Service/SectionService");
const {

  updateSectionValidator,
  deleteSectionValidator,
} = require("../Resuble/SectionValidationError");
const { createLectures,getLectures ,getLecture, updateLecture, deleteLecture } = require("../Service/LectureService");
const { createLectureValidator, getLectureValidator, updateLectureValidator, deleteLectureValidator } = require("../Resuble/LectureValidationError");
const { uploadImage, resizeImage } = require("../Utils/imagesHandler");

const Routes = Router();

Routes.route("/")
  .post(protect,allowedTo("admin", "manager"),createLectureValidator,uploa.single('pdfFile'), createLectures)
  .get(getLectures);
Routes.route("/:id")
  .get(getLectureValidator, getLecture)
  .put(protect,allowedTo("admin", "manager"),updateLectureValidator, updateLecture)
  .delete(protect,allowedTo("admin", "manager"),deleteLectureValidator, deleteLecture);
module.exports = Routes;
