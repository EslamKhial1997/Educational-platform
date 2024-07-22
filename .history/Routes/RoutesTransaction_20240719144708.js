const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");




const Routes = Router();
Routes.use(protect);
Routes.use(allowedTo("admin", "manager"));
Routes.route("/")
  .post(createSections)
  .get(getSections);
Routes.route("/:id")
  .get(getSectionValidator, getSection)
  .put(updateSectionValidator, updateSection)
  .delete(deleteSectionValidator, deleteSection);
module.exports = Routes;
