const express = require("express");
const { protect } = require("../Service/AuthService");
const { createCoures, getCoures } = require("../Service/CouresService");



const Routes = express.Router();
Routes.use(protect);
Routes.route("/").post(protect, createCoures).get(pgetCoures)
//.delete(deleteCart);

// Routes.put("/checkCoupon", ApplyCoupon);

// Routes.route("/:id")
//   .delete(deleteSpecificCartItem)
//   .put(updateSpecificCartItemQuantity);

module.exports = Routes;
