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
  },
  { timestamps: true }
);

const createUsersModel = mongoose.model("Code", createUsers);
module.exports = createUsersModel;
