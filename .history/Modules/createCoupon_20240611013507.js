const mongoose = require("mongoose");

const createCoupons = new mongoose.Schema(
  {
    coupon:[],
  },
  expires
  { timestamps: true }
);

const createCouponsModel = mongoose.model("Coupons", createCoupons);
module.exports = createCouponsModel;
