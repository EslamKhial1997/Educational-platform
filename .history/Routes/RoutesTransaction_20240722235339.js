const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");
const {
  updateAdminPoint,
  updateUserPoint,
  getTransactions,
  getTransactionsDate,
  getTransactionsYear,
  getAllTransactionsMonth,
  getAllTransactions,
  getOneTransaction,
  getMySendTransactions,
  getMyReceiveTransactions,
} = require("../Service/TransactionService");
const { getLoggedUserData } = require("../Service/UsersService");

const Routes = Router();
Routes.use(protect);
Routes.get("/getMySendTransactions" , getMySendTransactions);
Routes.get("/getMySendTransactions" , getMySendTransactions);
Routes.get("/getMyReceiveTransactions" , getMyReceiveTransactions);
Routes.route("/manager/sendPoints").put(allowedTo("manager"), updateAdminPoint);
Routes.route("/").get(allowedTo("manager", "admin"), getAllTransactions);
Routes.route("/:id").get(allowedTo("manager", "admin"), getOneTransaction);
Routes.route("/admin/sendPoints").put(allowedTo("admin"), updateUserPoint);

//   .get(getSections);
// Routes.route("/:id")
//   .get(getSectionValidator, getSection)
//   .put(updateSectionValidator, updateSection)
//   .delete(deleteSectionValidator, deleteSection);
Routes.route("/transactions/manager/:receiver/:month/:year").get(
  getTransactionsDate
);
Routes.route("/transactions/manager/:receiver/:year").get(getTransactionsYear);
Routes.route("/allTransactions/manager/:month/:year").get(
  getAllTransactionsMonth
);
module.exports = Routes;
