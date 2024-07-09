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
      require:[true , "Lectures Is Required"]
    },
    section: {
      type: mongoose.Schema.ObjectId,
      ref: "Section",
      require:[true , "section Is Required"]
    },
  
  },
  { timestamps: true }
);

const createCouponsModel = mongoose.model("Coupons", createCoupons);
module.exports = createCouponsModel;
