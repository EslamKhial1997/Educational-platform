const express = require("express");
const { protect } = require("../Service/AuthService");



const Routes = express.Router();
Routes.use(protect);
Routes.route("/").post(create)
// .get(getCart).delete(deleteCart);

// Routes.put("/checkCoupon", ApplyCoupon);

// Routes.route("/:id")
//   .delete(deleteSpecificCartItem)
//   .put(updateSpecificCartItemQuantity);

module.exports = Routes;
