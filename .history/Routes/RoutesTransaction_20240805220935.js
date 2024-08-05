const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");
const {
  updateAdminPoint,
  updateUserPoint,
  getTransactionsDate,
  getTransactionsYear,
  getAllTransactionsMonth,
  getAllTransactions,
  getOneTransaction,
  getMyTransactions,
} = require("../Service/TransactionService");


const Routes = Router();
Routes.use(protect);
Routes.get("/getMyTransactions" , getMyTransactions);
Routes.route("/manager/sendPoints").put(allowedTo("manager"), updateAdminPoint);
Routes.route("/").get(allowedTo("manager", "admin"), getAllTransactions);
Routes.route("/:id").get(allowedTo("manager", "admin"), getOneTransaction);
Routes.route("/admin/sendPoints").put(allowedTo("admin"), updateUserPoint);


Routes.route("/transactions/manager/:receiver/:month/:year").get(
  getTransactionsDate
);
//Get All Transaction By Years Only 
Routes.route("/transactions/manager/:year").get(getTransactionsYear);
Routes.route("/allTransactions/manager/:month/:year").get(
  getAllTransactionsMonth
);
module.exports = Routes;
