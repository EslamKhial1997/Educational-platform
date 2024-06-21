const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");
const Routes = Router();
Routes.use(protect);
Routes.route("/")
  .post(allowedTo("admin", "manager"), createCoupon)
  .get(allowedTo("admin", "manager"), getCoupons);
Routes.route("/:id").get(getCoupon).delete(deleteCoupon);
module.exports = Routes;
