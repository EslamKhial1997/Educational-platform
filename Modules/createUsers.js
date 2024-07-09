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

    phone: {
      type: Number,
      required: [true, "Required Phone User"],
      unique: [true, "Phone Must Be Unique"],
    },
  
    guardianPhone: {
      required: [true, "Required Guardian Phone User"],
      unique: [true, "Guardian Phone Must Be Unique"],
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
      enum: ["user"],
      default: "user",
    },
    history: [
      {
        from: {
          type: String,
        },
        to: {
          type: String,
        },
        point: String,
        history: {
          type: Date,
          default: new Date(),
        },
      },
    ],
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

const createUsersModel = mongoose.model("Users", createUsers);
module.exports = createUsersModel;
