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


exports.creates = factory.createOne(createSectionModel);
exports.gets = factory.getAll(createSectionModel);
exports.get = factory.getOne(createSectionModel);
exports.update = factory.updateOne(createSectionModel);
exports.delete = factory.deleteOne(createSectionModel);

