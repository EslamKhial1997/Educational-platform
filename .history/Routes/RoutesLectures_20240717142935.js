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

const Routes = Router();
Routes.use(protect);
Routes.use(allowedTo("admin", "manager"));
Routes.route("/")
  .post(create createLectures)
  .get(getLectures);
Routes.route("/:id")
  .get( getLecture)
  .put(updateSectionValidator, updateLecture)
  .delete(deleteSectionValidator, deleteLecture);
module.exports = Routes;
