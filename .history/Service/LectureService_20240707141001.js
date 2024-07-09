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


exports.createLs = factory.createOne(createSectionModel);
exports.getLs = factory.getAll(createSectionModel);
exports.getL = factory.getOne(createSectionModel);
exports.updateL = factory.updateOne(createSectionModel);
exports.deleteL = factory.deleteOne(createSectionModel);

