const mongoose = require("mongoose");

const createCoupons = new mongoose.Schema(
  {
    coupon: {
      type: String,
      required: [true, "Required Coupons"],
    },
    slug: {
      type: String,
    },
    discount: {
      type: String,
      required: [true, "Required E-mail User"],
    },
  },
  { timestamps: true }
);

const createCouponsModel = mongoose.model("Users", createCoupons);
module.exports = createCouponsModel;
