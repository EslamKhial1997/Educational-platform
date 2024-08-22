const mongoose = require("mongoose");

const createTeachers = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Required Name "],
      minlength: [3, "Name Too Short To Create"],
      maxlength: [32, "Name Too long To Create"],
    },
    description: {
      type: String,
    },
    subject: {
      type: String,
    },
    slug: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Required E-mail "],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Required Password "],
      minlength: [6, "Password Too Short To Create"],
    },

    phone: {
      type: Number,
      required: [true, "Required Phone "],
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

    point: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,

      default: "teacher",
    },
    paid:[{ image: {
      type: String,
      required: [true, "Slider Image Is Required"],
    },}]
    
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
createTeachers.post("init", (doc) => {
  ImageURL(doc);
});
createTeachers.post("save", (doc) => {
  ImageURL(doc);
});

const createTeachersModel = mongoose.model("Teachers", createTeachers);
module.exports = createTeachersModel;
