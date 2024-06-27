const mongoose = require("mongoose");

const createTs = new mongoose.Schema(
  {
    Tname: {
      type: String,
      required: [true, "Required Name T"],
      minlength: [3, "Name Too Short To Create"],
      maxlength: [32, "Name Too long To Create"],
    },
    slug: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Required E-mail T"],
      trim: true,
      unique: [true, "E-mail Must Be Unique"],
    },
    password: {
      type: String,
      required: [true, "Required Password T"],
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
      enum: ["T", "teacher", "admin", "manager"],
      default: "T",
    },
    history: [
      {
        from: {
          type:String,
        },
        to: {
          type:String,
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

    TVerify: {
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
  if (doc.image && !doc.image.includes(`${process.env.BASE_URL}/teacher`)) {
    const image = `${process.env.BASE_URL}/teacher/${doc.image}`;
    doc.image = image;
  }
  if (doc.picture && !doc.picture.includes(`${process.env.BASE_URL}/teacher`)) {
    const picture = `${process.env.BASE_URL}/teacher/${doc.picture}`;
    doc.picture = picture;
  }
  if (doc.avater && !doc.avater.includes(`${process.env.BASE_URL}/teacher`)) {
    const avater = `${process.env.BASE_URL}/teacher/${doc.avater}`;
    doc.avater = avater;
  }
};
createTs.post("init", (doc) => {
  ImageURL(doc);
});
createTs.post("save", (doc) => {
  ImageURL(doc);
});
const createTsModel = mongoose.model("Ts", createTs);
module.exports = createTsModel;
