const mongoose = require("mongoose");

const createUsers = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Required Name User"],
      minlength: [3, "Name Too Short To Create"],
      maxlength: [32, "Name Too long To Create"],
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

    register: {
      type: Date,
      default: new Date(Date.now()),
    },
    phone: {
      type: Number,
    },
    wallet: {
      type: Number,
    },
    role: {
      type: String,
      enum: ["user", "teacher", "admin", "manager"],
      default: "user",
    },
    grade: {
      type: String,
      enum: ["first", "second", "third"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
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

const createUsersModel = mongoose.model("Users", createUsers);
module.exports = createUsersModel;
