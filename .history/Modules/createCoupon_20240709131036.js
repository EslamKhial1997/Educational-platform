const mongoose = require("mongoose");

const createCoupons = new mongoose.Schema(
  {
    code: String,
    discount: Number,
    expires: {
      type: String,
    },
    lecture: {
      type: mongoose.Schema.ObjectId,
      ref: "Lectures",
      require: [true, "Lectures Is Required"],
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: "Teachers",
      require: [true, "Teachers Is Required"],
    },
  },
  { timestamps: true }
);
createCoupons.pre(/^find/, function (next) {
  this.populate({
    path: "lecture",
  });
  next();
});
createCoupons.pre(/^find/, function (next) {
  this.populate({
    path: "teacher",
    select:"teachername , "
  });
  next();
});
const createCouponsModel = mongoose.model("Coupons", createCoupons);
module.exports = createCouponsModel;
