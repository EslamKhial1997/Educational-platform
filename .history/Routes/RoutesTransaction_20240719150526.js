const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");
const { updatePoint, getTransactions } = require("../Service/TransactionService");




const Routes = Router();
Routes.use(protect);
Routes.use(allowedTo("manager"));
Routes.route("/sendPoints")
  .put(updatePoint)
//   .get(getSections);
// Routes.route("/:id")
//   .get(getSectionValidator, getSection)
//   .put(updateSectionValidator, updateSection)
//   .delete(deleteSectionValidator, deleteSection);
Routes.route('/transactions/:adminId/:month/:year' ).get(getTransactions)
module.exports = Routes;
