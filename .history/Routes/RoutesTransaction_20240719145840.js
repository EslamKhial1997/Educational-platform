const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");
const { updatePoint } = require("../Service/TransactionService");




const Routes = Router();
Routes.use(protect);
Routes.use(allowedTo("manager"));
Routes.route("/")
  .put(updatePoint)
//   .get(getSections);
// Routes.route("/:id")
//   .get(getSectionValidator, getSection)
//   .put(updateSectionValidator, updateSection)
//   .delete(deleteSectionValidator, deleteSection);

module.exports = Routes;
