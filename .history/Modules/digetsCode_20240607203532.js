const mongoose = require("mongoose");

const createDigetsCode = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Required Name User"],
      minlength: [3, "Name Too Short To Create"],
      maxlength: [32, "Name Too long To Create"],
    },
    slug: {
      type: String,
    },
    code: {
      type: String,
      required: [true, "Required E-mail User"],
      trim: true,
      unique: [true, "E-mail Must Be Unique"],
    },
    code: {
      type: String,
      required: [true, "Required E-mail User"],
      trim: true,
      unique: [true, "E-mail Must Be Unique"],
    },
    passwordRestExpires
  },
  { timestamps: true }
);

const createDigetsCodeModel = mongoose.model("Code", createDigetsCode);
module.exports = createDigetsCodeModel;
