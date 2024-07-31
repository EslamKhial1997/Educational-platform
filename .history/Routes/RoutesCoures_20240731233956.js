const express = require("express");
const { protect, allowedTo } = require("../Service/AuthService");
const { createCoures, getCoures } = require("../Service/CouresService");
const { createCouresValidator } = require("../Resuble/CouressValidationError");

const Routes = express.Router();
Routes.use(protect);
Routes.route("/")
  .post(protect, allowedTo("user"), createCouresValidator, createCoures)
  .get(protect, allowedTo("user"), getCoures);
//.delete(deleteCart);

// Routes.put("/checkCoupon", ApplyCoupon);

Routes.route("/:id").get()
//   .delete(deleteSpecificCartItem)
//   .put(updateSpecificCartItemQuantity);

module.exports = Routes;
