const mongoose = require("mongoose");

const createCoupons = new mongoose.Schema(
  {
    coupon:[],
  },
  expire
  { timestamps: true }
);

const createCouponsModel = mongoose.model("Coupons", createCoupons);
module.exports = createCouponsModel;
