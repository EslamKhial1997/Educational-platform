const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");
const {
  createCoupon,
  getCoupons,
  getCoupon,
} = require("../Service/CouponService");

const Routes = Router();
Routes.use(protect);
Routes.route("/")
  .post(allowedTo("admin", "manager"), createCoupon)
  .get(allowedTo("admin", "manager"), getCoupons);
Routes.route("/:id").get(getCoupon).delete(, deleteUser);
module.exports = Routes;
