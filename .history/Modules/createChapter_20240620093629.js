const mongoose = require("mongoose");

const createCoupons = new mongoose.Schema(
  {
    name: {
      type: "string",
      required: [true, "Section Name Is Required"],
    },
  },
  { timestamps: true }
);

const createCouponsModel = mongoose.model("Coupons", createCoupons);
module.exports = createCouponsModel;
