const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");
const { updatePoint, getTransactions, getTransactionsDate, getTransactionsYear } = require("../Service/TransactionService");




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
Routes.route('/transactions/:adminId/:month/:year' ).get(getTransactionsDate)
Routes.route('/transactions/:adminId/:year' ).get(getTransactionsYear)
Routes.route('/allTransactions/:month' ).get(getTrans)
module.exports = Routes;
