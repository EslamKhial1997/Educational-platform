const mongoose = require("mongoose");

const createCoupons = new mongoose.Schema(
  {
    code:String,
    discount:Number,
    expires: {
      type: String,
    },
    
  },
  { timestamps: true }
);

const createCouponsModel = mongoose.model("Coupons", createCoupons);
module.exports = createCouponsModel;
