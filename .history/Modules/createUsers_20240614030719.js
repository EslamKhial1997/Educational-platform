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
    },
    image: {
      type: String,
    },
    picture: {
      type: String,
    },
    avater: {
      type: String,
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
const ImageURL = (doc) => {
  if (doc.image && !doc.image.includes(`${process.env.SERVER_IP}/teacher`)) {
    const image = `${process.env.SERVER_IP}/header/${doc.image}`;
    doc.image = image;
  }
  if (doc.picture && !doc.picture.includes(`${process.env.SERVER_IP}/teacher`)) {
    const logo = `${process.env.SERVER_IP}/header/${doc.logo}`;
    doc.logo = logo;
  }
  if (doc.avater && !doc.avater.includes(`${process.env.SERVER_IP}/teacher`)) {
    const avater = `${process.env.SERVER_IP}/header/${doc.logo}`;
    doc.logo = logo;
  }
};
headerSchema.post("init", (doc) => {
  ImageURL(doc);
});
headerSchema.post("save", (doc) => {
  ImageURL(doc);
});
const createUsersModel = mongoose.model("Users", createUsers);
module.exports = createUsersModel;
