const mongoose = require("mongoose");

const createCouresSchema = new mongoose.Schema(
  {
    couresItems: [
      {
        lacture: {
          type: mongoose.Schema.ObjectId,
          ref: "Lectures",
          require: [true, "Lacture Id is Required"],
        },
        coupon: {
          type: mongoose.Schema.ObjectId,
          ref: "Coupons",
        },
        count: {
          type: Number,
          default: 1,
        },
        price: Number,
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      require: [true, "User Id is Required"],
    },
  },
  { timestamps: true }
);

createCouresSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
  }).populate({
    path: 'cartItems.lacture',
    select: 'title imageCover ',
  });
  next();
});
const createCouresModel = mongoose.model("Cart", createCouresSchema);
module.exports = createCouresModel;
