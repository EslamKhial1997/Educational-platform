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
    select:"username email phone image"
  }).populate({
    path: "couresItems.lacture",
  }).populate({
     path: "coupon",
  });
  next();
});
const createCouresModel = mongoose.model("Cart", createCouresSchema);
module.exports = createCouresModel;
