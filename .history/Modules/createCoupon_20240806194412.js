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
// });
// createCoupons.pre("save", function (next) {
//   this.populate({
//     path: "createdBy",
//     select: "username  image",
//   });
//   next();
// });
createCoupons.pre('save', async function (next) {
  try {
    // تحقق من وجود createdBy وقم بملء البيانات إذا لزم الأمر
    const user = await mongoose.model('Users').findById(this.createdBy).select('name image');

    if (!user) {
      const err = new Error('User not found');
      return next(err);
    }

    // يمكنك ملء الحقول المطلوبة إذا كنت ترغب في ذلك
    this.createdBy = user;

    next();
  } catch (error) {
    next(error);
  }
});
// Delete Coupon After Expires Date
createCoupons.index({ expires: 10 }, { expireAfterSeconds: 0 });
const createCouponsModel = mongoose.model("Coupons", createCoupons);
module.exports = createCouponsModel;
