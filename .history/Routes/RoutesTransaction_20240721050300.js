const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");
const {
  updatePoint,
  getTransactions,
  getTransactionsDate,
  getTransactionsYear,
  getAllTransactionsMonth,
} = require("../Service/TransactionService");

const Routes = Router();
Routes.use(protect);
Routes.route("/sendPoints").put(allowedTo("manager"),updatePoint);
//   .get(getSections);
// Routes.route("/:id")
//   .get(getSectionValidator, getSection)
//   .put(updateSectionValidator, updateSection)
//   .delete(deleteSectionValidator, deleteSection);
Routes.route("/transactions/manager/:receiver/:month/:year").get(getTransactionsDate);
Routes.route("/transactions/manager/:receiver/:year").get(getTransactionsYear);
Routes.route("/allTransactions/manager/:month/:year").get(getAllTransactionsMonth);
module.exports = Routes;
