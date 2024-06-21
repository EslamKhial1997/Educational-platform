// const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendCode = require("../Utils/SendCodeEmail");
const jwt = require("jsonwebtoken");
const factory = require("./FactoryHandler");

const createChaptersModel = require("../Modules/createChapter");


exports.createChapters = factory.createOne(createChaptersModel);
exports.getChapters = factory.getAll(createChaptersModel);
exports.getCoupon = factory.get(createChaptersModel);

//   res.status(200).json({ status: "success", data: couponNumber });
// });
// exports.deleteCoupon = factory.deleteOne(createCouponsModel);

