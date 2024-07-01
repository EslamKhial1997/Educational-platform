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
        { class: 'frist graude' },
        { class: 'second ل' },
        { class: 'الثالث الثانوي' }
      ];
    for (let i = 0; i < req.body.count; i++) {
      const code = Math.floor(Math.random() * 10 ** 10).toString(); // هنا ممكن تستخدم دالة لتوليد أكواد عشوائية
      const newCoupon = new createClassModel({
        class: code,
        discount: req.body.discount,
        expires: Date.now() + req.body.expires * 24 * 60 * 60 * 1000, // صلاحية لشهر مثلاً
      });
      coupons.push(newCoupon);
    }
    if (coupons.length < 1) {
      res.status(500).json({ status: "Somthing want Error" });
    }
    await createCouponsModel.insertMany(coupons);
    res.status(201).json({ status: "Success", data: coupons });
  });
exports.getSections = factory.getAll(createSectionModel);
exports.getSection = factory.getOne(createSectionModel);
exports.updateSection = factory.updateOne(createSectionModel);
exports.deleteSection = factory.deleteOne(createSectionModel);

