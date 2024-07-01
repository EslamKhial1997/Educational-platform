// const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendCode = require("../Utils/SendCodeEmail");
const jwt = require("jsonwebtoken");
const factory = require("./FactoryHandler");

const createUsersModel = require("../Modules/createUsers");
const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../Resuble/ApiErrors");
const createCouponsModel = require("../Modules/createCoupon");
const createSectionModel = require("../Modules/createSection");
const createClassModel = require("../Modules/createClasses");

exports.createClasses = expressAsyncHandler(async (req, res) => {
  const classes = [
    { class: "frist graude" },
    { class: "second graude" },
    { class: "third graude" },
  ];

  await createClassModel.insertMany(classes);
  res.status(201).json({ status: "Success", data: coupons });
});
// exports.getSections = factory.getAll(createSectionModel);
// exports.getSection = factory.getOne(createSectionModel);
// exports.updateSection = factory.updateOne(createSectionModel);
// exports.deleteSection = factory.deleteOne(createSectionModel);
