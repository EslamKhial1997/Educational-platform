// const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendCode = require("../Utils/SendCodeEmail");
const jwt = require("jsonwebtoken");
const factory = require("./FactoryHandler");
const createClassModel = require("../Modules/createClasses");




exports.createClasses = factory.createOne(createClassModel);
exports.getClassess = factory.getAll(createClassModel);
exports.getClass = factory.getOne(createClassModel);
exports.updateClasses = factory.updateOne(createClassModel);
exports.deleteClasses = factory.deleteOne(createClassModel);

