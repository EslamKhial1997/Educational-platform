const mongoose = require("mongoose");

const createCouresSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        lacture: {
          type: mongoose.Schema.ObjectId,
          ref: "Products",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: String,
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
    select: 'name profileImg email phone',
  }).populate({
    path: 'cartItems.product',
    select: 'title imageCover ',
  });
  next();
});
const createCouresModel = mongoose.model("Cart", createCouresSchema);
module.exports = createCouresModel;
