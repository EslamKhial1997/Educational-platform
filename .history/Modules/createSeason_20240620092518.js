const mongoose = require("mongoose");

const createSeason = new mongoose.Schema(
  {
    coupon: [],
    expires: {
      type: String,
    },
  },
  { timestamps: true }
);

const createSeasonModel = mongoose.model("Season", createSeason);
module.exports = createSeasonModel;
