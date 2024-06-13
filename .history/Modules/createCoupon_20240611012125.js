const mongoose = require("mongoose");

const createCoupons = new mongoose.Schema(
  {
    coupon: {
      type: Number,
      required: [true, "Required Coupons"],
    },
   
    discount: {
      type: String,
      required: [true, "Required E-mail User"],
    },
  },
  { timestamps: true }
);

const createCouponsModel = mongoose.model("Coupons", createCoupons);
module.exports = createCouponsModel;
