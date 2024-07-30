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

        count: {
          type: Number,
          default: 1,
        },
      },
    ],
    coupon: {
      type: mongoose.Schema.ObjectId,
      ref: "Coupons",
    },
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
    path: "user",
    select: "username email phone image",
  })
    .populate({
      path: "couresItems.lacture",
    })
    .populate({
      path: "couresItems.coupon",
    });
  next();
});
const createCouresModel = mongoose.model("Couress", createCouresSchema);
module.exports = createCouresModel;
