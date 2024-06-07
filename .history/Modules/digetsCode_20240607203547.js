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
     
    },
    passwordRestExpires: {
      type: String,
     
    },
    
  },
  { timestamps: true }
);

const createDigetsCodeModel = mongoose.model("Code", createDigetsCode);
module.exports = createDigetsCodeModel;
