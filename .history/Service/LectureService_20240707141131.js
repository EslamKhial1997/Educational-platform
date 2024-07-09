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
const createLecturesModel = require("../Modules/createAlecture");


exports.createLectures = factory.createOne(createLecturesModel);
exports.getLectures = factory.getAll(createSectionModel);
exports.getLecture = factory.getOne(createSectionModel);
exports.updateLecture = factory.updateOne(createSectionModel);
exports.deleteLecture = factory.deleteOne(createSectionModel);

