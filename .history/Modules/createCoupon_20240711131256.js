const mongoose = require("mongoose");

const createCoupons = new mongoose.Schema(
  {
    code: String,
    discount: Number,
    expires: {
      type: Date,
    },
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
    path: "createdBy",
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
createCoupons.index({ expires: 1 }, { expireAfterSeconds: 0 });
const createCouponsModel = mongoose.model("Coupons", createCoupons);
module.exports = createCouponsModel;
