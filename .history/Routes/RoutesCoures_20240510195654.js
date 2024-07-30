const express = require("express");
const { protect, allowedTo } = require("../Services/AuthService");
const {
  createCart,
  getCart,
  deleteCart,
  deleteSpecificCartItem,
  updateSpecificCartItemQuantity,
  ApplyCoupon,
} = require("../Services/CartService");

const Routes = express.Router();
Routes.use(protect);
Routes.route("/").post(createCart).get(getCart).delete(deleteCart);

Routes.put("/checkCoupon", ApplyCoupon);

Routes.route("/:id")
  .delete(deleteSpecificCartItem)
  .put(updateSpecificCartItemQuantity);

module.exports = Routes;
