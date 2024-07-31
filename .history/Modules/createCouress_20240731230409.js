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
          type: String,
        },
        discount: {
          type: Number,
          default: 0,
        },
      },
    ],
    teacher: [
      {
        name: String,
        : String,
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
    path: "couresItems.coupon",
  });
  next();
});
const createCouresModel = mongoose.model("Couress", createCouresSchema);
module.exports = createCouresModel;
