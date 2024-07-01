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
  createSectionsValidator,
  getSectionValidator,
  updateSectionValidator,
  deleteSectionValidator,
} = require("../Resuble/SectionValidationError");

const Routes = Router();
Routes.use(protect);
Routes.use(allowedTo("admin", "manager"));
Routes.route("/")
  .post(createSectionsValidator, createSections)
  .get(getSections);
Routes.route("/:id")
  .get(getSectionValidator, getSection)
  .put(updateSectionValidator, updateSection)
  .delete(deleteSectionValidator, deleteSection);
module.exports = Routes;
