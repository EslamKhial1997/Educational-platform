const mongoose = require("mongoose");

const createCoupons = new mongoose.Schema(
  {
    coupon: [],
    expires: {
      type: String,
    },
  },
  { timestamps: true }
);

const createCouponsModel = mongoose.model("Coupons", createCoupons);
module.exports = createCouponsModel;
