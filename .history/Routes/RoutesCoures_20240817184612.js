const express = require("express");
const { protect, allowedTo } = require("../Service/AuthService");
const {
  createCoures,
  getCoures,
  getCouress,
  deleteSpecificCourseItem
} = require("../Service/CouresService");


const Routes = express.Router();
Routes.use(protect);
Routes.route("/")
  .post(allowedTo("user"), createCoures)
  .get(protect, allowedTo("user"), getCouress);
//.delete(deleteCart);

// Routes.put("/checkCoupon", ApplyCoupon);

Routes.route("/:id")
  .get(protect, allowedTo("user"), getCoures)
  .delete(deleteSpecificCourseItem).put(updateSpecificCourseItemSeen);

module.exports = Routes;
