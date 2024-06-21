const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");
const {
  createCoupon,
  getCoupons,
  getCoupon,
  deleteCoupon,
} = require("../Service/CouponService");
const { createSections } = require("../Service/SectionService");

const Routes = Router();
Routes.use(protect);
Routes.use(allowedTo("admin", "manager"));
Routes.route("/")
  .post( createSections)
  .get(allowedTo("admin", "manager"), getSelection);
Routes.route("/:id").get(getCoupon).delete(deleteCoupon);
module.exports = Routes;
