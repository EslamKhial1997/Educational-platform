// const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendCode = require("../Utils/SendCodeEmail");
const jwt = require("jsonwebtoken");
const factory = require("./FactoryHandler");
const createClassModel = require("../Modules/createClasses");




exports.createClassess = factory.createOne(createClassModel);
exports.getClassess = factory.getAll(createClassesModel);
exports.getClasses = factory.getOne(createClassesModel);
exports.updateClasses = factory.updateOne(createClassesModel);
exports.deleteClasses = factory.deleteOne(createClassesModel);

