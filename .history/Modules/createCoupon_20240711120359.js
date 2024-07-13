const mongoose = require("mongoose");

const createCoupons = new mongoose.Schema(
  {
    code: String,
    discount: Number,
    expires: {
      type: String,
    },
    expires: String,
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
    lecture: {
      type: mongoose.Schema.ObjectId,
      ref: "Lectures",
     
    },
    section: {
      type: mongoose.Schema.ObjectId,
      ref: "Section",
      
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
    path: "section",
  });
  next();
});
createCoupons.pre(/^find/, function (next) {
  this.populate({
    path: "section",
  });
  next();
});
createCoupons.pre(/^find/, function (next) {
  this.populate({
    path: "teacher",
    select:"teachername , image"
  });
  next();
});
const createCouponsModel = mongoose.model("Coupons", createCoupons);
module.exports = createCouponsModel;
