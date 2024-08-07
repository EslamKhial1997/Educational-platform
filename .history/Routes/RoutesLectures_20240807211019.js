
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
const { uploadImage } = require("../Utils/imagesHandler");

const Routes = Router();
Routes.use(protect);
Routes.route("/")
  .post(allowedTo("admin", "manager"),uploadImage,createLectureValidator, resize("gallery"), createLectures)
  .get(getLectures);
Routes.route("/:id")
  .get(getLectureValidator, getLecture)
  .put(allowedTo("admin", "manager"),updateLectureValidator, updateLecture)
  .delete(allowedTo("admin", "manager"),deleteLectureValidator, deleteLecture);
module.exports = Routes;
