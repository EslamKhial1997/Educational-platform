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
createCoupons.pre('save', async function (next) {
  try {
    // تحقق من وجود lecture وقم بجلب البيانات إذا لزم الأمر
    const lecture = await mongoose.model('Lecture').findById(this.lecture);

    if (!lecture) {
      const err = new Error('Lecture not found');
      return next(err);
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Delete Coupon After Expires Date
createCoupons.index({ expires: 10 }, { expireAfterSeconds: 0 });
const createCouponsModel = mongoose.model("Coupons", createCoupons);
module.exports = createCouponsModel;
