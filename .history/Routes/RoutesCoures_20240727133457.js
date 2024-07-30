const express = require("express");



const Routes = express.Router();
Routes.use();
Routes.route("/").post(createCart).get(getCart).delete(deleteCart);

Routes.put("/checkCoupon", ApplyCoupon);

Routes.route("/:id")
  .delete(deleteSpecificCartItem)
  .put(updateSpecificCartItemQuantity);

module.exports = Routes;
