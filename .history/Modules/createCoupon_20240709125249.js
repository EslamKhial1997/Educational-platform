const mongoose = require("mongoose");

const createCoupons = new mongoose.Schema(
  {
    code:String,
    discount:Number,
    expires: {
      type: String,
    },
    lecture: {
      type: mongoose.Schema.ObjectId,
      ref: "Lectures",
    },
    section: {
      type: mongoose.Schema.ObjectId,
      ref: "Section",
    },
  
  },
  { timestamps: true }
);

const createCouponsModel = mongoose.model("Coupons", createCoupons);
module.exports = createCouponsModel;
