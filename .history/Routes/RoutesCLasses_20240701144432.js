const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");


const { createClasses,getClassess } = require("../Service/ClassService");
const { createClassValidator } = require("../Resuble/ClassValidationError copy");

const Routes = Router();
Routes.use(protect);
Routes.use(allowedTo("admin", "manager"));
Routes.route("/")
  .post(createClassValidator, createClasses)
//   .get(getClassess);
// Routes.route("/:id")
//   .get(getSectionValidator, getSection)
//   .put(updateSectionValidator, updateSection)
//   .delete(deleteSectionValidator, deleteSection);
module.exports = Routes;
