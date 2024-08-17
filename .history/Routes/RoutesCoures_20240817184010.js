const express = require("express");
const { protect, allowedTo } = require("../Service/AuthService");
const { createCoures, getCoures, getCouress } = require("../Service/CouresService");
const { createCouresValidator } = require("../Resuble/CouressValidationError");

const Routes = express.Router();
Routes.use(protect);
Routes.route("/")
  .post( allowedTo("user"), createCoures)
  .get(protect, allowedTo("user"), getCouress);
//.delete(deleteCart);

// Routes.put("/checkCoupon", ApplyCoupon);

Routes.route("/:id").get(protect, allowedTo("user"), getCoures).delete(deleteSpecificCartItem)
//   .put(updateSpecificCartItemQuantity);

module.exports = Routes;
