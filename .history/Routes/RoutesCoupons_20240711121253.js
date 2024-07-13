const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");
const {
  createCoupon,
  getCoupons,
  getCoupon,
  deleteCoupon,
  checkCoupon,
  updateCoupon,
} = require("../Service/CouponService");

const Routes = Router();
Routes.get("/checkCoupon", checkCoupon);
Routes.use(protect);
Routes.route("/")
  .post(allowedTo("admin", "manager"), createCoupon)
  .get(allowedTo("admin", "manager"), getCoupons);
Routes.route("/:id").get(getCoupon).delete(allowedTo("admin"),deleteCoupon).put(updateCoupon);
module.exports = Routes;
