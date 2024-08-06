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
    select: "name  image",
  });
  next();
});
createCoupons.pre(/^find/, function (next) {
  this.populate({
    path: "lecture",
  });
  next();
});
createCoupons.pre(/^find/, function (next) {
  this.populate({
    path: "createdBy",
    select: "username  image",
  });
  next();
});
// createCoupons.pre("save", function (next) {
//   this.populate({
//     path: "lecture",
//   });
//   next();
// });
createCoupons.post('save', function (doc, next) {
  log
  doc.populate({
    path: 'lecture',
  }).execPopulate().then(function() {
    next();
  }).catch(next);
});
// Delete Coupon After Expires Date
createCoupons.index({ expires: 10 }, { expireAfterSeconds: 0 });
const createCouponsModel = mongoose.model("Coupons", createCoupons);
module.exports = createCouponsModel;
