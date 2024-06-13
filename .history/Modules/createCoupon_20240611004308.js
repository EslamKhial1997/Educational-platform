const mongoose = require("mongoose");

const createCoupons = new mongoose.Schema(
  {
    coupon: {
      type: String,
      required: [true, "Required Coupon"],
    },
    slug: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Required E-mail User"],
      trim: true,
      unique: [true, "E-mail Must Be Unique"],
    },
    password: {
      type: String,
      required: [true, "Required Password User"],
      minlength: [6, "Password Too Short To Create"],
    },

    phone: {
      type: Number,
    },
    address: {
      type: String,
    },
    guardianPhone: {
      type: Number,
    },
    wallet: {
      type: Number,
    },
    point: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["user", "teacher", "admin", "manager"],
      default: "user",
    },
    grade: {
      type: String,
      enum: ["first", "second", "third"],
      default: "first",
    },
    code: {
      type: String,
    },

    userVerify: {
      type: Boolean,
      default: false,
    },
    codeExpires: {
      type: String,
    },
  },
  { timestamps: true }
);

const createCouponsModel = mongoose.model("Users", createCoupons);
module.exports = createCouponsModel;
