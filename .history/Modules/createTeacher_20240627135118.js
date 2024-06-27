const mongoose = require("mongoose");

const createTeachers = new mongoose.Schema(
  {
    Teachername: {
      type: String,
      required: [true, "Required Name Teacher"],
      minlength: [3, "Name Too Short To Create"],
      maxlength: [32, "Name Too long To Create"],
    },
    slug: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Required E-mail Teacher"],
      trim: true,
      unique: [true, "E-mail Must Be Unique"],
    },
    password: {
      type: String,
      required: [true, "Required Password Teacher"],
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
      enum: ["Teacher", "teacher", "admin", "manager"],
      default: "Teacher",
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

    TeacherVerify: {
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
createTeachers.post("init", (doc) => {
  ImageURL(doc);
});
createTeachers.post("save", (doc) => {
  ImageURL(doc);
});
const createTeachersModel = mongoose.model("Teachers", createTeachers);
module.exports = createTeachersModel;
