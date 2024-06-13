const mongoose = require("mongoose");

const createCoupons = new mongoose.Schema(
  {
    coupon:,
   
    discount: {
      type: Number,
      required: [true, "Required E-mail User"],
    },
  },
  { timestamps: true }
);

const createCouponsModel = mongoose.model("Coupons", createCoupons);
module.exports = createCouponsModel;
